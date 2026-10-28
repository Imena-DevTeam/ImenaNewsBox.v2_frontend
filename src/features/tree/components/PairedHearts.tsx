import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Line-drawn hearts matching the login page brand system (/images/hearts.svg),
 * drifting slowly with reduced motion support.
 */
export function PairedHearts({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "motion-safe:animate-float-slow pointer-events-none block select-none",
        className,
      )}
      style={style}
    >
      <Image
        src="/images/hearts.svg"
        alt=""
        width={48}
        height={44}
        className="opacity-70 drop-shadow-xs"
      />
    </span>
  );
}
