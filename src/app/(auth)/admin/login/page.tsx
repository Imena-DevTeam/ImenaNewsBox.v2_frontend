import type { Metadata } from "next";
import { AdminLoginForm } from "@/features/auth/components/admin-login-form";
import { AuthShell } from "@/features/auth/components/auth-shell";

export const metadata: Metadata = { title: "Admin Log In" };

export default function AdminLoginPage() {
  return (
    <AuthShell>
      <AdminLoginForm />
    </AuthShell>
  );
}
