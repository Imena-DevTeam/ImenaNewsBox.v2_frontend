import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Family Birthdays",
  description: "Every celebration in the family, month by month.",
};

export default function BirthdaysPage() {
  return (
    <ComingSoon
      title="Family Birthdays"
      description="Every celebration in the family, month by month."
    />
  );
}
