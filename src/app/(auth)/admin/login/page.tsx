import type { Metadata } from "next";
import { AdminLoginForm } from "@/features/auth/components/AdminLoginForm";
import { AuthShell } from "@/features/auth/components/AuthShell";

export const metadata: Metadata = { title: "Admin Log In" };

export default function AdminLoginPage() {
  return (
    <AuthShell title={["Dear Admin,", "Welcome back!"]}>
      <AdminLoginForm />
    </AuthShell>
  );
}
