import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./api-client";
import { ApiError } from "@/types/api";

const BASE = "https://api.test/v1";

function answer(body: unknown, init: ResponseInit = {}): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  });
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_API_URL", BASE);
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const sentUrl = () => String(fetchMock.mock.calls[0]![0]);
const sentInit = () => fetchMock.mock.calls[0]![1] as RequestInit;

/**
 * The transport every service runs on.
 *
 * What these hold is the promise the services are written against: a call
 * either returns the body typed, or throws an `ApiError` that says what to
 * do about it. No service should ever see a `Response`.
 */
describe("api-client", () => {
  it("builds the URL from the base and the path", async () => {
    fetchMock.mockResolvedValue(answer({ ok: true }));
    await api.get("/members");
    expect(sentUrl()).toBe(`${BASE}/members`);
  });

  it("drops empty query entries rather than sending them", async () => {
    fetchMock.mockResolvedValue(answer([]));
    await api.get("/members", {
      query: { page: 2, search: "", branch: undefined, active: true },
    });

    const url = new URL(sentUrl());
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("active")).toBe("true");
    expect(url.searchParams.has("search")).toBe(false);
    expect(url.searchParams.has("branch")).toBe(false);
  });

  it("sends a bearer token when it is given one, and none when it is not", async () => {
    fetchMock.mockResolvedValue(answer({}));
    await api.get("/members", { token: "abc123" });
    expect((sentInit().headers as Record<string, string>).Authorization).toBe(
      "Bearer abc123",
    );

    fetchMock.mockClear();
    fetchMock.mockResolvedValue(answer({}));
    await api.get("/members");
    expect(
      (sentInit().headers as Record<string, string>).Authorization,
    ).toBeUndefined();
  });

  /* The whole reason this file exists: one failure shape, whatever the
     backend chose to send. */
  it("turns a refusal into an ApiError carrying the server's own words", async () => {
    fetchMock.mockResolvedValue(
      answer(
        {
          code: "email_taken",
          message: "Somebody else already uses that address.",
          fields: { email: "Already in use" },
        },
        { status: 422 },
      ),
    );

    const failure = await api
      .post("/members", {})
      .catch((error: unknown) => error);

    expect(failure).toBeInstanceOf(ApiError);
    const error = failure as ApiError;
    expect(error.status).toBe(422);
    expect(error.code).toBe("email_taken");
    expect(error.fields?.email).toBe("Already in use");
    expect(error.isValidation).toBe(true);
  });

  /* A backend that answers an error with HTML, or with nothing, must not
     surface as "Unexpected token < in JSON". */
  it("still produces a readable error when the body is not JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response("<html>502</html>", { status: 502 }),
    );

    const error = (await api
      .get("/members")
      .catch((e: unknown) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(502);
    expect(error.message).toContain("502");
  });

  it("says plainly when a session has ended", async () => {
    fetchMock.mockResolvedValue(answer({ code: "expired" }, { status: 401 }));

    const error = (await api
      .get("/members")
      .catch((e: unknown) => e)) as ApiError;
    expect(error.isUnauthorized).toBe(true);
    expect(error.message).toMatch(/sign in again/i);
  });

  /* Status 0 is the one that means trying again may genuinely help. */
  it("reports a request that never reached the server as offline", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    const error = (await api
      .get("/members")
      .catch((e: unknown) => e)) as ApiError;
    expect(error.isOffline).toBe(true);
    expect(error.code).toBe("network");
  });

  it("returns nothing for a 204, rather than failing to parse it", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(api.delete("/members/m-01")).resolves.toBeUndefined();
  });

  it("sends a body as JSON, and FormData as itself", async () => {
    fetchMock.mockResolvedValue(answer({}));
    await api.post("/posts", { title: "A day out" });
    let headers = sentInit().headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
    expect(sentInit().body).toBe(JSON.stringify({ title: "A day out" }));

    fetchMock.mockClear();
    fetchMock.mockResolvedValue(answer({}));
    const form = new FormData();
    form.set("file", new Blob(["x"]));
    await api.post("/uploads", form);
    headers = sentInit().headers as Record<string, string>;
    /* The browser sets it, with the multipart boundary. */
    expect(headers["Content-Type"]).toBeUndefined();
  });

  it("says which variable is missing when there is no backend configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");
    await expect(api.get("/members")).rejects.toThrow(/NEXT_PUBLIC_API_URL/);
  });
});
