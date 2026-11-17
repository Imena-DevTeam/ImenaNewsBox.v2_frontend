import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set a new password",
  /* The URL is the credential, so it is kept out of search engines. */
  robots: { index: false, follow: false },
};

/**
 * The link another administrator sent.
 *
 * The token is handed to the backend when the form is submitted and never
 * checked before: a page that could tell you a token was good before you
 * used it would answer questions about other people's resets. So the form
 * renders for any token, and a bad one is refused on submit.
 */
export default function AdminResetPasswordPage() {
  return (
    <AuthShell title={["Set a new", "password"]}>
      <ResetPasswordForm />
    </AuthShell>
  );
}
