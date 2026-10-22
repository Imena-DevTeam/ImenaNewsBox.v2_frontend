"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VerifyForm } from "@/features/auth/components/VerifyForm";
import { ROUTES } from "@/constants/routes";

/**
 * Reads the address and the role out of the query string.
 *
 * Done here rather than on the page so the page itself touches nothing from
 * the request and can be prerendered: it was the one route still rendered per
 * visit. VerifyForm is a client component already, so this moves nothing
 * extra across the boundary.
 */
export function VerifyPanel() {
  const params = useSearchParams();
  const email = params.get("email") ?? undefined;

  /* Back goes to whichever login sent you here. */
  const back =
    params.get("role") === "admin" ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN;

  return (
    <>
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
    </>
  );
}
