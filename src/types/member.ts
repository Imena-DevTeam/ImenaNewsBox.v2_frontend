import type { Role } from "@/lib/session";

/**
 * A person in the family register, as the API sends them.
 *
 * This is the canonical shape: `features/members/data.ts` re-exports it so
 * the fixture and the wire cannot drift apart, and so the day the register
 * comes from the backend the only thing that changes is where the array is
 * filled from.
 */
export type MemberStatus = "active" | "invited" | "suspended";

export interface FamilyMember {
  /** Stable across an email change, which is the whole point of having it. */
  id: string;
  fullName: string;
  email: string;
  /** A branch slug: wihogora | light | hope. */
  branch: string;
  /** ISO date, or empty — the Birthdays page cannot place them without it. */
  bornOn: string;
  role: Role;
  status: MemberStatus;
  /** ISO date. The list's default order is newest first. */
  joinedOn: string;
}

/** What `POST /members` is given. The server assigns id and joinedOn. */
export type NewMember = Omit<FamilyMember, "id" | "joinedOn">;

/** What `PATCH /members/:id` is given: anything but the id. */
export type MemberPatch = Partial<Omit<FamilyMember, "id">>;
