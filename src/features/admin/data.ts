import { ROUTES } from "@/constants/routes";
import { FAMILY_REGISTER, type FamilyMember } from "@/features/members/data";

export interface AttentionItem {
  id: string;
  /** What it is, read on its own. */
  label: string;
  /** Why it is waiting. */
  reason: string;
  href: string;
  action: string;
}

/**
 * What is waiting for the administrator, worked out from the register rather
 * than stored anywhere. Nothing here is a notification: each row is a record
 * that is incomplete, and each one links to where it gets completed.
 *
 * It read draft posts and empty albums until 11 Nov 2026. Those belong to
 * the social media manager, and an administrator cannot act on them, so they
 * left the queue with the rest of that work.
 *
 * A record with no email address would belong here too, and none exists: the
 * register gives everybody one and the panel refuses to save a record
 * without it. The check is left out rather than written as a branch that
 * nothing can reach.
 */
export function attentionItems(
  people: FamilyMember[] = FAMILY_REGISTER,
): AttentionItem[] {
  const items: AttentionItem[] = [];

  for (const person of people) {
    if (person.bornOn) continue;
    items.push({
      id: `dob-${person.id}`,
      label: person.fullName,
      reason: "No date of birth, so they are missing from Birthdays",
      href: `${ROUTES.ADMIN_MEMBERS}?find=${person.id}`,
      action: "Fill it in",
    });
  }

  for (const person of people) {
    if (person.status !== "invited") continue;
    items.push({
      id: `invited-${person.id}`,
      label: person.fullName,
      reason: "Invited, but has never signed in",
      href: `${ROUTES.ADMIN_MEMBERS}?find=${person.id}`,
      action: "Review",
    });
  }

  return items;
}

export interface ActivityEntry {
  id: string;
  actor: string;
  /** Past tense, because it already happened. */
  did: string;
  subject: string;
  at: string;
  href?: string;
}

/* TODO: a real trail, written when the register changes. Until then these
   are samples, so the band's shape and empty state can be built and
   reviewed. They are register changes now rather than posts and albums,
   because that is what an administrator does here. */
export const ACTIVITY: ActivityEntry[] = [
  {
    id: "a1",
    actor: "Aganze",
    did: "changed the email address of",
    subject: "Mukamana Esther",
    at: "2026-11-09T14:20:00Z",
    href: ROUTES.ADMIN_MEMBERS,
  },
  {
    id: "a2",
    actor: "Aganze",
    did: "added",
    subject: "two people to Hope",
    at: "2026-11-08T09:05:00Z",
    href: ROUTES.ADMIN_MEMBERS,
  },
  {
    id: "a3",
    actor: "Niyonzima Eric",
    did: "filled in a date of birth for",
    subject: "Habimana Jean",
    at: "2026-11-05T16:40:00Z",
    href: ROUTES.ADMIN_MEMBERS,
  },
  {
    id: "a4",
    actor: "Aganze",
    did: "suspended",
    subject: "an account signing in from two places",
    at: "2026-11-02T11:15:00Z",
    href: ROUTES.ADMIN_MEMBERS,
  },
];
