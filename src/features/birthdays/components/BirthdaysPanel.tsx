"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Gift, Heart, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
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
 * The right-hand column of the dashboard: who celebrates today and who is
 * next. Today's card is wrapped in a gold-edged foil with a celebration
 * badge, and every wish is sent in place through the wish dialog.
 *
 * Wishes sent from this device add to the count straight away; they are
 * kept locally until the family messaging service exists, and the dialog
 * says so rather than claiming delivery.
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
        "border-member-border bg-member-tint shadow-member rounded-lg border p-6",
        className,
      )}
    >
      <p className="text-brand text-caption mb-2 font-semibold tracking-[0.16em] uppercase">
        Celebration board
      </p>
      <h2
        id="family-birthdays"
        className="text-h2-m text-member-ink md:text-h2"
      >
        Family Birthdays
      </h2>
      <p className="text-body-sm text-muted mt-3">
        Celebrating life, joy, and the growth of our brothers and sisters across
        all subfamilies.
      </p>

      <article className="from-member-night to-brand text-surface shadow-member relative mt-6 overflow-hidden rounded-lg bg-gradient-to-br p-5">
        {/* The foil: a slow sheen across the gradient, and a gold edge. */}
        <span
          aria-hidden
          className="foil-sheen pointer-events-none absolute inset-0"
        />
        <span
          aria-hidden
          className="ring-celebration-gold/40 pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset"
        />

        <div className="relative flex items-center justify-between gap-2">
          <p className="bg-celebration-gold text-member-night rounded-pill text-caption flex items-center gap-2 px-4 py-1.5 font-semibold shadow-lg">
            <PartyPopper aria-hidden className="size-4" />
            Today&rsquo;s family birthday!
          </p>
          <p className="bg-member-chip text-caption rounded-pill px-3 py-1.5 text-white">
            {TODAY.date}
          </p>
        </div>

        <div className="relative mt-5 flex items-center gap-4">
          <Image
            src={TODAY.avatar}
            alt={TODAY.avatarAlt}
            width={72}
            height={72}
            className="rounded-md object-cover"
          />
          <div>
            <p className="text-caption text-surface/70">{TODAY.nickname}</p>
            <p className="text-h4-m md:text-h4 font-semibold uppercase">
              {TODAY.name}
            </p>
            <p className="bg-surface/15 rounded-pill text-caption text-surface/85 mt-1.5 w-max px-3 py-1">
              {TODAY.subfamily} Family
            </p>
          </div>
        </div>

        <p className="text-body-sm relative mt-5 flex items-center gap-2 font-semibold">
          <Heart
            aria-hidden
            className="text-member-heart fill-member-heart size-4"
          />
          {wishes} family wishes sent
        </p>

        <Button
          variant="light"
          onClick={() =>
            setTarget({ name: TODAY.name, subfamily: TODAY.subfamily })
          }
          className="rounded-field text-body-sm relative mt-5 w-full"
        >
          <Gift aria-hidden className="text-brand size-4" />
          Send a Warm Family Wish
        </Button>
      </article>

      <h3 className="text-h4-m md:text-h4 mt-8">Upcoming Birthdays</h3>

      <ul className="mt-4 space-y-2">
        {UPCOMING.map((birthday) => (
          <li
            key={birthday.name}
            className="border-member-border bg-surface flex items-center gap-3 rounded-md border p-3"
          >
            <p className="bg-member-chip text-caption flex flex-col items-center rounded-md px-2.5 py-2 text-white">
              <span>{birthday.month}</span>
              <span className="font-semibold">{birthday.day}</span>
            </p>

            <Image
              src={birthday.avatar}
              alt={birthday.avatarAlt}
              width={48}
              height={48}
              className="rounded-pill object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="text-body-sm flex flex-wrap items-center gap-2 font-semibold">
                {birthday.name}
                <span className="text-brand text-caption rounded-pill bg-member-tint px-2 py-0.5">
                  {birthday.subfamily}
                </span>
              </p>
              <p className="text-caption text-muted mt-1">
                Child of {birthday.parent}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setTarget({
                  name: birthday.name,
                  subfamily: birthday.subfamily,
                })
              }
              aria-label={`Send a family wish for ${birthday.name}'s day`}
              className="transition-fast rounded-pill bg-member-tint text-muted hover:text-member-heart focus-visible:outline-brand inline-flex size-11 shrink-0 items-center justify-center"
            >
              <Gift aria-hidden className="size-4" />
            </button>
          </li>
        ))}
      </ul>

      <p className="text-caption text-muted mt-6 text-center">
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
