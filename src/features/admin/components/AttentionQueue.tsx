import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AttentionItem } from "../data";

/**
 * What is waiting. The band that earns this page: a queue, not a count, with
 * each row's action on the row itself.
 *
 * The card around it belongs to AdminBoard, so this renders the rows alone.
 * An empty queue is a good result, so it says so and stops rather than
 * showing a blank panel.
 */
export function AttentionQueue({
  items,
  emptyTitle = "Nothing is waiting.",
  emptyDescription,
}: {
  items: AttentionItem[];
  /* The queue is shared by the admin area and the studio, and the two have
     nothing in common to say when it is empty. */
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircle2 aria-hidden className="size-6" />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <ul className="divide-member-border divide-y">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={item.href}
            className="focus-visible:outline-brand hover:bg-member-tint transition-fast group flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3.5 motion-safe:hover:translate-x-0.5"
          >
            <span className="min-w-0 flex-1">
              <span className="text-body-sm text-member-ink block font-medium">
                {item.label}
              </span>
              <span className="text-caption text-muted mt-0.5 block">
                {item.reason}
              </span>
            </span>
            <span className="text-caption text-brand flex shrink-0 items-center gap-1 font-semibold">
              {item.action}
              <ArrowRight
                aria-hidden
                className="transition-base size-3.5 group-hover:translate-x-1"
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
