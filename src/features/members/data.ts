import {
  SOCIAL_MEDIA_MANAGER,
  MEMBER,
  SECOND_ADMINISTRATOR,
} from "@/constants/member";
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
 * Every record is invented. It is what the register shows in fixture mode
 * (no `API_URL`, see lib/auth-mode.ts); with a backend the register is
 * `GET /users/accounts`, turned into the same shape by ./wire.ts.
 */

/* The record's shape is defined once, in @/types/member, because the API
   sends it and this fixture stands in for the API. Re-exported here so the
   seventy or so places that already import FamilyMember from this module
   keep working, and so the fixture and the wire cannot drift apart. */
import type {
  Choice,
  DirectoryEntry,
  FamilyMember,
  MemberStatus,
  RegisterChoices,
} from "@/types/member";

export type { FamilyMember, MemberStatus };

/** The backend's promotions, oldest first, as its migration seeds them. */
export const SAMPLE_PROMOTIONS: Choice[] = [
  { id: 1, name: "IBIMANUKA" },
  { id: 2, name: "NKONGI" },
  { id: 3, name: "SHEJA_NGABO" },
  { id: 4, name: "IBIHAME" },
];

/** The lookup lists fixture mode offers: the three branches and the four
    promotions, with ids the way the backend would number them. */
export const SAMPLE_CHOICES: RegisterChoices = {
  subFamilies: TRINITY.map((family, index) => ({
    id: index + 1,
    name: family.name.toUpperCase(),
    slug: family.slug,
  })),
  promotions: SAMPLE_PROMOTIONS,
};

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
export const SOCIAL_MEDIA_MANAGER_ID = "m-02";

/**
 * The second administrator.
 *
 * Seeded by name rather than left as whichever row index 2 happened to be,
 * because the password reset needs **two** people a reviewer can sign in as:
 * one asks for a link and the other sends it. See MIN_ADMINS.
 */
export const SECOND_ADMIN_ID = "m-03";

function record(index: number, branch: string): FamilyMember {
  const surname = SURNAMES[(index * 7) % SURNAMES.length]!;
  const given = GIVEN[(index * 5) % GIVEN.length]!;
  const fullName = `${surname} ${given}`;

  return {
    id: `m-${String(index + 1).padStart(2, "0")}`,
    fullName,
    /* Unique like the backend's, because it is what they log in with. */
    familyName: fullName,
    email: `${given}.${surname}@imenafamily.rw`.toLowerCase(),
    branch,
    /* Every nineteenth person has no date of birth, which is the one gap the
       rest of the site visibly suffers from: they are missing from the
       Birthdays page until somebody fills it in. */
    bornOn:
      index % 19 === 0
        ? ""
        : `${1948 + ((index * 13) % 60)}-${String(((index * 7) % 12) + 1).padStart(2, "0")}-${String(((index * 17) % 28) + 1).padStart(2, "0")}`,
    /* One in five has none yet, like the people imported from v1. */
    promotion: index % 5 === 0 ? null : SAMPLE_PROMOTIONS[index % 4]!,
    role: "member",
    status:
      index % 23 === 5
        ? "invited"
        : index % 37 === 11
          ? "deactivated"
          : "active",
    photo: "",
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
  ngabe.fullName = `${SOCIAL_MEDIA_MANAGER.name} Uwase`;
  ngabe.familyName = SOCIAL_MEDIA_MANAGER.name;
  ngabe.email = `${SOCIAL_MEDIA_MANAGER.name}@imenafamily.rw`.toLowerCase();
  ngabe.role = "social_media_manager";
  ngabe.status = "active";
  ngabe.bornOn = "1996-09-02";
  ngabe.photo = "/images/elder-1.webp";

  /* The person doing the editing. Their own record is the one the role
     control locks, so it has to be in the list rather than implied. */
  const me = people[0]!;
  me.fullName = `${MEMBER.name} Rubagumya`;
  me.familyName = MEMBER.name;
  me.email = `${MEMBER.name}@imenafamily.rw`.toLowerCase();
  me.role = "admin";
  me.status = "active";
  me.bornOn = "1979-04-16";
  me.photo = "/images/elder-3.webp";

  /* The second administrator, and the reason the password reset can work at
     all: a locked-out administrator needs somebody else who can send them
     the link. One administrator means one forgotten password locks the
     register for good — see MIN_ADMINS and CLAUDE.md §21. */
  const second = people.find((person) => person.id === SECOND_ADMIN_ID)!;
  second.fullName = `${SECOND_ADMINISTRATOR.name} Nkusi`;
  second.familyName = SECOND_ADMINISTRATOR.name;
  second.email = `${SECOND_ADMINISTRATOR.name}@imenafamily.rw`.toLowerCase();
  second.role = "admin";
  second.status = "active";
  second.bornOn = "1983-07-11";
  second.photo = "/images/elder-2.webp";

  return people;
}

export const FAMILY_REGISTER: FamilyMember[] = register();

/** The sample register as members see it in the search palette: everybody
    who has not been deactivated. */
export function sampleDirectory(
  people: FamilyMember[] = FAMILY_REGISTER,
): DirectoryEntry[] {
  return people
    .filter((one) => one.status !== "deactivated")
    .map((one) => ({ id: one.id, name: one.fullName, branch: one.branch }));
}

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

/**
 * How few administrators the register may hold.
 *
 * Two, because the password reset puts a person in the loop rather than an
 * email provider: a locked-out administrator is helped by another one. With
 * one administrator a forgotten password is permanent and nobody can reach
 * /admin again.
 *
 * > [!IMPORTANT]
 * > The UI disables the controls that would break this and says why, which
 * > is a courtesy rather than a rule. **The backend has to refuse it too** —
 * > a disabled `<select>` stops a mis-click, not a request.
 */
export const MIN_ADMINS = 2;

/** Everyone who holds the administrator role and can actually use it. */
export function administrators(
  people: FamilyMember[] = FAMILY_REGISTER,
): FamilyMember[] {
  return people.filter(
    (person) => person.role === "admin" && person.status !== "deactivated",
  );
}

/**
 * Whether this person's administrator role may be taken away — by demoting
 * them or deactivating them. Both have the same answer, so they ask the same
 * question. Invited administrators count, as they do in the backend: only a
 * deactivated one does not.
 */
export function mayLoseAdmin(
  person: FamilyMember,
  people: FamilyMember[] = FAMILY_REGISTER,
): boolean {
  if (person.role !== "admin" || person.status === "deactivated") return true;
  return administrators(people).length > MIN_ADMINS;
}

/** The record holding an address, case-insensitively, or undefined. Login
    codes go to it, so two people cannot share one. */
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
  /** Matches either name or the email: whoever is looking has one of them. */
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
      person.familyName.toLowerCase().includes(needle) ||
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
