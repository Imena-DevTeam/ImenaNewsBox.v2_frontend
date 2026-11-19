import { cn } from "@/lib/cn";

export interface SubfamilyBadgeProps {
  subfamily: string;
  className?: string;
  size?: "sm" | "md";
  uppercase?: boolean;
}

/**
 * Standardized Subfamily Pill Badge across the entire application.
 *
 * - LIGHT: Pink background bg-member-heart text-member-heart
 * - WIHOGORA: Golden/amber badge bg-light-tint text-light-ink
 * - SANCTUARY: Emerald badge bg-window-green text-window-green
 * - HOPE: Sky blue badge bg-hope-tint text-hope-ink
 */
export function SubfamilyBadge({
  subfamily,
  className,
  size = "sm",
  uppercase = true,
}: SubfamilyBadgeProps) {
  const norm = subfamily.toUpperCase();

  let style = "bg-member-tint text-brand border-member-border/60";
  if (norm.includes("LIGHT")) {
    style = "bg-member-heart text-member-heart border-member-heart/60";
  } else if (norm.includes("WIHOGORA")) {
    style = "bg-light-tint text-light-ink border-light-ink/60";
  } else if (norm.includes("SANCTUARY")) {
    style = "bg-window-green text-window-green border-window-green/60";
  } else if (norm.includes("HOPE")) {
    style = "bg-hope-tint text-hope-ink border-hope-edge/60";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-bold tracking-wider",
        size === "sm" ? "text-caption px-2 py-0.5" : "text-caption px-3 py-0.5",
        uppercase && "uppercase",
        style,
        className,
      )}
    >
      {subfamily}
    </span>
  );
}
