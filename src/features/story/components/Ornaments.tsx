import { cn } from "@/lib/cn";

/**
 * The line-drawn ornaments scattered behind the Our Story page. They carry no
 * meaning, so each one is hidden from assistive technology.
 */

type OrnamentProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SunOrnament({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      className={cn("text-ornament", className)}
      {...stroke}
      strokeWidth={1.6}
    >
      <circle cx="24" cy="24" r="8" {...stroke} strokeWidth={1.6} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="24"
          y1="6"
          x2="24"
          y2="13"
          transform={`rotate(${deg} 24 24)`}
          {...stroke}
          strokeWidth={1.6}
        />
      ))}
    </svg>
  );
}

export function TreeOrnament({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 48 56"
      aria-hidden
      className={cn("text-ornament", className)}
      {...stroke}
      strokeWidth={1.6}
    >
      <path d="M24 4 10 24h28L24 4Z" />
      <path d="M24 16 6 38h36L24 16Z" />
      <path d="M14 30h8M26 30h8M12 38h24" />
      <path d="M24 38v12M18 50h12" />
    </svg>
  );
}

export function HouseHeartOrnament({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 48 56"
      aria-hidden
      className={cn("text-ornament", className)}
      {...stroke}
      strokeWidth={4}
    >
      <path d="M24 4 6 20v32h36V20L24 4Z" />
      <path
        d="M24 42c-5-4-8-7-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 32 31c0 4-3 7-8 11Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function HeartsOrnament({ className }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 64 48"
      aria-hidden
      className={cn("text-ornament", className)}
      {...stroke}
      strokeWidth={2.4}
    >
      <path d="M26 42C14 33 7 27 7 19a9 9 0 0 1 16-5.6A9 9 0 0 1 39 19c0 8-7 14-13 23Z" />
      <path d="M44 34c-9-7-14-12-14-18a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 6-5 11-14 18Z" />
    </svg>
  );
}
