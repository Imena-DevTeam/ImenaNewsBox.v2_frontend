"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";
import { PROMOTIONS } from "../promotions";
import { PROMOTION_YEARS, type PromotionYear } from "../publicTreeData";
import type { TreePerson } from "../types";
import { PersonDialog } from "./PersonDialog";
import { TreeHierarchyGrid } from "./TreeHierarchyGrid";

/**
 * The whole of one promotion drawn as a family tree chart: elders,
 * coordinators and the three families. The year follows the rest of the
 * page, and the pills here move it too.
 */
export function PublicLineageChart({
  activeYear,
  onYearChange,
}: {
  activeYear: PromotionYear;
  onYearChange: (year: PromotionYear) => void;
}) {
  const [open, setOpen] = useState<TreePerson | null>(null);
  const promotion = PROMOTIONS.find((p) => p.year === activeYear);

  return (
    <section
      id="lineage-chart"
      aria-labelledby="lineage-chart-title"
      className="scroll-mt-24 pt-4 pb-12 md:pb-16"
    >
      <Container>
        <div className="text-center">
          <h2
            id="lineage-chart-title"
            className="text-h2-m md:text-h2 font-black text-black"
          >
            The {activeYear} <span className="text-primary">Promotion</span>
          </h2>
        </div>

        <div
          role="group"
          aria-label="Choose a promotion"
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {[...PROMOTION_YEARS].reverse().map((year) => (
            <button
              key={year}
              type="button"
              aria-pressed={year === activeYear}
              onClick={() => onYearChange(year)}
              className={cn(
                "focus-visible:outline-brand min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors",
                year === activeYear
                  ? "border-primary bg-primary text-white"
                  : "border-member-border bg-surface text-member-rail-ink hover:border-primary/40",
              )}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="mt-8 md:mt-10">
          {promotion ? (
            <TreeHierarchyGrid promotion={promotion} onOpen={setOpen} />
          ) : null}
        </div>
      </Container>

      <PersonDialog person={open} onClose={() => setOpen(null)} />
    </section>
  );
}
