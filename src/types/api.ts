/**
 * The shapes every service speaks, whatever resource it is for.
 *
 * These describe the **transport**, not the family: a page of results and a
 * failure. The backend's resources are in `wire.ts`, generated from its
 * OpenAPI schema; the frontend's own shapes live beside this file.
 */

/**
 * One page of a list, exactly as the backend sends it (`core/pagination.py`
 * `Page[T]`). `page` starts at 1, and `limit` is at most 100.
 */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/** How many pages a list has, for a pager. Never less than one. */
export function pageCount(page: Pick<Paginated<unknown>, "total" | "limit">) {
  return Math.max(1, Math.ceil(page.total / page.limit));
}

/** Every list endpoint takes these, and some add filters of their own. */
export type ListQuery = {
  page?: number;
  limit?: number;
};

/** What the API says when it refuses. */
export interface ApiFailure {
  /** A stable, machine-readable reason, such as `email_taken`. */
  code: string;
  /** A sentence fit to show somebody. */
  message: string;
  /** Per-field messages, keyed by field name, for a form to place. */
  fields?: Record<string, string>;
}

/** The 401 codes that mean the session itself is over, as opposed to a
    wrong code or password on the way in. */
const SESSION_OVER = new Set([
  "not_authenticated",
  "session_ended",
  "token_expired",
  "invalid_token",
]);

/**
 * A failed request, as an Error so it can be thrown and caught, carrying
 * enough to decide what to do about it.
 *
 * `status` is 0 for a request that never reached the server — offline, DNS,
 * a timeout — which is a different problem from a 400 and reads differently
 * to the person waiting.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: Record<string, string>;

  constructor(status: number, failure: ApiFailure) {
    super(failure.message);
    this.name = "ApiError";
    this.status = status;
    this.code = failure.code;
    this.fields = failure.fields;
  }

  /** Nothing reached the server, so trying again may genuinely help. */
  get isOffline(): boolean {
    return this.status === 0;
  }

  /**
   * The session is gone or was never valid: sign in again.
   *
   * Not every 401 means that. A wrong login code (`invalid_code`) or a wrong
   * administrator password (`invalid_credentials`) is a 401 too, and telling
   * somebody who mistyped a digit that their session has ended would be
   * wrong.
   */
  get isSessionOver(): boolean {
    return this.status === 401 && SESSION_OVER.has(this.code);
  }

  /** Signed in, and still not allowed. Signing in again will not help. */
  get isForbidden(): boolean {
    return this.status === 403;
  }

  /** The request was refused on its contents, so a form can show why. */
  get isValidation(): boolean {
    return this.status === 422 || this.status === 400;
  }
}
