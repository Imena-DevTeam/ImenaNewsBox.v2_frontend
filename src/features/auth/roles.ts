import { FAMILY_REGISTER } from "@/features/members/data";
import type { Role } from "@/lib/session";

/**
 * What the name typed at the member login gets you.
 *
 * There is one login for the whole family. Somebody who types "Ngabe" is the
 * family's blogger and lands with the studio in her rail; everybody else
 * lands as a member. The answer comes out of the **register**, not a name
 * written into the code, so an administrator can hand the studio to somebody
 * else from `/admin/members` without a deploy.
 *
 * A match is on the whole name or on either part of it, case-insensitively,
 * because nobody signing in types "Ngabe Uwase" when "Ngabe" is what they
 * are called. `matchesName` is that rule, shared with the administrators'
 * door so the two never disagree about what a typed name means.
 *
 * Only `blogger` is granted this way. An administrator still comes through
 * `/admin/login`, which asks for a password: the register is readable by
 * anyone who can see the site, so a name must never be enough to become one.
 *
 * TODO: the auth API decides this, against a credential. A name is not a
 * credential — any five digits still pass verifyCode(), and this grants no
 * more than the one-time password already does.
 */
export function matchesName(fullName: string, typed: string): boolean {
  const wanted = typed.trim().toLowerCase();
  if (!wanted) return false;

  const full = fullName.toLowerCase();
  return full === wanted || full.split(/\s+/).includes(wanted);
}

export function roleForName(name: string): Role {
  const typed = name.trim();
  if (!typed) return "member";

  const found = FAMILY_REGISTER.find(
    (person) =>
      person.role === "blogger" && matchesName(person.fullName, typed),
  );

  return found ? "blogger" : "member";
}
