"use client";

import { BellRing } from "lucide-react";
import { MEMBER } from "@/constants/member";
import { OPEN_UPDATES_EVENT } from "@/components/layout/NotificationBell";
import { NOTIFICATIONS } from "@/lib/notifications";
import { useNow } from "@/hooks/useNow";

const TIME_ZONE = "Africa/Kigali";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** "Mwaramutse" until noon in Kigali, "Mwiriwe" after it. */
function greetingFor(hour: number): string {
  return hour >= 4 && hour < 12 ? "Mwaramutse" : "Mwiriwe";
}

/**
 * The dashboard's welcome, in Kinyarwanda and on Kigali time: "Mwaramutse"
 * in the morning, "Mwiriwe" from noon, with the local time and a pill
 * counting this week's family updates that opens the updates drawer.
 */
export function DashboardGreeting() {
  /* To the minute, so the clock and the greeting turn over on time. */
  const nowMs = useNow(60_000);
  const now = nowMs === null ? null : new Date(nowMs);

  const hour = now
    ? Number(
        new Intl.DateTimeFormat("en-GB", {
          hour: "numeric",
          hourCycle: "h23",
          timeZone: TIME_ZONE,
        }).format(now),
      )
    : null;

  const thisWeek = now
    ? NOTIFICATIONS.filter(
        (item) => now.getTime() - Date.parse(item.at) < WEEK_MS,
      ).length
    : NOTIFICATIONS.length;

  return (
    <div className="min-w-0">
      <h1 className="text-welcome-m lg:text-welcome leading-none whitespace-nowrap max-sm:text-xl">
        {hour === null ? "Muraho" : greetingFor(hour)},{" "}
        <span className="text-brand">{MEMBER.name}</span>
      </h1>

      <div className="text-caption text-muted mt-3 flex flex-wrap items-center gap-2">
        {thisWeek ? (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_UPDATES_EVENT))}
            className="bg-member-tint text-brand hover:bg-member-active/40 focus-visible:outline-brand flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors"
          >
            <span className="relative flex size-2">
              <span className="bg-brand absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping" />
              <span className="bg-brand relative size-2 rounded-full" />
            </span>
            {thisWeek} family update{thisWeek === 1 ? "" : "s"} this week
            <BellRing aria-hidden className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
