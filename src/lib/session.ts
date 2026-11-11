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
 * Uses Web Crypto only, so the same code runs in the middleware (edge) and
 * in server actions (Node).
 */
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

/** Everything under /admin except the login page itself. */
export const ADMIN_PREFIX = "/admin";

export function isAdminPath(pathname: string): boolean {
  if (pathname === "/admin/login") return false;
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

/* Only for local development. Production without AUTH_SECRET fails closed:
   no session can be issued and none is accepted. */
const DEV_SECRET = "imena-dev-only-secret-do-not-use-in-production";

function secret(): string | null {
  const configured = process.env.AUTH_SECRET;
  if (configured) return configured;
  return process.env.NODE_ENV === "production" ? null : DEV_SECRET;
}

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sign(payload: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toBase64Url(
    await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(payload)),
  );
}

/* Compares every character whatever the first difference, so the time a
   check takes says nothing about how close a guess was. */
function sameString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++)
    difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

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
