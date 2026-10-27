"use client";

import { useMemo } from "react";
import { OPEN_UPDATES_EVENT } from "@/components/layout/NotificationBell";
import { useStoredValue } from "@/hooks/useStoredValue";
import {
  NOTIFICATIONS,
  NOTIFICATIONS_READ_KEY,
  parseRead,
} from "@/lib/notifications";

/**
 * Opens the updates drawer, and says how many of them this member has not
 * seen, from the same read record the bell keeps.
 */
export function FooterUpdates({ className }: { className?: string }) {
  const [raw] = useStoredValue(NOTIFICATIONS_READ_KEY, "[]");
  const read = useMemo(() => parseRead(raw), [raw]);
  const unread = NOTIFICATIONS.filter((item) => !read.has(item.id)).length;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_UPDATES_EVENT))}
      className={className}
    >
      Family updates
      {unread > 0 ? (
        <span className="bg-brand text-surface text-caption ml-2 inline-block min-w-5 rounded-full px-1.5 py-0.5 text-center tabular-nums">
          {unread}
          <span className="sr-only"> new</span>
        </span>
      ) : null}
    </button>
  );
}
