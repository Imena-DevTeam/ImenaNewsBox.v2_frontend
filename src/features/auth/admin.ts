import { sameString } from "@/lib/signing";
import {
  FAMILY_REGISTER,
  SECOND_ADMIN_ID,
  SIGNED_IN_ID,
} from "@/features/members/data";
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
 *
 * > [!CAUTION]
 * > **`ADMIN_PASSWORD` cannot survive the invitation work of 13 Nov 2026.**
 * > `/invite/<token>/signup` asks an invited administrator to choose their
 * > own password and `/admin/reset-password/<token>` lets them replace it,
 * > and neither is possible on top of one shared secret in the environment:
 * > "A sets a new password" would set everybody's. Those two screens exist
 * > and call services; this file is what they replace. See CLAUDE.md §21.
 */

/* Only for local development, and only when ADMIN_PASSWORD is unset. In
   production an unset password fails closed: no administrator can sign in,
   which is the right way round for a missing secret. */
const DEV_PASSWORD = "imena-dev-admin";

/**
 * A password each, in development only.
 *
 * The password reset is the first feature that needs **two administrators
 * who are told apart by their credential**: "one of them forgets his
 * password" is not a story you can walk through if both of them share one.
 * So each seeded administrator has their own while there is no
 * `ADMIN_PASSWORD` to use, and knowing one does not open the other's door.
 *
 * > [!NOTE]
 * > Setting `ADMIN_PASSWORD` overrides all of this and both administrators
 * > share that one value again — which is exactly the limitation that makes
 * > `ADMIN_PASSWORD` unable to survive per-person signup. See the caution
 * > above and CLAUDE.md §21.
 */
const DEV_PASSWORDS: Record<string, string> = {
  [SIGNED_IN_ID]: "aganze-dev-admin",
  [SECOND_ADMIN_ID]: "shema-dev-admin",
};

export type AdminCheck =
  { ok: true } | { ok: false; reason: "unavailable" | "rejected" };

export function checkAdminCredential(
  name: string,
  password: string,
): AdminCheck {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured && process.env.NODE_ENV === "production") {
    return { ok: false, reason: "unavailable" };
  }

  /* The same rule the member door uses, so "Aganze" means the same thing at
     both: the whole name or either part of it. */
  const person = FAMILY_REGISTER.find(
    (one) =>
      one.role === "admin" &&
      one.status === "active" &&
      matchesName(one.fullName, name),
  );

  /* Whose password to expect. `ADMIN_PASSWORD` wins and is shared; without
     it, each seeded administrator has their own. An unknown name falls back
     to a value nothing matches, so the comparison below still runs: there
     must be no path that skips it. */
  const expected = configured
    ? configured
    : person
      ? (DEV_PASSWORDS[person.id] ?? DEV_PASSWORD)
      : DEV_PASSWORD;

  /* Both halves are checked whatever the first one said, so the time this
     takes does not tell somebody whether the name is an administrator's. */
  const nameIsAdmin = person !== undefined;
  const passwordMatches = sameString(password, expected);

  if (!nameIsAdmin || !passwordMatches)
    return { ok: false, reason: "rejected" };
  return { ok: true };
}
