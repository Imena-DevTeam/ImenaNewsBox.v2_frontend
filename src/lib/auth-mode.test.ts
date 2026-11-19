import { afterEach, describe, expect, it, vi } from "vitest";
import { authMode } from "./auth-mode";

/**
 * The fixture mode is a door that opens for any five digits. These hold
 * that each of the two conditions closes it on its own: a configured
 * backend, and a production build.
 */
describe("authMode", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the backend whenever API_URL is set", () => {
    vi.stubEnv("API_URL", "http://127.0.0.1:8000/api/v1");
    vi.stubEnv("NODE_ENV", "development");
    expect(authMode()).toBe("backend");

    vi.stubEnv("NODE_ENV", "production");
    expect(authMode()).toBe("backend");
  });

  it("stands in with the fixtures only in development, with no backend", () => {
    vi.stubEnv("API_URL", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(authMode()).toBe("fixture");

    vi.stubEnv("NODE_ENV", "test");
    expect(authMode()).toBe("fixture");
  });

  /* A production build that forgot API_URL must not fall back to a door
     that takes any five digits. */
  it("signs nobody in on a production build with no backend", () => {
    vi.stubEnv("API_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(authMode()).toBe("off");
  });
});
