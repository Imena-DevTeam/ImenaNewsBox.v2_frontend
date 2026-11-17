import type { ApiAuth } from "@/lib/api-auth";
import { api, type Exchange } from "@/lib/api-client";
import type { ListQuery, Paginated } from "@/types/api";
import type {
  AccessToken,
  CodeSent,
  GoogleLoginRequest,
  InvitationRead,
  LoginRequest,
  ResetRequestRead,
  ResetRequested,
  SessionRead,
  VerifyRequest,
} from "@/types/wire";
import { ENDPOINTS } from "./endpoints";

/**
 * Signing in, signing out, invitations and forgotten passwords.
 *
 * Server-only, like every service: the Next server makes these calls and
 * keeps what they return in httpOnly cookies (CLAUDE.md §23).
 *
 * The backend sets the refresh token as a cookie scoped to `/api/v1/auth`.
 * That cookie lands on the Next server, not the browser, so the server reads
 * it out of `Set-Cookie` (`readRefreshToken`), keeps it in a cookie of its
 * own, and hands it back as a `Cookie` header on refresh and logout.
 */

/** The backend's name for the refresh cookie (`auth/router.py`). */
export const REFRESH_COOKIE = "refresh_token";

/**
 * The refresh token out of an answer's `Set-Cookie`, if it set one.
 *
 * A cookie being cleared is not a token: Starlette clears one as
 * `refresh_token=""; Max-Age=0`, quotes and all.
 */
export function readRefreshToken(headers: Headers): string | undefined {
  for (const cookie of headers.getSetCookie()) {
    const [pair = "", ...attributes] = cookie.split(";");
    const [name, ...value] = pair.split("=");
    if (name?.trim() !== REFRESH_COOKIE) continue;

    const cleared = attributes.some((attribute) =>
      /^\s*max-age\s*=\s*0\s*$/i.test(attribute),
    );
    const token = value
      .join("=")
      .trim()
      .replace(/^"(.*)"$/, "$1");
    return cleared || !token ? undefined : token;
  }
  return undefined;
}

const withRefresh = (refreshToken: string) => ({
  Cookie: `${REFRESH_COOKIE}=${refreshToken}`,
});

export type SessionQuery = ListQuery & { user_id?: string };

export const authService = {
  /** Step one on a new device. The same answer whether or not the family
      name exists; administrators also send their password. */
  login: (body: LoginRequest, auth: ApiAuth = {}) =>
    api.post<CodeSent>(ENDPOINTS.auth.login, body, auth),

  /** Step two: the emailed code. The answer's `Set-Cookie` holds the
      refresh token. */
  verify: (
    body: VerifyRequest,
    auth: ApiAuth = {},
  ): Promise<Exchange<AccessToken>> =>
    api.exchange<AccessToken>(ENDPOINTS.auth.verify, body, auth),

  google: (body: GoogleLoginRequest, auth: ApiAuth = {}) =>
    api.exchange<AccessToken>(ENDPOINTS.auth.google, body, auth),

  /** A new access token. The refresh token rotates: keep the one in the
      answer's `Set-Cookie`, because the old one is spent. */
  refresh: (refreshToken: string, auth: ApiAuth = {}) =>
    api.exchange<AccessToken>(ENDPOINTS.auth.refresh, undefined, {
      ...auth,
      headers: withRefresh(refreshToken),
    }),

  /** Ends this device's session. Always succeeds. */
  logout: (refreshToken: string | undefined, auth: ApiAuth = {}) =>
    api.post<void>(ENDPOINTS.auth.logout, undefined, {
      ...auth,
      headers: refreshToken ? withRefresh(refreshToken) : undefined,
    }),

  sessions: (query: SessionQuery, auth: ApiAuth) =>
    api.get<Paginated<SessionRead>>(ENDPOINTS.auth.sessions, {
      ...auth,
      query,
    }),

  revokeSession: (sessionId: string, auth: ApiAuth) =>
    api.delete<void>(ENDPOINTS.auth.session(sessionId), auth),

  /** Who an invitation link is for. The link's token is the credential, so
      no session is needed or sent. */
  checkInvitation: (token: string) =>
    api.post<InvitationRead>(ENDPOINTS.auth.invitationCheck, { token }),

  /** Accepting confirms the address; administrators set their password with
      it. It does not sign anybody in. */
  acceptInvitation: (token: string, password?: string) =>
    api.post<void>(ENDPOINTS.auth.invitationAccept, {
      token,
      ...(password === undefined ? {} : { password }),
    }),

  /** "I cannot get in." No login, and the same answer for every name. */
  requestPasswordReset: (familyName: string) =>
    api.post<ResetRequested>(ENDPOINTS.auth.resetRequests, {
      family_name: familyName,
    }),

  /** Other administrators' open requests. Administrators only. */
  resetRequests: (auth: ApiAuth) =>
    api.get<ResetRequestRead[]>(ENDPOINTS.auth.resetRequests, auth),

  /** Sends the requester a password link, to the address on their account. */
  approveReset: (requestId: string, auth: ApiAuth) =>
    api.post<void>(ENDPOINTS.auth.approveReset(requestId), undefined, auth),

  /** Closes a request and sends nothing. */
  declineReset: (requestId: string, auth: ApiAuth) =>
    api.post<void>(ENDPOINTS.auth.declineReset(requestId), undefined, auth),
};
