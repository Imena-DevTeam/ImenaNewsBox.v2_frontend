import { describe, expect, it } from "vitest";
import { FAMILY_REGISTER } from "@/features/members/data";
import { roleForName } from "./roles";

describe("roleForName", () => {
  /* One login for the whole family: the name decides what you land with. */
  it("signs the social media manager in as one", () => {
    expect(roleForName("Ngabe")).toBe("social_media_manager");
  });

  it("does not care about case or stray spaces", () => {
    expect(roleForName("  nGaBe ")).toBe("social_media_manager");
  });

  it("takes her whole name too", () => {
    const manager = FAMILY_REGISTER.find(
      (one) => one.role === "social_media_manager",
    )!;
    expect(roleForName(manager.fullName)).toBe("social_media_manager");
  });

  it("signs everybody else in as a member", () => {
    expect(roleForName("Imena")).toBe("member");
    expect(roleForName("")).toBe("member");
  });

  /* The register is readable by anyone who can see the site, so a name must
     never be enough to become an administrator. That door asks for a
     password. */
  it("will not hand out the admin role for a name", () => {
    const admin = FAMILY_REGISTER.find((one) => one.role === "admin")!;
    expect(roleForName(admin.fullName)).toBe("member");
    expect(roleForName("Aganze")).toBe("member");
  });
});
