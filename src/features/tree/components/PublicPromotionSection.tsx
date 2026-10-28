"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";
import {
  PROMOTIONS_DATA,
  PROMOTION_YEARS,
  getPrecedingGenerationMember,
  type PromotionYear,
  type PublicPromotionMember,
} from "@/features/tree/publicTreeData";

interface PublicMemberFlipCardProps {
  member: PublicPromotionMember;
  predecessor: { member: PublicPromotionMember; yearLabel: string } | null;
  isFlipped: boolean;
  onToggleFlip: () => void;
  staggerDelayMs?: number;
}

function MemberCardContent({
  member,
  yearTag,
  isBack = false,
}: {
  member: PublicPromotionMember;
  yearTag?: string;
  isBack?: boolean;
}) {
  return (
    <article
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      className={cn(
        "relative flex h-full w-full flex-col sm:flex-row items-center sm:items-stretch gap-6",
        "bg-white rounded-3xl border border-[#e8edf7] p-5 sm:p-6 md:p-7",
        "shadow-[0_4px_24px_rgba(13,26,186,0.04)] hover:shadow-[0_20px_45px_rgba(13,26,186,0.08)]",
        "transition-shadow duration-300 select-none",
        isBack && "border-[#dbeafe] shadow-[0_6px_28px_rgba(13,26,186,0.06)]",
      )}
    >
      {/* Subtle Flip Micro-Indicator */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5 flex size-8 items-center justify-center rounded-full bg-slate-100/70 text-slate-400 opacity-60 transition-all duration-300 group-hover:bg-blue-50 group-hover:text-primary group-hover:opacity-100">
        <svg
          className="size-4 transition-transform duration-500 group-hover:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 21h5v-5" />
        </svg>
      </div>

      {/* Left Column: Portrait */}
      <div className="relative aspect-[4/5] w-full sm:w-44 md:w-52 shrink-0 overflow-hidden rounded-2xl bg-[#eaeff5] ring-1 ring-black/5">
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, 220px"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#eaeff5]">
            <svg
              className="h-28 w-24 text-[#475569] opacity-90"
              viewBox="0 0 100 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="50" cy="38" r="22" fill="currentColor" />
              <path
                d="M14 110 C 14 74, 86 74, 86 110 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Right Column: Details */}
      <div className="flex flex-1 flex-col justify-center py-1 sm:py-2 text-left w-full">
        {/* Name in bold uppercase/caps matching the design */}
        <h4 className="font-heading font-black text-2xl md:text-[26px] text-slate-900 tracking-tight leading-tight uppercase">
          {member.name}
        </h4>

        {/* Badges */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#ebf3fe] text-[#1d4ed8] border border-[#dbeafe]">
            {member.role}
            {yearTag ? ` • ${yearTag}` : ""}
          </span>

          {member.familyName && (
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-white text-[#1d4ed8] border border-[#bfdbfe]">
              {member.familyName}
            </span>
          )}
        </div>

        {/* Saying / Quote with authentic typographical styling */}
        {member.saying && (
          <p className="mt-4 text-sm md:text-base text-slate-600 italic font-normal leading-relaxed">
            &ldquo;{member.saying}&rdquo;
          </p>
        )}
      </div>
    </article>
  );
}

function PublicMemberFlipCard({
  member,
  predecessor,
  isFlipped,
  onToggleFlip,
  staggerDelayMs = 0,
}: PublicMemberFlipCardProps) {
  return (
    <div
      className="group relative min-h-[300px] w-full [perspective:1400px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-3xl"
      tabIndex={0}
      role="button"
      aria-label={`${member.name}, ${member.role}. Click to flip and view preceding generation`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggleFlip();
        }
      }}
      onClick={onToggleFlip}
    >
      <div
        className="relative h-full w-full rounded-3xl [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        style={{
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transitionDelay: `${staggerDelayMs}ms`,
        }}
      >
        {/* FRONT FACE: Current Generation Member */}
        <div className="h-full w-full">
          <MemberCardContent member={member} />
        </div>

        {/* BACK FACE: Preceding Generation Member */}
        <div
          className="absolute inset-0 h-full w-full [transform:rotateY(180deg)]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {predecessor ? (
            <MemberCardContent
              member={predecessor.member}
              yearTag={predecessor.yearLabel}
              isBack
            />
          ) : (
            <MemberCardContent
              member={{
                id: "founder-root",
                name: "Benon",
                singleName: "Benon",
                role: member.role,
                familyName: "Founder Patriarch",
                imageUrl: null,
                saying: "Umuryango ukura ku mizi yawo (Our strength comes from our roots)",
              }}
              yearTag="Founder Lineage"
              isBack
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function PublicPromotionSection({
  activeYear = "2025-2026",
}: {
  activeYear?: PromotionYear;
  onYearChange?: (year: PromotionYear) => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const currentYear = activeYear;
  const currentIndex = PROMOTION_YEARS.indexOf(currentYear);
  const precedingYear =
    currentIndex > 0 ? PROMOTION_YEARS[currentIndex - 1] : "Root (Benon)";

  const currentGroup = PROMOTIONS_DATA[currentYear]?.[0];
  const members = currentGroup?.members ?? [];
  const grandpere = members.find((m) => m.role === "Grandpere");
  const grandmere = members.find((m) => m.role === "Grandmere");

  const grandperePredecessor = getPrecedingGenerationMember(
    currentYear,
    "Grandpere",
  );
  const grandmerePredecessor = getPrecedingGenerationMember(
    currentYear,
    "Grandmere",
  );

  const toggleFlip = () => {
    setIsFlipped((f) => !f);
  };

  return (
    <section
      id="promotion-section"
      className="relative scroll-mt-24 pt-12 pb-24 md:pt-16 md:pb-32"
    >
      {/* Decorative Ornaments sourced directly from the Login page assets */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 left-4 hidden opacity-40 select-none md:block lg:left-12"
      >
        <Image
          src="/images/hearts.svg"
          alt=""
          width={80}
          height={72}
          className="object-contain"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-4 hidden opacity-35 select-none md:block lg:right-12"
      >
        <Image
          src="/images/house.svg"
          alt=""
          width={100}
          height={104}
          className="object-contain"
        />
      </div>

      <Container className="relative">
        {/* ==============================================================
            SECTION HEADER with IMENA Crest matching design
        ============================================================== */}
        <div className="text-center">
          {/* Centered Crest */}
          <div className="mx-auto mb-4 flex justify-center">
            <Image
              src="/images/imena-crest.webp"
              alt="IMENA Family Crest"
              width={70}
              height={70}
              className="object-contain drop-shadow-xs"
              priority
            />
          </div>

          <h2 className="text-h1-m md:text-h1 font-black text-black">
            AERG IMENA Family <span className="text-primary">Tree</span>
          </h2>

          <p className="text-body-lg text-muted mx-auto mt-3 max-w-2xl">
            Discover the connections and relationships within our extended
            family. Each level represents a generation, and each circle
            represents a family member.
          </p>
        </div>

        {/* ==============================================================
            CLEAN DESIGN-MATCHING YEAR DISPLAY (Smooth Cross-Fade)
        ============================================================== */}
        <div className="mt-8 flex flex-col items-center">
          {/* Minimalist Year Pill with Cross-Fade */}
          <div className="relative h-10 w-44">
            {/* Current Year */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out",
                isFlipped
                  ? "opacity-0 -translate-y-2 pointer-events-none"
                  : "opacity-100 translate-y-0",
              )}
            >
              <span className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-xs">
                {currentYear}
              </span>
            </div>

            {/* Preceding Year */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out",
                isFlipped
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none",
              )}
            >
              <span className="rounded-full bg-heading px-6 py-2 text-sm font-semibold text-white shadow-xs">
                {precedingYear}
              </span>
            </div>
          </div>

          {/* Section Subhead strictly matching media_1793188908046.png */}
          <h3 className="mt-6 text-xl font-bold tracking-tight text-black sm:text-2xl">
            Grandpere &amp; Grandmere
          </h3>
        </div>

        {/* ==============================================================
            PREMIUM GRANDPERE & GRANDMERE 3D FLIP CARDS
        ============================================================== */}
        <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-2">
          {grandpere && (
            <PublicMemberFlipCard
              member={grandpere}
              predecessor={grandperePredecessor}
              isFlipped={isFlipped}
              onToggleFlip={toggleFlip}
              staggerDelayMs={0}
            />
          )}

          {grandmere && (
            <PublicMemberFlipCard
              member={grandmere}
              predecessor={grandmerePredecessor}
              isFlipped={isFlipped}
              onToggleFlip={toggleFlip}
              staggerDelayMs={75}
            />
          )}
        </div>

        {/* Divider */}
        <hr className="border-border mx-auto mt-20 max-w-5xl border-t" />
      </Container>
    </section>
  );
}
