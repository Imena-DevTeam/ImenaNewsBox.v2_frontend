// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  SESSION_COOKIE,
  createSessionToken,
  readSession,
  type Role,
} from "@/lib/session";

const refreshSession = vi.fn();
vi.mock("@/lib/refresh", async (original) => ({
  ...(await original<Record<string, unknown>>()),
  refreshSession: (...args: unknown[]) => refreshSession(...args),
}));

const { middleware } = await import("./middleware");

/** An unsigned JWT that runs out `seconds` from now. */
function access(seconds: number): string {
  const exp = Math.floor(Date.now() / 1000) + seconds;
  const claims = btoa(JSON.stringify({ exp })).replace(/=+$/, "");
  return `h.${claims}.s`;
}

async function request(
  path: string,
  cookies: Record<string, string> = {},
): Promise<NextRequest> {
  const req = new NextRequest(new URL(path, "http://localhost:3000"));
  for (const [name, value] of Object.entries(cookies)) {
    req.cookies.set(name, value);
  }
  return req;
}

const session = async (role: Role) =>
  (await createSessionToken({ role, userId: "u-1" }))!;

const location = (response: Response) => response.headers.get("location");
const setCookie = (response: Response, name: string) =>
  response.headers
    .getSetCookie()
    .find((cookie) => cookie.startsWith(`${name}=`));

afterEach(() => {
  vi.unstubAllEnvs();
  refreshSession.mockReset();
});

describe("middleware, fixture mode", () => {
  beforeEach(() => {
    vi.stubEnv("API_URL", "");
    vi.stubEnv("NODE_ENV", "development");
  });

  it("leaves public pages alone", async () => {
    const response = await middleware(await request("/login"));
    expect(location(response)).toBeNull();
  });

  it("sends a visitor with no session to the login, carrying the way back", async () => {
    const response = await middleware(await request("/gallery?album=a"));
    expect(location(response)).toBe(
      "http://localhost:3000/login?next=%2Fgallery%3Falbum%3Da",
    );
  });

  it("sends the admin area to its own door", async () => {
    const response = await middleware(await request("/admin/members"));
    expect(location(response)).toContain("/admin/login?next=");
  });

  it("lets a member into the member area, and not into admin or studio", async () => {
    const cookies = { [SESSION_COOKIE]: await session("member") };
    expect(
      location(await middleware(await request("/dashboard", cookies))),
    ).toBeNull();
    expect(location(await middleware(await request("/admin", cookies)))).toBe(
      "http://localhost:3000/dashboard",
    );
    expect(location(await middleware(await request("/studio", cookies)))).toBe(
      "http://localhost:3000/dashboard",
    );
  });

  it("lets a social media manager into the studio, not the admin area", async () => {
    const cookies = { [SESSION_COOKIE]: await session("social_media_manager") };
    expect(
      location(await middleware(await request("/studio/posts", cookies))),
    ).toBeNull();
    expect(
      location(await middleware(await request("/admin", cookies))),
    ).toContain("/dashboard");
  });

  it("refuses a hand-written session", async () => {
    const response = await middleware(
      await request("/admin", { [SESSION_COOKIE]: "v3.e30.forged" }),
    );
    expect(location(response)).toContain("/admin/login");
  });
});

