import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { VerifyForm } from "@/features/auth/components/verify-form";

export const metadata: Metadata = { title: "Verify Your Account" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main className="h-dvh overflow-hidden bg-white px-6 pt-[clamp(24px,7dvh,61px)]">
      <div className="mx-auto w-full max-w-[490px]">
        {/* 36px hit target around the 14px arrow, offset so the arrow keeps
            its design position. */}
        <Link
          href="/login"
          aria-label="Back to log in"
          className="group focus-visible:ring-brand -my-[11px] -ml-[5px] inline-flex size-9 items-center justify-center rounded-full border border-transparent transition-colors duration-300 ease-out hover:border-black hover:bg-black focus-visible:ring-2 focus-visible:outline-none"
        >
          <Image
            src="/icons/arrow-left.svg"
            alt=""
            width={14}
            height={14}
            className="transition-[filter] duration-300 ease-out group-hover:invert"
          />
        </Link>

        <div className="mt-[clamp(32px,10dvh,92px)]">
          <VerifyForm email={email} />
        </div>
      </div>
    </main>
  );
}
