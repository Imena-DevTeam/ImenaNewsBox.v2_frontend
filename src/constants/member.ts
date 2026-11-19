import type { Role } from "@/lib/session";
import type { UserRead } from "@/types/wire";

/**
 * The person the member frames greet: the header, the footer, the
 * dashboard. It lives here rather than inside a feature because every member
 * frame shows it.
 *
 * With a backend, `personFromAccount` makes it from the signed-in account.
 * In fixture mode (no backend, never in production) it is one of the sample
 * people below, chosen by the session's role.
 */
export interface Person {
  name: string;
  /** What they are called in the frame, not the session's role name. */
  role: string;
  subfamily?: string;
}

/** How each role is named in the frames. */
export const ROLE_TITLES: Record<Role, string> = {
  member: "Family Member",
  social_media_manager: "Social Media Manager",
  admin: "Family Administrator",
};

/** HOPE, LIGHT and WIHOGORA, as the frames write them. */
function subfamilyName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/** The signed-in account, as the frames greet it. */
export function personFromAccount(
  account: Pick<UserRead, "display_name" | "role" | "sub_family">,
): Person {
  return {
    name: account.display_name,
    role: ROLE_TITLES[account.role],
    subfamily: subfamilyName(account.sub_family.name),
  };
}

/* The sample people, for fixture mode and the sample register. */

export const MEMBER: Person = {
  name: "Aganze",
  role: ROLE_TITLES.member,
  subfamily: "Wihogora",
};

/**
 * The family's social media manager.
 *
 * She signs in at the member login like everybody else; in fixture mode the
 * sample register says she holds the role, and that is what opens the
 * studio — see features/auth/roles.ts.
 */
export const SOCIAL_MEDIA_MANAGER: Person = {
  name: "Ngabe",
  role: ROLE_TITLES.social_media_manager,
  subfamily: "Wihogora",
};

/** The administrator, who is the member with one extra door. */
export const ADMINISTRATOR: Person = {
  name: MEMBER.name,
  role: ROLE_TITLES.admin,
  subfamily: MEMBER.subfamily,
};

/**
 * The second administrator.
 *
 * Named rather than left as one of the generated rows, because the password
 * reset needs **two** people who can sign in: one asks for a link and the
 * other sends it. Her surname is outside the register's two pools on
 * purpose, so the seeded name cannot collide with a generated one.
 */
export const SECOND_ADMINISTRATOR: Person = {
  name: "Shema",
  role: ROLE_TITLES.admin,
  subfamily: "Hope",
};

/** Fixture mode: the sample person a session's role stands for. */
export function signedInPerson(role?: Role | null): Person {
  if (role === "social_media_manager") return SOCIAL_MEDIA_MANAGER;
  if (role === "admin") return ADMINISTRATOR;
  return MEMBER;
}
