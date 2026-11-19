import { describe, expect, it, vi } from "vitest";
import { ACCESS_COOKIE, SESSION_COOKIE } from "@/lib/session";

const jar = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      jar.has(name) ? { name, value: jar.get(name)! } : undefined,
  }),
  headers: async () => new Headers({ "user-agent": "Firefox 140" }),
}));

const { apiAuth } = await import("./api-auth");

describe("apiAuth", () => {
  /* Sending the frontend's own session cookie as the backend's token is
     what sent everybody back to the login straight after a correct code. */
  it("sends the backend's access token, never the frontend's session", async () => {
    jar.set(SESSION_COOKIE, "v3.frontend-signed.sig");
    jar.set(ACCESS_COOKIE, "backend.jwt.token");

    expect(await apiAuth()).toEqual({
      token: "backend.jwt.token",
      userAgent: "Firefox 140",
    });
  });

  it("sends no token when there is no access token", async () => {
    jar.clear();
    jar.set(SESSION_COOKIE, "v3.frontend-signed.sig");

    expect((await apiAuth()).token).toBeUndefined();
  });
});
