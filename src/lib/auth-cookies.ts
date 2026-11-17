import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/session";
import { PENDING_COOKIE } from "@/lib/pending";

/**
 * Writing and clearing the session's cookies, in one place.
 *
 * The same code serves a server action (`cookies()`) and the middleware
 * (`response.cookies`): both have `set(name, value, options)`. Every cookie
 * is httpOnly, so no script on the page can read a token, and `lax`, so a
 * link from another site still arrives signed in but a form posted from one
 * does not.
 */
export interface CookieWriter {
  set(
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      sameSite?: "lax" | "strict" | "none";
      secure?: boolean;
      path?: string;
      maxAge?: number;
    },
  ): unknown;
}

const base = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
});

export interface SessionCookies {
  /** The signed role-and-id token (`createSessionToken`). */
  session: string;
  /** Backend mode: the access token and how many seconds it lasts. */
  access?: { token: string; expiresIn: number };
  /** Backend mode: the refresh token the backend just rotated to. */
  refresh?: string;
}

export function writeSessionCookies(
  writer: CookieWriter,
  cookies: SessionCookies,
): void {
  writer.set(SESSION_COOKIE, cookies.session, {
    ...base(),
    maxAge: SESSION_MAX_AGE,
  });
  if (cookies.access) {
    writer.set(ACCESS_COOKIE, cookies.access.token, {
      ...base(),
      maxAge: cookies.access.expiresIn,
    });
  }
  if (cookies.refresh) {
    writer.set(REFRESH_COOKIE, cookies.refresh, {
      ...base(),
      maxAge: SESSION_MAX_AGE,
    });
  }
}

/** Every cookie a sign-in leaves behind, the login in progress included. */
export const AUTH_COOKIES = [
  SESSION_COOKIE,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  PENDING_COOKIE,
] as const;

export function clearSessionCookies(writer: CookieWriter): void {
  for (const name of AUTH_COOKIES) {
    writer.set(name, "", { ...base(), maxAge: 0 });
  }
}
