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

/** Every path that needs a member session. */
export const MEMBER_PREFIXES = [
  "/dashboard",
  "/gallery",
  "/blogs",
  "/profile",
  "/resources",
  "/birthdays",
  "/tree",
] as const;

export function isMemberPath(pathname: string): boolean {
  return MEMBER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

const VERSION = "v1";

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
  now: number = Date.now(),
): Promise<string | null> {
  const key = secret();
  if (!key) return null;

  const payload = `${VERSION}.${now}`;
  return `${payload}.${await sign(payload, key)}`;
}

/** True only for a token this server signed, and only within its lifetime. */
export async function verifySessionToken(
  token: string | undefined,
  now: number = Date.now(),
): Promise<boolean> {
  const key = secret();
  if (!key || !token) return false;

  const [version, issued, signature] = token.split(".");
  if (version !== VERSION || !issued || !signature) return false;

  const issuedAt = Number(issued);
  if (!Number.isFinite(issuedAt) || issuedAt > now) return false;
  if (now - issuedAt > SESSION_MAX_AGE * 1000) return false;

  return sameString(signature, await sign(`${version}.${issued}`, key));
}
