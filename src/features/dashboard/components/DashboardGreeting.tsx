"use client";

import { useEffect, useState } from "react";
import {
  BellRing,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { MEMBER } from "@/constants/member";
import { OPEN_UPDATES_EVENT } from "@/components/layout/NotificationBell";
import { NOTIFICATIONS } from "@/lib/notifications";
import { useNow } from "@/hooks/useNow";

const TIME_ZONE = "Africa/Kigali";

/* Kigali, for the weather badge. */
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-1.9441&longitude=30.0619&current=temperature_2m,weather_code&timezone=Africa%2FKigali";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

interface Weather {
  temperature: number;
  label: string;
  Icon: LucideIcon;
}

/* WMO weather codes, folded into the handful a badge needs. */
function describe(code: number): Pick<Weather, "label" | "Icon"> {
  if (code === 0) return { label: "Clear", Icon: Sun };
  if (code <= 2) return { label: "Partly cloudy", Icon: CloudSun };
  if (code === 3) return { label: "Cloudy", Icon: Cloud };
  if (code <= 48) return { label: "Foggy", Icon: CloudFog };
  if (code >= 95) return { label: "Storms", Icon: CloudLightning };
  return { label: "Rain", Icon: CloudRain };
}

/** "Mwaramutse" until noon in Kigali, "Mwiriwe" after it. */
function greetingFor(hour: number): string {
  return hour >= 4 && hour < 12 ? "Mwaramutse" : "Mwiriwe";
}

/**
 * The dashboard's welcome, in Kinyarwanda and on Kigali time: "Mwaramutse"
 * in the morning, "Mwiriwe" from noon, with the local time, the weather in
 * Kigali and a pill counting this week's family updates that opens the
 * updates drawer.
 *
 * The page is prerendered, so the server cannot know the hour. It renders
 * "Muraho" — plain hello, true at any time — and the time-aware greeting
 * takes over once the page is running. Weather that fails to load simply
 * leaves its badge out.
 */
export function DashboardGreeting() {
  /* To the minute, so the clock and the greeting turn over on time. */
  const nowMs = useNow(60_000);
  const now = nowMs === null ? null : new Date(nowMs);
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(WEATHER_URL, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const current = data?.current;
        if (typeof current?.temperature_2m !== "number") return;
        setWeather({
          temperature: Math.round(current.temperature_2m),
          ...describe(Number(current.weather_code)),
        });
      })
      .catch(() => {
        /* No badge rather than a broken one. */
      });
    return () => controller.abort();
  }, []);

  const hour = now
    ? Number(
        new Intl.DateTimeFormat("en-GB", {
          hour: "numeric",
          hourCycle: "h23",
          timeZone: TIME_ZONE,
        }).format(now),
      )
    : null;

  const time = now
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: TIME_ZONE,
      }).format(now)
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
        {time ? (
          <span className="border-member-border bg-surface rounded-full border px-3 py-1 tabular-nums">
            <time dateTime={now?.toISOString()}>{time}</time> · Kigali
          </span>
        ) : null}

        {weather ? (
          <span className="border-member-border bg-surface flex items-center gap-1.5 rounded-full border px-3 py-1">
            <weather.Icon aria-hidden className="text-brand size-3.5" />
            {weather.temperature}°C · {weather.label}
          </span>
        ) : null}

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
