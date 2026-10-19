"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

/** Black "Continue with Google" OAuth button. */
export function GoogleButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="social" onClick={onClick} className="gap-[22px]">
      <Image src="/icons/google.svg" alt="" width={28.7} height={29.3} />
      Continue with Google
    </Button>
  );
}
