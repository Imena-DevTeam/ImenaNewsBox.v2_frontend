import Link from "next/link";
import { History } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { RelativeTime } from "@/components/ui/RelativeTime";
import type { ActivityEntry } from "../data";

/**
 * What has been done, newest first. This is the band that makes an admin
 * page trustworthy: without it nobody can see what changed last week, or
 * catch a mistake they notice late.
 *
 * `now` is passed in rather than read here, so the server and the client
 * agree on what "2 hours ago" means and the markup hydrates cleanly.
 */
export function ActivityList({
  entries,
  now,
}: {
  entries: ActivityEntry[];
  now: string;
}) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<History aria-hidden className="size-6" />}
        title="Nothing has changed yet."
        description="Once posts, albums and members are added, what happened shows here."
      />
    );
  }

  return (
    <ul className="divide-member-border divide-y">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3.5"
        >
          <p className="text-body-sm text-member-ink min-w-0 flex-1">
            <span className="font-medium">{entry.actor}</span> {entry.did}{" "}
            {entry.href ? (
              <Link
                href={entry.href}
                className="text-brand hover:text-brand-hover focus-visible:outline-brand font-medium"
              >
                {entry.subject}
              </Link>
            ) : (
              entry.subject
            )}
          </p>
          <RelativeTime
            iso={entry.at}
            now={now}
            className="text-caption text-muted shrink-0 tracking-[0.14em] uppercase"
          />
        </li>
      ))}
    </ul>
  );
}
