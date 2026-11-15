import { PopperOrnament } from "@/components/ui/Ornaments";

/**
 * Two poppers in the empty margin beside the story, from wide screens up,
 * where the margin exists, so they can never sit on the words.
 */
export function CelebrationOrnaments() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-1/3 right-8 hidden flex-col gap-24 xl:flex"
    >
      <PopperOrnament size="lg" />
      <PopperOrnament size="lg" className="-scale-x-100" />
    </div>
  );
}
