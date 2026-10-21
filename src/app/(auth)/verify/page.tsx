import type { Metadata } from "next";
import { VerifyForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Verify your account",
  description: "Enter the one time password we sent to your email.",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="page-enter flex min-h-dvh items-center justify-center px-6 py-20">
      <VerifyForm email={email || "johndoe@gmail.com"} />
    </div>
  );
}
