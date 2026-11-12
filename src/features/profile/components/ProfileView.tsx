"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  CircleUserRound,
  FileText,
  Heart,
  LogOut,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useModalDialog } from "@/components/ui/useModalDialog";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { SubfamilyBadge } from "@/components/ui/SubfamilyBadge";
import { ROUTES } from "@/constants/routes";
import { useStoredValue } from "@/hooks/useStoredValue";
import { elder3 } from "@/lib/images";

interface ProfileViewProps {
  onSignOut: () => Promise<void>;
}

const DEFAULT_QUOTE = "“Shinjagira niyo waba ushira.”";

export function ProfileView({ onSignOut }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const editDialog = useModalDialog(isEditing);
  const [quote, setQuote] = useStoredValue(
    "imena:profile_quote",
    DEFAULT_QUOTE,
  );
  const [tempQuote, setTempQuote] = useState(DEFAULT_QUOTE);

  function handleSaveQuote() {
    setQuote(tempQuote);
    setIsEditing(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 pb-28">
      {/* Header with Circular Profile Badge & Hover-Revealing Avatar */}
      <PageHeader
        title="PROFILE"
        badgeIcon={<CircleUserRound className="size-6 text-[#581C87]" />}
        badgeLabel="Profile"
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
            <SubfamilyBadge subfamily="LIGHT FAMILY" size="md" />
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

          {/* Action Buttons with direct Log Out */}
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setTempQuote(quote);
                setIsEditing(true);
              }}
              className="cursor-pointer rounded-full bg-[#EDE9FE] px-8 py-2.5 text-sm font-semibold text-[#5B21B6] shadow-sm transition-colors hover:bg-[#DDD6FE]"
            >
              Edit Profile
            </button>

            <Link
              href={ROUTES.RESOURCES}
              className="rounded-full border border-neutral-800 bg-transparent px-8 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
            >
              View Archive
            </Link>

            <form action={onSignOut}>
              <button
                type="submit"
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/70 px-6 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Secondary Details & Lineage Summary */}
      <section className="grid gap-6 sm:grid-cols-2">
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

      {/* A native <dialog>, like the nine others in this codebase. It was a
          fixed overlay, which looks the same and gives none of what this
          gives: Escape, focus trapped inside it, the page behind it inert,
          and focus returning to the button that opened it. */}
      <dialog
        ref={editDialog}
        onClose={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsEditing(false);
        }}
        aria-labelledby="edit-motto-title"
        className="bg-surface open:animate-dialog-pop m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl p-0 shadow-2xl backdrop:bg-black/40 motion-reduce:animate-none"
      >
        {isEditing ? (
          <div className="p-6">
            <div className="border-member-border flex items-center justify-between border-b pb-3">
              <h3
                id="edit-motto-title"
                className="text-member-ink text-base font-bold"
              >
                Edit personal motto
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                aria-label="Close"
                className="text-muted hover:bg-member-tint hover:text-member-ink rounded-lg p-1"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="profile-motto"
                  className="text-member-ink block text-xs font-semibold"
                >
                  Family motto or favourite proverb
                </label>
                <textarea
                  id="profile-motto"
                  value={tempQuote}
                  onChange={(e) => setTempQuote(e.target.value)}
                  rows={3}
                  className="focus:border-brand border-field-border mt-1.5 w-full rounded-xl border p-3 text-sm"
                  placeholder="A line your family lives by"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-muted hover:bg-member-tint rounded-full px-5 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuote}
                  className="bg-brand hover:bg-brand-hover text-surface rounded-full px-6 py-2 text-xs font-semibold shadow-sm"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
