import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";
import {
  getSessionRole,
  isAdminPath,
  isMemberPath,
  isStudioPath,
  mayUseStudio,
  RETURN_PARAM,
  SESSION_COOKIE,
} from "@/lib/session";

/**
 * The member area holds the family's photographs and records, so it is not
 * public. Without a valid, signed session the request is sent to the login
 * page, carrying where it was going so the verify step can finish the
 * journey.
 *
 * The admin area needs more than a session: it needs an admin one. A member
 * who reaches for it is sent to their own dashboard rather than to a login
 * page, because logging in again would not help them.
 *
 * The studio is the same rule for the blogger, with the administrator let in
 * as well: they answer for what the family publishes. Nobody is sent to a
 * login for it, because the login does not grant it — the register does.
 *
 * This is the first of the two checks the structure document asks for. The
 * second lives in the admin layout and runs on the server, so the rule never
 * rests on the middleware alone.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const admin = isAdminPath(pathname);
  const studio = isStudioPath(pathname);
  if (!admin && !studio && !isMemberPath(pathname)) return NextResponse.next();

  const role = await getSessionRole(request.cookies.get(SESSION_COOKIE)?.value);

  if (!role) {
    const login = new URL(
      admin ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN,
      request.url,
    );
    login.searchParams.set(RETURN_PARAM, `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  if (admin && role !== "admin") {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  if (studio && !mayUseStudio(role)) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  /* Everything but Next's own assets and the files under public/. */
  matcher: [
    "/((?!_next/static|_next/image|images|icons|videos|favicon.ico).*)",
  ],
};
