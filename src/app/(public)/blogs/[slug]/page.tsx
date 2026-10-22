import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

/* The posts on the landing page link to their own page. Until there is
   somewhere to read them, each slug lands here rather than on a 404. */

const titleFrom = (slug: string) =>
  slug
    .split("-")
    .join(" ")
    .replace(/^\w/, (c) => c.toUpperCase());

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: titleFrom(slug) };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <ComingSoon
      title={titleFrom(slug)}
      description="This post has not been written up yet. It will live here once the family blog is running."
    />
  );
}
