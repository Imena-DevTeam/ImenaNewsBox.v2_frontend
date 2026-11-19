/**
 * The session: who is signed in, as far as this frontend needs to know.
 *
 * A signed, httpOnly cookie carrying the person's **role and id**, written
 * by the server after a login it checked and never by a caller. The
 * middleware reads it to decide who may reach `/admin` and `/studio`, and
 * the rail reads it to decide what to offer.
 *
 * > [!IMPORTANT]
 * > **It decides what the frontend shows, not what anybody may do.** With
 * > a backend (`authMode() === "backend"`), every call carries the
 * > backend's own access token, the backend loads the user and their role
 * > from its database on every request, and it refuses what the role may
 * > not do. This cookie is re-issued from `GET /users/me` whenever the
 * > tokens refresh, so a changed role reaches the rail within minutes, and
 * > the admin and studio layouts ask the backend again before rendering.
 *
 * The signing is in @/lib/signing, shared with the pending-login cookie:
 * Web Crypto only, so the same code runs in the middleware and in server
 * actions.
 */
import type { Role as WireRole } from "@/types/wire";
import { readData, signData } from "@/lib/signing";

/** The backend's roles, cumulative: member < social media manager < admin. */
export type Role = WireRole;

/** Every role a token may carry, for validating one that arrives. */
export const ROLES: readonly Role[] = [
  "member",
  "social_media_manager",
  "admin",
];

/** The signed role-and-id cookie. */
export const SESSION_COOKIE = "imena_member";

/** The backend's access token, kept by the Next server (backend mode). */
export const ACCESS_COOKIE = "imena_access";

/** The backend's refresh token, kept by the Next server (backend mode). */
export const REFRESH_COOKIE = "imena_refresh";

/**
 * Ninety days, the backend's refresh lifetime: a device used at least that
 * often never logs in again. Every refresh starts the count again.
 */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 90;

/** Where a signed-out visitor is sent back to after logging in. */
export const RETURN_PARAM = "next";

/** The family name a login form starts with, after an invitation is
    accepted. Family names are not secret (the backend's auth.md), and it
    only fills a field: the code, and an administrator's password, still
    decide everything. */
export const NAME_PARAM = "name";

export const ADMIN_PREFIX = "/admin";

/**
 * The /admin paths a visitor with no session may reach.
 *
 * They are reached by exactly the people who **cannot** sign in, so they
 * cannot sit behind the gate that sends you to a login you have lost the
 * password for.
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

export function isAdminPublicPath(pathname: string): boolean {
  return ADMIN_PUBLIC_PATHS.some((path) => path === pathname);
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

/** The studio is the social media manager's, and an administrator's too:
    roles are cumulative, and they answer for what the family publishes. */
export function mayUseStudio(role: Role): boolean {
  return role === "social_media_manager" || role === "admin";
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

/* v1 and v2 tokens carried the frontend's own roles, before the backend
   existed. They are not read: somebody holding one signs in again. */
const VERSION = "v3";

export interface Session {
  role: Role;
  /** The backend's user id, or a sample register id in fixture mode. */
  userId: string;
}

/** A fresh session token, or null when no secret is configured. */
export async function createSessionToken(
  session: Session,
  now: number = Date.now(),
): Promise<string | null> {
  return signData(VERSION, {
    r: session.role,
    u: session.userId,
    t: now,
  });
}

/**
 * The role and id a token carries, or null when it is absent, forged, of
 * an older version, names a role that does not exist, or is past its
 * lifetime.
 */
export async function readSession(
  token: string | undefined,
  now: number = Date.now(),
): Promise<Session | null> {
  const data = await readData(VERSION, token);
  if (!data) return null;

  const role = ROLES.find((one) => one === data.r);
  const userId = typeof data.u === "string" && data.u ? data.u : null;
  const issuedAt = typeof data.t === "number" ? data.t : NaN;
  if (!role || !userId || !Number.isFinite(issuedAt)) return null;
  if (issuedAt > now || now - issuedAt > SESSION_MAX_AGE * 1000) return null;

  return { role, userId };
}

/** The role alone, for the places that only gate on it. */
export async function getSessionRole(
  token: string | undefined,
  now: number = Date.now(),
): Promise<Role | null> {
  return (await readSession(token, now))?.role ?? null;
}
