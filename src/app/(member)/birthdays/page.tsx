import type { Metadata } from "next";
import { Cake } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FamilyCelebrationsCalendar } from "@/features/birthdays/components/FamilyCelebrationsCalendar";

export const metadata: Metadata = {
  title: "Family Birthdays",
  description:
    "Celebrating life, joy and the growth of our brothers and sisters across all subfamilies.",
};

export default function BirthdaysPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-24">
      <PageHeader
        title="BIRTHDAYS"
        badgeIcon={<Cake className="size-6 text-[#581C87]" />}
        badgeLabel="Birthdays"
      />

      <FamilyCelebrationsCalendar />
    </div>
  );
}
