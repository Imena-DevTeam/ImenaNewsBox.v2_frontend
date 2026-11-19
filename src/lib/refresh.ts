import type { Role } from "@/lib/session";
import { authService, readRefreshToken } from "@/services/auth.service";
import { usersService } from "@/services/users.service";
import { ApiError } from "@/types/api";

/**
 * Keeping a signed-in device signed in (backend mode).
 *
 * The access token lasts fifteen minutes and the refresh token ninety days.
 * Only the middleware refreshes, and it does so **before** the access token
 * runs out (`REFRESH_AHEAD_MS`), so the request that refreshes is never the
 * one that finds itself signed out.
 *
 * > [!IMPORTANT]
 * > **Refresh tokens rotate, and reuse revokes the session.** The backend
 * > treats an old refresh token coming back later than 30 seconds as stolen
 * > and ends the session; within those 30 seconds it answers 409
 * > `refresh_conflict`. A page load sends several requests at once — the
 * > page, its prefetches, a server action — each carrying the same refresh
 * > token, so refreshing once per request would end sessions by itself.
 * >
 * > So a refresh is **shared**: requests carrying the same refresh token
 * > wait on the same call, and its result is kept for the backend's 30
 * > seconds, so one that arrives a moment late gets the same new tokens
 * > rather than spending the old one again. That holds within one server
 * > process, which is how this is deployed (one container). Across several,
 * > the 409 still arrives, and the middleware carries on with the access
 * > token it has, which is why it refreshes two minutes early.
 */
export const REFRESH_AHEAD_MS = 2 * 60 * 1000;

/** The backend's grace for a replaced refresh token (`REFRESH_GRACE`). */
const SHARED_FOR_MS = 30 * 1000;

export type Refreshed =
  | {
      ok: true;
      accessToken: string;
      expiresIn: number;
      refreshToken: string;
      /** From `GET /users/me`, so a changed role reaches the rail. Absent
          when that call failed after the refresh worked. */
      who?: { role: Role; userId: string };
    }
  /** `ended`: sign in again. `conflict`: another request refreshed first.
      `unreachable`: the backend did not answer. */
  | { ok: false; reason: "ended" | "conflict" | "unreachable" };

const shared = new Map<string, Promise<Refreshed>>();

async function attempt(
  refreshToken: string,
  userAgent: string | undefined,
): Promise<Refreshed> {
  let accessToken: string;
  let expiresIn: number;
  let rotated: string | undefined;
  try {
    const { data, headers } = await authService.refresh(refreshToken, {
      userAgent,
    });
    accessToken = data.access_token;
    expiresIn = data.expires_in;
    rotated = readRefreshToken(headers);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.code === "refresh_conflict") {
        return { ok: false, reason: "conflict" };
      }
      if (error.status === 401) return { ok: false, reason: "ended" };
    }
    return { ok: false, reason: "unreachable" };
  }
  /* The backend always rotates; an answer without the new token cannot be
     used, because the old one is spent. */
  if (!rotated) return { ok: false, reason: "ended" };

  try {
    const me = await usersService.me({ token: accessToken, userAgent });
    return {
      ok: true,
      accessToken,
      expiresIn,
      refreshToken: rotated,
      who: { role: me.role, userId: me.id },
    };
  } catch {
    return { ok: true, accessToken, expiresIn, refreshToken: rotated };
  }
}

/** A new pair of tokens for this refresh token, shared with every request
    that carries the same one. */
export function refreshSession(
  refreshToken: string,
  userAgent?: string,
): Promise<Refreshed> {
  const existing = shared.get(refreshToken);
  if (existing) return existing;

  const result = attempt(refreshToken, userAgent);
  shared.set(refreshToken, result);
  void result.then((outcome) => {
    /* A failure is not shared beyond the requests already waiting: the
       next one should get its own answer. */
    if (!outcome.ok) {
      shared.delete(refreshToken);
      return;
    }
    const timer = setTimeout(() => shared.delete(refreshToken), SHARED_FOR_MS);
    if (typeof timer === "object" && "unref" in timer) timer.unref();
  });
  return result;
}

/**
 * When an access token stops working, read from its own `exp` claim, in
 * milliseconds; null when it cannot be read. Not a check of the token —
 * the backend does that — only of when to ask for the next one.
 */
export function accessExpiresAt(token: string | undefined): number | null {
  const payload = token?.split(".")[1];
  if (!payload) return null;
  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")),
    ) as { exp?: unknown };
    return typeof claims.exp === "number" ? claims.exp * 1000 : null;
  } catch {
    return null;
  }
}

/** Whether a request carrying this access token should refresh first. */
export function shouldRefresh(
  accessToken: string | undefined,
  now: number = Date.now(),
): boolean {
  const expiresAt = accessExpiresAt(accessToken);
  return expiresAt === null || expiresAt - now < REFRESH_AHEAD_MS;
}

/** Forgets every shared refresh. For tests. */
export function forgetSharedRefreshes(): void {
  shared.clear();
}
