import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <AuthShell title={["Welcome back,", "Login to catch up"]}>
      <LoginForm />
    </AuthShell>
  );
}
