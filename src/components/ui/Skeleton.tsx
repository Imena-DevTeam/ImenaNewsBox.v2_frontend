import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * One placeholder block. Give it the size and radius of the thing it
 * stands in for, so nothing moves when the real content arrives.
 */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("skeleton rounded-md", className)}
      {...props}
    />
  );
}

/** A paragraph's worth of lines; the last one stops short, as text does. */
export function SkeletonText({
  lines = 3,
  className,
  lineClassName,
}: {
  lines?: number;
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div aria-hidden className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "h-3.5 w-full",
            index === lines - 1 && lines > 1 && "w-2/3",
            lineClassName,
          )}
        />
      ))}
    </div>
  );
}

/**
 * The wrapper every loading screen uses: it tells assistive technology the
 * page is loading, once, instead of announcing each grey block.
 */
export function SkeletonPage({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={className}
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
