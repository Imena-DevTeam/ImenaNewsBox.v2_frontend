"use client";

import { useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Heart, Sparkles } from "lucide-react";
import { elder1, elder2, elder3, elder4 } from "@/lib/images";
import { WishDialog, type WishTarget } from "./WishDialog";

interface CelebrantCard {
  id: string;
  name: string;
  subfamily: "LIGHT" | "SANCTUARY" | "WIHOGORA" | "HOPE";
  role: string;
  month: string;
  day: number;
  avatar: StaticImageData;
  offsetClass?: string;
}

const MONTHS = [
  { name: "Jan", count: 2 },
  { name: "Feb", count: 3 },
  { name: "March", count: 8 },
  { name: "April", count: 5 },
  { name: "May", count: 4 },
  { name: "June", count: 3 },
  { name: "July", count: 2 },
  { name: "August", count: 4 },
  { name: "September", count: 3 },
  { name: "October", count: 4 },
  { name: "November", count: 2 },
  { name: "December", count: 5 },
];

const CELEBRANTS: CelebrantCard[] = [
  {
    id: "m-1",
    name: "Divine Kaneza",
    subfamily: "LIGHT",
    role: "Vice-Coordinator",
    month: "MAR",
    day: 30,
    avatar: elder1,
    offsetClass: "justify-self-start sm:ml-4 md:ml-10",
  },
  {
    id: "m-2",
    name: "Divine Kaneza",
    subfamily: "LIGHT",
    role: "Vice-Coordinator",
    month: "MAR",
    day: 30,
    avatar: elder1,
    offsetClass: "justify-self-end sm:mr-4 md:mr-16",
  },
  {
    id: "m-3",
    name: "Divine Kaneza",
    subfamily: "LIGHT",
    role: "Vice-Coordinator",
    month: "MAR",
    day: 30,
    avatar: elder1,
    offsetClass: "justify-self-center",
  },
  {
    id: "m-4",
    name: "Divine Kaneza",
    subfamily: "LIGHT",
    role: "Vice-Coordinator",
    month: "MAR",
    day: 30,
    avatar: elder1,
    offsetClass: "justify-self-start sm:ml-2 md:ml-6",
  },
  {
    id: "m-5",
    name: "Divine Kaneza",
    subfamily: "LIGHT",
    role: "Vice-Coordinator",
    month: "MAR",
    day: 30,
    avatar: elder1,
    offsetClass: "justify-self-end sm:mr-8 md:mr-24",
  },
  {
    id: "m-6",
    name: "Divine Kaneza",
    subfamily: "LIGHT",
    role: "Vice-Coordinator",
    month: "MAR",
    day: 30,
    avatar: elder1,
    offsetClass: "justify-self-start sm:ml-6 md:ml-14",
  },
  {
    id: "m-7",
    name: "Divine Kaneza",
    subfamily: "LIGHT",
    role: "Vice-Coordinator",
    month: "MAR",
    day: 30,
    avatar: elder1,
    offsetClass: "justify-self-center md:translate-x-12",
  },
  {
    id: "m-8",
    name: "Divine Kaneza",
    subfamily: "LIGHT",
    role: "Vice-Coordinator",
    month: "MAR",
    day: 30,
    avatar: elder1,
    offsetClass: "justify-self-end sm:mr-6 md:mr-20",
  },
  // Other months samples
  {
    id: "a-1",
    name: "Aganze",
    subfamily: "WIHOGORA",
    role: "Family Member",
    month: "APR",
    day: 4,
    avatar: elder4,
    offsetClass: "justify-self-start sm:ml-6",
  },
  {
    id: "a-2",
    name: "Sheja Ngabo",
    subfamily: "HOPE",
    role: "Elder Coordinator",
    month: "APR",
    day: 12,
    avatar: elder3,
    offsetClass: "justify-self-end sm:mr-8",
  },
  {
    id: "a-3",
    name: "Christian M.",
    subfamily: "SANCTUARY",
    role: "Youth Liaison",
    month: "APR",
    day: 18,
    avatar: elder2,
    offsetClass: "justify-self-center",
  },
  {
    id: "a-4",
    name: "Giselle B.",
    subfamily: "LIGHT",
    role: "Historian",
    month: "APR",
    day: 24,
    avatar: elder1,
    offsetClass: "justify-self-start sm:ml-12",
  },
  {
    id: "a-5",
    name: "Kevine I.",
    subfamily: "WIHOGORA",
    role: "General Secretary",
    month: "APR",
    day: 29,
    avatar: elder4,
    offsetClass: "justify-self-end sm:mr-16",
  },
];

