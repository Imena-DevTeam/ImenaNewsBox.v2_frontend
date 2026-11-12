"use server";

import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  type Role,
} from "@/lib/session";
import {
  PENDING_COOKIE,
  PENDING_MAX_AGE,
  createPendingToken,
  readPendingToken,
} from "@/lib/pending";
import { checkAdminCredential } from "@/features/auth/admin";
import { roleForName } from "@/features/auth/roles";
import { adminLoginSchema, userLoginSchema } from "@/features/auth/schemas";

/**
 * Only async functions may be exported from a "use server" module, so the
 * cookie's name, lifetime and signing live in @/lib/session and @/lib/pending.
 *
 * > [!IMPORTANT]
 * > Everything exported from this file is a **public endpoint**. Anyone can
 * > call it, with anything, from anywhere — not only the forms that are
 * > supposed to. `startMemberSession` used to take the role as an argument
 * > and sign whatever it was handed, which meant the role was decided by the
 * > caller. It takes no arguments now, and reads the role from a cookie only
 * > this file can set.
 */

/** What the two login steps return, so a form can say what went wrong. */
export type LoginOutcome = { ok: true } | { ok: false; message: string };

const NO_SECRET =
  "AUTH_SECRET is not set, so no session can be issued. Generate one with `npx auth secret`.";

async function holdPendingLogin(role: Role): Promise<boolean> {
  const token = await createPendingToken(role);
  if (!token) return false;

  const store = await cookies();
  store.set(PENDING_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PENDING_MAX_AGE,
  });
  return true;
}

/**
 * The family's login: a name, and the register decides what it is worth.
 *
 * The lookup runs here rather than in the browser, because the browser's
 * answer is a suggestion. Typing the blogger's name is what puts the studio
 * in her rail; every other name is a member. Nothing here can grant an
 * administrator anything.
 */
export async function beginMemberLogin(name: string): Promise<LoginOutcome> {
  /* The same schema the form uses. A server action is a public endpoint:
     the form's validation is a courtesy to whoever is typing, not a
     guarantee about what arrives here. */
  const checked = userLoginSchema.safeParse({ name });
  if (!checked.success) {
    return {
      ok: false,
      message: checked.error.issues[0]?.message ?? "That name cannot be used.",
    };
  }

  const role = roleForName(checked.data.name);
  if (!(await holdPendingLogin(role))) {
    return { ok: false, message: NO_SECRET };
  }
  return { ok: true };
}

/**
 * The administrators' door: the family name, and the password.
 *
 * Both are checked before anything is held. One message for every kind of
 * failure, so the reply never says whether the name is an administrator's.
 */
export async function beginAdminLogin(
  name: string,
  password: string,
): Promise<LoginOutcome> {
  /* Shape first, on the server, for the same reason as above. The message
     is the same one a wrong credential gets: whether the shape or the
     credential was wrong is not something to tell a stranger. */
  const shape = adminLoginSchema.safeParse({ name, password });
  if (!shape.success) {
    return {
      ok: false,
      message: "That name and password do not match an administrator.",
    };
  }

  const checked = checkAdminCredential(shape.data.name, shape.data.password);

  if (!checked.ok) {
    return {
      ok: false,
      message:
        checked.reason === "unavailable"
          ? "Administrator sign-in is not configured on this site yet."
          : "That name and password do not match an administrator.",
    };
  }

  if (!(await holdPendingLogin("admin"))) {
    return { ok: false, message: NO_SECRET };
  }
  return { ok: true };
}

/**
 * Turns a login in progress into a session.
 *
 * It takes **no arguments**: the role comes from the pending cookie this
 * file set at the login step, so reaching /verify directly — with or without
 * a role in the URL — grants nothing. Without a pending login it throws, and
 * the verify screen sends you back to start again.
 */
export async function startMemberSession(): Promise<Role> {
  const store = await cookies();
  const role = await readPendingToken(store.get(PENDING_COOKIE)?.value);

  if (!role) {
    throw new Error(
      "There is no login in progress. Start again from the login page.",
    );
  }

  const token = await createSessionToken(role);
  if (!token) throw new Error(NO_SECRET);

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  /* Spent: one pending login, one session. */
  store.delete(PENDING_COOKIE);

  return role;
}

export async function endMemberSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(PENDING_COOKIE);
}
