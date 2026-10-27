/**
 * The member session, such as it is.
 *
 * There is no auth API yet, so a verified one-time password writes a cookie
 * and the middleware reads it. That is deliberately thin: it is a gate, not
 * a credential, and it exists so the member pages stop being public to
 * anyone who types the URL.
 *
 * TODO: when the backend lands, swap the marker for the session token it
 * issues and verify it here rather than merely checking that it is present.
 */
export const SESSION_COOKIE = "imena_member";

/** A week, which is how long the design's "catch up" flow implies. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/** Where a signed-out visitor is sent back to after logging in. */
export const RETURN_PARAM = "next";

/** Every path that needs a member session. */
export const MEMBER_PREFIXES = [
  "/dashboard",
  "/gallery",
  "/blogs",
  "/profile",
  "/resources",
  "/birthdays",
] as const;

export function isMemberPath(pathname: string): boolean {
  return MEMBER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
