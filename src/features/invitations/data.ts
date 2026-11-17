import type { InvitationCheck, ResetRequest } from "@/types/invitation";
import {
  administrators,
  FAMILY_REGISTER,
  SIGNED_IN_ID,
} from "@/features/members/data";

/**
 * Invitations, while there is no backend to issue them.
 *
 * Four states have to be reviewable — a member's invitation, an
 * administrator's, a link that has expired and a link already spent — and
 * with no API there is nothing to validate a token against. So the stand-in
 * reads the **shape** of the token and answers from the register.
 *
 * > [!IMPORTANT]
 * > **It answers whether or not `API_URL` is set**, until step 3 of
 * > CLAUDE.md §23 replaces these pages with `/invitation`. The backend's
 * > link is `/invitation#token=…` and its check is a POST, so these pages
 * > have nothing they could ask it.
 * >
 * > And it is not a back door: **the invitation pages issue no session.**
 * > The member's page renders a name; the administrator's form stores
 * > nothing. There is no path from a guessed token to a session, which is
 * > the only property that matters.
 *
 * TODO: delete this file in step 3.
 */

/** The tokens the stand-in recognises, for walking through the four states
    locally: /invite/member-demo, /invite/admin-demo, and so on. */
export const SAMPLE_TOKENS = {
  member: "member-demo",
  admin: "admin-demo",
  expired: "expired-demo",
  used: "used-demo",
} as const;

/** Ten days, which is the window the pages describe. */
const WINDOW_DAYS = 10;

function expiry(days = WINDOW_DAYS): string {
  const at = new Date();
  at.setUTCDate(at.getUTCDate() + days);
  return at.toISOString();
}

/**
 * What a token would mean, if there were anything to ask.
 *
 * The person it names is read from the register rather than invented, so the
 * member's landing page shows a name that exists in this fixture and the
 * **Go to login** button it offers actually works end to end.
 */
export function previewInvitation(token: string): InvitationCheck {
  if (token.startsWith("expired")) return { ok: false, reason: "expired" };
  if (token.startsWith("used")) return { ok: false, reason: "used" };

  if (token.startsWith("admin")) {
    /* An administrator who was invited rather than seeded: the second one in
       the register, because they are the one the reset flow leans on. */
    const other = administrators().find((person) => person.id !== SIGNED_IN_ID);
    if (!other) return { ok: false, reason: "unknown" };
    return {
      ok: true,
      invitation: {
        token,
        fullName: other.fullName,
        email: other.email,
        role: "admin",
        expiresAt: expiry(),
      },
    };
  }

  if (!token.startsWith("member")) return { ok: false, reason: "unknown" };

  /* Somebody who has been invited and never signed in — exactly who an
     invitation link belongs to. */
  const waiting =
    FAMILY_REGISTER.find((person) => person.status === "invited") ??
    FAMILY_REGISTER[0];
  if (!waiting) return { ok: false, reason: "unknown" };

  return {
    ok: true,
    invitation: {
      token,
      fullName: waiting.fullName,
      email: waiting.email,
      role: "member",
      expiresAt: expiry(),
    },
  };
}

/**
 * What a link is worth, by the stand-in.
 *
 * Called from a server component, so a token never reaches the browser's
 * JavaScript at all — the page renders the name and the token stays in the
 * URL where it arrived.
 */
export async function readInvitation(token: string): Promise<InvitationCheck> {
  if (!token.trim()) return { ok: false, reason: "unknown" };
  return previewInvitation(token);
}

/**
 * Administrators waiting on a new password.
 *
 * A sample, because asking for one sends an email and this frontend sends
 * none. The shape is what `GET /auth/reset-requests` returns, and the band
 * on /admin is built against it.
 *
 * TODO: the service call, once the endpoint answers.
 */
export function pendingResetRequests(): ResetRequest[] {
  const other = administrators().find((person) => person.id !== SIGNED_IN_ID);
  if (!other) return [];

  const requestedAt = new Date(Date.now() - 1000 * 60 * 95).toISOString();

  return [
    {
      id: "rr-1",
      memberId: other.id,
      fullName: other.fullName,
      email: other.email,
      requestedAt,
    },
  ];
}
