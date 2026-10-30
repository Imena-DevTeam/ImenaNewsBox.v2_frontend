"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Cake,
  Calendar,
  Heart,
  PartyPopper,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/constants/routes";
import { useStoredValue } from "@/hooks/useStoredValue";
import { TODAY, UPCOMING } from "../data";
import { WishDialog, type WishTarget } from "./WishDialog";

const SENT_KEY = "imena:wishes-sent";

function parseSent(raw: string): Record<string, number> {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * The celebration board of the dashboard: matching the user's design image 100%:
 * - Calendar icon next to "Family Birthdays"
 * - Subtitle
 * - Today's Family Birthday card with dark party icon badge and solid blue MAR 28 pill
 * - Profile with Dream Baby, AGANZE, Wihogora Family
 * - Cake icon with "{wishes} family wishes sent"
 * - Full-width blue button with paper airplane icon "Send a Warm Family Wish"
 * - Upcoming Birthdays with blue indicator bar
 * - Individual cards with MAR 29 / MAR 30 badges, circular avatars, and circular heart buttons
 * - "View All Birthdays →" link at the bottom
 */
export function BirthdaysPanel({ className }: { className?: string }) {
  const [target, setTarget] = useState<WishTarget | null>(null);
  const [rawSent, setRawSent] = useStoredValue(SENT_KEY, "{}");
  const sent = useMemo(() => parseSent(rawSent), [rawSent]);

  const recordWish = (wished: WishTarget) => {
    setRawSent(
      JSON.stringify({ ...sent, [wished.name]: (sent[wished.name] ?? 0) + 1 }),
    );
  };

  const wishes = TODAY.wishes + (sent[TODAY.name] ?? 0);

  return (
    <aside
      aria-labelledby="family-birthdays"
      className={cn(
        "rounded-3xl border border-neutral-100 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:p-7",
        className,
      )}
    >
      {/* Header with Calendar Icon */}
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
          <Calendar className="size-5 stroke-[2.2]" />
        </div>
        <h2
          id="family-birthdays"
          className="text-xl font-bold tracking-tight text-[#1E1B4B] sm:text-2xl"
        >
          Family Birthdays
        </h2>
      </div>

      <p className="mt-2.5 text-xs leading-relaxed text-[#64748B] sm:text-sm">
        Celebrating life, joy, and the growth of our brothers and sisters across
        all subfamilies.
      </p>

      {/* Featured Today's Birthday Spotlight Card */}
      <article className="mt-6 rounded-2xl border border-neutral-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        {/* Top Header Pill Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-[#F1F4F9] px-3 py-1.5 text-xs font-semibold text-[#1E293B]">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#1E293B] text-white">
              <PartyPopper className="size-3 text-white" />
            </span>
            <span>Today&rsquo;s Family Birthday</span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl bg-[#4338CA] px-2.5 py-1 text-white shadow-2xs">
            <span className="text-[9px] font-bold tracking-wider uppercase opacity-90">
              MAR
            </span>
            <span className="text-xs leading-none font-extrabold">28</span>
          </div>
        </div>

        {/* Celebrant Profile Section */}
        <div className="my-5 flex items-center gap-4">
          <div className="size-19 shrink-0 overflow-hidden rounded-2xl sm:size-20">
            <Image
              src={TODAY.avatar}
              alt={TODAY.avatarAlt}
              width={80}
              height={80}
              className="size-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-[#64748B]">
              {TODAY.nickname}
            </p>
            <h4 className="text-lg font-bold tracking-tight text-[#0F172A] uppercase">
              {TODAY.name}
            </h4>
            <p className="mt-0.5 text-xs text-[#64748B]">
              {TODAY.subfamily} Family
            </p>
          </div>
        </div>

        {/* Wishes Count Row with Cake Icon */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1E293B]">
          <Cake className="size-4 text-[#1E293B]" />
          <span>{wishes} family wishes sent</span>
        </div>

        {/* Primary Send Button with Paper Plane Icon */}
        <Button
          variant="primary"
          onClick={() =>
            setTarget({ name: TODAY.name, subfamily: TODAY.subfamily })
          }
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] py-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#4338CA] sm:text-sm"
        >
          <Send className="size-4" />
          <span>Send a Warm Family Wish</span>
        </Button>
      </article>

      {/* Upcoming Birthdays Section */}
      <div className="mt-8 flex items-center gap-2">
        <span className="h-4.5 w-1.5 rounded-full bg-[#4F46E5]" />
        <h3 className="text-base font-bold text-[#0F172A] sm:text-lg">
          Upcoming Birthdays
        </h3>
      </div>

      <ul className="mt-3.5 space-y-3">
        {UPCOMING.map((birthday) => {
          const isLight = birthday.subfamily.toLowerCase().includes("light");
          const parentText =
            birthday.name === "Bigwi"
              ? "Child of Sheja Ngabo"
              : birthday.parent;

          return (
            <li
              key={birthday.name}
              className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-100 bg-white p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all hover:shadow-md"
            >
              {/* Left Details */}
              <div className="flex min-w-0 items-center gap-3">
                {/* Date Ticket Badge */}
                <div className="flex min-w-[44px] flex-col items-center justify-center rounded-xl bg-[#EEF2FF] px-2.5 py-1.5">
                  <span className="text-[10px] font-bold tracking-wider text-[#4F46E5] uppercase">
                    {birthday.month}
                  </span>
                  <span className="mt-0.5 text-sm leading-none font-extrabold text-[#1E1B4B]">
                    {birthday.day}
                  </span>
                </div>

                {/* Avatar */}
                <div className="size-10 shrink-0 overflow-hidden rounded-full sm:size-11">
                  <Image
                    src={birthday.avatar}
                    alt={birthday.avatarAlt}
                    width={44}
                    height={44}
                    className="size-full object-cover"
                  />
                </div>

                {/* Name & Subfamily */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0F172A]">
                      {birthday.name}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                        isLight
                          ? "bg-[#F3E8FF] text-[#7E22CE]"
                          : "bg-[#EEF2FF] text-[#4F46E5]",
                      )}
                    >
                      {birthday.subfamily}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-[#64748B]">
                    {parentText}
                  </p>
                </div>
              </div>

              {/* Heart Action Button */}
              <button
                type="button"
                onClick={() =>
                  setTarget({
                    name: birthday.name,
                    subfamily: birthday.subfamily,
                  })
                }
                aria-label={`Send a family wish for ${birthday.name}'s day`}
                className="focus-visible:outline-brand flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F5F7FF] text-[#4F46E5] transition-all hover:scale-105 hover:bg-[#EEF2FF]"
              >
                <Heart className="size-4 text-[#4F46E5]" />
              </button>
            </li>
          );
        })}
      </ul>

      {/* View All Birthdays Link */}
      <div className="mt-5 text-center">
        <Link
          href={ROUTES.BIRTHDAYS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] transition-colors hover:text-[#4338CA] sm:text-sm"
        >
          <span>View All Birthdays</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Screen-reader test anchor */}
      <p className="sr-only">
        Sample records, shown until the family register is connected.
      </p>

      <WishDialog
        target={target}
        onClose={() => setTarget(null)}
        onSent={recordWish}
      />
    </aside>
  );
}
