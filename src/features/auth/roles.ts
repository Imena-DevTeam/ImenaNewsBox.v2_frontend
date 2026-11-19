import { FAMILY_REGISTER } from "@/features/members/data";
import type { Role } from "@/lib/session";

/**
 * What the name typed at the member login gets you — **in fixture mode
 * only** (lib/auth-mode.ts). With a backend, the backend says what the
 * signed-in account is, and this file is not asked.
 *
 * There is one login for the whole family. Somebody who types "Ngabe" is
 * the family's social media manager and lands with the studio in her rail;
 * everybody else lands as a member. The answer comes out of the
 * **register**, not a name written into the code.
 *
 * A match is on the whole name or on either part of it, case-insensitively,
 * because nobody signing in types "Ngabe Uwase" when "Ngabe" is what they
 * are called. `matchesName` is that rule, shared with the administrators'
 * door so the two never disagree about what a typed name means.
 *
 * Only `social_media_manager` is granted this way. An administrator still
 * comes through `/admin/login`, which asks for a password: the register is
 * readable by anyone who can see the site, so a name must never be enough
 * to become one.
 *
 * A name is not a credential: in fixture mode any five digits pass, and
 * this grants no more than that already does.
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
      person.role === "social_media_manager" &&
      matchesName(person.fullName, typed),
  );

  return found ? "social_media_manager" : "member";
}
