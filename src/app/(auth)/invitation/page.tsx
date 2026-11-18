import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { InvitationFlow } from "@/features/invitations/components/InvitationFlow";

export const metadata: Metadata = {
  title: "Your invitation",
  /* Not indexed: nobody should arrive here except from their own email. */
  robots: { index: false, follow: false },
};

/**
 * The backend's invitation link, `/invitation#token=…`, for members,
 * administrators, and an administrator's new password after a reset
 * request (CLAUDE.md §23, step 3).
 *
 * The token is after the `#`, which never reaches this server, so the page
 * itself reads nothing from the request and stays prerendered. Everything
 * happens in `InvitationFlow`, in the browser, through server actions.
 * **It issues no session**: `no-session.test.ts` holds that.
 */
export default function InvitationPage() {
  return (
    <AuthShell>
      <InvitationFlow />
    </AuthShell>
  );
}
