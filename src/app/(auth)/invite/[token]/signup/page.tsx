import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { readInvitation } from "@/features/invitations/data";
import { AdminSignupForm } from "@/features/invitations/components/AdminSignupForm";
import { InviteRefused } from "@/features/invitations/components/InviteRefused";

export const metadata: Metadata = {
  title: "Set your password",
  robots: { index: false, follow: false },
};

/**
 * The administrators' signup, and **the only way to reach it is a link**.
 *
 * There is no route to this page from anywhere in the site, and the token is
 * checked again here rather than trusted because the previous page looked at
 * it: a person can arrive at this URL directly, and most will — the
 * invitation page redirects them to it.
 *
 * A member's token is refused rather than accepted. The member door asks for
 * no password, so setting one for them would store a credential nothing
 * reads and imply a sign-in that does not work that way.
 */
export default async function InviteSignupPage({
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

  /* A member has nothing to set. Back to their own landing page, which tells
     them what they actually need: the name they sign in with. */
  if (checked.invitation.role !== "admin") {
    redirect(ROUTES.invite(token));
  }

  return (
    <AuthShell title={["Dear Admin,", "set your password"]}>
      <AdminSignupForm
        token={token}
        fullName={checked.invitation.fullName}
        email={checked.invitation.email}
      />
    </AuthShell>
  );
}
