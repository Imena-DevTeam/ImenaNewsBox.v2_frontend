import { MEMBER, SECOND_ADMINISTRATOR } from "@/constants/member";
import type { InvitationDetails } from "@/types/invitation";

/**
 * Fixture mode's invitations (no `API_URL`, never in production; see
 * lib/auth-mode.ts), so the `/invitation` page can be worked on and the
 * Playwright suite run without a backend.
 *
 * Two links answer: `/invitation#token=member-demo` and
 * `/invitation#token=admin-demo`. Any other token is refused, the way the
 * backend refuses a wrong, used or expired one. Accepting stores nothing,
 * and the page issues no session in any mode.
 */
export const SAMPLE_TOKENS = {
  member: "member-demo",
  admin: "admin-demo",
} as const;

export function fixtureInvitation(token: string): InvitationDetails | null {
  if (token === SAMPLE_TOKENS.member) {
    return {
      familyName: MEMBER.name,
      displayName: MEMBER.name,
      needsPassword: false,
    };
  }
  if (token === SAMPLE_TOKENS.admin) {
    return {
      familyName: SECOND_ADMINISTRATOR.name,
      displayName: SECOND_ADMINISTRATOR.name,
      needsPassword: true,
    };
  }
  return null;
}
