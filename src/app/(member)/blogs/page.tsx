import type { Metadata } from "next";
import { BlogsHome } from "@/features/blogs/components/BlogsHome";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Stories, reflections and news written by members of the family.",
};

export default function MemberBlogsPage() {
  return <BlogsHome />;
}