export function FamilyCelebrationsCalendar() {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [activeWishTarget, setActiveWishTarget] = useState<WishTarget | null>(
    null,
  );

  const activeCelebrants = useMemo(() => {
    if (selectedMonth === "March") {
      return CELEBRANTS.filter((c) => c.month === "MAR");
    }
    if (selectedMonth === "April") {
      return CELEBRANTS.filter((c) => c.month === "APR");
    }
    // Return standard March list as default preview if other month is empty
    return CELEBRANTS.filter((c) => c.month === "MAR");
  }, [selectedMonth]);

  const activeCount =
    MONTHS.find((m) => m.name === selectedMonth)?.count ??
    activeCelebrants.length;

  return (
    <div className="flex w-full flex-col">
      {/* Subtitle centered */}
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm font-normal text-neutral-600 sm:text-base">
        Celebrating life, joy and the growth of our brothers and sisters across
        all subfamilies
      </p>

      {/* Section Kicker */}
      <div className="mt-8 text-center">
        <span className="text-xs font-bold tracking-widest text-[#7C3AED] uppercase">
          CALENDAR HORIZON
        </span>
      </div>

      {/* Month Counter Bar */}
      <div className="mt-6 flex items-center justify-end">
        <p className="text-sm font-bold text-neutral-800 sm:text-base">
          {activeCount} Birthdays in {selectedMonth}
        </p>
      </div>

      {/* Month Pills Navigation */}
      <div className="mt-2 flex scrollbar-none items-center gap-2.5 overflow-x-auto pt-1 pb-3">
        {MONTHS.map((m) => {
          const isActive = selectedMonth === m.name;
          return (
            <button
              key={m.name}
              type="button"
              onClick={() => setSelectedMonth(m.name)}
              className={`shrink-0 cursor-pointer rounded-full px-5 py-2 text-xs font-semibold transition-all sm:text-sm ${
                isActive
                  ? "bg-[#4338CA] text-white shadow-md ring-2 ring-[#4338CA]/20"
                  : "bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF]"
              }`}
            >
              {isActive ? (
                <span className="flex items-center gap-2">
                  <span>{m.name}</span>
                  <span className="inline-block size-1.5 rounded-full bg-white" />
                  <span>{m.count}</span>
                </span>
              ) : m.name === "April" ? (
                `${m.name} (${m.count})`
              ) : (
                m.name
              )}
            </button>
          );
        })}
      </div>

      {/* Spotlight Card: "TODAY'S FAMILY BIRTHDAY!" */}
      <div className="mx-auto my-8 w-full max-w-xl rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
        {/* Card Top Row */}
        <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-neutral-600 uppercase">
            <Sparkles className="size-3.5 text-pink-500" />
            <span>TODAY&apos;S FAMILY BIRTHDAY!</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-neutral-100 px-3 py-0.5 text-xs font-medium text-neutral-600">
              Jan 01
            </span>
            <span className="rounded-full bg-[#E9D5FF] px-3 py-0.5 text-xs font-bold tracking-wider text-[#6B21A8] uppercase">
              LIGHT FAMILY
            </span>
          </div>
        </div>

        {/* Card Middle Row */}
        <div className="my-5 flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="size-16 overflow-hidden rounded-2xl shadow-sm sm:size-18">
              <Image
                src={elder2}
                alt="Bigwi"
                width={80}
                height={80}
                className="size-full object-cover"
              />
            </div>
            {/* Violet status dot in top-right corner */}
            <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-violet-600 ring-2 ring-white" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-extrabold text-neutral-900 sm:text-2xl">
              Bigwi
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-neutral-500 sm:text-sm">
              <span>Turned 16 today</span>
              <Sparkles className="size-3 text-pink-500" />
            </p>
          </div>
        </div>

        {/* Card Bottom Button */}
        <div>
          <button
            type="button"
            onClick={() =>
              setActiveWishTarget({
                name: "Bigwi",
                subfamily: "Light",
              })
            }
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3B2883] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#311f70]"
          >
            Send Warm Family Wish
          </button>
        </div>
      </div>

      {/* Staggered Birthday Cards Constellation */}
      <div className="relative my-4 flex flex-col gap-6">
        {activeCelebrants.map((celebrant) => (
          <div
            key={celebrant.id}
            className={`w-full max-w-xs transition-transform hover:-translate-y-0.5 ${celebrant.offsetClass ?? "justify-self-center"}`}
          >
            <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-2.5 shadow-sm sm:p-3">
              {/* Date Block */}
              <div className="flex min-w-[44px] shrink-0 flex-col items-center justify-center rounded-xl bg-neutral-100/90 px-2 py-1.5 text-center">
                <span className="text-[10px] leading-none font-bold tracking-wider text-neutral-400 uppercase">
                  {celebrant.month}
                </span>
                <span className="text-base leading-tight font-extrabold text-neutral-900">
                  {celebrant.day}
                </span>
              </div>

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="size-10 overflow-hidden rounded-xl sm:size-11">
                  <Image
                    src={celebrant.avatar}
                    alt={celebrant.name}
                    width={44}
                    height={44}
                    className="size-full object-cover"
                  />
                </div>
              </div>

              {/* Information */}
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold text-neutral-900">
                  {celebrant.name}
                </h4>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-pink-600 uppercase">
                    {celebrant.subfamily}
                  </span>
                  <span className="text-xs text-neutral-300">•</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-neutral-400">
                  {celebrant.role}
                </p>
              </div>

              {/* Heart Action Button */}
              <button
                type="button"
                onClick={() =>
                  setActiveWishTarget({
                    name: celebrant.name,
                    subfamily: celebrant.subfamily,
                  })
                }
                aria-label={`Send birthday wish to ${celebrant.name}`}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-indigo-50/70 text-indigo-500 transition-colors hover:bg-indigo-100 hover:text-indigo-600"
              >
                <Heart className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Wish Dialog Modal */}
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
