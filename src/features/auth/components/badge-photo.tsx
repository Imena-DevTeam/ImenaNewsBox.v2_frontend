import Image from "next/image";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { badgePath } from "@/lib/badge-path";

const BADGE = badgePath(1);

/**
 * The family photo as a verified-badge rosette, with a tilted brand rosette
 * behind it and a small check badge pinned to its edge.
 *
 * The rosette cut (the same shape as `badgePath`) and the dark bottom fade are
 * baked into auth-photo.png, so the file carries no other mask to leak out.
 */
export function BadgePhoto() {
  return (
    <div className="relative aspect-square w-full select-none">
      <svg
        viewBox="0 0 1 1"
        aria-hidden="true"
        className="absolute inset-0 size-full scale-[1.07] rotate-[9deg] text-white/30"
      >
        <path d={BADGE} fill="currentColor" />
      </svg>

      <Image
        src="/images/auth-photo.png"
        alt=""
        width={900}
        height={900}
        sizes="(min-width: 1024px) 40vw, 0px"
        priority
        draggable={false}
        className="relative size-full"
      />

      <VerifiedBadge className="absolute right-[9%] bottom-[9%] size-[18%] drop-shadow-[0_6px_14px_rgba(89,53,218,0.35)]" />
    </div>
  );
}
