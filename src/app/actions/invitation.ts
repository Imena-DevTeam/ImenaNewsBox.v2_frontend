"use server";

import { z } from "zod";
import { newPasswordSchema } from "@/features/auth/schemas";
import { fixtureInvitation } from "@/features/invitations/fixture";
import { authMode } from "@/lib/auth-mode";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/types/api";
import type { InvitationDetails } from "@/types/invitation";

/**
 * Invitation links: who one is for, and accepting it.
 *
 * > [!IMPORTANT]
 * > Both are **public endpoints**, called by somebody holding a string out
 * > of an email. The token is the only credential, so it is sent as it
 * > arrived and never read here. And neither issues a session: accepting
 * > confirms the address (and sets an administrator's password), and the
 * > person then logs in as usual. `no-session.test.ts` holds that this
 * > file never touches the session machinery.
 *
 * The backend refuses a wrong, used, replaced or expired link, or a
 * deactivated person's, with one answer (400 `invalid_invitation`), so the
 * page has one refusal to show for all of them.
 */

export type CheckOutcome =
  | { ok: true; invitation: InvitationDetails }
  | { ok: false; invalid: boolean; message: string };

export type AcceptOutcome =
  { ok: true } | { ok: false; invalid: boolean; message: string };

/* 256 random bits in the backend's encoding is 43 characters; the ceiling
   only keeps an absurd string from being forwarded. */
const tokenSchema = z.string().trim().min(1).max(512);

const INVALID = "This invitation link does not work.";
const OFF = "Invitations are not set up on this site yet.";
const UNREACHABLE = "We could not reach the server. Try again in a moment.";

const refused = (message = INVALID) =>
  ({ ok: false, invalid: true, message }) as const;

function failure(error: unknown): {
  ok: false;
  invalid: boolean;
  message: string;
} {
  if (error instanceof ApiError) {
    if (error.code === "invalid_invitation") return refused();
    /* Status 0: it never reached the backend. */
    return {
      ok: false,
      invalid: false,
      message: error.status === 0 ? UNREACHABLE : error.message,
    };
  }
  return { ok: false, invalid: false, message: UNREACHABLE };
}

/** Who the link is for, and whether they choose a password. Changes
    nothing, so opening the page (or a link scanner opening it) is safe. */
export async function checkInvitation(token: string): Promise<CheckOutcome> {
  const parsed = tokenSchema.safeParse(token);
  if (!parsed.success) return refused();

  const mode = authMode();
  if (mode === "off") return { ok: false, invalid: false, message: OFF };

  if (mode === "fixture") {
    const invitation = fixtureInvitation(parsed.data);
    return invitation ? { ok: true, invitation } : refused();
  }

  try {
    const read = await authService.checkInvitation(parsed.data);
    return {
      ok: true,
      invitation: {
        familyName: read.family_name,
        displayName: read.display_name,
        needsPassword: read.needs_password,
      },
    };
  } catch (error) {
    return failure(error);
  }
}

/**
 * Accepts the invitation. An administrator's carries the password they
 * chose; a member's carries none. Whether one is needed is the backend's
 * call (it answers 400 `password_required`), not this function's.
 */
export async function acceptInvitation(
  token: string,
  password?: string,
): Promise<AcceptOutcome> {
  const parsed = tokenSchema.safeParse(token);
  if (!parsed.success) return refused();

  if (password !== undefined) {
    const checked = newPasswordSchema.safeParse(password);
    if (!checked.success) {
      return {
        ok: false,
        invalid: false,
        message:
          checked.error.issues[0]?.message ?? "That password cannot be used.",
      };
    }
  }

  const mode = authMode();
  if (mode === "off") return { ok: false, invalid: false, message: OFF };

  if (mode === "fixture") {
    const invitation = fixtureInvitation(parsed.data);
    if (!invitation) return refused();
    if (invitation.needsPassword && password === undefined) {
      return { ok: false, invalid: false, message: "Choose a password first." };
    }
    return { ok: true };
  }

  try {
    await authService.acceptInvitation(parsed.data, password);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}
