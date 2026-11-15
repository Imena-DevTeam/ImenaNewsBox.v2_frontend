"use client";

import { Quote } from "@/components/ui/Quote";
import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Grow } from "@/components/motion/Grow";
import { Reveal } from "@/components/motion/Reveal";
import { HeartsOrnament, HouseOrnament } from "@/components/ui/Ornaments";
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
        "border-member-field bg-surface rounded-lg border p-5 sm:p-6 md:p-7",
        "shadow-member hover:shadow-member",
        "transition-shadow duration-300 select-none",
        isBack && "border-hope-tint shadow-member",
      )}
    >
      {/* Subtle Flip Micro-Indicator */}
      <div className="group-hover:text-brand bg-member-field/70 text-muted group-hover:bg-hope-tint absolute top-4 right-4 flex size-8 items-center justify-center rounded-full opacity-60 transition-all duration-300 group-hover:opacity-100 sm:top-5 sm:right-5">
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
      <div className="bg-member-field ring-member-ink/5 relative aspect-4/5 w-full shrink-0 overflow-hidden rounded-lg ring-1 sm:w-44 md:w-52">
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, 220px"
            className="object-cover object-top"
          />
        ) : (
          <div className="bg-member-field flex h-full w-full flex-col items-center justify-center">
            <svg
              className="text-text h-28 w-24 opacity-90"
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
        <h4 className="font-heading text-member-ink md:text-body-lg text-h3 leading-tight font-black tracking-tight uppercase">
          {member.name}
        </h4>

        {/* Badges */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="border-hope-tint bg-hope-tint text-hope-ink text-caption inline-flex items-center rounded-full border px-3.5 py-1 font-semibold">
            {member.role}
            {yearTag ? ` • ${yearTag}` : ""}
          </span>

          {member.familyName && (
            <span className="border-hope-edge text-hope-ink bg-surface text-caption inline-flex items-center rounded-full border px-3.5 py-1 font-medium">
              {member.familyName}
            </span>
          )}
        </div>

        {/* Saying / Quote with authentic typographical styling */}
        {member.saying && <Quote className="mt-4">{member.saying}</Quote>}
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
      className="group focus-visible:ring-brand relative min-h-75 w-full cursor-pointer rounded-lg [perspective:1400px] focus-visible:ring-2 focus-visible:ring-offset-4"
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
        className="ease-out-soft relative h-full w-full rounded-lg transition-transform duration-700 [transform-style:preserve-3d]"
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
      className="relative scroll-mt-24 overflow-x-clip pt-12 pb-24 md:pt-16 md:pb-32"
    >
      <HeartsOrnament
        size="lg"
        className="absolute top-12 left-12 hidden lg:block"
      />
      <HouseOrnament
        size="lg"
        className="absolute top-1/3 right-12 hidden lg:block"
      />

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

          <h2 className="text-h1-m md:text-h1 text-text font-black">
            AERG IMENA Family <span className="text-brand">Tree</span>
          </h2>

          <Reveal from="bottom" delay={0.1} distance={12}>
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
                <span className="bg-brand text-surface text-body-sm rounded-full px-6 py-2 font-semibold shadow-xs">
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
                <span className="bg-heading text-surface text-body-sm rounded-full px-6 py-2 font-semibold shadow-xs">
                  {precedingYear}
                </span>
              </div>
            </div>

            {/* Section Subhead strictly matching media_1793188908046.png */}
            <h3 className="text-text text-h4 sm:text-h3 mt-6 font-bold tracking-tight">
              Grandpere &amp; Grandmere
            </h3>
          </div>
        </Reveal>

        {/* ==============================================================
            PREMIUM GRANDPERE & GRANDMERE 3D FLIP CARDS
        ============================================================== */}
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
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
