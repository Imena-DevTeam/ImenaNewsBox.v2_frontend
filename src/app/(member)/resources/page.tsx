import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Family Resources",
  description: "Documents, records and guides the family keeps together.",
};

export default function ResourcesPage() {
  return (
    <ComingSoon
      title="Family Resources"
      description="Documents, records and guides the family keeps together."
    />
  );
}
