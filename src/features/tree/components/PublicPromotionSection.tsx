"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { HeartsOrnament } from "@/components/ui/Ornaments";
import {
  PROMOTIONS_DATA,
  PROMOTION_YEARS,
  type PromotionYear,
  type PublicPromotionMember,
} from "@/features/tree/publicTreeData";

function PublicMemberCard({ member }: { member: PublicPromotionMember }) {
  return (
    <article className="border-primary/15 bg-surface hover:border-primary/30 flex flex-col items-stretch gap-4 rounded-2xl border p-3.5 shadow-sm transition-all duration-200 hover:shadow-md sm:flex-row">
      {/* Portrait */}
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-36 md:w-44">
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, 180px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-slate-400">
            <svg
              className="size-16"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
            <span className="text-caption mt-1 text-slate-400">No photo</span>
          </div>
        )}
      </div>

      {/* Information */}
      <div className="flex flex-1 flex-col justify-center py-1">
        <h4 className="text-h4-m font-bold text-black">{member.name}</h4>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="bg-primary/10 text-primary text-caption rounded-full px-2.5 py-0.5 font-semibold">
            {member.role}
          </span>
          {member.familyName && (
            <span className="border-border text-muted text-caption rounded-full border px-2.5 py-0.5">
              {member.familyName}
            </span>
          )}
        </div>

        {member.saying && (
          <blockquote className="border-primary/30 text-body-sm text-muted mt-3 border-l-2 pl-3 italic">
            &ldquo;{member.saying}&rdquo;
          </blockquote>
        )}
      </div>
    </article>
  );
}

export function PublicPromotionSection() {
  const [activeYear, setActiveYear] = useState<PromotionYear>("2025-2026");

  const currentGroups = PROMOTIONS_DATA[activeYear] ?? [];

  return (
    <section className="relative pt-12 pb-24 md:pt-16 md:pb-32">
      {/* Decorative Hearts Ornament */}
      <HeartsOrnament className="absolute -top-4 left-4 hidden w-16 opacity-60 md:block md:w-20 lg:left-12" />
      <HeartsOrnament className="absolute top-1/3 right-4 hidden w-16 opacity-60 md:block md:w-20 lg:right-12" />

      <Container className="relative">
        {/* Section Heading */}
        <div className="text-center">
          <h2 className="text-h1-m md:text-h1 font-bold">
            IMENA Family <span className="text-heading">Tree</span>
          </h2>

          <p className="text-body-lg text-muted mx-auto mt-4 max-w-2xl">
            Discover the connections and relationships within our extended
            family. Each level represents a generation, and each circle
            represents a family member.
          </p>
        </div>

        {/* Promotion Selector Year Tabs */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-body font-medium text-black">
            The <span className="text-heading font-bold">{activeYear}</span>{" "}
            Promotion
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/70 p-1.5 shadow-xs backdrop-blur-xs">
            {PROMOTION_YEARS.map((year) => {
              const isActive = activeYear === year;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => setActiveYear(year)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150 sm:text-sm ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-black"
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>

        {/* Member Cards Groups */}
        <div className="mt-14 space-y-14">
          {currentGroups.map((group) => (
            <div key={group.heading}>
              <h3 className="text-h4-m md:text-h4 text-center font-bold tracking-tight text-black">
                {group.heading}
              </h3>

              <div className="mx-auto mt-7 grid max-w-4xl gap-6 md:grid-cols-2">
                {group.members.map((member) => (
                  <PublicMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr className="border-border mx-auto mt-20 max-w-5xl border-t" />
      </Container>
    </section>
  );
}
