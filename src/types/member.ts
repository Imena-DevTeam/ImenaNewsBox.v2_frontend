import type { Role } from "@/lib/session";

/**
 * A person in the family register, as an administrator sees them.
 *
 * The backend sends `UserRead`; `features/members/wire.ts` turns it into
 * this, and the sample register in `features/members/data.ts` is built in
 * the same shape, so the table never knows which one it is reading.
 *
 * - **invited**: has not used their invitation yet (a member who has never
 *   confirmed their address, an administrator with no password).
 * - **deactivated**: kept in the register, signed out everywhere, and unable
 *   to log in until an administrator reactivates them. There is no delete.
 */
export type MemberStatus = "active" | "invited" | "deactivated";

/** One entry of a fixed lookup list: a sub-family or a promotion. */
export interface Choice {
  id: number;
  name: string;
}

export interface FamilyMember {
  /** Stable across an email change, which is the whole point of having it. */
  id: string;
  /** The display name: what the family calls them. */
  fullName: string;
  /** What they log in with. Unique, ignoring case, deactivated people
      included. */
  familyName: string;
  email: string;
  /** A branch slug: wihogora | light | hope. */
  branch: string;
  promotion: Choice | null;
  /** ISO date, or empty — the Birthdays page cannot place them without it. */
  bornOn: string;
  role: Role;
  status: MemberStatus;
  /** ISO date. The list's default order is newest first. */
  joinedOn: string;
  /** A portrait's address, or empty: most of the register has none yet, and
   *  the site shows initials rather than borrow somebody else's face. */
  photo: string;
}

/** The lookup lists the register's selects offer. Sub-families carry the
    branch slug the rest of the site uses for them. */
export interface RegisterChoices {
  subFamilies: (Choice & { slug: string })[];
  promotions: Choice[];
}

/**
 * One relative as every member sees them (`UserPublicRead`): no email, no
 * role, no account status, and a birthday without its year.
 */
export interface PublicPerson {
  id: string;
  fullName: string;
  familyName: string;
  branch: string;
  promotion: Choice | null;
  /** Month 1–12 and day, or null. */
  birthday: { month: number; day: number } | null;
  photo: string;
  bio: string;
}

/** One line of the family directory: enough to find somebody and link to
    their page. */
export interface DirectoryEntry {
  id: string;
  name: string;
  branch: string;
}
