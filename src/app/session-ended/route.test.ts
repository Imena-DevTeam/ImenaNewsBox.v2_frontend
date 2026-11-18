// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  SESSION_COOKIE,
  createSessionToken,
} from "@/lib/session";

const refreshSession = vi.fn();
vi.mock("@/lib/refresh", async (original) => ({
  ...(await original<Record<string, unknown>>()),
  refreshSession: (...args: unknown[]) => refreshSession(...args),
}));

const { GET } = await import("./route");

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.stubEnv("API_URL", "http://api.test/api/v1");
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  refreshSession.mockReset();
});

async function visit(cookies: Record<string, string>) {
  const request = new NextRequest("http://localhost:3000/session-ended");
  for (const [name, value] of Object.entries(cookies)) {
    request.cookies.set(name, value);
  }
  return GET(request);
}

const location = (response: Response) => response.headers.get("location");
const cleared = (response: Response) =>
  response.headers
    .getSetCookie()
    .filter((cookie) => /Max-Age=0/i.test(cookie))
    .map((cookie) => cookie.split("=")[0]);

const signedIn = async () => ({
  [SESSION_COOKIE]: (await createSessionToken({
    role: "member",
    userId: "u-1",
  }))!,
  [ACCESS_COOKIE]: "a1",
  [REFRESH_COOKIE]: "r1",
});

/**
 * Clearing a device's cookies is something any other site could link
 * somebody to, so the route only does it when the backend agrees the
 * session is over.
 */
describe("/session-ended", () => {
  it("clears the cookies when the backend has ended the session", async () => {
    fetchMock.mockResolvedValue(
      json({ error: { code: "session_ended", message: "ended" } }, 401),
    );
    refreshSession.mockResolvedValue({ ok: false, reason: "ended" });

    const response = await visit(await signedIn());

    expect(location(response)).toBe("http://localhost:3000/login");
    expect(cleared(response)).toEqual(
      expect.arrayContaining([SESSION_COOKIE, ACCESS_COOKIE, REFRESH_COOKIE]),
    );
  });

  it("signs nobody out whose session still works", async () => {
    fetchMock.mockResolvedValue(json({ id: "u-1", role: "member" }));

    const response = await visit(await signedIn());

    expect(location(response)).toBe("http://localhost:3000/dashboard");
    expect(cleared(response)).toEqual([]);
  });

  it("refreshes an access token that has only run out", async () => {
    fetchMock.mockResolvedValue(
      json({ error: { code: "token_expired", message: "expired" } }, 401),
    );
    refreshSession.mockResolvedValue({
      ok: true,
      accessToken: "a2",
      expiresIn: 900,
      refreshToken: "r2",
      who: { role: "member", userId: "u-1" },
    });

    const response = await visit(await signedIn());

    expect(location(response)).toBe("http://localhost:3000/dashboard");
    expect(cleared(response)).toEqual([]);
    expect(response.headers.getSetCookie().join("\n")).toContain(
      `${REFRESH_COOKIE}=r2`,
    );
  });

  it("signs nobody out because the backend could not be reached", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    const response = await visit(await signedIn());

    expect(location(response)).toBe("http://localhost:3000/dashboard");
    expect(cleared(response)).toEqual([]);
  });

  it("clears a device that has no refresh token to try", async () => {
    const response = await visit({ [SESSION_COOKIE]: "v3.x.y" });
    expect(location(response)).toBe("http://localhost:3000/login");
    expect(cleared(response)).toContain(SESSION_COOKIE);
  });
});
