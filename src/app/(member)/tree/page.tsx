import type { Metadata } from "next";
import { FamilyTagline } from "@/components/layout/FamilyTagline";
import { PageHeader } from "@/components/layout/PageHeader";
import { FloatingFaceHero } from "@/features/tree/components/FloatingFaceHero";
import { TreeBrowser } from "@/features/tree/components/TreeBrowser";

export const metadata: Metadata = {
  title: "Family Tree",
  description:
    "The people who lead each promotion of the IMENA family, from the elders to the three branches.",
};

export default function MemberTreePage() {
  return (
    <div className="min-w-0">
      <PageHeader
        title="Family Tree"
        subtitle="Generation by generation, united in love and heritage"
      />
      <FloatingFaceHero />
      <TreeBrowser />
      <FamilyTagline className="mt-20" />
    </div>
  );
}
