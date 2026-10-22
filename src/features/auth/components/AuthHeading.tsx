import { cn } from "@/lib/cn";

/**
 * Big display heading for the verify step. Each entry in `lines` sits on its
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
        "font-auth-display text-auth-display text-text page-enter",
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
