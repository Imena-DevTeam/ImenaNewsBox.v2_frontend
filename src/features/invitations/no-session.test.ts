import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The one property this whole feature rests on: **a link grants nothing.**
 *
 * An invitation page and a reset page are public, and they are reached by
 * somebody holding a string out of an email. If one of them ever issued a
 * session, a guessed or replayed token would be a way in — and §17 is the
 * record of how expensive that mistake is when the server signs whatever it
 * is handed.
 *
 * So this reads the public pages, and the code behind the invitation
 * page, and refuses to let them grow a session. It is a crude test on purpose: it cannot be fooled by a helper
 * three files away, because it looks for the session machinery by name
 * rather than for its effect.
 */
const PUBLIC_PAGES = [
  "src/app/(auth)/invitation/page.tsx",
  "src/features/invitations/components/InvitationFlow.tsx",
  "src/app/actions/invitation.ts",
  "src/app/(auth)/admin/forgot-password/page.tsx",
  "src/features/auth/components/ForgotPasswordForm.tsx",
  "src/app/actions/reset-requests.ts",
];

/* Everything that can put a session in front of somebody, and the pending
   cookie too: holding a login in progress is half of becoming one. */
const FORBIDDEN = [
  "verifyLoginCode",
  "writeSessionCookies",
  "ACCESS_COOKIE",
  "REFRESH_COOKIE",
  "SESSION_COOKIE",
  "PENDING_COOKIE",
  "createSessionToken",
  "createPendingToken",
  "cookies(",
];

describe("the public invitation and reset pages", () => {
  for (const page of PUBLIC_PAGES) {
    it(`issues no session: ${page}`, () => {
      const source = readFileSync(page, "utf8");
      for (const forbidden of FORBIDDEN) {
        expect(source).not.toContain(forbidden);
      }
    });
  }
});
