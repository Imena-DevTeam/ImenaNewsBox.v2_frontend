import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./api-client";
import { ApiError } from "@/types/api";

const BASE = "http://api.test/api/v1";
const ORIGIN = "http://localhost:3000";

function answer(body: unknown, init: ResponseInit = {}): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  });
}

/** A refusal exactly as the backend writes one (`core/exceptions.py`). */
function refusal(
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return answer({ error: { code, message, details } }, { status });
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.stubEnv("API_URL", BASE);
  vi.stubEnv("FRONTEND_ORIGIN", ORIGIN);
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const sentUrl = () => String(fetchMock.mock.calls[0]![0]);
const sentInit = () => fetchMock.mock.calls[0]![1] as RequestInit;
const sentHeaders = () => sentInit().headers as Record<string, string>;

const failureOf = (call: Promise<unknown>) =>
  call.then(
    () => {
      throw new Error("expected the call to fail");
    },
    (error: unknown) => error as ApiError,
  );

/**
 * The transport every service runs on.
 *
 * What these hold is the promise the services are written against: a call
 * either returns the body typed, or throws an `ApiError` that says what to
 * do about it — in the backend's own words, read from its own error shape.
 */
describe("api-client", () => {
  it("builds the URL from API_URL and the path", async () => {
    fetchMock.mockResolvedValue(answer({ ok: true }));
    await api.get("/users/me");
    expect(sentUrl()).toBe(`${BASE}/users/me`);
  });

  it("drops empty query entries rather than sending them", async () => {
    fetchMock.mockResolvedValue(answer([]));
    await api.get("/users", {
      query: { page: 2, category: "", user_id: undefined, featured: false },
    });

    const url = new URL(sentUrl());
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("featured")).toBe("false");
    expect(url.searchParams.has("category")).toBe(false);
    expect(url.searchParams.has("user_id")).toBe(false);
  });

  it("sends a bearer token when it is given one, and none when it is not", async () => {
    fetchMock.mockResolvedValue(answer({}));
    await api.get("/users/me", { token: "abc123" });
    expect(sentHeaders().Authorization).toBe("Bearer abc123");

    fetchMock.mockClear();
    fetchMock.mockResolvedValue(answer({}));
    await api.get("/users/me");
    expect(sentHeaders().Authorization).toBeUndefined();
  });

  /* The backend checks Origin on refresh and logout, and a call from the
     Next server has no browser to add one. */
  it("names the frontend as the Origin of every call", async () => {
    fetchMock.mockResolvedValue(answer({}));
    await api.post("/auth/logout");
    expect(sentHeaders().Origin).toBe(ORIGIN);
  });

  /* The backend labels a device after its user agent; without this every
     session would be called after Node's fetch. */
  it("forwards the browser's user agent when it is given one", async () => {
    fetchMock.mockResolvedValue(answer({}));
    await api.post("/auth/verify", {}, { userAgent: "Mozilla/5.0 Firefox" });
    expect(sentHeaders()["User-Agent"]).toBe("Mozilla/5.0 Firefox");
  });

  it("never lets Next cache an answer, and sends no browser credentials", async () => {
    fetchMock.mockResolvedValue(answer({}));
    await api.get("/users");
    expect(sentInit().cache).toBe("no-store");
    expect(sentInit().credentials).toBeUndefined();
  });

  /* The whole reason this file exists: one failure shape. */
  it("reads the backend's own refusal: code, message and fields", async () => {
    fetchMock.mockResolvedValue(
      refusal(
        422,
        "validation_error",
        "The request has invalid or missing fields.",
        [
          {
            field: "body.email",
            message: "value is not a valid email address",
          },
          { field: "body.family_name", message: "Field required" },
          { field: "body.email", message: "a second complaint is not shown" },
        ],
      ),
    );

    const error = await failureOf(api.post("/users", {}));

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(422);
    expect(error.code).toBe("validation_error");
    expect(error.message).toBe("The request has invalid or missing fields.");
    expect(error.fields).toEqual({
      email: "value is not a valid email address",
      family_name: "Field required",
    });
    expect(error.isValidation).toBe(true);
  });

  it("keeps the backend's code and words for a refusal without fields", async () => {
    fetchMock.mockResolvedValue(
      refusal(409, "too_few_admins", "The family needs at least two admins."),
    );

    const error = await failureOf(api.post("/users/x/deactivate"));

    expect(error.code).toBe("too_few_admins");
    expect(error.message).toBe("The family needs at least two admins.");
    expect(error.fields).toBeUndefined();
  });

  /* A wrong administrator password is a 401 too, and must not be reworded
     into "your session has ended". */
  it("tells an ended session apart from a wrong password", async () => {
    fetchMock.mockResolvedValue(
      refusal(
        401,
        "invalid_credentials",
        "The family name or password is wrong.",
      ),
    );
    const wrong = await failureOf(api.post("/auth/login", {}));
    expect(wrong.message).toBe("The family name or password is wrong.");
    expect(wrong.isSessionOver).toBe(false);

    fetchMock.mockResolvedValue(
      refusal(401, "session_ended", "Your session has ended. Log in again."),
    );
    const ended = await failureOf(api.get("/users/me"));
    expect(ended.isSessionOver).toBe(true);
  });

  /* A proxy that answers with HTML, or with nothing, must not surface as
     "Unexpected token < in JSON". */
  it("still produces a readable error when the body is not JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response("<html>502</html>", { status: 502 }),
    );

    const error = await failureOf(api.get("/users"));
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(502);
    expect(error.code).toBe("http_502");
    expect(error.message).toContain("502");
  });

  /* Status 0 is the one that means trying again may genuinely help. */
  it("reports a request that never reached the server as offline", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    const error = await failureOf(api.get("/users"));
    expect(error.isOffline).toBe(true);
    expect(error.code).toBe("network");
  });

  it("returns nothing for a 204, rather than failing to parse it", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(api.delete("/wishes/w-1")).resolves.toBeUndefined();
  });

  it("sends a body as JSON, and FormData as itself", async () => {
    fetchMock.mockResolvedValue(answer({}));
    await api.post("/wishes", { message: "Happy birthday" });
    expect(sentHeaders()["Content-Type"]).toBe("application/json");
    expect(sentInit().body).toBe(JSON.stringify({ message: "Happy birthday" }));

    fetchMock.mockClear();
    fetchMock.mockResolvedValue(answer({}));
    const form = new FormData();
    form.set("photo", new Blob(["x"]));
    await api.put("/users/x/photo", form);
    /* fetch sets it, with the multipart boundary. */
    expect(sentHeaders()["Content-Type"]).toBeUndefined();
    expect(sentInit().body).toBe(form);
  });

  it("hands back the headers with the body when asked to", async () => {
    fetchMock.mockResolvedValue(
      answer(
        { access_token: "t", token_type: "bearer", expires_in: 900 },
        {
          headers: {
            "set-cookie": "refresh_token=r; Path=/api/v1/auth; HttpOnly",
          },
        },
      ),
    );

    const { data, headers } = await api.exchange("/auth/verify", {});
    expect(data).toMatchObject({ access_token: "t" });
    expect(headers.getSetCookie()).toHaveLength(1);
  });

  it("streams a body without reading it, and still refuses like the rest", async () => {
    fetchMock.mockResolvedValue(
      new Response("%PDF-1.7", {
        headers: { "content-type": "application/pdf" },
      }),
    );
    const response = await api.stream("/resources/r/file");
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(await response.text()).toBe("%PDF-1.7");

    fetchMock.mockResolvedValue(
      refusal(404, "resource_not_found", "That document doesn't exist."),
    );
    const error = await failureOf(api.stream("/resources/r/file"));
    expect(error.code).toBe("resource_not_found");
  });

  /* Built before the try, so it is not reported as a network failure. */
  it("says which variable is missing when there is no backend configured", async () => {
    vi.stubEnv("API_URL", "");
    await expect(api.get("/users")).rejects.toThrow(/API_URL is not set/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
