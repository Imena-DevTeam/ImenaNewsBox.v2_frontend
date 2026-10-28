import type { Metadata } from "next";
import { PublicPromotionSection, TreeHero } from "@/features/tree/components";

export const metadata: Metadata = {
  title: "Family Tree",
  description:
    "Discover the connections and relationships within the extended IMENA family, generation by generation.",
};

export default function FamilyTreePage() {
  return (
    <div className="page-enter">
      <TreeHero />
      <PublicPromotionSection />
    </div>
  );
}
