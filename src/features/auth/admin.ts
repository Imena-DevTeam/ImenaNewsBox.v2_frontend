import { authMode } from "@/lib/auth-mode";
import { sameString } from "@/lib/signing";
import {
  FAMILY_REGISTER,
  SECOND_ADMIN_ID,
  SIGNED_IN_ID,
} from "@/features/members/data";
import { matchesName } from "./roles";

/**
 * Whether a name and a password belong to an administrator — **in fixture
 * mode only** (lib/auth-mode.ts: no backend, never in production).
 *
 * With a backend this file is not asked: the backend checks the password
 * against its own hash, per person. Here, each seeded administrator in the
 * sample register has a development password of their own, so the reset
 * flow's two administrators can still be told apart without a backend.
 *
 * It refuses outright in any other mode, as well as the caller deciding not
 * to ask: a development password must never open a door anywhere else.
 * `ADMIN_PASSWORD`, the one secret all administrators once shared, is gone:
 * it could not be set per person, and per-person passwords are the
 * backend's now (CLAUDE.md §23).
 */
const DEV_PASSWORDS: Record<string, string> = {
  [SIGNED_IN_ID]: "aganze-dev-admin",
  [SECOND_ADMIN_ID]: "shema-dev-admin",
};

/* For an unknown name, so the comparison below still runs: there must be no
   path that skips it. */
const NOBODY = "imena-no-such-administrator";

export type AdminCheck =
  { ok: true } | { ok: false; reason: "unavailable" | "rejected" };

export function checkAdminCredential(
  name: string,
  password: string,
): AdminCheck {
  if (authMode() !== "fixture") return { ok: false, reason: "unavailable" };

  /* The same rule the member door uses, so "Aganze" means the same thing at
     both: the whole name or either part of it. */
  const person = FAMILY_REGISTER.find(
    (one) =>
      one.role === "admin" &&
      one.status === "active" &&
      matchesName(one.fullName, name),
  );
  const expected = person ? (DEV_PASSWORDS[person.id] ?? NOBODY) : NOBODY;

  /* Both halves are checked whatever the first one said, so the time this
     takes does not tell somebody whether the name is an administrator's. */
  const nameIsAdmin = person !== undefined;
  const passwordMatches = sameString(password, expected);

  if (!nameIsAdmin || !passwordMatches)
    return { ok: false, reason: "rejected" };
  return { ok: true };
}
