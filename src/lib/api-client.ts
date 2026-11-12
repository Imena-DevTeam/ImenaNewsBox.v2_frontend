import { ApiError, type ApiFailure } from "@/types/api";
import { DEFAULT_TIMEOUT_MS, apiBaseUrl, serverEnv } from "@/lib/env";

/**
 * The one way this frontend talks to the backend.
 *
 * Everything goes through here so that the base URL, the credentials, the
 * timeout, and above all the **shape of a failure** are decided once. A
 * service calls `api.get<Member[]>("/members")` and either gets members or
 * an `ApiError`; it never sees a `Response`, never checks `res.ok`, and
 * never has to guess what the body looks like when something went wrong.
 *
 * It runs on both sides. On the server it is called from server components
 * and server actions; in the browser it is called through TanStack Query.
 * The only difference is where the credential comes from, which is the one
 * thing below that the backend's own scheme will decide.
 *
 * > [!IMPORTANT]
 * > **Two credential mechanisms are wired up and one of them is wrong.**
 * > `credentials: "include"` suits a backend that sets its own cookie;
 * > `Authorization: Bearer` suits one that returns a token. Which it is
 * > depends on the API, and when that is known the other should be deleted
 * > rather than left as a second way in. See `withAuth` below.
 */

type Query = Record<string, string | number | boolean | undefined | null>;

export interface RequestOptions {
  /** Appended as a query string; undefined and null entries are dropped. */
  query?: Query;
  /** A bearer token, when the backend wants one. */
  token?: string;
  /** Overrides the default, for an endpoint known to be slow. */
  timeoutMs?: number;
  /** Next's fetch cache controls, for server-side calls. */
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

function buildUrl(path: string, query?: Query): string {
  const base = apiBaseUrl();
  const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

function withAuth(
  headers: Record<string, string>,
  token?: string,
): Record<string, string> {
  if (!token) return headers;
  return { ...headers, Authorization: `Bearer ${token}` };
}

/**
 * Turns anything that went wrong into one `ApiError`.
 *
 * A backend that returns `{ code, message }` is used as-is. One that returns
 * a bare string, HTML, or nothing at all still produces an error with a
 * sentence in it, because the alternative is "Unexpected token < in JSON".
 */
async function toError(response: Response): Promise<ApiError> {
  let failure: ApiFailure = {
    code: `http_${response.status}`,
    message: `The server returned ${response.status}.`,
  };

  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object") {
      const shape = body as Partial<ApiFailure> & { error?: string };
      failure = {
        code: shape.code ?? failure.code,
        message: shape.message ?? shape.error ?? failure.message,
        fields: shape.fields,
      };
    }
  } catch {
    /* Not JSON. The status-based message above stands. */
  }

  if (response.status === 401) {
    failure.message = "Your session has ended. Please sign in again.";
  }

  return new ApiError(response.status, failure);
}

async function request<T>(
  method: string,
  path: string,
  body: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const {
    query,
    token,
    timeoutMs = serverEnv().API_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS,
    cache,
    next,
    signal,
    headers = {},
  } = options;

  /* A request with no ceiling is a page that hangs for ever. The caller's
     own signal still aborts it; this only adds a limit. */
  const timeout = AbortSignal.timeout(timeoutMs);
  const abort = signal ? AbortSignal.any([signal, timeout]) : timeout;

  const isForm = body instanceof FormData;
  const sent: RequestInit = {
    method,
    signal: abort,
    /* For a backend that authenticates with its own cookie. */
    credentials: "include",
    headers: withAuth(
      {
        Accept: "application/json",
        ...(isForm
          ? {}
          : body !== undefined
            ? { "Content-Type": "application/json" }
            : {}),
        ...headers,
      },
      token,
    ),
    ...(cache ? { cache } : {}),
    ...(next ? { next } : {}),
  };

  if (body !== undefined) {
    sent.body = isForm ? body : JSON.stringify(body);
  }

  /* Built before the try, deliberately: an unset base URL is a
     configuration mistake, and swallowing it into the catch below would
     tell somebody to check their connection about a missing .env. */
  const url = buildUrl(path, query);

  let response: Response;
  try {
    response = await fetch(url, sent);
  } catch (cause) {
    /* Never reached the server: offline, DNS, CORS, or the timeout above.
       Status 0 is what tells the caller retrying may actually help. */
    const timedOut = cause instanceof Error && cause.name === "TimeoutError";
    throw new ApiError(0, {
      code: timedOut ? "timeout" : "network",
      message: timedOut
        ? "The server took too long to answer. Please try again."
        : "We could not reach the server. Check your connection and try again.",
    });
  }

  if (!response.ok) throw await toError(response);

  /* 204, and any other answer with nothing in it. */
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return undefined as T;
  }

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
};
