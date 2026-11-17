"use server";

import { cookies, headers } from "next/headers";
import { checkAdminCredential } from "@/features/auth/admin";
import { roleForName } from "@/features/auth/roles";
import { adminLoginSchema, userLoginSchema } from "@/features/auth/schemas";
import { clearSessionCookies, writeSessionCookies } from "@/lib/auth-cookies";
import { authMode } from "@/lib/auth-mode";
import {
  PENDING_COOKIE,
  PENDING_MAX_AGE,
  createPendingToken,
  readPendingToken,
  type PendingLogin,
} from "@/lib/pending";
import { REFRESH_COOKIE, createSessionToken, type Role } from "@/lib/session";
import { authService, readRefreshToken } from "@/services/auth.service";
import { usersService } from "@/services/users.service";
import { ApiError } from "@/types/api";

/**
 * Signing in and out.
 *
 * > [!IMPORTANT]
 * > Everything exported from this file is a **public endpoint**. Anyone can
 * > call it, with anything, from anywhere — not only the forms that are
 * > supposed to. So every input is checked here again, nothing a caller
 * > sends decides a role, and the session is only ever written from what
 * > the backend (or, in fixture mode, the sample register) answered.
 *
 * With a backend, the family name and the administrator's password go to
 * `POST /auth/login`, the code to `POST /auth/verify`, and the tokens that
 * come back are kept in httpOnly cookies the browser cannot read. In fixture
 * mode (no backend, never in production) the old stand-in answers: any five
 * digits, and the sample register decides the role. See lib/auth-mode.ts.
 */

/** What a login step returns, so a form can say what went wrong. */
export type LoginOutcome = { ok: true } | { ok: false; message: string };

/** What checking a code returns. `restart`: the login itself is gone, so
    another code will not help; the way on is back to the login. */
export type VerifyOutcome =
  { ok: true; role: Role } | { ok: false; message: string; restart?: boolean };

/** What asking for another code returns. */
export type ResendOutcome =
  | { ok: true; resendAfter: number }
  | { ok: false; message: string; restart?: boolean };

const NO_SECRET =
  "AUTH_SECRET is not set, so no session can be issued. Generate one with `npx auth secret`.";
const SIGN_IN_OFF = "Signing in is not set up on this site yet.";
const NO_LOGIN =
  "This code can't be used: the login it belongs to has expired, or you came straight to this page.";
const ADMIN_REFUSED = "That name and password do not match an administrator.";

/** The browser's user agent, which the backend names the device after. */
async function userAgent(): Promise<string | undefined> {
  return (await headers()).get("user-agent") ?? undefined;
}

/** The backend's own words for a refusal, or a sentence for a failure that
    never reached it. */
function said(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

async function holdPendingLogin(login: PendingLogin): Promise<boolean> {
  const token = await createPendingToken(login);
  if (!token) return false;
  (await cookies()).set(PENDING_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PENDING_MAX_AGE,
  });
  return true;
}

/**
 * The family's login: a family name, then an emailed code.
 *
 * With a backend the answer is the same whether or not the name exists, so
 * nothing here says whose names are real; somebody who typed one that is
 * not simply never gets a code.
 */
export async function beginMemberLogin(name: string): Promise<LoginOutcome> {
  /* The same schema the form uses. The form's validation is a courtesy to
     whoever is typing, not a guarantee about what arrives here. */
  const checked = userLoginSchema.safeParse({ name });
  if (!checked.success) {
    return {
      ok: false,
      message: checked.error.issues[0]?.message ?? "That name cannot be used.",
    };
  }
  const familyName = checked.data.name;

  const mode = authMode();
  if (mode === "off") return { ok: false, message: SIGN_IN_OFF };

  if (mode === "backend") {
    try {
      await authService.login(
        { family_name: familyName },
        { userAgent: await userAgent() },
      );
    } catch (error) {
      return {
        ok: false,
        message: said(
          error,
          "We could not send a code. Try again in a moment.",
        ),
      };
    }
    if (!(await holdPendingLogin({ familyName, admin: false }))) {
      return { ok: false, message: NO_SECRET };
    }
    return { ok: true };
  }

  /* Fixture mode: the sample register decides. */
  const role = roleForName(familyName);
  if (!(await holdPendingLogin({ familyName, admin: false, role }))) {
    return { ok: false, message: NO_SECRET };
  }
  return { ok: true };
}

/**
 * The administrators' door: the family name and the password, then the same
 * emailed code. One message for a wrong name and a wrong password, so the
 * reply never says whether a name is an administrator's.
 */
