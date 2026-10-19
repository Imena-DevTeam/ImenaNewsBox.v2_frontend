"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

/** Black "Continue with Google" OAuth button. */
export function GoogleButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="social" onClick={onClick}>
      <Image src="/icons/google.svg" alt="" width={30} height={30} />
      Continue with Google
    </Button>
  );
}
