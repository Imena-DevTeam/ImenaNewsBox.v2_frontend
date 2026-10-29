"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { elder1, elder2, elder3, elder4 } from "@/lib/images";
import { WishDialog, type WishTarget } from "./WishDialog";

interface Celebrant {
  name: string;
  subfamily: "Sanctuary" | "Light" | "Wihogora" | "Hope";
  month: string;
  day: number;
  promotion: string;
  avatar: StaticImageData;
}

const CELEBRANTS: Celebrant[] = [
  {
    name: "Aganze",
    subfamily: "Wihogora",
    month: "March",
    day: 28,
    promotion: "2019–2020",
    avatar: elder4,
  },
  {
    name: "Bigwi",
    subfamily: "Light",
    month: "March",
    day: 29,
    promotion: "2018–2019",
    avatar: elder1,
  },
  {
    name: "Sheja Ngabo",
    subfamily: "Sanctuary",
    month: "April",
    day: 12,
    promotion: "2016–2017",
    avatar: elder2,
  },
  {
    name: "Kamanzi Joseph",
    subfamily: "Hope",
    month: "May",
    day: 4,
    promotion: "2020–2021",
    avatar: elder3,
  },
  {
    name: "Inyange Diane",
    subfamily: "Light",
    month: "June",
    day: 18,
    promotion: "2017–2018",
    avatar: elder1,
  },
  {
    name: "Kagabo Yves",
    subfamily: "Wihogora",
    month: "July",
    day: 22,
    promotion: "2019–2020",
    avatar: elder4,
  },
  {
    name: "Mutesi Solange",
    subfamily: "Sanctuary",
    month: "August",
    day: 9,
    promotion: "2015–2016",
    avatar: elder2,
  },
  {
    name: "Mugisha Kevin",
    subfamily: "Hope",
    month: "September",
    day: 15,
    promotion: "2021–2022",
    avatar: elder3,
  },
];

const MONTHS = [
  "All",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
];

const BRANCH_CLASSES = {
  Sanctuary: "border-sanctuary-edge bg-sanctuary-tint text-sanctuary-ink",
  Light: "border-light-edge bg-light-tint text-light-ink",
  Wihogora: "border-wihogora-edge bg-wihogora-tint text-wihogora-ink",
  Hope: "border-hope-edge bg-hope-tint text-hope-ink",
} as const;

export function FamilyCelebrationsCalendar() {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [activeWishTarget, setActiveWishTarget] = useState<WishTarget | null>(
    null,
  );

  const filtered =
    selectedMonth === "All"
      ? CELEBRANTS
      : CELEBRANTS.filter((c) => c.month === selectedMonth);

  return (
    <div className="flex flex-col gap-6">
      {/* Header and month filters */}
      <div className="border-border bg-surface shadow-subtle flex flex-col gap-4 rounded-2xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h4 text-heading font-serif font-bold">
              Annual Calendar
            </h2>
            <p className="text-muted text-xs">
              Every family celebration across the year
            </p>
          </div>
          <span className="border-border bg-surface-elevated text-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
            <Sparkles className="text-brand size-3.5" aria-hidden />
            {filtered.length} Celebrations
          </span>
        </div>

        {/* Month Pills */}
        <div
          role="tablist"
          aria-label="Filter birthdays by month"
          className="flex flex-wrap gap-2"
        >
          {MONTHS.map((month) => {
            const active = selectedMonth === month;
            return (
              <button
                key={month}
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedMonth(month)}
                className={cn(
                  "focus-visible:outline-brand min-h-[36px] rounded-full px-3.5 py-1 text-xs font-semibold transition-all",
                  active
                    ? "bg-brand text-white shadow-sm"
                    : "border-border bg-surface-elevated text-muted hover:border-brand/40 hover:text-heading border",
                )}
              >
                {month}
              </button>
            );
          })}
        </div>
      </div>

      {/* Celebrants Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((celebrant) => (
          <article
            key={`${celebrant.name}-${celebrant.day}`}
            className="border-border bg-surface shadow-subtle hover:border-brand/40 flex flex-col justify-between gap-4 rounded-2xl border p-5 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full border">
                <Image
                  src={celebrant.avatar}
                  alt={celebrant.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-heading font-serif text-base font-bold">
                    {celebrant.name}
                  </h3>
                  <span className="text-brand font-serif text-xs font-semibold">
                    {celebrant.month} {celebrant.day}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                      BRANCH_CLASSES[celebrant.subfamily],
                    )}
                  >
                    {celebrant.subfamily}
                  </span>
                  <span className="text-muted text-xs">
                    {celebrant.promotion}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setActiveWishTarget({
                  name: celebrant.name,
                  subfamily: celebrant.subfamily,
                })
              }
              className="border-border hover:bg-surface-elevated min-h-[38px] w-full text-xs font-semibold"
            >
              <Heart className="size-3.5 text-rose-500" aria-hidden />
              Send Birthday Wish
            </Button>
          </article>
        ))}
      </div>

      {/* Wish dialog when target clicked */}
      <WishDialog
        target={activeWishTarget}
        onClose={() => setActiveWishTarget(null)}
        onSent={() => {
          setActiveWishTarget(null);
        }}
      />
    </div>
  );
}
