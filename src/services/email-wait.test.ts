import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_TIMEOUT_MS, EMAIL_TIMEOUT_MS } from "@/lib/env";
import { authService } from "./auth.service";
import { usersService } from "./users.service";

/**
 * The calls that make the backend send an email wait as long as an email
 * can take.
 *
 * The backend sends during the request and gives each email up to 25
 * seconds. Over a slow link to Gmail a login took longer than this
 * frontend's usual 10, so the login form said the code had failed while it
 * was still being sent (18 Nov 2026).
 */
const AUTH = { token: "t" };

let timeouts: number[];

beforeEach(() => {
  vi.stubEnv("API_URL", "http://api.test/api/v1");
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("{}", { status: 200 })),
  );
  const original = AbortSignal.timeout.bind(AbortSignal);
  timeouts = [];
  vi.spyOn(AbortSignal, "timeout").mockImplementation((ms: number) => {
    timeouts.push(ms);
    return original(ms);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("waiting for an email", () => {
  it("waits longer than the backend's 25 seconds", () => {
    expect(EMAIL_TIMEOUT_MS).toBeGreaterThan(30_000);
  });

  it.each([
    ["a login code", () => authService.login({ family_name: "RWEMA" })],
    ["a password link", () => authService.approveReset("r-1", AUTH)],
    ["another email code", () => usersService.resendEmailCode(AUTH)],
    [
      "an invitation, on adding somebody",
      () =>
        usersService.create(
          {
            family_name: "UWASE",
            display_name: "Uwase",
            email: "uwase@example.test",
            sub_family_id: 1,
            role: "member",
          },
          AUTH,
        ),
    ],
    [
      "a code or a link, on changing somebody",
      () => usersService.update("u-1", { email: "new@example.test" }, AUTH),
    ],
    ["a new invitation", () => usersService.invite("u-1", AUTH)],
  ])("waits for %s", async (_what, call) => {
    await call();
    expect(timeouts).toEqual([EMAIL_TIMEOUT_MS]);
  });

  it("does not wait that long for anything else", async () => {
    await usersService.me(AUTH);
    await authService.verify({ family_name: "RWEMA", code: "12345" });
    expect(timeouts).toEqual([DEFAULT_TIMEOUT_MS, DEFAULT_TIMEOUT_MS]);
  });
});
