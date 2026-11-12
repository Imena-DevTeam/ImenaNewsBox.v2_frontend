import { describe, expect, it } from "vitest";
import { FAMILY_REGISTER } from "@/features/members/data";
import { roleForName } from "./roles";

describe("roleForName", () => {
  /* One login for the whole family: the name decides what you land with. */
  it("signs the blogger in as the blogger", () => {
    expect(roleForName("Ngabe")).toBe("blogger");
  });

  it("does not care about case or stray spaces", () => {
    expect(roleForName("  nGaBe ")).toBe("blogger");
  });

  it("takes her whole name too", () => {
    const blogger = FAMILY_REGISTER.find((one) => one.role === "blogger")!;
    expect(roleForName(blogger.fullName)).toBe("blogger");
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
