import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Join as a Member",
  description:
    "Request a place in the family record and add your own chapter to it.",
};

export default function JoinasaMemberPage() {
  return (
    <ComingSoon
      title="Join as a Member"
      description="Request a place in the family record and add your own chapter to it."
    />
  );
}
