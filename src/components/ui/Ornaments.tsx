import { cn } from "@/lib/cn";

/**
 * The line-drawn ornaments scattered behind Our Story and the family tree. They carry no
 * meaning, so each one is hidden from assistive technology.
 */

type OrnamentProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

/* Our Story's sun: a heavy ring with short rays standing clear of it. */
export function SunOrnament({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      className={cn("text-ornament", className)}
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
export function RayedSunOrnament({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      className={cn("text-ornament", className)}
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
export function TreeOrnament({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 56 54"
      aria-hidden
      className={cn("text-ornament", className)}
      {...stroke}
      strokeWidth={4.5}
    >
      <path d="M17 35a9 9 0 0 1-3-17.5A11 11 0 0 1 35 12a12 12 0 0 1 6 23Z" />
      <path d="M29 35v13" />
      <path d="M11 49h36" strokeLinecap="butt" />
    </svg>
  );
}
