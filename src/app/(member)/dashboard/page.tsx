import type { Metadata } from "next";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { BlogSearch } from "@/features/dashboard/components/BlogSearch";
import { DashboardTagline } from "@/features/dashboard/components/DashboardTagline";
import { HeroSlides } from "@/features/dashboard/components/HeroSlides";
import { PopularArticles } from "@/features/blogs/components/PopularArticles";
import { BirthdaysPanel } from "@/features/birthdays/components/BirthdaysPanel";
import { SubFamilyTrinity } from "@/features/families/components/SubFamilyTrinity";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your family dashboard for gatherings, articles and birthdays.",
};

/**
 * The member home, in the design's order: welcome and search, the gathering
 * carousel, the celebration board beside the articles, the subfamily
 * trinity and the closing line.
 *
 * It draws on four features, so it is composed here: a feature never imports
 * another, and the route is the one layer allowed to bring them together.
 *
 * Only the search pill and the article list are client components that
 * re-render on a keystroke — they share the query through an external store
 * (@/hooks/useSearchQuery) — so everything else stays rendered on the server.
 *
 * The celebration board comes first in document order: on a phone it is the
 * first thing after the photographs, and the grid moves it back to the side
 * from `lg` up.
 */
export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div>
        <DashboardHeader search={<BlogSearch />} />
        <div className="mt-6">
          <HeroSlides />
        </div>
      </div>

      <div className="grid items-start gap-6 md:gap-8 lg:grid-cols-[minmax(0,1fr)_370px]">
        <PopularArticles className="order-2 lg:order-1" />
        <BirthdaysPanel className="order-1 lg:order-2" />
      </div>

      <SubFamilyTrinity />

      <DashboardTagline />
    </div>
  );
}
