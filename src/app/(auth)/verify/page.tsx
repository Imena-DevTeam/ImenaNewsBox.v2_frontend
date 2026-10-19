import type { Metadata } from "next";
import { VerifyForm } from "@/features/auth/components/verify-form";

export const metadata: Metadata = { title: "Verify Your Account" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-6 py-12">
      <VerifyForm email={email} />
    </main>
  );
}
