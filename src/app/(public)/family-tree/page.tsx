import type { Metadata } from "next";
import {
  MemberGroups,
  TreeDiagram,
  TreeHero,
  TreeIntro,
} from "@/features/tree/components";

export const metadata: Metadata = {
  title: "Family Tree",
  description:
    "Discover the connections and relationships within the extended IMENA family, generation by generation.",
};

export default function FamilyTreePage() {
  return (
    <div className="page-enter">
      <TreeHero />
      <TreeDiagram />
      <TreeIntro />
      <MemberGroups />
    </div>
  );
}
