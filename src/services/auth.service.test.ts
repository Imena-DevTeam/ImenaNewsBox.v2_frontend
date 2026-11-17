import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authService, readRefreshToken } from "./auth.service";

/**
 * The refresh token travels in a cookie the backend sets on the Next server.
 * These hold the two halves of carrying it: reading it out of `Set-Cookie`,
 * and handing it back as a `Cookie` header.
 */
function withCookies(...cookies: string[]): Headers {
  const headers = new Headers();
  for (const cookie of cookies) headers.append("set-cookie", cookie);
  return headers;
}

describe("readRefreshToken", () => {
  it("reads the token out of the backend's cookie", () => {
    const headers = withCookies(
      "refresh_token=abc.DEF-123_x; HttpOnly; Max-Age=7776000; Path=/api/v1/auth; SameSite=lax; Secure",
    );
    expect(readRefreshToken(headers)).toBe("abc.DEF-123_x");
  });

  it("finds it among other cookies", () => {
    const headers = withCookies(
      "other=1; Path=/",
      "refresh_token=tok; Path=/api/v1/auth",
    );
    expect(readRefreshToken(headers)).toBe("tok");
  });

  /* Logout answers with Starlette's cleared cookie, quotes and all: that is
     not a token, and keeping `""` as one would send it back on refresh. */
  it("treats a cleared cookie as no token", () => {
    expect(
      readRefreshToken(
        withCookies(
          'refresh_token=""; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=/api/v1/auth; SameSite=lax; Secure; HttpOnly',
        ),
      ),
    ).toBeUndefined();
    expect(
      readRefreshToken(withCookies("refresh_token=; Path=/")),
    ).toBeUndefined();
  });

  it("is undefined when no refresh cookie was set", () => {
    expect(readRefreshToken(new Headers())).toBeUndefined();
  });
});

describe("authService", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubEnv("API_URL", "http://api.test/api/v1");
    vi.stubEnv("FRONTEND_ORIGIN", "http://localhost:3000");
    fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  const sentHeaders = () =>
    (fetchMock.mock.calls[0]![1] as RequestInit).headers as Record<
      string,
      string
    >;

  it("hands the refresh token back as the backend's cookie", async () => {
    await authService.logout("tok");
    expect(sentHeaders().Cookie).toBe("refresh_token=tok");
    expect(sentHeaders().Origin).toBe("http://localhost:3000");
  });

  it("logs out without a cookie when there is no token", async () => {
    await authService.logout(undefined);
    expect(sentHeaders().Cookie).toBeUndefined();
  });

  /* The invitation token is the credential, so it goes in the body, never
     in a URL. */
  it("sends an invitation token in the body", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          family_name: "RWEMA",
          display_name: "R",
          needs_password: true,
        }),
        { status: 200 },
      ),
    );
    await authService.checkInvitation("secret-token");
    const [url, init] = fetchMock.mock.calls[0]! as [string, RequestInit];
    expect(url).not.toContain("secret-token");
    expect(JSON.parse(String(init.body))).toEqual({ token: "secret-token" });
  });

  it("sends no password for a member accepting an invitation", async () => {
    await authService.acceptInvitation("t");
    const init = fetchMock.mock.calls[0]![1] as RequestInit;
    expect(JSON.parse(String(init.body))).toEqual({ token: "t" });
  });
});
