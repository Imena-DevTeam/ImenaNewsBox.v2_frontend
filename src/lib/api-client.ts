import { ApiError, type ApiFailure } from "@/types/api";
import {
  DEFAULT_TIMEOUT_MS,
  apiBaseUrl,
  frontendOrigin,
  serverEnv,
} from "@/lib/env";

/**
 * The one way this frontend talks to the backend.
 *
 * **Server-only.** It runs in server components, server actions, route
 * handlers and the middleware, never in the browser: the Next server holds
 * the tokens and makes every call (CLAUDE.md §23, BFF). A client component
 * that needs data gets it as props or through a server action.
 *
 * Everything goes through here so that the base URL, the headers, the
 * timeout and above all the **shape of a failure** are decided once. A
 * service calls `api.get<UserRead>("/users/me", { token })` and either gets
 * the body typed or an `ApiError`; it never checks `res.ok`, and never has
 * to guess what a refusal looks like.
 */

type Query = Record<string, string | number | boolean | undefined | null>;

export interface RequestOptions {
  /** Appended as a query string; undefined, null and "" are dropped. */
  query?: Query;
  /** The access token, sent as `Authorization: Bearer`. */
  token?: string;
  /**
   * The browser's own `User-Agent`. The backend names a device after it in
   * the sessions list, so a login without it would be called "node".
   */
  userAgent?: string;
  /** Overrides the default, for an endpoint known to be slow. */
  timeoutMs?: number;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

/** A body and the headers it came with, for the calls that need both: a
    login's `Set-Cookie` carries the refresh token. */
export interface Exchange<T> {
  data: T;
  headers: Headers;
}

function buildUrl(path: string, query?: Query): string {
  const url = new URL(
    `${apiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`,
  );
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

/** `body.family_name` → `family_name`: the location is FastAPI's, the field
    name is what a form knows. */
function fieldName(location: string): string {
  const [first, ...rest] = location.split(".");
  return ["body", "query", "path"].includes(first ?? "") && rest.length
    ? rest.join(".")
    : location;
}

/**
 * Turns a refusal into one `ApiError`.
 *
 * The backend always answers `{"error": {code, message, details?}}`, with
 * `details` only on a 422. Anything else — an HTML page from a proxy, an
 * empty body — still becomes an error with a sentence in it, because the
 * alternative is "Unexpected token < in JSON".
 */
async function toError(response: Response): Promise<ApiError> {
  const failure: ApiFailure = {
    code: `http_${response.status}`,
    message: `The server returned ${response.status}.`,
  };

  try {
    const body: unknown = await response.json();
    const error =
      body && typeof body === "object" && "error" in body
        ? (body as { error: unknown }).error
        : undefined;
    if (error && typeof error === "object") {
      const { code, message, details } = error as {
        code?: unknown;
        message?: unknown;
        details?: unknown;
      };
      if (typeof code === "string") failure.code = code;
      if (typeof message === "string") failure.message = message;
      if (Array.isArray(details)) {
        const fields: Record<string, string> = {};
        for (const detail of details) {
          const { field, message: said } = (detail ?? {}) as {
            field?: unknown;
            message?: unknown;
          };
          if (typeof field !== "string" || typeof said !== "string") continue;
          fields[fieldName(field)] ??= said;
        }
        if (Object.keys(fields).length) failure.fields = fields;
      }
    }
  } catch {
    /* Not JSON. The status-based message above stands. */
  }

  return new ApiError(response.status, failure);
}

async function call(
  method: string,
  path: string,
  body: unknown,
  options: RequestOptions,
): Promise<Response> {
  const {
    query,
    token,
    userAgent,
    timeoutMs = serverEnv().API_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS,
    signal,
    headers = {},
  } = options;

  /* Built before the try, deliberately: an unset API_URL is a configuration
     mistake, and swallowing it into the catch below would tell somebody to
     check their connection about a missing .env. */
  const url = buildUrl(path, query);
  const origin = frontendOrigin();

  /* A request with no ceiling is a page that hangs for ever. The caller's
     own signal still aborts it; this only adds a limit. */
  const timeout = AbortSignal.timeout(timeoutMs);
  const isForm = body instanceof FormData;

  const sent: RequestInit = {
    method,
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    /* Member data is never cached by Next: the backend says `no-store` on
       every answer, and this agrees with it. */
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(body !== undefined && !isForm
        ? { "Content-Type": "application/json" }
        : {}),
      ...(origin ? { Origin: origin } : {}),
      ...(userAgent ? { "User-Agent": userAgent } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };
  if (body !== undefined) sent.body = isForm ? body : JSON.stringify(body);

  let response: Response;
  try {
    response = await fetch(url, sent);
  } catch (cause) {
    /* Never reached the server: offline, DNS, or the timeout above. Status
       0 is what tells the caller retrying may actually help. */
    const timedOut = cause instanceof Error && cause.name === "TimeoutError";
    throw new ApiError(0, {
      code: timedOut ? "timeout" : "network",
      message: timedOut
        ? "The server took too long to answer. Please try again."
        : "We could not reach the server. Please try again in a moment.",
    });
  }

  if (!response.ok) throw await toError(response);
  return response;
}

async function readBody<T>(response: Response): Promise<T> {
  /* 204, and any other answer with nothing in it. */
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError(response.status, {
      code: "bad_json",
      message: "The server's answer could not be read.",
    });
  }
}

async function request<T>(
  method: string,
  path: string,
  body: unknown,
  options: RequestOptions = {},
): Promise<T> {
  return readBody<T>(await call(method, path, body, options));
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),

  /** A POST whose answer's headers matter as well as its body: login,
      verify and refresh, whose `Set-Cookie` holds the refresh token. */
  exchange: async <T>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<Exchange<T>> => {
    const response = await call("POST", path, body, options);
    return { data: await readBody<T>(response), headers: response.headers };
  },

  /** The response itself, unread, for a body to be streamed on: the family's
      PDFs. A refusal still throws an `ApiError`. */
  stream: (path: string, options: RequestOptions = {}) =>
    call("GET", path, undefined, options),
};
