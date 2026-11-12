import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * The line-drawn ornaments scattered across the Our Story page, drawn to the
 * design export. They carry no meaning, so each one is hidden from assistive
 * technology.
 */

type OrnamentProps = { className?: string; style?: CSSProperties };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SunOrnament({ className, style }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      style={style}
      className={cn("text-story-ornament", className)}
      {...stroke}
      strokeWidth={4.4}
    >
      <circle cx="24" cy="24" r="8.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="24"
          y1="2.2"
          x2="24"
          y2="9"
          transform={`rotate(${deg} 24 24)`}
        />
      ))}
    </svg>
  );
}

/* A round, cloud-crowned tree on a short trunk standing on a base line. */
export function TreeOrnament({ className, style }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 60 64"
      aria-hidden
      style={style}
      className={cn("text-story-ornament", className)}
      {...stroke}
      strokeWidth={5}
    >
      <path d="M21 37a9.5 9.5 0 0 1-4-18 12 12 0 0 1 23-4.5 9.5 9.5 0 0 1 6 17A8.5 8.5 0 0 1 39 37Z" />
      <path d="M30 37v19M17 57h26" />
    </svg>
  );
}

/* An outlined house whose door is an arch cut up into the base. */
export function HouseOrnament({ className, style }: OrnamentProps) {
  return (
    <svg
      viewBox="2 2 56 56"
      aria-hidden
      style={style}
      className={cn("text-story-ornament", className)}
      {...stroke}
      strokeWidth={7.5}
    >
      <path d="M10 27 30 10l20 17v23H38v-9a8 8 0 0 0-16 0v9H10V27Z" />
    </svg>
  );
}

/* A plump heart centred on (cx, cy), about 2s across and 1.9s tall. */
function heart(cx: number, cy: number, s: number) {
  const p = (x: number, y: number) => `${cx + x * s} ${cy + y * s}`;
  return `M${p(0, 0.95)}C${p(-1.2, 0.2)} ${p(-1.05, -0.95)} ${p(-0.5, -0.95)}C${p(-0.2, -0.95)} ${p(0, -0.7)} ${p(0, -0.5)}C${p(0, -0.7)} ${p(0.2, -0.95)} ${p(0.5, -0.95)}C${p(1.05, -0.95)} ${p(1.2, 0.2)} ${p(0, 0.95)}Z`;
}

/* Two outlined hearts, the front one lower right and filled with the page
   colour so it covers the line of the one behind. */
export function HeartsOrnament({ className, style }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 112 96"
      aria-hidden
      style={style}
      className={cn("text-story-ornament", className)}
      {...stroke}
      strokeWidth={7}
    >
      <path d={heart(38, 39, 34)} transform="rotate(-14 38 39)" />
      <path
        d={heart(74, 57, 34)}
        transform="rotate(12 74 57)"
        className="fill-background"
      />
    </svg>
  );
}

/* A four-pointed star with a smaller star and a dot beside it, the glints
   at either end of the OUR STORY rule. */
export function SparkleOrnament({ className, style }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      style={style}
      className={cn("text-heading", className)}
    >
      <path
        d="M9 5c.7 5.3 2.5 7.2 8 8-5.5.8-7.3 2.7-8 8-.7-5.3-2.5-7.2-8-8 5.5-.8 7.3-2.7 8-8Z"
        fill="currentColor"
      />
      <path
        d="M19.5 14.5c.35 2.3 1.1 3.1 3.5 3.5-2.4.4-3.15 1.2-3.5 3.5-.35-2.3-1.1-3.1-3.5-3.5 2.4-.4 3.15-1.2 3.5-3.5Z"
        fill="currentColor"
      />
      <circle cx="19.5" cy="6.5" r="1.8" fill="currentColor" />
    </svg>
  );
}
