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
 * - LIGHT: Pink background bg-pink-100 text-pink-700
 * - WIHOGORA: Golden/amber badge bg-amber-100 text-amber-800
 * - SANCTUARY: Emerald badge bg-emerald-100 text-emerald-800
 * - HOPE: Sky blue badge bg-sky-100 text-sky-800
 */
export function SubfamilyBadge({
  subfamily,
  className,
  size = "sm",
  uppercase = true,
}: SubfamilyBadgeProps) {
  const norm = subfamily.toUpperCase();

  let style = "bg-purple-100 text-purple-700 border-purple-200/60";
  if (norm.includes("LIGHT")) {
    style = "bg-pink-100 text-pink-700 border-pink-200/60";
  } else if (norm.includes("WIHOGORA")) {
    style = "bg-amber-100 text-amber-800 border-amber-200/60";
  } else if (norm.includes("SANCTUARY")) {
    style = "bg-emerald-100 text-emerald-800 border-emerald-200/60";
  } else if (norm.includes("HOPE")) {
    style = "bg-sky-100 text-sky-800 border-sky-200/60";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-bold tracking-wider",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-0.5 text-xs",
        uppercase && "uppercase",
        style,
        className,
      )}
    >
      {subfamily}
    </span>
  );
}
