import { describe, expect, it } from "vitest";
import { entryDay } from "./archive";

describe("entryDay", () => {
  it("splits the date into the two lines the card sets", () => {
    expect(entryDay("2026-05-31")).toEqual({ day: "31", month: "May" });
  });

  /* Read in a timezone behind UTC, a naive Date would show the 30th. */
  it("does not shift a day across timezones", () => {
    expect(entryDay("2024-07-01").day).toBe("1");
  });

  it("reads a December date as December", () => {
    expect(entryDay("2024-12-10")).toEqual({ day: "10", month: "Dec" });
  });
});
