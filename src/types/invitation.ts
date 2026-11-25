/**
 * Who an invitation link is for, as the backend answered
 * `POST /auth/invitations/check`. Read from the backend, never from the
 * token: the token is opaque and is sent on as it arrived.
 */
export interface InvitationDetails {
  /** What they log in with, so the login can start with it filled in. */
  familyName: string;
  displayName: string;
  /** True for an administrator, who chooses a password with the link. */
  needsPassword: boolean;
}

/**
 * One administrator's request for a new password, waiting for another
 * administrator to answer it (`GET /auth/reset-requests`).
 *
 * The address is the one on their account, and it is shown, never typed:
 * the link can only go there, so the administrator who sends it never sees
 * it, and cannot take the account over.
 */
export interface ResetRequest {
  id: string;
  userId: string;
  familyName: string;
  displayName: string;
  /** Where the link will go: the address already on the account. */
  email: string;
  /** ISO. */
  requestedAt: string;
}
