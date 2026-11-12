import { describe, expect, it } from "vitest";
import { TRINITY } from "@/features/families/data";
import {
  BLOGGER_ID,
  countByBranch,
  FAMILY_REGISTER,
  findByEmail,
  missingBirthday,
  queryMembers,
  SIGNED_IN_ID,
} from "./data";

describe("the family register", () => {
  /* The admin overview showed 73 before the register existed. If this number
     moves, a page's arithmetic moved with it. */
  it("holds the same number of people the branch counts claimed", () => {
    const claimed = TRINITY.reduce(
      (total, family) => total + family.members,
      0,
    );
    expect(FAMILY_REGISTER).toHaveLength(claimed);
    expect(claimed).toBe(73);
  });

  it("counts each branch the way TRINITY did", () => {
    const counts = countByBranch();
    for (const family of TRINITY) {
      expect(counts[family.slug]).toBe(family.members);
    }
  });

  /* Email is how a person signs in, so a duplicate is a broken login, not an
     untidy fixture. */
  it("gives every person their own address", () => {
    const seen = new Set(
      FAMILY_REGISTER.map((person) => person.email.toLowerCase()),
    );
    expect(seen.size).toBe(FAMILY_REGISTER.length);
  });

  it("gives every person their own name and id", () => {
    expect(new Set(FAMILY_REGISTER.map((p) => p.fullName)).size).toBe(73);
    expect(new Set(FAMILY_REGISTER.map((p) => p.id)).size).toBe(73);
  });

  it("puts the signed-in admin in the register, as an admin", () => {
    const me = FAMILY_REGISTER.find((person) => person.id === SIGNED_IN_ID);
    expect(me?.role).toBe("admin");
  });

  it("leaves exactly one admin, so the role control has something to lock", () => {
    const admins = FAMILY_REGISTER.filter((person) => person.role === "admin");
    expect(admins).toHaveLength(1);
  });

  /* The row that opens the studio. The login looks her up here rather than
     carrying a name in the code, so this is the whole of what makes her the
     blogger. */
  it("holds one blogger, and she is Ngabe", () => {
    const bloggers = FAMILY_REGISTER.filter(
      (person) => person.role === "blogger",
    );
    expect(bloggers).toHaveLength(1);
    expect(bloggers[0]!.id).toBe(BLOGGER_ID);
    expect(bloggers[0]!.fullName).toMatch(/^Ngabe/);
  });

  it("leaves some people without a date of birth, and some not active", () => {
    expect(missingBirthday().length).toBeGreaterThan(0);
    expect(
      FAMILY_REGISTER.filter((person) => person.status === "invited").length,
    ).toBeGreaterThan(0);
    expect(
      FAMILY_REGISTER.filter((person) => person.status === "suspended").length,
    ).toBeGreaterThan(0);
  });
});

describe("findByEmail", () => {
  it("finds a person whatever the case", () => {
    const person = FAMILY_REGISTER[4]!;
    expect(findByEmail(person.email.toUpperCase())?.id).toBe(person.id);
  });

  it("finds nobody for an address nobody holds, or for nothing", () => {
    expect(findByEmail("nobody@example.com")).toBeUndefined();
    expect(findByEmail("   ")).toBeUndefined();
  });
});

describe("queryMembers", () => {
  it("searches the email as well as the name", () => {
    const person = FAMILY_REGISTER[9]!;
    const byEmail = queryMembers(FAMILY_REGISTER, { search: person.email });
    expect(byEmail.map((found) => found.id)).toContain(person.id);
  });

  it("narrows to one branch", () => {
    const found = queryMembers(FAMILY_REGISTER, { branch: "hope" });
    expect(found).toHaveLength(countByBranch()["hope"] ?? 0);
    expect(found.every((person) => person.branch === "hope")).toBe(true);
  });

  it("narrows to the people the birthdays page cannot place", () => {
    const found = queryMembers(FAMILY_REGISTER, { missingBornOn: true });
    expect(found).toHaveLength(missingBirthday().length);
    expect(found.every((person) => person.bornOn === "")).toBe(true);
  });

  it("orders by name, newest and oldest", () => {
    const names = queryMembers(FAMILY_REGISTER, { sort: "name" }).map(
      (person) => person.fullName,
    );
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));

    const newest = queryMembers(FAMILY_REGISTER, { sort: "newest" });
    const oldest = queryMembers(FAMILY_REGISTER, { sort: "oldest" });
    expect(newest[0]!.joinedOn >= newest.at(-1)!.joinedOn).toBe(true);
    expect(oldest[0]!.joinedOn <= oldest.at(-1)!.joinedOn).toBe(true);
  });

  it("returns everyone when nothing is asked of it", () => {
    expect(queryMembers(FAMILY_REGISTER)).toHaveLength(73);
  });
});
