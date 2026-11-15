import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { readInvitation } from "@/features/invitations/data";
import { InviteRefused } from "@/features/invitations/components/InviteRefused";
import { InviteWelcome } from "@/features/invitations/components/InviteWelcome";

export const metadata: Metadata = {
  title: "Your invitation",
  /* Not indexed, and not described: the URL is the credential. */
  robots: { index: false, follow: false },
};

/**
 * An invitation link.
 *
 * It is public, because the person holding it has no account yet — that is
 * the whole point of it. **It grants nothing.** No session is issued here,
 * on either branch: a member is told the name they sign in with, and an
 * administrator is sent on to choose a password.
 *
 * > [!IMPORTANT]
 * > The branch is the **backend's** answer about the token, never a role
 * > read out of the URL. `readInvitation` runs on the server and the token
 * > is never parsed — §17 is the hole that taught this, and an invitation
 * > link is a better disguise for it than `/verify?role=admin` ever was.
 *
 * One link serves both kinds of person, so whoever sends the invitation
 * does not have to know which URL to paste.
 */
export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const checked = await readInvitation(token);

  if (!checked.ok) {
    return (
      <AuthShell title={["About this", "invitation"]}>
        <InviteRefused reason={checked.reason} />
      </AuthShell>
    );
  }

  /* An administrator has a password to choose first, so there is nothing for
     them on this page. The decision is made here rather than in the email,
     so one link works for everybody. */
  if (checked.invitation.role === "admin") {
    redirect(ROUTES.inviteSignup(token));
  }

  return (
    <AuthShell title={["Welcome to the", "family register"]}>
      <InviteWelcome invitation={checked.invitation} />
    </AuthShell>
  );
}
