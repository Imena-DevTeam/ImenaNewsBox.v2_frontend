import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <AuthShell title={["Welcome back,", "Login to catch up"]}>
      <LoginForm />
    </AuthShell>
  );
}
