import type { Role } from "@/lib/session";

/**
 * An invitation, and a password reset, as the API answers for them.
 *
 * Both are the same idea: a signed, single-use token sent to an address the
 * backend already holds, which buys the holder exactly one action. The
 * frontend hands the token over and renders the answer.
 *
 * > [!CAUTION]
 * > **Nothing in here is decoded in the browser.** The role on an
 * > `Invitation` is what the backend said when it was asked about the
 * > token, never something read out of the URL. A role a caller supplies is
 * > a role the caller chose — §17 of CLAUDE.md is the hole that cost.
 */

/** Why a token is no good, so the page can say which it is. */
export type TokenRefusal = "expired" | "used" | "unknown";

/** A live invitation: who it is for, and what it makes them. */
export interface Invitation {
  /** Opaque. Carried in the URL, never parsed. */
  token: string;
  fullName: string;
  /** Where it was sent, shown back so they know which inbox to check. */
  email: string;
  role: Role;
  /** ISO. Past it, the backend refuses the token. */
  expiresAt: string;
}

/**
 * What a token lookup returns.
 *
 * A refusal is a result, not an error: an expired invitation is the normal
 * end of an invitation's life, and the page it lands on has something to
 * say about it.
 */
export type InvitationCheck =
  { ok: true; invitation: Invitation } | { ok: false; reason: TokenRefusal };

/** What `POST /invitations` is given. */
export interface InvitationInput {
  fullName: string;
  email: string;
  branch: string;
  bornOn: string;
  role: Role;
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
