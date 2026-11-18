import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";
import {
  clearSessionCookies,
  writeSessionCookies,
  type SessionCookies,
} from "@/lib/auth-cookies";
import { authMode } from "@/lib/auth-mode";
import { refreshSession, shouldRefresh } from "@/lib/refresh";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  RETURN_PARAM,
  SESSION_COOKIE,
  createSessionToken,
  isAdminPath,
  isMemberPath,
  isStudioPath,
  mayUseStudio,
  readSession,
  type Session,
} from "@/lib/session";

/**
 * The gate in front of the member area, and the one place a backend session
 * is kept alive.
 *
 * - Without a session, a request is sent to the login, carrying where it
 *   was going. The admin area sends to its own door.
 * - With a backend (`authMode() === "backend"`), a request whose access
 *   token is within two minutes of running out refreshes it first, and
 *   hands the new tokens both to the browser and to the page being
 *   rendered, so the page never sees the old one. See `lib/refresh.ts` for
 *   why every request with the same token shares one refresh.
 * - A member who reaches for /admin, or for /studio without the role,
 *   lands on their dashboard: signing in again would not help them.
 *
 * This is the first of two checks. The admin and studio layouts ask the
 * backend again on the server, so the rule never rests on the middleware.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === ROUTES.LOGIN || pathname === ROUTES.ADMIN_LOGIN) {
    return pastTheLogin(request);
  }

  const admin = isAdminPath(pathname);
  const studio = isStudioPath(pathname);
  if (!admin && !studio && !isMemberPath(pathname)) return NextResponse.next();

  const toLogin = () => {
    const login = new URL(
      admin ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN,
      request.url,
    );
    login.searchParams.set(RETURN_PARAM, `${pathname}${search}`);
    return NextResponse.redirect(login);
  };
  const signedOut = () => {
    const response = toLogin();
    clearSessionCookies(response.cookies);
    return response;
  };

  const mode = authMode();
  if (mode === "off") return signedOut();

  let session: Session | null = await readSession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );
  let renewed: SessionCookies | null = null;

  if (mode === "backend") {
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
    if (!refreshToken) return signedOut();

    if (!session || shouldRefresh(request.cookies.get(ACCESS_COOKIE)?.value)) {
      const result = await refreshSession(
        refreshToken,
        request.headers.get("user-agent") ?? undefined,
      );
      if (result.ok) {
        session = result.who ?? session;
        const token = session ? await createSessionToken(session) : null;
        if (!token) return signedOut();
        renewed = {
          session: token,
          access: { token: result.accessToken, expiresIn: result.expiresIn },
          refresh: result.refreshToken,
        };
      } else if (result.reason === "ended") {
        return signedOut();
      }
      /* `conflict` or `unreachable`: carry on with the tokens this request
         has. They were refreshed early, so they usually still work; when
         they do not, the backend says so and the layout sends the person
         to the login, and a backend that is down gets the error page. */
    }
  }

  if (!session) return toLogin();

  const forbidden =
    (admin && session.role !== "admin") ||
    (studio && !mayUseStudio(session.role));
  const response = forbidden
    ? NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url))
    : renewed
      ? NextResponse.next({ request: { headers: forward(request, renewed) } })
      : NextResponse.next();

  if (renewed) writeSessionCookies(response.cookies, renewed);
  return response;
}

/**
 * A device that is signed in is not shown the login again: it goes on to
 * where it was headed, or to its home. Logging in once per device is the
 * whole design; a second code for a device that already has a session is
 * a chore that teaches people to ignore the emails.
 *
 * The administrators' door only lets an administrator past: somebody signed
 * in as a member may be handing the device to an administrator.
 *
 * A session the backend has ended since is not caught here: the cookies are
 * only read, not checked with the backend. The page that finds out sends
 * the person to /session-ended, which clears them, so this never loops.
 */
async function pastTheLogin(request: NextRequest) {
  const mode = authMode();
  if (mode === "off") return NextResponse.next();

  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.next();
  if (mode === "backend" && !request.cookies.get(REFRESH_COOKIE)) {
    return NextResponse.next();
  }

  const adminDoor = request.nextUrl.pathname === ROUTES.ADMIN_LOGIN;
  if (adminDoor && session.role !== "admin") return NextResponse.next();

  /* Only ever a plain path on this site, and never a login page itself. */
  const requested = request.nextUrl.searchParams.get(RETURN_PARAM) ?? "";
  const next =
    requested.startsWith("/") &&
    !requested.startsWith("//") &&
    !requested.startsWith("/\\") &&
    !requested.startsWith(ROUTES.LOGIN) &&
    !requested.startsWith(ROUTES.ADMIN_LOGIN)
      ? requested
      : adminDoor
        ? ROUTES.ADMIN
        : ROUTES.DASHBOARD;
  return NextResponse.redirect(new URL(next, request.url));
}

/** The request's headers with the renewed cookies in place of the old ones,
    so the page rendered for this request already uses the new tokens. */
function forward(request: NextRequest, renewed: SessionCookies): Headers {
  request.cookies.set(SESSION_COOKIE, renewed.session);
  if (renewed.access) request.cookies.set(ACCESS_COOKIE, renewed.access.token);
  if (renewed.refresh) request.cookies.set(REFRESH_COOKIE, renewed.refresh);
  return request.headers;
}

export const config = {
  /* Node, not the edge: the refresh is shared between requests in one
     process's memory (lib/refresh.ts), and the backend is called with
     Node's fetch, the same as everywhere else. */
  runtime: "nodejs",
  /* Everything but Next's own assets and the files under public/. */
  matcher: [
    "/((?!_next/static|_next/image|images|icons|videos|favicon.ico).*)",
  ],
};
