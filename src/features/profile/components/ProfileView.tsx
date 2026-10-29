"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  CircleUserRound,
  FileText,
  Heart,
  LogOut,
  MapPin,
  MoreVertical,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { ROUTES } from "@/constants/routes";
import { useStoredValue } from "@/hooks/useStoredValue";
import { elder3 } from "@/lib/images";

interface ProfileViewProps {
  onSignOut: () => Promise<void>;
}

const DEFAULT_QUOTE = "“Shinjagira niyo waba ushira.”";

export function ProfileView({ onSignOut }: ProfileViewProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [quote, setQuote] = useStoredValue(
    "imena:profile_quote",
    DEFAULT_QUOTE,
  );
  const [tempQuote, setTempQuote] = useState(DEFAULT_QUOTE);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSaveQuote() {
    setQuote(tempQuote);
    setIsEditing(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 pb-28">
      {/* Header with Circular Profile Badge & Kebab Menu with Log Out */}
      <PageHeader
        title="PROFILE"
        badgeIcon={<CircleUserRound className="size-6 text-[#581C87]" />}
        badgeLabel="Profile"
        rightActions={
          <div className="flex items-center gap-4">
            <NotificationBell />

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Profile actions menu"
                aria-expanded={menuOpen}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200"
              >
                <MoreVertical className="size-5" />
              </button>

              {menuOpen && (
                <div className="animate-in fade-in zoom-in-95 absolute top-12 right-0 z-50 w-36 rounded-2xl border border-neutral-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5">
                  <form action={onSignOut}>
                    <button
                      type="submit"
                      className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* Main Profile Showcase Card matching design */}
      <section className="relative mt-2 flex flex-col items-center gap-8 rounded-3xl bg-white p-6 sm:flex-row sm:items-center sm:gap-12 sm:p-10">
        {/* Large Circular Profile Photo */}
        <div className="relative shrink-0">
          <div className="size-48 overflow-hidden rounded-full shadow-lg ring-4 ring-neutral-100 sm:size-56 md:size-64">
            <Image
              src={elder3}
              alt="Aganze's profile photograph"
              width={256}
              height={256}
              className="size-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
          {/* Subfamily Pill */}
          <div className="mb-2">
            <span className="rounded-full bg-[#E9D5FF] px-3.5 py-1 text-xs font-bold tracking-wider text-[#6B21A8] uppercase">
              LIGHT FAMILY
            </span>
          </div>

          {/* Member Name */}
          <h1 className="text-4xl font-extrabold tracking-tight text-[#3B2883] uppercase sm:text-5xl md:text-6xl">
            AGANZE
          </h1>

          {/* Quote Banner */}
          <div className="my-4 border-l-4 border-indigo-300 py-1 pl-4 text-left">
            <p className="text-base font-semibold text-neutral-800 sm:text-lg">
              {quote}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setTempQuote(quote);
                setIsEditing(true);
              }}
              className="rounded-full bg-[#EDE9FE] px-8 py-2.5 text-sm font-semibold text-[#5B21B6] shadow-sm transition-colors hover:bg-[#DDD6FE]"
            >
              Edit Profile
            </button>

            <Link
              href={ROUTES.RESOURCES}
              className="rounded-full border border-neutral-800 bg-transparent px-8 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
            >
              View Archive
            </Link>
          </div>
        </div>
      </section>

      {/* Secondary Details & Lineage Summary */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-neutral-600">
            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Family Status</p>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-neutral-900">
                  Verified Member
                </span>
                <VerifiedBadge />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-neutral-600">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Calendar className="size-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Promotion Cohort</p>
              <p className="font-semibold text-neutral-900">
                2019–2020 Handover
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 text-neutral-600">
            <div className="flex size-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <MapPin className="size-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Affiliation Chapter</p>
              <p className="font-semibold text-neutral-900">Kigali, Rwanda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Counters */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xs font-bold tracking-wider text-neutral-400 uppercase">
          Family Involvement &amp; Community
        </h2>
        <div className="grid grid-cols-3 divide-x divide-neutral-100 text-center">
          <div className="p-2">
            <p className="font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
              14
            </p>
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-neutral-500">
              <Heart className="size-3.5 text-rose-500" /> Wishes Sent
            </p>
          </div>
          <div className="p-2">
            <p className="font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
              8
            </p>
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-neutral-500">
              <FileText className="size-3.5 text-indigo-500" /> Archives Read
            </p>
          </div>
          <div className="p-2">
            <p className="font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
              6
            </p>
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-neutral-500">
              <UserCheck className="size-3.5 text-emerald-500" /> Handover Votes
            </p>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal Dialog */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsEditing(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                Edit Personal Motto
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700">
                  Family Motto / Favorite Proverb
                </label>
                <textarea
                  value={tempQuote}
                  onChange={(e) => setTempQuote(e.target.value)}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-neutral-300 p-3 text-sm focus:border-purple-600 focus:outline-hidden"
                  placeholder="Enter your family motto..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full px-5 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuote}
                  className="rounded-full bg-[#5B21B6] px-6 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#4C1D95]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
