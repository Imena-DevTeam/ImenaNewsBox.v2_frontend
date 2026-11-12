import { describe, expect, it } from "vitest";
import { adminLoginSchema, userLoginSchema, verifySchema } from "./schemas";

describe("userLoginSchema", () => {
  it("rejects a blank family name", () => {
    const result = userLoginSchema.safeParse({ name: "   " });
    expect(result.success).toBe(false);
  });

  it("trims and accepts a family name", () => {
    const result = userLoginSchema.safeParse({ name: "  Imena  " });
    expect(result.success && result.data.name).toBe("Imena");
  });
});

describe("adminLoginSchema", () => {
  it("rejects a password under 8 characters", () => {
    const result = adminLoginSchema.safeParse({
      name: "Aganze",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a blank name", () => {
    const result = adminLoginSchema.safeParse({
      name: "   ",
      password: "correct-horse",
    });
    expect(result.success).toBe(false);
  });

  /* The design asks for a name on both doors. The shape is all this schema
     checks — whether the name belongs to an administrator is
     checkAdminCredential's job, on the server. */
  it("accepts a full credential pair", () => {
    const result = adminLoginSchema.safeParse({
      name: "Aganze",
      password: "correct-horse",
    });
    expect(result.success).toBe(true);
  });
});

describe("verifySchema", () => {
  it.each(["1234", "123456", "12a45", ""])("rejects %o", (code) => {
    expect(verifySchema.safeParse({ code }).success).toBe(false);
  });

  it("accepts five digits", () => {
    expect(verifySchema.safeParse({ code: "12345" }).success).toBe(true);
  });
});
