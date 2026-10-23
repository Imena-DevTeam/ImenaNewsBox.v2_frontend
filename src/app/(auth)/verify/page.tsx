import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { VerifyForm } from "@/features/auth/components/VerifyForm";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = { title: "Verify Your Account" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; role?: string }>;
}) {
  const { email, role } = await searchParams;
  /* Back goes to whichever login sent you here. */
  const back = role === "admin" ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN;

  return (
    <main className="py-auth-lg flex min-h-dvh flex-col px-6">
      <div className="max-w-auth-verify mx-auto flex w-full flex-1 flex-col">
        {/* 36px hit target around the 14px arrow, offset so the arrow keeps
            its design position. */}
        <Link
          href={back}
          aria-label="Back to log in"
          className="group transition-base -my-2.75 -ml-1.25 inline-flex size-9 items-center justify-center self-start rounded-full border border-transparent hover:border-black hover:bg-black"
        >
          <Image
            src="/icons/arrow-left.svg"
            alt=""
            width={14}
            height={14}
            className="transition-base group-hover:invert"
          />
        </Link>

        <div className="pb-auth-lg flex flex-1 items-center">
          <VerifyForm email={email} />
        </div>
      </div>
    </main>
  );
}
