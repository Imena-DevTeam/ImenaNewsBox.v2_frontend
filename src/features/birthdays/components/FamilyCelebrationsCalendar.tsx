"use client";

import { useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Cake, Check, Heart, Send, Sparkles, X } from "lucide-react";
import { elder1, elder2, elder3, elder4 } from "@/lib/images";
import { SubfamilyBadge } from "@/components/ui/SubfamilyBadge";
import { Reveal } from "@/components/motion/Reveal";
import { useStoredValue } from "@/hooks/useStoredValue";
import { WishDialog, type WishTarget } from "./WishDialog";

interface CelebrantCard {
  id: string;
  name: string;
  subfamily: "LIGHT" | "SANCTUARY" | "WIHOGORA" | "HOPE";
  role: string;
  month: string;
  day: number;
  avatar: StaticImageData;
}

const MONTHS = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const OFFSETS = [
  "justify-self-start sm:ml-4 md:ml-10",
  "justify-self-end sm:mr-4 md:mr-16",
  "justify-self-center",
  "justify-self-start sm:ml-2 md:ml-6",
  "justify-self-end sm:mr-8 md:mr-24",
  "justify-self-start sm:ml-6 md:ml-14",
  "justify-self-center md:translate-x-12",
  "justify-self-end sm:mr-6 md:mr-20",
];

const monthKey = (name: string) => name.slice(0, 3).toUpperCase();

const CELEBRANTS: CelebrantCard[] = [
  {
    id: "m-1",
    name: "Divine Kaneza",
    subfamily: "LIGHT",
    role: "Vice-Coordinator",
    month: "MAR",
    day: 3,
    avatar: elder1,
  },
  {
    id: "m-2",
    name: "Sheja Ngabo",
    subfamily: "HOPE",
    role: "Elder Coordinator",
    month: "MAR",
    day: 8,
    avatar: elder3,
  },
  {
    id: "m-3",
    name: "Christian M.",
    subfamily: "SANCTUARY",
    role: "Youth Liaison",
    month: "MAR",
    day: 12,
    avatar: elder2,
  },
  {
    id: "m-4",
    name: "Kevine I.",
    subfamily: "WIHOGORA",
    role: "General Secretary",
    month: "MAR",
    day: 16,
    avatar: elder4,
  },
  {
    id: "m-5",
    name: "Aganze",
    subfamily: "WIHOGORA",
    role: "Family Member",
    month: "MAR",
    day: 21,
    avatar: elder3,
  },
  {
    id: "m-6",
    name: "Giselle B.",
    subfamily: "LIGHT",
    role: "Historian",
    month: "MAR",
    day: 25,
    avatar: elder1,
  },
  {
    id: "m-7",
    name: "Bigwi",
    subfamily: "LIGHT",
    role: "Youth Member",
    month: "MAR",
    day: 28,
    avatar: elder2,
  },
  {
    id: "m-8",
    name: "Pacifique M.",
    subfamily: "SANCTUARY",
    role: "Cultural Guide",
    month: "MAR",
    day: 30,
    avatar: elder4,
  },
  // April celebrants
  {
    id: "a-1",
    name: "Honorine M.",
    subfamily: "WIHOGORA",
    role: "Family Member",
    month: "APR",
    day: 4,
    avatar: elder4,
  },
  {
    id: "a-2",
    name: "Jean-Paul K.",
    subfamily: "HOPE",
    role: "Executive Council",
    month: "APR",
    day: 12,
    avatar: elder3,
  },
  {
    id: "a-3",
    name: "Thierry R.",
    subfamily: "SANCTUARY",
    role: "Youth Council",
    month: "APR",
    day: 18,
    avatar: elder2,
  },
  {
    id: "a-4",
    name: "Liliane I.",
    subfamily: "LIGHT",
    role: "Family Historian",
    month: "APR",
    day: 24,
    avatar: elder1,
  },
  {
    id: "a-5",
    name: "Sylvain M.",
    subfamily: "WIHOGORA",
    role: "Treasurer",
    month: "APR",
    day: 29,
    avatar: elder4,
  },
  // May celebrants
  {
    id: "my-1",
    name: "Joy K.",
    subfamily: "HOPE",
    role: "Communications",
    month: "MAY",
    day: 14,
    avatar: elder1,
  },
  {
    id: "my-2",
    name: "Patrick N.",
    subfamily: "SANCTUARY",
    role: "Heritage Lead",
    month: "MAY",
    day: 22,
    avatar: elder2,
  },
];