export async function beginAdminLogin(
  name: string,
  password: string,
): Promise<LoginOutcome> {
  const shape = adminLoginSchema.safeParse({ name, password });
  if (!shape.success) return { ok: false, message: ADMIN_REFUSED };
  const familyName = shape.data.name;

  const mode = authMode();
  if (mode === "off") return { ok: false, message: SIGN_IN_OFF };

  if (mode === "backend") {
    try {
      await authService.login(
        { family_name: familyName, password: shape.data.password },
        { userAgent: await userAgent() },
      );
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof ApiError && error.code === "invalid_credentials"
            ? ADMIN_REFUSED
            : said(error, "We could not send a code. Try again in a moment."),
      };
    }
    if (!(await holdPendingLogin({ familyName, admin: true }))) {
      return { ok: false, message: NO_SECRET };
    }
    return { ok: true };
  }

  /* Fixture mode: the sample register and the development passwords. */
  const checked = checkAdminCredential(familyName, shape.data.password);
  if (!checked.ok) {
    return {
      ok: false,
      message:
        checked.reason === "unavailable"
          ? "Administrator sign-in is not configured on this site yet."
          : ADMIN_REFUSED,
    };
  }
  if (!(await holdPendingLogin({ familyName, admin: true, role: "admin" }))) {
    return { ok: false, message: NO_SECRET };
  }
  return { ok: true };
}

/**
 * Turns a login in progress and its code into a session.
 *
 * The family name comes from the pending cookie this file set at the login
 * step, never from the caller: reaching /verify directly grants nothing.
 */
export async function verifyLoginCode(code: string): Promise<VerifyOutcome> {
  const store = await cookies();
  const pending = await readPendingToken(store.get(PENDING_COOKIE)?.value);
  if (!pending) return { ok: false, message: NO_LOGIN, restart: true };

  const digits = code.trim();
  if (!/^[0-9]{5}$/.test(digits)) {
    return { ok: false, message: "Enter the 5-digit code." };
  }

  const mode = authMode();
  if (mode === "off") return { ok: false, message: SIGN_IN_OFF, restart: true };

  if (mode === "fixture") {
    const role = pending.role ?? "member";
    const session = await createSessionToken({
      role,
      userId: `fixture-${role}`,
    });
    if (!session) return { ok: false, message: NO_SECRET };
    writeSessionCookies(store, { session });
    store.delete(PENDING_COOKIE);
    return { ok: true, role };
  }

  const agent = await userAgent();
  let accessToken: string;
  let expiresIn: number;
  let refreshToken: string | undefined;
  try {
    const { data, headers: answer } = await authService.verify(
      { family_name: pending.familyName, code: digits },
      { userAgent: agent },
    );
    accessToken = data.access_token;
    expiresIn = data.expires_in;
    refreshToken = readRefreshToken(answer);
  } catch (error) {
    return {
      ok: false,
      message: said(
        error,
        "We could not check the code. Try again in a moment.",
      ),
    };
  }
  if (!refreshToken) {
    return {
      ok: false,
      message: "The server did not start a session. Try logging in again.",
      restart: true,
    };
  }

  /* The role is the backend's, read straight after the login. */
  let me;
  try {
    me = await usersService.me({ token: accessToken, userAgent: agent });
  } catch (error) {
    return {
      ok: false,
      message: said(error, "We could not finish signing you in. Try again."),
      restart: true,
    };
  }

  const session = await createSessionToken({ role: me.role, userId: me.id });
  if (!session) return { ok: false, message: NO_SECRET };

  writeSessionCookies(store, {
    session,
    access: { token: accessToken, expiresIn },
    refresh: refreshToken,
  });
  /* Spent: one pending login, one session. */
  store.delete(PENDING_COOKIE);
  return { ok: true, role: me.role };
}

/**
 * Another code for the login in progress.
 *
 * Only for the member door. An administrator's code needs the password
 * again, and the password is never kept between the two steps, so for them
 * the way to a new code is the login.
 */
export async function resendLoginCode(): Promise<ResendOutcome> {
  const pending = await readPendingToken(
    (await cookies()).get(PENDING_COOKIE)?.value,
  );
  if (!pending) return { ok: false, message: NO_LOGIN, restart: true };
  if (pending.admin) {
    return {
      ok: false,
      message: "Log in again with your password to get a new code.",
      restart: true,
    };
  }

  const mode = authMode();
  if (mode === "off") return { ok: false, message: SIGN_IN_OFF, restart: true };
  if (mode === "fixture") return { ok: true, resendAfter: 60 };

  try {
    const sent = await authService.login(
      { family_name: pending.familyName },
      { userAgent: await userAgent() },
    );
    /* A fresh ten minutes for the login, as for the code. */
    await holdPendingLogin(pending);
    return { ok: true, resendAfter: sent.resend_after };
  } catch (error) {
    return {
      ok: false,
      message: said(error, "We could not send a code. Try again in a moment."),
    };
  }
}

/**
 * Signs this device out: the backend ends its session, and every cookie
 * goes. The backend is asked first and its answer does not matter: a
 * device that cannot reach it is still signed out here.
 */
export async function endMemberSession(): Promise<void> {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  if (authMode() === "backend" && refreshToken) {
    try {
      await authService.logout(refreshToken, { userAgent: await userAgent() });
    } catch {
      /* Signed out here either way. */
    }
  }
  clearSessionCookies(store);
}
