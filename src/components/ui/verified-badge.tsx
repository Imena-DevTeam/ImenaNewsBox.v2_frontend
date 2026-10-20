import { badgePath } from "@/lib/badge-path";
import { cn } from "@/lib/cn";

const BADGE = badgePath(100);

/** Brand rosette with a white check, like a social "verified" mark. */
export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("text-brand size-8", className)}
    >
      <path d={BADGE} fill="currentColor" />
      <path
        d="M31 51.5 44 64l25-27"
        fill="none"
        stroke="white"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
