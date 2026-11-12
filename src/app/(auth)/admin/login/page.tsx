import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/features/auth/components/AdminLoginForm";
import { AuthShell } from "@/features/auth/components/AuthShell";

export const metadata: Metadata = { title: "Admin Log In" };

/**
 * The page reads nothing from the request, so it stays prerendered. The form
 * reads ?next= — where the administrator was headed before the gate stopped
 * them — behind the Suspense boundary a client-side read of it requires.
 */
export default function AdminLoginPage() {
  return (
    <AuthShell title={["Dear Admin,", "Welcome back!"]}>
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </AuthShell>
  );
}
