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
 * are called.
 *
 * Only `blogger` is granted this way. An administrator still comes through
 * `/admin/login`, which asks for a password: the register is readable by
 * anyone who can see the site, so a name must never be enough to become one.
 *
 * TODO: the auth API decides this, against a credential. A name is not a
 * credential — any five digits still pass verifyCode(), and this grants no
 * more than the one-time password already does.
 */
export function roleForName(name: string): Role {
  const typed = name.trim().toLowerCase();
  if (!typed) return "member";

  const found = FAMILY_REGISTER.find((person) => {
    if (person.role !== "blogger") return false;
    const full = person.fullName.toLowerCase();
    return full === typed || full.split(/\s+/).includes(typed);
  });

  return found ? "blogger" : "member";
}
