import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Blogs and Posts",
  description:
    "Stories, reflections and news written by members of the family.",
};

export default function BlogsandPostsPage() {
  return (
    <ComingSoon
      title="Blogs and Posts"
      description="Stories, reflections and news written by members of the family."
    />
  );
}
