"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { HeartsOrnament } from "@/components/ui/Ornaments";
import { cn } from "@/lib/cn";
import {
  PROMOTIONS_DATA,
  PROMOTION_YEARS,
  getPrecedingGenerationMember,
  type PromotionYear,
  type PublicPromotionMember,
} from "@/features/tree/publicTreeData";
import { PROMOTIONS } from "../promotions";

interface TileProps {
  name: string;
  role: string;
  clan?: string;
  quote?: string;
  image?: StaticImageData | string | null;
}

/* One member, as the design draws them: the portrait inset on the left; the
   name, two small stacked pills and the saying on the right. */
function MemberTile({ name, role, clan, quote, image }: TileProps) {
  return (
    <article className="bg-tree-card border-tree-outline flex h-full gap-4 rounded-2xl border-2 p-2.5 sm:gap-6 xl:h-[380px] xl:gap-[46px] xl:rounded-[17px] xl:p-[11px]">
      <div className="bg-tree-box relative aspect-[243/358] w-28 shrink-0 self-start overflow-hidden rounded-lg sm:w-40 xl:w-[243px] xl:self-stretch">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1280px) 243px, 10rem"
            className="object-cover object-top"
          />
        ) : (
          <svg
            viewBox="0 0 100 120"
            aria-hidden
            className="fill-tree-silhouette absolute inset-x-0 bottom-0 mx-auto w-3/4"
          >
            <circle cx="50" cy="40" r="22" />
            <path d="M12 120c0-34 76-34 76 0Z" />
          </svg>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center py-2 pr-3 xl:pr-6">
        <h4 className="text-h4-m md:text-h4 xl:text-tree-name text-tree-ink">
          {name}
        </h4>

        <div className="mt-3 flex flex-col items-start gap-2 xl:mt-[20px] xl:gap-[14px]">
          <span className="border-tree-badge-edge text-caption text-tree-badge-ink rounded-lg border bg-white/60 px-3 py-1.5 font-bold">
            {role}
          </span>
          {clan ? (
            <span className="border-tree-badge-edge text-caption text-tree-badge-ink rounded-lg border bg-white/60 px-3 py-1.5 font-bold">
              {clan}
            </span>
          ) : null}
        </div>

        {/* The saying sits beside a soft violet bar with rounded ends, as in
            the design. */}
        {quote ? (
          <blockquote className="mt-4 flex gap-2.5 xl:mt-[25px]">
            <span
              aria-hidden
              className="bg-tree-quote-bar rounded-pill w-[3px] shrink-0"
            />
            <p className="text-body-sm text-tree-copy">&ldquo;{quote}&rdquo;</p>
          </blockquote>
        ) : null}
      </div>
    </article>
  );
}

const fromPublic = (m: PublicPromotionMember): TileProps => ({
  name: m.name,
  role: m.role,
  clan: m.familyName,
  quote: m.saying,
  image: m.imageUrl,
});

/* A grandparent card that turns over to show who held the role in the
   promotion before. */
