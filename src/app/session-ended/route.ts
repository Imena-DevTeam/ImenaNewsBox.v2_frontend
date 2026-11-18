import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";
import { clearSessionCookies, writeSessionCookies } from "@/lib/auth-cookies";
import { authMode } from "@/lib/auth-mode";
import { refreshSession } from "@/lib/refresh";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  SESSION_COOKIE,
  createSessionToken,
  readSession,
} from "@/lib/session";
import { usersService } from "@/services/users.service";
import { ApiError } from "@/types/api";

/**
 * Where a page sends somebody whose session it could not use.
 *
 * A signed-in device is never shown the login (the middleware sends it on),
 * so when the backend has ended a session — revoked from another device, the
 * account deactivated — the cookies have to go first, or the login would
 * send the person straight back to the page that just turned them away.
 *
 * It does not take the page's word for it. A cookie-clearing link is
 * something any other site could send somebody to, so this asks the backend
 * itself, and only clears the cookies when the backend agrees the session is
 * over. An access token that has merely run out is refreshed instead.
 */
export async function GET(request: NextRequest) {
  const to = (path: string) =>
    NextResponse.redirect(new URL(path, request.url));
  const signOut = () => {
    const response = to(ROUTES.LOGIN);
    clearSessionCookies(response.cookies);
    return response;
  };

  const mode = authMode();
  if (mode !== "backend") {
    const session = await readSession(
      request.cookies.get(SESSION_COOKIE)?.value,
    );
    return mode === "fixture" && session ? to(ROUTES.DASHBOARD) : signOut();
  }

  const userAgent = request.headers.get("user-agent") ?? undefined;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (token) {
    try {
      await usersService.me({ token, userAgent });
      /* Still signed in: whatever went wrong, it was not the session. */
      return to(ROUTES.DASHBOARD);
    } catch (error) {
      /* Not reachable is not signed out: let the page say so. */
      if (!(error instanceof ApiError && error.status === 401)) {
        return to(ROUTES.DASHBOARD);
      }
    }
  }

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return signOut();

  const result = await refreshSession(refreshToken, userAgent);
  if (!result.ok) {
    return result.reason === "ended" ? signOut() : to(ROUTES.DASHBOARD);
  }

  const session = result.who
    ? await createSessionToken(result.who)
    : request.cookies.get(SESSION_COOKIE)?.value;
  if (!session) return signOut();

  const response = to(ROUTES.DASHBOARD);
  writeSessionCookies(response.cookies, {
    session,
    access: { token: result.accessToken, expiresIn: result.expiresIn },
    refresh: result.refreshToken,
  });
  return response;
}
