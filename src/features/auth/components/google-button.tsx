"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

/** Outlined "Continue with Google" OAuth button. */
export function GoogleButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="outline" onClick={onClick} className="gap-3">
      <Image src="/icons/google.svg" alt="" width={20} height={20} />
      Continue with Google
    </Button>
  );
}
