/**
 * The member session.
 *
 * There is no auth API yet, so a verified one-time password issues a signed
 * token and the middleware checks the signature and its age. Signing means a
 * session cannot be made by hand-writing a cookie; it does not make the
 * one-time password itself real — any five digits still pass verifyCode().
 *
 * TODO: when the backend lands, verify the code against it and carry the
 * user's identity in the token (or swap this for the token it issues).
 *
 * The signing itself is in @/lib/signing, shared with the pending-login
 * cookie: Web Crypto only, so the same code runs in the middleware (edge)
 * and in server actions (Node).
 *
 * The role in this token is written by the server and never by a caller —
 * see app/actions/session.ts, which reads it from the pending-login cookie.
 */
import { sameString, secret, sign } from "@/lib/signing";

export const SESSION_COOKIE = "imena_member";

/** A week, which is how long the design's "catch up" flow implies. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/** Where a signed-out visitor is sent back to after logging in. */
export const RETURN_PARAM = "next";

/**
 * The three kinds of session.
 *
 * The design offers "As Admin" and "As a member" at login. `blogger` has no
 * door of its own: the family's blogger signs in at the member login like
 * everybody else, and the register says who she is — see
 * features/auth/roles.ts. What the role gates is one extra target in the
 * rail and the studio behind it.
 */
export type Role = "member" | "admin" | "blogger";

/** Every role a token may carry, for validating one that arrives. */
const ROLES: Role[] = ["member", "admin", "blogger"];

export const ADMIN_PREFIX = "/admin";

/**
 * The /admin paths a visitor with no session may reach.
 *
 * There was one — the login — and it was a line in `isAdminPath`. Two more
 * arrived with the password reset, and they are reached by exactly the
 * people who **cannot** sign in, so they cannot sit behind the gate that
 * sends you to a login you have lost the password for.
 *
 * > [!CAUTION]
 * > This list is the whole of what separates the register from the public.
 * > Each entry is an **exact path**, never a prefix, so `/admin/login-x`
 * > and `/admin/forgot-password/members` are still gated — a prefix here
 * > would open everything underneath a name anybody can type.
 */
export const ADMIN_PUBLIC_PATHS = [
  "/admin/login",
  "/admin/forgot-password",
] as const;

/* The one that cannot be an exact path, because the token is in it. The
   token itself proves nothing: the page behind this renders a form, and the
   backend decides whether the token is worth anything. */
const ADMIN_PUBLIC_PREFIX = "/admin/reset-password/";

export function isAdminPublicPath(pathname: string): boolean {
  if (ADMIN_PUBLIC_PATHS.some((path) => path === pathname)) return true;
  /* Longer than the prefix, so a bare /admin/reset-password/ with no token
     is gated rather than public: there is nothing to do on it. */
  return (
    pathname.startsWith(ADMIN_PUBLIC_PREFIX) &&
    pathname.length > ADMIN_PUBLIC_PREFIX.length
  );
}

/** Everything under /admin except the pages a signed-out visitor needs. */
export function isAdminPath(pathname: string): boolean {
  if (isAdminPublicPath(pathname)) return false;
  return pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
}

/** Where the posts and the albums are worked on. */
export const STUDIO_PREFIX = "/studio";

export function isStudioPath(pathname: string): boolean {
  return pathname === STUDIO_PREFIX || pathname.startsWith(`${STUDIO_PREFIX}/`);
}

/** The studio is the blogger's, and an administrator can see it too: they
    are the one who answers for what the family publishes. */
export function mayUseStudio(role: Role): boolean {
  return role === "blogger" || role === "admin";
}

/** Every path that needs a member session. */
export const MEMBER_PREFIXES = [
  "/dashboard",
  "/gallery",
  "/blogs",
  "/profile",
  "/resources",
  "/birthdays",
  "/tree",
  "/families",
  "/people",
] as const;

export function isMemberPath(pathname: string): boolean {
  return MEMBER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/* v1 tokens carry no role and are read as member sessions, so the sessions
   issued before the admin area existed keep working until they expire. */
const VERSION = "v2";
const LEGACY_VERSION = "v1";

/** A fresh session token, or null when no secret is configured. */
export async function createSessionToken(
  role: Role = "member",
  now: number = Date.now(),
): Promise<string | null> {
  const key = secret();
  if (!key) return null;

  const payload = `${VERSION}.${role}.${now}`;
  return `${payload}.${await sign(payload, key)}`;
}

/**
 * The role a token carries, or null when it is absent, unsigned, forged or
 * expired. A v1 token predates roles and counts as a member.
 */
export async function getSessionRole(
  token: string | undefined,
  now: number = Date.now(),
): Promise<Role | null> {
  const key = secret();
  if (!key || !token) return null;

  const parts = token.split(".");
  const legacy = parts[0] === LEGACY_VERSION;
  if (!legacy && parts[0] !== VERSION) return null;

  const [version, role, issued, signature] = legacy
    ? ([parts[0], "member", parts[1], parts[2]] as const)
    : (parts as [string, string, string, string]);

  if (!issued || !signature) return null;
  const known = ROLES.find((one) => one === role);
  if (!known) return null;

  const issuedAt = Number(issued);
  if (!Number.isFinite(issuedAt) || issuedAt > now) return null;
  if (now - issuedAt > SESSION_MAX_AGE * 1000) return null;

  const payload = legacy
    ? `${version}.${issued}`
    : `${version}.${role}.${issued}`;
  if (!sameString(signature, await sign(payload, key))) return null;

  return known;
}

/** True only for a token this server signed, and only within its lifetime. */
export async function verifySessionToken(
  token: string | undefined,
  now: number = Date.now(),
): Promise<boolean> {
  return (await getSessionRole(token, now)) !== null;
}
