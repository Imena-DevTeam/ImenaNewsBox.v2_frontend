import type { LucideIcon } from "lucide-react";
import { Camera, HouseHeart, PartyPopper } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The line-drawn marks beside headings and in page margins, all in
 * `text-ornament` from one size scale. The sun, the rayed sun, the tree and
 * the hearts are drawn to the design (Our Story and the family tree); the
 * rest are lucide icons at the same weight. They carry no meaning and are
 * hidden from assistive technology.
 */

const SIZE = {
  sm: "size-10",
  md: "size-12",
  lg: "size-16",
} as const;

export type OrnamentSize = keyof typeof SIZE;

type OrnamentProps = { size?: OrnamentSize; className?: string };

/* A size from the scale when asked for; otherwise the caller's className
   sizes it, and with neither it is the middle size. */
function sized(size: OrnamentSize | undefined, className?: string) {
  return cn(
    "text-ornament shrink-0",
    size ? SIZE[size] : !className && SIZE.md,
    className,
  );
}

function ornament(Icon: LucideIcon) {
  return function Ornament({ size, className }: OrnamentProps) {
    return (
      <Icon aria-hidden strokeWidth={1.5} className={sized(size, className)} />
    );
  };
}

export const HouseOrnament = ornament(HouseHeart);
export const CameraOrnament = ornament(Camera);
export const PopperOrnament = ornament(PartyPopper);

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

/* Our Story's sun: a heavy ring with short rays standing clear of it. */
export function SunOrnament({ size, className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      className={sized(size, className)}
      {...stroke}
      strokeWidth={4}
    >
      <circle cx="24" cy="24" r="9" />
      {RAYS.map((deg) => (
        <line
          key={deg}
          x1="24"
          y1="3"
          x2="24"
          y2="8"
          transform={`rotate(${deg} 24 24)`}
        />
      ))}
    </svg>
  );
}

/* The family tree's sun: a lighter line, a wider ring, and long rays that
   grow straight out of it. */
export function RayedSunOrnament({ size, className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      className={sized(size, className)}
      {...stroke}
      strokeWidth={3.6}
    >
      <circle cx="24" cy="24" r="10" />
      {RAYS.map((deg) => (
        <line
          key={deg}
          x1="24"
          y1="2.5"
          x2="24"
          y2="14"
          transform={`rotate(${deg} 24 24)`}
        />
      ))}
    </svg>
  );
}

/* A broad three-lobed canopy on a short trunk, standing on a long line. */
export function TreeOrnament({ size, className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 56 54"
      aria-hidden
      className={sized(size, className)}
      {...stroke}
      strokeWidth={4.5}
    >
      <path d="M17 35a9 9 0 0 1-3-17.5A11 11 0 0 1 35 12a12 12 0 0 1 6 23Z" />
      <path d="M29 35v13" />
      <path d="M11 49h36" strokeLinecap="butt" />
    </svg>
  );
}

/** Two hearts, one tucked behind the other: the family's own mark. */
export function HeartsOrnament({ size, className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 64 48"
      aria-hidden
      className={sized(size, className)}
      {...stroke}
      strokeWidth={4.5}
    >
      <path d="M26 42C14 33 7 27 7 19a9 9 0 0 1 16-5.6A9 9 0 0 1 39 19c0 8-7 14-13 23Z" />
      <path d="M44 34c-9-7-14-12-14-18a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 6-5 11-14 18Z" />
    </svg>
  );
}
