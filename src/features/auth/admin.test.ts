import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FAMILY_REGISTER, SIGNED_IN_ID } from "@/features/members/data";
import { checkAdminCredential } from "./admin";

const admin = FAMILY_REGISTER.find((one) => one.id === SIGNED_IN_ID)!;
const notAdmin = FAMILY_REGISTER.find((one) => one.role === "member")!;
const blogger = FAMILY_REGISTER.find((one) => one.role === "blogger")!;

const PASSWORD = "a-test-password";

beforeEach(() => {
  process.env.ADMIN_PASSWORD = PASSWORD;
});

afterEach(() => {
  delete process.env.ADMIN_PASSWORD;
});

/**
 * The administrators' door.
 *
 * `AdminLoginForm` validated the shape of these two fields and then threw
 * them away — `handleSubmit(() => ...)` ignored its values entirely — and
 * pushed a URL that granted an admin session. Nothing ever read the
 * password. These tests hold the door shut.
 *
 * It takes a **name** again, as the design asks. The name alone proves
 * nothing — `/login` takes one with no password at all — so what these
 * tests check is that it takes both halves, and that neither half on its own
 * opens anything.
 */
describe("checkAdminCredential", () => {
  it("lets an administrator in with the password", () => {
    expect(checkAdminCredential(admin.fullName, PASSWORD)).toEqual({
      ok: true,
    });
  });

  it("does not care about the case of the name", () => {
    expect(
      checkAdminCredential(admin.fullName.toUpperCase(), PASSWORD).ok,
    ).toBe(true);
  });

  /* The same rule the member door uses: either part of the name will do,
     because nobody types both when one is what they are called. */
  it("takes either part of the name", () => {
    const part = admin.fullName.split(/\s+/)[0]!;
    expect(checkAdminCredential(part, PASSWORD).ok).toBe(true);
  });

  it("refuses the right name with the wrong password", () => {
    expect(checkAdminCredential(admin.fullName, "not-it")).toEqual({
      ok: false,
      reason: "rejected",
    });
  });

  it("refuses an empty password", () => {
    expect(checkAdminCredential(admin.fullName, "").ok).toBe(false);
  });

  it("refuses an empty name", () => {
    expect(checkAdminCredential("", PASSWORD).ok).toBe(false);
  });

  /* Knowing the password is not enough: the name has to be an
     administrator's. Seventy-three people are in the register and one of
     them is. */
  it("refuses a member who has somehow learned the password", () => {
    expect(checkAdminCredential(notAdmin.fullName, PASSWORD)).toEqual({
      ok: false,
      reason: "rejected",
    });
  });

  /* The blogger publishes; she does not keep the register. */
  it("refuses the blogger", () => {
    expect(checkAdminCredential(blogger.fullName, PASSWORD).ok).toBe(false);
  });

  it("refuses a name nobody in the register has", () => {
    expect(checkAdminCredential("Nobody Atall", PASSWORD).ok).toBe(false);
  });

  /* A missing password is a missing secret, and a missing secret fails
     closed rather than open. */
  it("lets nobody in at all when no password is configured", () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    vi.stubEnv("NODE_ENV", "production");

    expect(checkAdminCredential(admin.fullName, PASSWORD)).toEqual({
      ok: false,
      reason: "unavailable",
    });

    vi.unstubAllEnvs();
  });
});
