import { PartyPopper } from "lucide-react";

/**
 * Two faint party poppers in the empty margin beside the story. Only from
 * wide screens up, where the margins exist, so they can never sit on the
 * words or add a scrollbar.
 */
export function CelebrationOrnaments() {
  return (
    <div aria-hidden className="pointer-events-none hidden xl:block">
      <PartyPopper
        className="text-gallery-ornament absolute top-[34%] right-6 size-28 rotate-12"
        strokeWidth={1.2}
      />
      <PartyPopper
        className="text-gallery-ornament absolute top-[62%] right-16 size-20 scale-x-[-1] -rotate-12"
        strokeWidth={1.2}
      />
    </div>
  );
}
