import type { Metadata } from "next";
import { Cake } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { todayAndNext } from "@/features/birthdays/data";
import { registerCelebrants } from "../_lib/birthdays";
import { FamilyCelebrationsCalendar } from "@/features/birthdays/components/FamilyCelebrationsCalendar";

export const metadata: Metadata = {
  title: "Family Birthdays",
  description:
    "Celebrating life, joy and the growth of our brothers and sisters across all subfamilies.",
};

export default function BirthdaysPage() {
  const now = new Date();
  const celebrants = registerCelebrants();
  const { today } = todayAndNext(celebrants, now);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-24">
      <PageHeader
        title="Birthdays"
        badgeIcon={<Cake className="text-brand-hover size-6" />}
        badgeLabel="Birthdays"
      />

      <FamilyCelebrationsCalendar
        celebrants={celebrants}
        today={today}
        initialMonth={now.getUTCMonth()}
      />
    </div>
  );
}
