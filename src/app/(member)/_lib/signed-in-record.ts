import { cookies } from "next/headers";
import { signedInPerson } from "@/constants/member";
import { matchesName } from "@/features/auth/roles";
import { FAMILY_REGISTER } from "@/features/members/data";
import { getSessionRole, SESSION_COOKIE } from "@/lib/session";

/**
 * The register's row for whoever is signed in, found by name, because the
 * session carries a role and not an identity yet. Composed here, at the
 * route layer, because it joins three features.
 *
 * TODO: read the id from the session once it carries one.
 */
export async function signedInRecord() {
  const store = await cookies();
  const role = await getSessionRole(store.get(SESSION_COOKIE)?.value);
  const person = signedInPerson(role);
  return FAMILY_REGISTER.find((row) => matchesName(row.fullName, person.name));
}
