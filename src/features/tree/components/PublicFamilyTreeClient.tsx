"use client";

import { useState } from "react";
import { PublicPromotionSection } from "@/features/tree/components/PublicPromotionSection";
import { TreeHero } from "@/features/tree/components/TreeHero";
import type { PromotionYear } from "@/features/tree/publicTreeData";

export function PublicFamilyTreeClient() {
  const [activeYear, setActiveYear] = useState<PromotionYear>("2025-2026");

  return (
    <div className="page-enter">
      <TreeHero activeYear={activeYear} onSelectYear={setActiveYear} />
      <PublicPromotionSection
        activeYear={activeYear}
        onYearChange={setActiveYear}
      />
    </div>
  );
}
