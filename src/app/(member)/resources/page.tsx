import type { Metadata } from "next";
import { FamilyTagline } from "@/components/layout/FamilyTagline";
import { PageHeader } from "@/components/layout/PageHeader";
import { ResourcesBrowser } from "@/features/resources/components/ResourcesBrowser";

export const metadata: Metadata = {
  title: "Family Resources",
  description:
    "Knowledge we share: official chapter oversight records, guides, and educational materials.",
};

export default function ResourcesPage() {
  return (
    <div className="min-w-0 pb-12">
      {/* Top Header with title, notification bell, and user avatar */}
      <PageHeader title="RESOURCES" />

      {/* Subhead strictly matching design */}
      <div className="mt-6 text-center md:mt-8">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-[#4828b8] sm:text-3xl md:text-4xl">
          Knowledge We Share
        </h2>
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-1 w-12 rounded-full bg-[#4828b8]"
        />
      </div>

      {/* Interactive Category Filter and Resource Cards Grid */}
      <ResourcesBrowser />

      {/* Family Closing Tagline */}
      <FamilyTagline className="mt-16 md:mt-24" />
    </div>
  );
}
