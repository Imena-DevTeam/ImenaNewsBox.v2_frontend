import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Family Tree",
  description:
    "Explore how every branch of the IMENA family connects — generation by generation.",
};

export default function FamilyTreePage() {
  return (
    <ComingSoon
      title="Family Tree"
      description="Explore how every branch of the IMENA family connects — generation by generation."
    />
  );
}
