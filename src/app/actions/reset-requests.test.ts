// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ACCESS_COOKIE } from "@/lib/session";

const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === ACCESS_COOKIE ? { name, value: "access-1" } : undefined,
  }),
  headers: async () => new Headers({ "user-agent": "Firefox 140" }),
}));

const { approveResetRequest, askForPasswordReset, declineResetRequest } =
  await import("./reset-requests");

const json = (body: unknown, status = 200) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const refusal = (status: number, code: string, message: string) =>
  json({ error: { code, message } }, status);

let fetchMock: ReturnType<typeof vi.fn>;

const call = (index = 0) => {
  const [url, init] = fetchMock.mock.calls[index]! as [string, RequestInit];
  return {
    url: String(url),
    body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
    authorization: new Headers(init.headers).get("authorization"),
  };
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  revalidatePath.mockReset();
});

describe("reset requests, against the backend", () => {
  beforeEach(() => {
    vi.stubEnv("API_URL", "http://api.test/api/v1");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("asks with the family name, and keeps the backend's words", async () => {
    fetchMock.mockResolvedValue(
      json({ message: "The same for everyone." }, 202),
    );

    expect(await askForPasswordReset("  Rwema ")).toEqual({
      ok: true,
      message: "The same for everyone.",
    });
    expect(call()).toMatchObject({
      url: "http://api.test/api/v1/auth/reset-requests",
      body: { family_name: "Rwema" },
      authorization: null,
    });
  });

  it("refuses an empty name before asking anybody", async () => {
    expect(await askForPasswordReset("   ")).toMatchObject({ ok: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("says when the server could not be reached", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    expect(await askForPasswordReset("Rwema")).toEqual({
      ok: false,
      message: "We could not reach the server. Try again in a moment.",
    });
  });

  it("sends the link as the signed-in administrator, then refreshes /admin", async () => {
    fetchMock.mockResolvedValue(json(undefined, 204));

    expect(await approveResetRequest("rr-1")).toEqual({ ok: true });
    expect(call()).toMatchObject({
      url: "http://api.test/api/v1/auth/reset-requests/rr-1/approve",
      authorization: "Bearer access-1",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin");
  });

  it("declines without sending anything", async () => {
    fetchMock.mockResolvedValue(json(undefined, 204));

    expect(await declineResetRequest("rr-1")).toEqual({ ok: true });
    expect(call().url).toBe(
      "http://api.test/api/v1/auth/reset-requests/rr-1/decline",
    );
  });

  /* Another administrator answered it first. */
  it("lets a request that is no longer open leave the list", async () => {
    fetchMock.mockResolvedValue(
      refusal(404, "reset_request_not_found", "Not found."),
    );
    expect(await approveResetRequest("rr-1")).toMatchObject({
      ok: false,
      gone: true,
    });
  });

  /* The backend keeps the request open when the email fails. */
  it("keeps a request whose email could not be sent", async () => {
    fetchMock.mockResolvedValue(
      refusal(503, "email_not_sent", "The email could not be sent."),
    );
    expect(await approveResetRequest("rr-1")).toEqual({
      ok: false,
      message: "The email could not be sent.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("reset requests, fixture mode", () => {
  beforeEach(() => {
    vi.stubEnv("API_URL", "");
    vi.stubEnv("NODE_ENV", "development");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("answers like the backend and asks nobody", async () => {
    expect(await askForPasswordReset("Shema")).toMatchObject({ ok: true });
    expect(await approveResetRequest("rr-1")).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("reset requests, production with no backend", () => {
  it("does nothing", async () => {
    vi.stubEnv("API_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(await askForPasswordReset("Shema")).toMatchObject({ ok: false });
    expect(await declineResetRequest("rr-1")).toMatchObject({ ok: false });
  });
});
