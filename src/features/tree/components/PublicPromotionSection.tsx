"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Grow } from "@/components/motion/Grow";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
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
        "relative flex h-full w-full flex-col items-center gap-6 sm:flex-row sm:items-stretch",
        "rounded-3xl border border-[#e8edf7] bg-white p-5 sm:p-6 md:p-7",
        "shadow-[0_4px_24px_rgba(13,26,186,0.04)] hover:shadow-[0_20px_45px_rgba(13,26,186,0.08)]",
        "transition-shadow duration-300 select-none",
        isBack && "border-[#dbeafe] shadow-[0_6px_28px_rgba(13,26,186,0.06)]",
      )}
    >
      {/* Subtle Flip Micro-Indicator */}
      <div className="group-hover:text-primary absolute top-4 right-4 flex size-8 items-center justify-center rounded-full bg-slate-100/70 text-slate-400 opacity-60 transition-all duration-300 group-hover:bg-blue-50 group-hover:opacity-100 sm:top-5 sm:right-5">
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
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-2xl bg-[#eaeff5] ring-1 ring-black/5 sm:w-44 md:w-52">
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
              <path d="M14 110 C 14 74, 86 74, 86 110 Z" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>

      {/* Right Column: Details */}
      <div className="flex w-full flex-1 flex-col justify-center py-1 text-left sm:py-2">
        {/* Name in bold uppercase/caps matching the design */}
        <h4 className="font-heading text-2xl leading-tight font-black tracking-tight text-slate-900 uppercase md:text-[26px]">
          {member.name}
        </h4>

        {/* Badges */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-[#dbeafe] bg-[#ebf3fe] px-3.5 py-1 text-xs font-semibold text-[#1d4ed8]">
            {member.role}
            {yearTag ? ` • ${yearTag}` : ""}
          </span>

          {member.familyName && (
            <span className="inline-flex items-center rounded-full border border-[#bfdbfe] bg-white px-3.5 py-1 text-xs font-medium text-[#1d4ed8]">
              {member.familyName}
            </span>
          )}
        </div>

        {/* Saying / Quote with authentic typographical styling */}
        {member.saying && (
          <p className="mt-4 text-sm leading-relaxed font-normal text-slate-600 italic md:text-base">
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
      className="group focus-visible:ring-primary relative min-h-[300px] w-full cursor-pointer rounded-3xl [perspective:1400px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
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
        className="relative h-full w-full rounded-3xl transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform-style:preserve-3d]"
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
                saying:
                  "Umuryango ukura ku mizi yawo (Our strength comes from our roots)",
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
      {/* Decorative Ornaments with parallax drift matching landing page */}
      <Parallax
        distance={-25}
        className="pointer-events-none absolute -top-6 left-4 hidden opacity-40 select-none md:block lg:left-12"
      >
        <Reveal from="left" delay={0.15} distance={24}>
          <Image
            src="/images/hearts.svg"
            alt=""
            width={80}
            height={72}
            className="object-contain"
          />
        </Reveal>
      </Parallax>

      <Parallax
        distance={35}
        className="pointer-events-none absolute top-1/3 right-4 hidden opacity-35 select-none md:block lg:right-12"
      >
        <Reveal from="right" delay={0.25} distance={24}>
          <Image
            src="/images/house.svg"
            alt=""
            width={100}
            height={104}
            className="object-contain"
          />
        </Reveal>
      </Parallax>

      <Container className="relative">
        {/* ==============================================================
            SECTION HEADER with IMENA Crest matching design
        ============================================================== */}
        <div className="text-center">
          {/* Centered Crest */}
          <Reveal from="top" distance={20} duration={0.6}>
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
          </Reveal>

          <SplitText
            lines={[
              [
                "AERG IMENA Family ",
                { text: "Tree", className: "text-primary" },
              ],
            ]}
            className="text-h1-m md:text-h1 font-black text-black"
          />

          <Reveal from="bottom" blur delay={0.2} distance={20}>
            <p className="text-body-lg text-muted mx-auto mt-3 max-w-2xl">
              Discover the connections and relationships within our extended
              family. Each level represents a generation, and each circle
              represents a family member.
            </p>
          </Reveal>
        </div>

        {/* ==============================================================
            CLEAN DESIGN-MATCHING YEAR DISPLAY (Smooth Cross-Fade)
        ============================================================== */}
        <Reveal from="bottom" delay={0.3} distance={20}>
          <div className="mt-8 flex flex-col items-center">
            {/* Minimalist Year Pill with Cross-Fade */}
            <div className="relative h-10 w-44">
              {/* Current Year */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out",
                  isFlipped
                    ? "pointer-events-none -translate-y-2 opacity-0"
                    : "translate-y-0 opacity-100",
                )}
              >
                <span className="bg-primary rounded-full px-6 py-2 text-sm font-semibold text-white shadow-xs">
                  {currentYear}
                </span>
              </div>

              {/* Preceding Year */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out",
                  isFlipped
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0",
                )}
              >
                <span className="bg-heading rounded-full px-6 py-2 text-sm font-semibold text-white shadow-xs">
                  {precedingYear}
                </span>
              </div>
            </div>

            {/* Section Subhead strictly matching media_1793188908046.png */}
            <h3 className="mt-6 text-xl font-bold tracking-tight text-black sm:text-2xl">
              Grandpere &amp; Grandmere
            </h3>
          </div>
        </Reveal>

        {/* ==============================================================
            PREMIUM GRANDPERE & GRANDMERE 3D FLIP CARDS
        ============================================================== */}
        <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-2">
          {grandpere && (
            <Reveal from="left" distance={30} duration={0.65} delay={0.1}>
              <PublicMemberFlipCard
                member={grandpere}
                predecessor={grandperePredecessor}
                isFlipped={isFlipped}
                onToggleFlip={toggleFlip}
                staggerDelayMs={0}
              />
            </Reveal>
          )}

          {grandmere && (
            <Reveal from="right" distance={30} duration={0.65} delay={0.2}>
              <PublicMemberFlipCard
                member={grandmere}
                predecessor={grandmerePredecessor}
                isFlipped={isFlipped}
                onToggleFlip={toggleFlip}
                staggerDelayMs={75}
              />
            </Reveal>
          )}
        </div>

        {/* Divider with graceful Grow animation */}
        <Grow
          axis="x"
          delay={0.3}
          className="mx-auto mt-20 max-w-5xl origin-center"
        >
          <hr className="border-border border-t" />
        </Grow>
      </Container>
    </section>
  );
}
