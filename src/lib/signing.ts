/**
 * The signing this project's cookies rest on.
 *
 * Lifted out of session.ts when the pending-login cookie needed the same
 * thing: one HMAC, one secret, one constant-time comparison, so a second
 * cookie cannot quietly be given a weaker version of the first one's.
 *
 * Web Crypto only, so the same code runs in the middleware (edge) and in
 * server actions (Node).
 */

/* Only for local development. Production without AUTH_SECRET fails closed:
   nothing can be signed and nothing is accepted. */
const DEV_SECRET = "imena-dev-only-secret-do-not-use-in-production";

export function secret(): string | null {
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

export async function sign(payload: string, key: string): Promise<string> {
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

/**
 * Compares every character whatever the first difference, so the time a
 * check takes says nothing about how close a guess was.
 */
export function sameString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++)
    difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}
