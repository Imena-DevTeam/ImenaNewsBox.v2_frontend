import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FAMILY_REGISTER,
  SECOND_ADMIN_ID,
  SIGNED_IN_ID,
} from "@/features/members/data";
import { checkAdminCredential } from "./admin";

const admin = FAMILY_REGISTER.find((one) => one.id === SIGNED_IN_ID)!;
const second = FAMILY_REGISTER.find((one) => one.id === SECOND_ADMIN_ID)!;
const notAdmin = FAMILY_REGISTER.find((one) => one.role === "member")!;
const manager = FAMILY_REGISTER.find(
  (one) => one.role === "social_media_manager",
)!;

const AGANZE = "aganze-dev-admin";
const SHEMA = "shema-dev-admin";

beforeEach(() => {
  vi.stubEnv("API_URL", "");
  vi.stubEnv("NODE_ENV", "development");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

/**
 * The administrators' door in fixture mode: no backend, never production.
 *
 * It takes a **name** and a password. The name alone proves nothing —
 * `/login` takes one with no password at all — so these hold that it needs
 * both halves, that neither half on its own opens anything, and that the
 * development passwords open nothing anywhere a backend answers instead.
 */
describe("checkAdminCredential", () => {
  it("lets each seeded administrator in with their own password", () => {
    expect(checkAdminCredential(admin.fullName, AGANZE)).toEqual({ ok: true });
    expect(checkAdminCredential(second.fullName, SHEMA).ok).toBe(true);
  });

  it("does not care about the case of the name, and takes either part", () => {
    expect(checkAdminCredential(admin.fullName.toUpperCase(), AGANZE).ok).toBe(
      true,
    );
    const part = admin.fullName.split(/\s+/)[0]!;
    expect(checkAdminCredential(part, AGANZE).ok).toBe(true);
  });

  /* The point of a password each: knowing one does not open the other's
     door, so a reset is somebody else's to help with. */
  it("does not let one administrator in with the other's password", () => {
    expect(checkAdminCredential(admin.fullName, SHEMA)).toEqual({
      ok: false,
      reason: "rejected",
    });
    expect(checkAdminCredential(second.fullName, AGANZE).ok).toBe(false);
  });

  it("refuses an empty password, and an empty name", () => {
    expect(checkAdminCredential(admin.fullName, "").ok).toBe(false);
    expect(checkAdminCredential("", AGANZE).ok).toBe(false);
  });

  it("refuses a member who has learned a password", () => {
    expect(checkAdminCredential(notAdmin.fullName, AGANZE).ok).toBe(false);
    expect(checkAdminCredential(notAdmin.fullName, SHEMA).ok).toBe(false);
  });

  /* The social media manager publishes; she does not keep the register. */
  it("refuses the social media manager", () => {
    expect(checkAdminCredential(manager.fullName, AGANZE).ok).toBe(false);
  });

  it("refuses a name nobody in the register has", () => {
    expect(checkAdminCredential("Nobody Atall", AGANZE).ok).toBe(false);
  });

  /* `ADMIN_PASSWORD` was one secret every administrator shared. It is gone:
     setting it opens nothing. */
  it("ignores ADMIN_PASSWORD", () => {
    vi.stubEnv("ADMIN_PASSWORD", "shared-secret");
    expect(checkAdminCredential(admin.fullName, "shared-secret").ok).toBe(
      false,
    );
  });

  /* The development passwords must never open a door anywhere real. */
  it("opens nothing in a production build", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(checkAdminCredential(admin.fullName, AGANZE)).toEqual({
      ok: false,
      reason: "unavailable",
    });
  });

  it("opens nothing when a backend is configured", () => {
    vi.stubEnv("API_URL", "http://127.0.0.1:8000/api/v1");
    expect(checkAdminCredential(admin.fullName, AGANZE)).toEqual({
      ok: false,
      reason: "unavailable",
    });
  });
});
