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
 * administrator to send the link.
 *
 * The address is on the record and is shown, never typed: a reset link sent
 * to an address supplied at reset time is a takeover with extra steps.
 */
export interface ResetRequest {
  id: string;
  memberId: string;
  fullName: string;
  /** The address already on the record, which is where the link may go. */
  email: string;
  /** ISO. */
  requestedAt: string;
  /** ISO, once another administrator has sent the link. */
  sentAt?: string;
}
