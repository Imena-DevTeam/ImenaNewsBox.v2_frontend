import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot password" };

/**
 * An administrator who cannot get in.
 *
 * It is under /admin and it is **public**, which is the point: the people
 * who need it are exactly the ones the gate would turn away. That exemption
 * is `ADMIN_PUBLIC_PATHS` in lib/session.ts, and it is an exact path rather
 * than a prefix, so nothing else under this name is let through.
 *
 * The page reads nothing from the request, so it stays prerendered.
 */
export default function AdminForgotPasswordPage() {
  return (
    <AuthShell title={["Lost your", "password?"]}>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
