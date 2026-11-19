// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SAMPLE_TOKENS } from "@/features/invitations/fixture";
import { acceptInvitation, checkInvitation } from "./invitation";

const json = (body: unknown, status = 200) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const refusal = (status: number, code: string, message: string) =>
  json({ error: { code, message } }, status);

let fetchMock: ReturnType<typeof vi.fn>;

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const sent = () => {
  const [url, init] = fetchMock.mock.calls[0]! as [string, RequestInit];
  return { url: String(url), body: JSON.parse(String(init.body)) as unknown };
};

describe("invitations, against the backend", () => {
  beforeEach(() => {
    vi.stubEnv("API_URL", "http://api.test/api/v1");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("asks who the link is for, sending the token as it arrived", async () => {
    fetchMock.mockResolvedValue(
      json({
        family_name: "Shema",
        display_name: "Shema Nkusi",
        needs_password: true,
      }),
    );

    expect(await checkInvitation("tok-123")).toEqual({
      ok: true,
      invitation: {
        familyName: "Shema",
        displayName: "Shema Nkusi",
        needsPassword: true,
      },
    });
    expect(sent()).toEqual({
      url: "http://api.test/api/v1/auth/invitations/check",
      body: { token: "tok-123" },
    });
  });

  /* Wrong, used, replaced, expired, or a deactivated person's: the backend
     gives one answer, and the page one refusal. */
  it("reads invalid_invitation as a link that no longer works", async () => {
    fetchMock.mockResolvedValue(
      refusal(400, "invalid_invitation", "Ask an admin to send a new one."),
    );
    expect(await checkInvitation("old")).toMatchObject({
      ok: false,
      invalid: true,
    });
  });

  it("does not call an unreachable backend a bad link", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    expect(await checkInvitation("tok")).toEqual({
      ok: false,
      invalid: false,
      message: "We could not reach the server. Try again in a moment.",
    });
  });

  it("sends a member's acceptance with no password", async () => {
    fetchMock.mockResolvedValue(json(undefined, 204));
    expect(await acceptInvitation("tok")).toEqual({ ok: true });
    expect(sent()).toEqual({
      url: "http://api.test/api/v1/auth/invitations/accept",
      body: { token: "tok" },
    });
  });

  it("sends an administrator's password with theirs", async () => {
    fetchMock.mockResolvedValue(json(undefined, 204));
    expect(await acceptInvitation("tok", "correct-horse")).toEqual({
      ok: true,
    });
    expect(sent().body).toEqual({ token: "tok", password: "correct-horse" });
  });

  it("keeps the backend's words for any other refusal", async () => {
    fetchMock.mockResolvedValue(
      refusal(429, "password_check_busy", "Too many sign-ins at once."),
    );
    expect(await acceptInvitation("tok", "correct-horse")).toEqual({
      ok: false,
      invalid: false,
      message: "Too many sign-ins at once.",
    });
  });

  /* A server action is a public endpoint: the form's checks are a
     courtesy, so they are made again here before anything is sent. */
  it("checks the password and the token before sending anything", async () => {
    expect(await acceptInvitation("tok", "short")).toMatchObject({
      ok: false,
      message: "Password must be at least 8 characters",
    });
    expect(await acceptInvitation("tok", "x".repeat(257))).toMatchObject({
      ok: false,
    });
    expect(await checkInvitation("   ")).toMatchObject({ invalid: true });
    expect(await acceptInvitation("")).toMatchObject({ invalid: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("invitations, fixture mode", () => {
  beforeEach(() => {
    vi.stubEnv("API_URL", "");
    vi.stubEnv("NODE_ENV", "development");
  });

  it("answers the two sample links and refuses anything else", async () => {
    expect(await checkInvitation(SAMPLE_TOKENS.member)).toMatchObject({
      ok: true,
      invitation: { needsPassword: false },
    });
    expect(await checkInvitation(SAMPLE_TOKENS.admin)).toMatchObject({
      ok: true,
      invitation: { needsPassword: true },
    });
    expect(await checkInvitation("guessed")).toMatchObject({ invalid: true });
  });

  it("wants an administrator's password, as the backend does", async () => {
    expect(await acceptInvitation(SAMPLE_TOKENS.admin)).toMatchObject({
      ok: false,
      invalid: false,
    });
    expect(
      await acceptInvitation(SAMPLE_TOKENS.admin, "correct-horse"),
    ).toEqual({ ok: true });
  });
});

describe("invitations, production with no backend", () => {
  it("answers nobody, sample links included", async () => {
    vi.stubEnv("API_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(await checkInvitation(SAMPLE_TOKENS.member)).toMatchObject({
      ok: false,
      invalid: false,
    });
    expect(await acceptInvitation(SAMPLE_TOKENS.member)).toMatchObject({
      ok: false,
    });
  });
});
