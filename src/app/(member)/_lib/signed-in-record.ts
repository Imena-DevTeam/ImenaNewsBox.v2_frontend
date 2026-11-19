import { signedInPerson } from "@/constants/member";
import { matchesName } from "@/features/auth/roles";
import { FAMILY_REGISTER } from "@/features/members/data";
import { authMode } from "@/lib/auth-mode";
import { getViewer } from "@/lib/viewer";

/**
 * The sample register's row for whoever is signed in, in fixture mode only.
 *
 * With a backend there is no such row: the person is a real account, and the
 * sample register is not theirs. So this answers undefined, and the profile
 * shows what it can without one until step 6 of CLAUDE.md §23 reads the
 * account itself.
 *
 * TODO: step 6 replaces this with `usersService.me`.
 */
export async function signedInRecord() {
  if (authMode() !== "fixture") return undefined;
  const viewer = await getViewer();
  if (!viewer) return undefined;
  const person = signedInPerson(viewer.role);
  return FAMILY_REGISTER.find((row) => matchesName(row.fullName, person.name));
}
