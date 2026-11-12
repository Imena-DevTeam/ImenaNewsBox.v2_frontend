import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * What a list says when it has nothing in it.
 *
 * Always a sentence, never a bare "No results": say what is missing and what
 * to do about it. An empty queue is often a good result, so the tone here is
 * calm rather than apologetic.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-10 text-center", className)}>
      {icon ? (
        <span className="text-muted mb-3 inline-flex justify-center">
          {icon}
        </span>
      ) : null}
      <p className="text-body text-member-ink font-medium">{title}</p>
      {description ? (
        <p className="text-body-sm text-muted mx-auto mt-1.5 max-w-sm">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
