/**
 * The login in progress.
 *
 * Between the login screen and the one-time password there is a fact worth
 * exactly as much as the session itself: **which role is being signed in
 * for**. It used to travel in the query string — `/verify?role=admin` — and
 * the server action that issued the session took it as an argument and
 * believed it. Typing that URL and any five digits made you an
 * administrator, and the password on `/admin/login` was never read.
 *
 * So the role is decided on the server, at the login step, and carried here:
 * a short-lived, signed, httpOnly cookie. `/verify` reads this and nothing
 * else. A role in the URL is ignored.
 *
 * It is deliberately short-lived. It is not a session — it is the few
 * minutes between asking for a code and typing one, and a stale one should
 * send you back to the login rather than quietly work a day later.
 */
import { secret, sameString, sign } from "@/lib/signing";
import type { Role } from "@/lib/session";

export const PENDING_COOKIE = "imena_pending";

/** Long enough to read an email and type five digits, and no longer. */
export const PENDING_MAX_AGE = 60 * 10;

const VERSION = "p1";

const ROLES: Role[] = ["member", "admin", "blogger"];

/** A token naming the role this login is for, or null with no secret set. */
export async function createPendingToken(
  role: Role,
  now: number = Date.now(),
): Promise<string | null> {
  const key = secret();
  if (!key) return null;

  const payload = `${VERSION}.${role}.${now}`;
  return `${payload}.${await sign(payload, key)}`;
}

/**
 * The role a pending token names, or null when it is absent, forged or past
 * its ten minutes. Same shape and the same checks as the session token: a
 * second cookie must not be a weaker version of the first.
 */
export async function readPendingToken(
  token: string | undefined,
  now: number = Date.now(),
): Promise<Role | null> {
  const key = secret();
  if (!key || !token) return null;

  const [version, role, issued, signature] = token.split(".");
  if (version !== VERSION || !role || !issued || !signature) return null;

  const known = ROLES.find((one) => one === role);
  if (!known) return null;

  const issuedAt = Number(issued);
  if (!Number.isFinite(issuedAt) || issuedAt > now) return null;
  if (now - issuedAt > PENDING_MAX_AGE * 1000) return null;

  const payload = `${version}.${role}.${issued}`;
  if (!sameString(signature, await sign(payload, key))) return null;

  return known;
}
