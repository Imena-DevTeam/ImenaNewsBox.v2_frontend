import type { CSSProperties } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Two line-drawn hearts that overlap, one amber and one lavender, drifting
 * slowly. The drift is skipped for anyone who asked for reduced motion.
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
      className={cn("motion-safe:animate-float-slow block", className)}
      style={style}
    >
      <span className="relative block size-12">
        <Heart
          className="text-celebration-gold/70 absolute top-0 left-0 size-8 fill-none"
          strokeWidth={1.6}
        />
        <Heart
          className="text-member-active absolute right-0 bottom-0 size-9 rotate-12 fill-none"
          strokeWidth={1.6}
        />
      </span>
    </span>
  );
}
