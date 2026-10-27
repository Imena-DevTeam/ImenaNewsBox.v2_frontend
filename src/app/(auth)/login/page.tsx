import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Log In" };

/**
 * The page reads nothing from the request, so it stays prerendered. The
 * form reads ?next= — where the member was headed before the gate stopped
 * them — behind the Suspense boundary a client-side read of it requires.
 */
export default function LoginPage() {
  return (
    <AuthShell title={["Welcome back,", "Login to catch up"]}>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
