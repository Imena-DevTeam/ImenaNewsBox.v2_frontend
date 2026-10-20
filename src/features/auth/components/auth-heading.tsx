import { cn } from "@/lib/cn";

/**
 * Big display heading for the auth pages. Each entry in `lines` sits on its
 * own line, and the last one is picked out in the brand colour.
 */
export function AuthHeading({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "font-display motion-safe:animate-rise text-[clamp(32px,min(5.8dvh,9vw),50px)] leading-[1.02] font-extrabold tracking-[-0.035em] text-black",
        className,
      )}
    >
      {lines.map((line, index) => (
        <span
          key={line}
          className={cn("block", index === lines.length - 1 && "text-brand")}
        >
          {line}
        </span>
      ))}
    </h1>
  );
}