function FlipTile({
  front,
  back,
  flipped,
  onToggle,
  delayMs,
}: {
  front: TileProps;
  back: TileProps;
  flipped: boolean;
  onToggle: () => void;
  delayMs: number;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${front.name}, ${front.role}. Show the ${front.role} before them`}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className="focus-visible:ring-primary cursor-pointer rounded-2xl [perspective:1400px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
    >
      <div
        className="relative h-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform-style:preserve-3d]"
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transitionDelay: `${delayMs}ms`,
        }}
      >
        <div className="h-full [backface-visibility:hidden]">
          <MemberTile {...front} />
        </div>
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <MemberTile {...back} />
        </div>
      </div>
    </div>
  );
}

const ROOT_TILE: TileProps = {
  name: "Benon",
  role: "Founder",
  clan: "IMENA Family",
  quote: "Umuryango ukura ku mizi yawo",
  image: null,
};

export function PublicPromotionSection({
  activeYear = "2025-2026",
}: {
  activeYear?: PromotionYear;
  onYearChange?: (year: PromotionYear) => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const index = PROMOTION_YEARS.indexOf(activeYear);
  const precedingYear = index > 0 ? PROMOTION_YEARS[index - 1] : null;

  const members = PROMOTIONS_DATA[activeYear]?.[0]?.members ?? [];
  const grandpere = members.find((m) => m.role === "Grandpere");
  const grandmere = members.find((m) => m.role === "Grandmere");
  const before = (role: "Grandpere" | "Grandmere") => {
    const prev = getPrecedingGenerationMember(activeYear, role);
    return prev ? fromPublic(prev.member) : ROOT_TILE;
  };

  /* The coordinating pair comes from the full promotion records. */
  const record = PROMOTIONS.find((p) => p.year === activeYear);
  const leads = [
    record?.members.find((m) => m.role === "coordinator"),
    record?.members.find((m) => m.role === "vice_coordinator"),
  ].filter((m) => m !== undefined);
  const leadsHeading =
    leads.length > 1 ? "Coordinator & Vice Coordinator" : "Coordinator";

  const rowHeading =
    "text-h4-m md:text-h3 xl:text-tree-row text-text text-center font-heading";
  const cardGrid =
    "mx-auto mt-6 grid max-w-[1099px] gap-6 lg:grid-cols-2 xl:mt-[46px] xl:grid-cols-[526px_526px] xl:justify-center xl:gap-[47px]";

  return (
    <>
      <section
        id="promotion-section"
        className="relative scroll-mt-24 pt-16 pb-20 md:pt-24 xl:pt-[138px] xl:pb-[238px]"
      >
        <div className="relative mx-auto max-w-[1440px] px-4 md:px-8">
          <HeartsOrnament className="motion-safe:animate-float-slow absolute top-[242px] right-[48px] hidden w-[104px] xl:block" />

          <SplitText
            lines={[
              ["IMENA Family ", { text: "Tree", className: "text-heading" }],
            ]}
            className="text-h1-m md:text-display xl:text-story-hero text-center"
          />

          <Reveal from="bottom" blur delay={0.2} distance={20}>
            <p className="text-body-lg md:text-h3 xl:text-tree-intro text-text mx-auto mt-6 max-w-[940px] text-center font-normal tracking-tight xl:mt-[69px]">
              Discover the connections and relationships within our extended
              family. Each level represents a generation, and each circle
              represents{" "}
              <span className="whitespace-nowrap">a family member.</span>
            </p>
          </Reveal>

          {/* The promotion's year cross-fades to the one before when the
              grandparent cards turn over. */}
          <p className="text-h3-m md:text-h2 xl:text-tree-promo text-text mt-12 text-center font-normal xl:mt-[92px]">
            The{" "}
            <span className="text-heading inline-grid">
              <span
                aria-hidden={isFlipped && precedingYear !== null}
                className={cn(
                  "transition-opacity duration-500 [grid-area:1/1]",
                  isFlipped && precedingYear ? "opacity-0" : "opacity-100",
                )}
              >
                {activeYear}
              </span>
              <span
                aria-hidden={!(isFlipped && precedingYear !== null)}
                className={cn(
                  "transition-opacity duration-500 [grid-area:1/1]",
                  isFlipped && precedingYear ? "opacity-100" : "opacity-0",
                )}
              >
                {precedingYear ?? activeYear}
              </span>
            </span>{" "}
            Promotion
          </p>

          <h3 className={cn(rowHeading, "mt-14 xl:mt-[132px]")}>
            Grandpere &amp; Grandmere
          </h3>
          <div className={cardGrid}>
            {grandpere ? (
              <Reveal from="left" distance={30} duration={0.65} delay={0.1}>
                <FlipTile
                  front={fromPublic(grandpere)}
                  back={before("Grandpere")}
                  flipped={isFlipped}
                  onToggle={() => setIsFlipped((f) => !f)}
                  delayMs={0}
                />
              </Reveal>
            ) : null}
            {grandmere ? (
              <Reveal from="right" distance={30} duration={0.65} delay={0.2}>
                <FlipTile
                  front={fromPublic(grandmere)}
                  back={before("Grandmere")}
                  flipped={isFlipped}
                  onToggle={() => setIsFlipped((f) => !f)}
                  delayMs={75}
                />
              </Reveal>
            ) : null}
          </div>

          {leads.length > 0 ? (
            <>
              <h3 className={cn(rowHeading, "mt-14 xl:mt-[69px]")}>
                {leadsHeading}
              </h3>
              <div className={cardGrid}>
                {leads.map((m, i) => (
                  <Reveal
                    key={m.id}
                    from={i === 0 ? "left" : "right"}
                    distance={30}
                    duration={0.65}
                    delay={0.1 + i * 0.1}
                  >
                    <MemberTile
                      name={m.name}
                      role={m.roleLabel}
                      clan={m.subfamily}
                      quote={m.quote}
                      image={m.image}
                    />
                  </Reveal>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* The full-width rule above the footer, with rounded ends. */}
      <span aria-hidden className="bg-border rounded-pill block h-0.5" />
    </>
  );
}
