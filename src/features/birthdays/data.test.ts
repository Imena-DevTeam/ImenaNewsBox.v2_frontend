import { describe, expect, it } from "vitest";
import {
  celebrantsFrom,
  daysUntil,
  todayAndNext,
  type BirthdayPerson,
} from "./data";

const someone = (
  id: string,
  bornOn: string,
  status = "active",
): BirthdayPerson => ({
  id,
  fullName: `Person ${id}`,
  branch: "hope",
  bornOn,
  photo: "",
  status,
});

const people = [
  someone("a", "1990-03-28"),
  someone("b", "1985-03-30"),
  someone("c", "2001-12-02"),
  someone("d", ""),
  someone("e", "1970-03-28", "suspended"),
];
const celebrants = celebrantsFrom(people, (slug) => `Branch ${slug}`);

describe("birthdays from the register", () => {
  it("leaves out people with no date and people who are suspended", () => {
    expect(celebrants.map((c) => c.id)).toEqual(["a", "b", "c"]);
    expect(celebrants[0]).toMatchObject({
      month: 2,
      day: 28,
      branch: "Branch hope",
    });
  });

  it("counts days to the next birthday, wrapping into next year", () => {
    const now = new Date(Date.UTC(2026, 11, 20));
    expect(daysUntil(celebrants[2]!, now)).toBe(347);
    expect(daysUntil(celebrants[0]!, new Date(Date.UTC(2026, 2, 28)))).toBe(0);
  });

  it("finds today's celebrants and the next ones", () => {
    const { today, upcoming } = todayAndNext(
      celebrants,
      new Date(Date.UTC(2026, 2, 28)),
      2,
    );
    expect(today.map((c) => c.id)).toEqual(["a"]);
    expect(upcoming.map((c) => c.id)).toEqual(["b", "c"]);
  });
});
