import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  REFRESH_AHEAD_MS,
  accessExpiresAt,
  forgetSharedRefreshes,
  refreshSession,
  shouldRefresh,
} from "./refresh";

/** An unsigned JWT with this `exp`: only the claim is ever read here. */
function jwt(expSeconds: number): string {
  const part = (value: unknown) =>
    btoa(JSON.stringify(value))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  return `${part({ alg: "HS256" })}.${part({ sub: "u", exp: expSeconds })}.sig`;
}

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json", ...init.headers },
    ...init,
  });

const refreshed = (refresh = "new-refresh") =>
  json(
    { access_token: "new-access", token_type: "bearer", expires_in: 900 },
    {
      headers: {
        "set-cookie": `refresh_token=${refresh}; HttpOnly; Path=/api/v1/auth`,
      },
    },
  );

const me = () => json({ id: "u-1", role: "admin" });

const refusal = (status: number, code: string) =>
  json({ error: { code, message: code } }, { status });

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.stubEnv("API_URL", "http://api.test/api/v1");
  vi.stubEnv("FRONTEND_ORIGIN", "http://localhost:3000");
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  forgetSharedRefreshes();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const refreshCalls = () =>
  fetchMock.mock.calls.filter(([url]) => String(url).endsWith("/auth/refresh"));

describe("refreshSession", () => {
  it("returns the new tokens and who they belong to", async () => {
    fetchMock.mockResolvedValueOnce(refreshed()).mockResolvedValueOnce(me());

    expect(await refreshSession("old-refresh", "Firefox")).toEqual({
      ok: true,
      accessToken: "new-access",
      expiresIn: 900,
      refreshToken: "new-refresh",
      who: { role: "admin", userId: "u-1" },
    });

    const [, init] = refreshCalls()[0]! as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers.Cookie).toBe("refresh_token=old-refresh");
    expect(headers["User-Agent"]).toBe("Firefox");
    expect(headers.Origin).toBe("http://localhost:3000");
  });

  /* The reason it is shared: several requests from one page load carry the
     same refresh token, and spending it twice ends the session. */
  it("refreshes once for every request carrying the same token", async () => {
    fetchMock.mockResolvedValueOnce(refreshed()).mockResolvedValueOnce(me());

    const results = await Promise.all([
      refreshSession("same"),
      refreshSession("same"),
      refreshSession("same"),
    ]);

    expect(refreshCalls()).toHaveLength(1);
    expect(new Set(results.map((r) => r.ok && r.refreshToken))).toEqual(
      new Set(["new-refresh"]),
    );
  });

  it("hands the same answer to a request that arrives just after", async () => {
    fetchMock.mockResolvedValueOnce(refreshed()).mockResolvedValueOnce(me());
    const first = await refreshSession("same");
    const late = await refreshSession("same");

    expect(refreshCalls()).toHaveLength(1);
    expect(late).toEqual(first);
  });

  it("does not share between different tokens", async () => {
    fetchMock
      .mockResolvedValueOnce(refreshed("a2"))
      .mockResolvedValueOnce(me())
      .mockResolvedValueOnce(refreshed("b2"))
      .mockResolvedValueOnce(me());

    await refreshSession("a");
    await refreshSession("b");
    expect(refreshCalls()).toHaveLength(2);
  });

  it("says the session ended when the backend says so", async () => {
    fetchMock.mockResolvedValueOnce(refusal(401, "session_ended"));
    expect(await refreshSession("stolen")).toEqual({
      ok: false,
      reason: "ended",
    });
  });

  it("tells a conflict apart from an ended session", async () => {
    fetchMock.mockResolvedValueOnce(refusal(409, "refresh_conflict"));
    expect(await refreshSession("raced")).toEqual({
      ok: false,
      reason: "conflict",
    });
  });

  it("tells an unreachable backend apart from an ended session", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    expect(await refreshSession("offline")).toEqual({
      ok: false,
      reason: "unreachable",
    });
  });

  /* A failure is not shared: the next request asks again. */
  it("asks again after a failure", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce(refreshed())
      .mockResolvedValueOnce(me());

    expect((await refreshSession("t")).ok).toBe(false);
    expect((await refreshSession("t")).ok).toBe(true);
  });

  /* The old token is spent the moment the backend answers, so an answer
     without the new one cannot be used. */
  it("treats an answer without a new refresh token as ended", async () => {
    fetchMock.mockResolvedValueOnce(
      json({ access_token: "a", token_type: "bearer", expires_in: 900 }),
    );
    expect(await refreshSession("t")).toEqual({ ok: false, reason: "ended" });
  });

  it("keeps the new tokens when only the who-am-I call fails", async () => {
    fetchMock
      .mockResolvedValueOnce(refreshed())
      .mockRejectedValueOnce(new TypeError("fetch failed"));

    const result = await refreshSession("t");
    expect(result).toMatchObject({ ok: true, refreshToken: "new-refresh" });
    expect(result.ok && result.who).toBeUndefined();
  });
});

describe("when to refresh", () => {
  it("reads the access token's own expiry", () => {
    expect(accessExpiresAt(jwt(2_000_000_000))).toBe(2_000_000_000_000);
    expect(accessExpiresAt("not.a-jwt")).toBeNull();
    expect(accessExpiresAt(undefined)).toBeNull();
  });

  it("refreshes before the token runs out, not after", () => {
    const now = 1_800_000_000_000;
    const fresh = jwt((now + 10 * 60_000) / 1000);
    const nearlyDone = jwt((now + REFRESH_AHEAD_MS - 1000) / 1000);
    const done = jwt((now - 1000) / 1000);

    expect(shouldRefresh(fresh, now)).toBe(false);
    expect(shouldRefresh(nearlyDone, now)).toBe(true);
    expect(shouldRefresh(done, now)).toBe(true);
    expect(shouldRefresh(undefined, now)).toBe(true);
  });
});
