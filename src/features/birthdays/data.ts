/**
 * Birthdays, built from the family register.
 *
 * This feature does not import the register itself (a feature never imports
 * another); the route hands it people and it works out who celebrates when.
 * Only the day and the month are used: a relative's age is theirs to share.
 */

export interface Celebrant {
  /** The register id, so a name can open the person's own page. */
  id: string;
  name: string;
  /** The branch's display name: Wihogora, Light, Hope. */
  branch: string;
  /** 0 for January. */
  month: number;
  day: number;
  /** A portrait's address, or empty. */
  photo: string;
}

export interface BirthdayPerson {
  id: string;
  fullName: string;
  branch: string;
  bornOn: string;
  photo: string;
  status: string;
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function shortMonth(month: number): string {
  return MONTH_NAMES[month]!.slice(0, 3);
}

/**
 * Everybody the birthdays page can place: people with a date of birth who
 * have not been suspended, in calendar order.
 */
export function celebrantsFrom(
  people: BirthdayPerson[],
  branchName: (slug: string) => string,
): Celebrant[] {
  return people
    .filter((person) => person.bornOn && person.status !== "suspended")
    .map((person) => {
      const [, month, day] = person.bornOn.split("-").map(Number);
      return {
        id: person.id,
        name: person.fullName,
        branch: branchName(person.branch),
        month: (month ?? 1) - 1,
        day: day ?? 1,
        photo: person.photo,
      };
    })
    .sort((a, b) => a.month - b.month || a.day - b.day);
}

/** Days from `now` until this birthday next comes round; 0 is today. */
export function daysUntil(celebrant: Celebrant, now: Date): number {
  const year = now.getUTCFullYear();
  const today = Date.UTC(year, now.getUTCMonth(), now.getUTCDate());
  let next = Date.UTC(year, celebrant.month, celebrant.day);
  if (next < today) next = Date.UTC(year + 1, celebrant.month, celebrant.day);
  return Math.round((next - today) / 86_400_000);
}

/** Who celebrates today, and the next few after them. */
export function todayAndNext(
  celebrants: Celebrant[],
  now: Date,
  count = 3,
): { today: Celebrant[]; upcoming: Celebrant[] } {
  const ranked = [...celebrants].sort(
    (a, b) => daysUntil(a, now) - daysUntil(b, now),
  );
  return {
    today: ranked.filter((c) => daysUntil(c, now) === 0),
    upcoming: ranked.filter((c) => daysUntil(c, now) > 0).slice(0, count),
  };
}
