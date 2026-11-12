/**
 * The shapes every service speaks, whatever resource it is for.
 *
 * These describe the **transport**, not the family: a page of results, a
 * failure, a sort order. The domain lives beside them in `member.ts`,
 * `post.ts` and `album.ts`.
 *
 * > [!IMPORTANT]
 * > `Paginated` and `ApiFailure` are the two shapes most likely to differ
 * > from what the backend actually returns. They are written here, once, so
 * > that matching the real contract is editing this file rather than every
 * > service. If the API wraps its payloads in `{ data, meta }`, say so here
 * > and `api-client.ts` will unwrap it in one place.
 */

/** One page of a list, and enough to ask for the next. */
export interface Paginated<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

/** What the API says when it refuses. */
export interface ApiFailure {
  /** A stable, machine-readable reason, such as `email_taken`. */
  code: string;
  /** A sentence fit to show somebody. */
  message: string;
  /** Per-field messages, for a form to place against its inputs. */
  fields?: Record<string, string>;
}

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

  /** The session is gone or was never valid: sign in again. */
  get isUnauthorized(): boolean {
    return this.status === 401;
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

/** Everything a list endpoint accepts, in one shape.
 *
 * A type alias rather than an interface on purpose: an interface has no
 * implicit index signature, so it cannot be handed to the api-client's
 * `query`, which is a Record. Every query shape below follows the same
 * rule. */
export type ListQuery = {
  page?: number;
  perPage?: number;
  search?: string;
  sort?: string;
};
