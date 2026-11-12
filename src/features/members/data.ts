import { BLOGGER, MEMBER } from "@/constants/member";
import { TRINITY } from "@/features/families/data";

/**
 * The family register: one record per person, and the only list of people in
 * the project.
 *
 * Before this existed the "73 members" on the admin overview was
 * TRINITY.reduce over three branch *counts* — three numbers, not three
 * rosters, so there was nobody to edit. The counts here reproduce those
 * three numbers exactly (18 Wihogora, 24 Light, 31 Hope) so no page's
 * arithmetic changes on the day the register arrives.
 *
 * Every record is invented. There is no members API, so the admin's CRUD
 * runs over a copy of this array in component state and says so.
 */

/* The record's shape is defined once, in @/types/member, because the API
   sends it and this fixture stands in for the API. Re-exported here so the
   seventy or so places that already import FamilyMember from this module
   keep working, and so the fixture and the wire cannot drift apart. */
import type { FamilyMember, MemberStatus } from "@/types/member";

export type { FamilyMember, MemberStatus };

/* Two pools composed by index rather than 73 hand-written names. The strides
   are coprime with the pool lengths and the pair repeats only after 120
   records, so all 73 names — and so all 73 emails — are distinct. */
const SURNAMES = [
  "Uwimana",
  "Niyonzima",
  "Mukamana",
  "Habimana",
  "Nshimiyimana",
  "Mukasine",
  "Rwigema",
  "Byiringiro",
  "Nyirahabimana",
  "Gatete",
  "Mugisha",
  "Umutoni",
  "Kalisa",
  "Ndayisaba",
  "Irankunda",
  "Bizimana",
  "Munyaneza",
  "Ingabire",
  "Twagirayezu",
  "Karangwa",
];

const GIVEN = [
  "Claire",
  "Eric",
  "Esther",
  "Jean",
  "Alice",
  "Patrick",
  "Yvonne",
  "Emmanuel",
  "Diane",
  "Fidele",
  "Josiane",
  "Thierry",
  "Olive",
  "Gaspard",
  "Sandrine",
  "Innocent",
  "Chantal",
  "Olivier",
  "Agnes",
  "Pascal",
  "Vestine",
  "Celestin",
  "Immaculee",
  "Bosco",
];

/** The one record the signed-in admin is editing the register from. */
export const SIGNED_IN_ID = "m-01";

/** The family's blogger. Her role here is what opens the studio: the login
    looks her up rather than carrying a name in the code. */
export const BLOGGER_ID = "m-02";

function record(index: number, branch: string): FamilyMember {
  const surname = SURNAMES[(index * 7) % SURNAMES.length]!;
  const given = GIVEN[(index * 5) % GIVEN.length]!;
  const fullName = `${surname} ${given}`;

  return {
    id: `m-${String(index + 1).padStart(2, "0")}`,
    fullName,
    email: `${given}.${surname}@imenafamily.rw`.toLowerCase(),
    branch,
    /* Every nineteenth person has no date of birth, which is the one gap the
       rest of the site visibly suffers from: they are missing from the
       Birthdays page until somebody fills it in. */
    bornOn:
      index % 19 === 0
        ? ""
        : `${1948 + ((index * 13) % 60)}-${String(((index * 7) % 12) + 1).padStart(2, "0")}-${String(((index * 17) % 28) + 1).padStart(2, "0")}`,
    role: "member",
    status:
      index % 23 === 5 ? "invited" : index % 37 === 11 ? "suspended" : "active",
    joinedOn: `${2026 - Math.floor(index / 32)}-${String(((index * 5) % 12) + 1).padStart(2, "0")}-${String(((index * 11) % 28) + 1).padStart(2, "0")}`,
  };
}

function register(): FamilyMember[] {
  const people: FamilyMember[] = [];

  for (const family of TRINITY) {
    for (let n = 0; n < family.members; n++) {
      people.push(record(people.length, family.slug));
    }
  }

  /* The blogger. She signs in at the member login like everybody else, and
     this row is the whole of what makes her one — see auth/roles.ts. */
  const ngabe = people[1]!;
  ngabe.fullName = `${BLOGGER.name} Uwase`;
  ngabe.email = `${BLOGGER.name}@imenafamily.rw`.toLowerCase();
  ngabe.role = "blogger";
  ngabe.status = "active";
  ngabe.bornOn = "1996-09-02";

  /* The person doing the editing. Their own record is the one the role
     control locks, so it has to be in the list rather than implied. */
  const me = people[0]!;
  me.fullName = `${MEMBER.name} Rubagumya`;
  me.email = `${MEMBER.name}@imenafamily.rw`.toLowerCase();
  me.role = "admin";
  me.status = "active";
  me.bornOn = "1979-04-16";

  return people;
}

export const FAMILY_REGISTER: FamilyMember[] = register();

/** How many people each branch holds, read from the register rather than
    from TRINITY[].members — two counts in two places disagree the moment
    one person is edited. */
export function countByBranch(
  people: FamilyMember[] = FAMILY_REGISTER,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const family of TRINITY) counts[family.slug] = 0;
  for (const person of people) {
    counts[person.branch] = (counts[person.branch] ?? 0) + 1;
  }
  return counts;
}

/** The record holding an address, case-insensitively, or undefined. Email is
    how a person signs in, so two people cannot share one. */
export function findByEmail(
  email: string,
  people: FamilyMember[] = FAMILY_REGISTER,
): FamilyMember | undefined {
  const needle = email.trim().toLowerCase();
  if (!needle) return undefined;
  return people.find((person) => person.email.toLowerCase() === needle);
}

/** Everyone the Birthdays page cannot place. */
export function missingBirthday(
  people: FamilyMember[] = FAMILY_REGISTER,
): FamilyMember[] {
  return people.filter((person) => !person.bornOn);
}

export type MemberSort = "name" | "newest" | "oldest";

export interface MemberQuery {
  /** Matches the name or the email: whoever is looking has one, not both. */
  search?: string;
  branch?: string;
  status?: MemberStatus | "all";
  /** The one data gap worth filtering for on its own. */
  missingBornOn?: boolean;
  sort?: MemberSort;
}

/** The list the table shows: filtered, then ordered. */
export function queryMembers(
  people: FamilyMember[],
  query: MemberQuery = {},
): FamilyMember[] {
  const needle = query.search?.trim().toLowerCase() ?? "";

  const kept = people.filter((person) => {
    if (
      query.branch &&
      query.branch !== "all" &&
      person.branch !== query.branch
    )
      return false;
    if (
      query.status &&
      query.status !== "all" &&
      person.status !== query.status
    )
      return false;
    if (query.missingBornOn && person.bornOn) return false;
    if (!needle) return true;
    return (
      person.fullName.toLowerCase().includes(needle) ||
      person.email.toLowerCase().includes(needle)
    );
  });

  return [...kept].sort((a, b) => {
    if (query.sort === "oldest") return a.joinedOn.localeCompare(b.joinedOn);
    if (query.sort === "name") return a.fullName.localeCompare(b.fullName);
    return b.joinedOn.localeCompare(a.joinedOn);
  });
}

/** The branch's reading name, for a slug stored on a record. */
export function branchName(slug: string): string {
  return TRINITY.find((family) => family.slug === slug)?.name ?? slug;
}