export function FamilyCelebrationsCalendar() {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [activeWishTarget, setActiveWishTarget] = useState<
    (WishTarget & { id?: string }) | null
  >(null);
  const [suggestModalOpen, setSuggestModalOpen] = useState(false);
  const [suggestName, setSuggestName] = useState("");
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  // Persisted set of IDs who have received birthday wishes from this device
  const [wishedRaw, setWishedRaw] = useStoredValue(
    "imena:wished_celebrants",
    "[]",
  );

  const wishedIds = useMemo<Set<string>>(() => {
    try {
      const parsed = JSON.parse(wishedRaw);
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  }, [wishedRaw]);

  function markCelebrantWished(id?: string) {
    if (!id) return;
    const next = new Set(wishedIds);
    next.add(id);
    setWishedRaw(JSON.stringify(Array.from(next)));
  }

  const activeCelebrants = useMemo(
    () => CELEBRANTS.filter((c) => c.month === monthKey(selectedMonth)),
    [selectedMonth],
  );
  const activeCount = activeCelebrants.length;

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
          {activeCount} {activeCount === 1 ? "Birthday" : "Birthdays"} in{" "}
          {selectedMonth}
        </p>
      </div>

      {/* Month Pills Navigation */}
      <div className="mt-2 flex scrollbar-none items-center gap-2.5 overflow-x-auto pt-1 pb-3">
        {MONTHS.map((name) => {
          const isActive = selectedMonth === name;
          const count = CELEBRANTS.filter(
            (c) => c.month === monthKey(name),
          ).length;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelectedMonth(name)}
              className={`shrink-0 cursor-pointer rounded-full px-5 py-2 text-xs font-semibold transition-all sm:text-sm ${
                isActive
                  ? "bg-[#4338CA] text-white shadow-md ring-2 ring-[#4338CA]/20"
                  : "bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF]"
              }`}
            >
              {isActive ? (
                <span className="flex items-center gap-2">
                  <span>{name}</span>
                  <span className="inline-block size-1.5 rounded-full bg-white" />
                  <span>{count}</span>
                </span>
              ) : count > 0 ? (
                `${name} (${count})`
              ) : (
                name
              )}
            </button>
          );
        })}
      </div>

      {/* Spotlight Card: "TODAY'S FAMILY BIRTHDAY!" with ambient glow and pulsing indicator */}
      <Reveal from="bottom" distance={20} duration={0.6}>
        <div className="mx-auto my-8 w-full max-w-xl rounded-2xl border border-purple-100/80 bg-white p-5 shadow-[0_8px_30px_rgba(79,70,229,0.08)] transition-all hover:shadow-[0_12px_36px_rgba(79,70,229,0.12)] sm:p-6">
          {/* Card Top Row */}
          <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-neutral-600 uppercase">
              <Sparkles className="size-3.5 text-pink-500" />
              <span>TODAY&apos;S FAMILY BIRTHDAY!</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-neutral-100 px-3 py-0.5 text-xs font-medium text-neutral-600">
                Today &bull; Mar 28
              </span>
              <SubfamilyBadge subfamily="LIGHT" size="sm" />
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
              {/* Pulsing live status indicator in top-right corner */}
              <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex size-3.5 rounded-full bg-violet-600 ring-2 ring-white" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-neutral-900 sm:text-2xl">
                  Bigwi
                </h3>
                {wishedIds.has("spotlight-bigwi") && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-600">
                    <Check className="size-3" /> Wished
                  </span>
                )}
              </div>
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
                  id: "spotlight-bigwi",
                  name: "Bigwi",
                  subfamily: "Light",
                })
              }
              className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition-all ${
                wishedIds.has("spotlight-bigwi")
                  ? "border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                  : "bg-[#3B2883] text-white hover:bg-[#311f70]"
              }`}
            >
              {wishedIds.has("spotlight-bigwi") ? (
                <>
                  <Heart className="size-4 fill-rose-500 text-rose-500" />
                  <span>Warm Family Wish Sent ✓ (Send Another)</span>
                </>
              ) : (
                <span>Send Warm Family Wish</span>
              )}
            </button>
          </div>
        </div>
      </Reveal>

      {/* Constellation Container with Ambient Threading Guide */}
      <div className="relative my-4">
        {/* Ambient Constellation Threading Guide for wide screens */}
        {activeCelebrants.length > 0 && (
          <div
            className="pointer-events-none absolute inset-y-6 left-1/2 z-0 hidden w-px -translate-x-1/2 md:block"
            aria-hidden="true"
          >
            <div className="h-full w-full border-l border-dashed border-indigo-200/70" />
          </div>
        )}

        {/* Empty State Dignified Fallback */}
        {activeCelebrants.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-white/60 px-6 py-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-3xl border border-purple-100 bg-purple-50 text-purple-600 shadow-sm">
              <Cake className="size-8 text-[#581C87]" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
              No Celebrations in {selectedMonth} Yet
            </h3>
            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-neutral-500 sm:text-sm">
              Family birthdays are kept by subfamily coordinators and verified
              members. Know a birthday in {selectedMonth}?
            </p>
            <button
              type="button"
              onClick={() => {
                setSuggestName("");
                setSuggestSuccess(false);
                setSuggestModalOpen(true);
              }}
              className="mt-5 cursor-pointer rounded-full bg-[#EDE9FE] px-6 py-2.5 text-xs font-semibold text-[#5B21B6] shadow-sm transition-colors hover:bg-[#DDD6FE]"
            >
              Inform Subfamily Coordinator &rarr;
            </button>
          </div>
        )}

        {/* Animated Staggered Cards Constellation */}
        <div
          key={selectedMonth}
          className="animate-in fade-in-50 slide-in-from-bottom-2 relative z-10 grid grid-cols-1 gap-6 duration-300"
        >
          {activeCelebrants.map((celebrant, i) => {
            const isWished = wishedIds.has(celebrant.id);
            return (
              <Reveal
                key={celebrant.id}
                from="bottom"
                distance={24}
                delay={(i % 4) * 0.08}
                duration={0.45}
                className={`w-full max-w-xs transition-transform hover:-translate-y-0.5 ${OFFSETS[i % OFFSETS.length]}`}
              >
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md sm:p-3">
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
                      <SubfamilyBadge subfamily={celebrant.subfamily} />
                      <span className="text-xs text-neutral-300">&bull;</span>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-neutral-400">
                      {celebrant.role}
                    </p>
                  </div>

                  {/* Heart Action Button with Active "Sent" State */}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveWishTarget({
                        id: celebrant.id,
                        name: celebrant.name,
                        subfamily: celebrant.subfamily,
                      })
                    }
                    title={
                      isWished
                        ? `Wish already sent to ${celebrant.name} ♥`
                        : `Send birthday wish to ${celebrant.name}`
                    }
                    aria-label={`Send birthday wish to ${celebrant.name}`}
                    className={`flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-all ${
                      isWished
                        ? "bg-rose-50 text-rose-500 ring-1 ring-rose-200 hover:bg-rose-100"
                        : "bg-indigo-50/70 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-600"
                    }`}
                  >
                    <Heart
                      className={`size-4 transition-transform ${
                        isWished
                          ? "scale-110 fill-rose-500 text-rose-500"
                          : "text-indigo-500"
                      }`}
                    />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Wish Dialog Modal */}
      <WishDialog
        target={activeWishTarget}
        onClose={() => setActiveWishTarget(null)}
        onSent={() => {
          if (activeWishTarget?.id) {
            markCelebrantWished(activeWishTarget.id);
          }
          setActiveWishTarget(null);
        }}
      />

      {/* Suggest Birthday to Coordinator Modal Dialog */}
      {suggestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setSuggestModalOpen(false)}
          />
          <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                Inform Subfamily Coordinator
              </h3>
              <button
                type="button"
                onClick={() => setSuggestModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="size-5" />
              </button>
            </div>

            {suggestSuccess ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Check className="size-6" />
                </div>
                <h4 className="font-bold text-neutral-900">
                  Notice Submitted!
                </h4>
                <p className="mt-1 text-xs text-neutral-500">
                  Your coordinator has received the note for {selectedMonth}.
                </p>
                <button
                  type="button"
                  onClick={() => setSuggestModalOpen(false)}
                  className="mt-4 rounded-full bg-[#3B2883] px-6 py-2 text-xs font-semibold text-white shadow-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!suggestName.trim()) return;
                  setSuggestSuccess(true);
                }}
                className="mt-4 space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-neutral-700">
                    Celebrant Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={suggestName}
                    onChange={(e) => setSuggestName(e.target.value)}
                    placeholder="e.g. Christian Mugisha"
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 p-2.5 text-sm focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700">
                    Month &amp; Day
                  </label>
                  <input
                    type="text"
                    defaultValue={`${selectedMonth} `}
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 p-2.5 text-sm focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSuggestModalOpen(false)}
                    className="rounded-full px-5 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-full bg-[#3B2883] px-6 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#311f70]"
                  >
                    <Send className="size-3.5" />
                    Send Note
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
