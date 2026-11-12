import { sameString } from "@/lib/signing";
import { FAMILY_REGISTER } from "@/features/members/data";
import { matchesName } from "./roles";

/**
 * Whether a name and a password belong to an administrator.
 *
 * Two things have to be true, and both are checked on the server: the name
 * belongs to somebody the register holds as an administrator, and the
 * password matches `ADMIN_PASSWORD`.
 *
 * The name on its own proves nothing — the register is readable by anyone
 * who can see the site, and `/login` takes a name with no password at all.
 * It is the **password** that makes this a credential; the lookup only
 * stops the door opening for a name that is not an administrator's, so
 * knowing the password is not by itself enough.
 *
 * This is the smallest honest stand-in for a credential, not a password
 * system. There is one password for the administrators rather than one each,
 * it is compared in plain text because there is nowhere to store a hash, and
 * the register is a fixture. What it does do is stop an administrator
 * session being issued to somebody who simply asked for one, which is what
 * happened until 12 Nov 2026: the form validated the shape of these two
 * fields and then threw them away.
 *
 * TODO: the auth API verifies the credential and returns the role. Delete
 * this file on the day it does.
 */

/* Only for local development, and only when ADMIN_PASSWORD is unset. In
   production an unset password fails closed: no administrator can sign in,
   which is the right way round for a missing secret. */
const DEV_PASSWORD = "imena-dev-admin";

function adminPassword(): string | null {
  const configured = process.env.ADMIN_PASSWORD;
  if (configured) return configured;
  return process.env.NODE_ENV === "production" ? null : DEV_PASSWORD;
}

export type AdminCheck =
  { ok: true } | { ok: false; reason: "unavailable" | "rejected" };

export function checkAdminCredential(
  name: string,
  password: string,
): AdminCheck {
  const expected = adminPassword();
  if (!expected) return { ok: false, reason: "unavailable" };

  /* The same rule the member door uses, so "Aganze" means the same thing at
     both: the whole name or either part of it. */
  const person = FAMILY_REGISTER.find(
    (one) =>
      one.role === "admin" &&
      one.status === "active" &&
      matchesName(one.fullName, name),
  );

  /* Both halves are checked whatever the first one said, so the time this
     takes does not tell somebody whether the name is an administrator's. */
  const nameIsAdmin = person !== undefined;
  const passwordMatches = sameString(password, expected);

  if (!nameIsAdmin || !passwordMatches)
    return { ok: false, reason: "rejected" };
  return { ok: true };
}
