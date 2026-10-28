import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";
import {
  isMemberPath,
  RETURN_PARAM,
  SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/session";

/**
 * The member area holds the family's photographs and records, so it is not
 * public. Without a valid, signed session the request is sent to the login page, carrying
 * where it was going so the verify step can finish the journey.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isMemberPath(pathname)) return NextResponse.next();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (await verifySessionToken(token)) return NextResponse.next();

  const login = new URL(ROUTES.LOGIN, request.url);
  login.searchParams.set(RETURN_PARAM, `${pathname}${search}`);

  return NextResponse.redirect(login);
}

export const config = {
  /* Everything but Next's own assets and the files under public/. */
  matcher: [
    "/((?!_next/static|_next/image|images|icons|videos|favicon.ico).*)",
  ],
};
