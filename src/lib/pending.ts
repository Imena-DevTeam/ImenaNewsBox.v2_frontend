/**
 * The login in progress.
 *
 * Between the login screen and the code there are two facts worth holding:
 * **which family name the code was sent for**, because the backend checks
 * the code against it, and whether that was the administrators' door. Both
 * are decided on the server at the login step and carried here, in a
 * short-lived, signed, httpOnly cookie. Nothing about a login travels in a
 * URL: `/verify?role=admin` once made anybody an administrator.
 *
 * In fixture mode it also carries the role the sample register gave the
 * name, because there is no backend to ask afterwards.
 *
 * It is deliberately short-lived: the backend's code lasts ten minutes, and
 * a stale login should send you back to the start rather than quietly work
 * a day later.
 */
import { readData, signData } from "@/lib/signing";
import { ROLES, type Role } from "@/lib/session";

export const PENDING_COOKIE = "imena_pending";

/** The life of the backend's code, and no longer. */
export const PENDING_MAX_AGE = 60 * 10;

const VERSION = "p2";

export interface PendingLogin {
  familyName: string;
  /** Came through the administrators' door, so a new code needs the
      password again. */
  admin: boolean;
  /** Fixture mode only: the role the sample register gave this name. */
  role?: Role;
}

/** A token holding this login, or null with no secret set. */
export async function createPendingToken(
  login: PendingLogin,
  now: number = Date.now(),
): Promise<string | null> {
  return signData(VERSION, {
    n: login.familyName,
    a: login.admin,
    ...(login.role ? { r: login.role } : {}),
    t: now,
  });
}

/**
 * The login a pending token holds, or null when it is absent, forged or
 * past its ten minutes. The same checks as the session token: a second
 * cookie must not be a weaker version of the first.
 */
export async function readPendingToken(
  token: string | undefined,
  now: number = Date.now(),
): Promise<PendingLogin | null> {
  const data = await readData(VERSION, token);
  if (!data) return null;

  const familyName = typeof data.n === "string" ? data.n : "";
  const issuedAt = typeof data.t === "number" ? data.t : NaN;
  if (!familyName || typeof data.a !== "boolean") return null;
  if (!Number.isFinite(issuedAt) || issuedAt > now) return null;
  if (now - issuedAt > PENDING_MAX_AGE * 1000) return null;

  const role =
    data.r === undefined ? undefined : ROLES.find((one) => one === data.r);
  if (data.r !== undefined && !role) return null;

  return { familyName, admin: data.a, ...(role ? { role } : {}) };
}
