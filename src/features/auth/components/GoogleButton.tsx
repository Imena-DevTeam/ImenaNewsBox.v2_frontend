"use client";

import Image from "next/image";
import { AuthButton } from "./AuthButton";

/** Outlined "Continue with Google" OAuth button. */
export function GoogleButton({ onClick }: { onClick?: () => void }) {
  return (
    <AuthButton variant="outline" onClick={onClick} className="gap-3">
      <Image src="/icons/google.svg" alt="" width={20} height={20} />
      Continue with Google
    </AuthButton>
  );
}
