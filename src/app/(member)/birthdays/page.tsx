import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { BirthdaysPanel } from "@/features/birthdays/components/BirthdaysPanel";
import { FamilyCelebrationsCalendar } from "@/features/birthdays/components/FamilyCelebrationsCalendar";

export const metadata: Metadata = {
  title: "Family Birthdays",
  description: "Every celebration in the family, month by month.",
};

export default function BirthdaysPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 pb-24">
      <PageHeader
        title="BIRTHDAYS"
        subtitle="Celebrations & Wishes Across the Family"
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Full Family Calendar & Month Schedule */}
        <main className="order-2 lg:order-1">
          <FamilyCelebrationsCalendar />
        </main>

        {/* Today's Spotlight & Quick Wish Panel */}
        <aside className="order-1 lg:order-2">
          <BirthdaysPanel className="sticky top-24" />
        </aside>
      </div>
    </div>
  );
}
