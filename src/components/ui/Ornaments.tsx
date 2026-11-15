import type { LucideIcon } from "lucide-react";
import {
  Camera,
  Heart,
  HouseHeart,
  PartyPopper,
  Sun,
  TreePine,
} from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The line-drawn marks beside headings and in page margins. Every one is a
 * lucide icon at the same stroke and colour, from one size scale, so the
 * marks on the story, the gallery, the blog and the sign-in pages read as one
 * set. They carry no meaning and are hidden from assistive technology.
 */

const SIZE = {
  sm: "size-10",
  md: "size-12",
  lg: "size-16",
} as const;

export type OrnamentSize = keyof typeof SIZE;

type OrnamentProps = { size?: OrnamentSize; className?: string };

function ornament(Icon: LucideIcon) {
  return function Ornament({ size = "md", className }: OrnamentProps) {
    return (
      <Icon
        aria-hidden
        strokeWidth={1.5}
        className={cn("text-ornament shrink-0", SIZE[size], className)}
      />
    );
  };
}

export const SunOrnament = ornament(Sun);
export const TreeOrnament = ornament(TreePine);
export const HouseOrnament = ornament(HouseHeart);
export const CameraOrnament = ornament(Camera);
export const PopperOrnament = ornament(PartyPopper);

/** Two hearts, one tucked behind the other: the family's own mark. */
export function HeartsOrnament({ size = "md", className }: OrnamentProps) {
  return (
    <span
      aria-hidden
      className={cn("text-ornament relative block", SIZE[size], className)}
    >
      <Heart
        strokeWidth={1.5}
        className="absolute top-0 left-0 size-3/4 -rotate-12"
      />
      <Heart
        strokeWidth={1.5}
        className="absolute right-0 bottom-0 size-2/3 rotate-6"
      />
    </span>
  );
}