describe("middleware, backend mode", () => {
  beforeEach(() => {
    vi.stubEnv("API_URL", "http://api.test/api/v1");
  });

  it("signs out a device with no refresh token, whatever its session says", async () => {
    const response = await middleware(
      await request("/dashboard", { [SESSION_COOKIE]: await session("admin") }),
    );
    expect(location(response)).toContain("/login?next=");
    expect(setCookie(response, SESSION_COOKIE)).toMatch(/Max-Age=0/i);
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("does not refresh a token with time left on it", async () => {
    const response = await middleware(
      await request("/dashboard", {
        [SESSION_COOKIE]: await session("member"),
        [ACCESS_COOKIE]: access(600),
        [REFRESH_COOKIE]: "r1",
      }),
    );
    expect(location(response)).toBeNull();
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("refreshes a token near its end, and keeps the new ones", async () => {
    refreshSession.mockResolvedValue({
      ok: true,
      accessToken: "a2",
      expiresIn: 900,
      refreshToken: "r2",
      who: { role: "member", userId: "u-1" },
    });

    const response = await middleware(
      await request("/dashboard", {
        [SESSION_COOKIE]: await session("member"),
        [ACCESS_COOKIE]: access(30),
        [REFRESH_COOKIE]: "r1",
      }),
    );

    expect(refreshSession).toHaveBeenCalledWith("r1", undefined);
    expect(location(response)).toBeNull();
    expect(setCookie(response, ACCESS_COOKIE)).toMatch(/^imena_access=a2;/);
    expect(setCookie(response, REFRESH_COOKIE)).toMatch(/^imena_refresh=r2;/);
    expect(setCookie(response, ACCESS_COOKIE)).toMatch(/HttpOnly/i);
    /* And the page rendered for this request already sees them. */
    expect(response.headers.get("x-middleware-request-cookie")).toContain(
      "imena_access=a2",
    );
  });

  /* The rail follows the backend: a demotion reaches the session cookie at
     the next refresh, and the admin area closes with it. */
  it("takes the role from the refresh, not the old cookie", async () => {
    refreshSession.mockResolvedValue({
      ok: true,
      accessToken: "a2",
      expiresIn: 900,
      refreshToken: "r2",
      who: { role: "member", userId: "u-1" },
    });

    const response = await middleware(
      await request("/admin", {
        [SESSION_COOKIE]: await session("admin"),
        [REFRESH_COOKIE]: "r1",
      }),
    );

    expect(location(response)).toBe("http://localhost:3000/dashboard");
    const renewed = setCookie(response, SESSION_COOKIE)!
      .split(";")[0]!
      .split("=")[1];
    expect((await readSession(renewed))?.role).toBe("member");
  });

  it("signs out a device whose session the backend ended", async () => {
    refreshSession.mockResolvedValue({ ok: false, reason: "ended" });
    const response = await middleware(
      await request("/dashboard", {
        [SESSION_COOKIE]: await session("member"),
        [REFRESH_COOKIE]: "revoked",
      }),
    );
    expect(location(response)).toContain("/login");
    expect(setCookie(response, REFRESH_COOKIE)).toMatch(/Max-Age=0/i);
  });

  /* Another request refreshed first, or the backend is down: carry on with
     what this one has rather than signing anybody out. */
  it("carries on when the refresh lost a race or could not be made", async () => {
    for (const reason of ["conflict", "unreachable"] as const) {
      refreshSession.mockResolvedValue({ ok: false, reason });
      const response = await middleware(
        await request("/dashboard", {
          [SESSION_COOKIE]: await session("member"),
          [ACCESS_COOKIE]: access(60),
          [REFRESH_COOKIE]: "r1",
        }),
      );
      expect(location(response)).toBeNull();
      expect(setCookie(response, REFRESH_COOKIE)).toBeUndefined();
    }
  });
});

describe("middleware, production with no backend", () => {
  it("lets nobody in, whatever cookie they hold", async () => {
    vi.stubEnv("API_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    const response = await middleware(
      await request("/dashboard", { [SESSION_COOKIE]: await session("admin") }),
    );
    expect(location(response)).toContain("/login");
  });
});

/**
 * Logging in once per device: a device with a session is not shown the
 * login again. Asking it for a second code was the bug (18 Nov 2026).
 */
describe("middleware, a signed-in device at the login", () => {
  beforeEach(() => {
    vi.stubEnv("API_URL", "http://api.test/api/v1");
  });

  const signedIn = async (role: Role) => ({
    [SESSION_COOKIE]: await session(role),
    [ACCESS_COOKIE]: access(600),
    [REFRESH_COOKIE]: "r1",
  });

  it("goes on to its home instead", async () => {
    const response = await middleware(
      await request("/login", await signedIn("member")),
    );
    expect(location(response)).toBe("http://localhost:3000/dashboard");
  });

  it("goes on to where it was headed", async () => {
    const response = await middleware(
      await request(
        "/login?next=%2Fgallery%3Falbum%3Da",
        await signedIn("member"),
      ),
    );
    expect(location(response)).toBe("http://localhost:3000/gallery?album=a");
  });

  it("is never sent off the site, or back to a login", async () => {
    for (const next of [
      "//evil.example",
      "https://evil.example",
      /* A browser reads a backslash as a slash, so this is //evil.example. */
      String.raw`/\evil.example`,
      "/login",
    ]) {
      const response = await middleware(
        await request(
          `/login?next=${encodeURIComponent(next)}`,
          await signedIn("member"),
        ),
      );
      expect(location(response)).toBe("http://localhost:3000/dashboard");
    }
  });

  it("takes an administrator past their own door to the admin area", async () => {
    const response = await middleware(
      await request("/admin/login", await signedIn("admin")),
    );
    expect(location(response)).toBe("http://localhost:3000/admin");
  });

  /* The device may be being handed to an administrator. */
  it("still shows the administrators' door to a member", async () => {
    const response = await middleware(
      await request("/admin/login", await signedIn("member")),
    );
    expect(location(response)).toBeNull();
  });

  it("shows the login to a device with no session, or no refresh token", async () => {
    expect(location(await middleware(await request("/login")))).toBeNull();
    const response = await middleware(
      await request("/login", { [SESSION_COOKIE]: await session("member") }),
    );
    expect(location(response)).toBeNull();
  });

  it("never asks the backend: it only reads the cookies", async () => {
    await middleware(await request("/login", await signedIn("admin")));
    expect(refreshSession).not.toHaveBeenCalled();
  });
});
