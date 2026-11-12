import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ROUTES } from "@/constants/routes";
import { StudioTabs } from "@/features/studio/components/StudioTabs";
import { PostEditor } from "@/features/studio/components/PostEditor";
import {
  getArticleBySlug,
  BLOG_PAGE_POSTS,
  formatPostDate,
} from "@/features/blogs/data";

export const metadata: Metadata = {
  title: "Edit Post",
  description: "Correct a post already in the archive.",
};

/**
 * Correct a post.
 *
 * The archive could publish, filter and bulk-delete ten posts and never
 * change one, so a typo in a family story was permanent. The body comes from
 * the article's own paragraphs, joined by the blank lines the editor splits
 * them on, so what is loaded is what the reader sees.
 */
export default async function AdminEditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = BLOG_PAGE_POSTS.find((one) => one.slug === slug);
  const article = getArticleBySlug(slug);
  if (!post || !article) notFound();

  return (
    <div className="section-enter min-w-0 pb-12">
      <PageHeader title="POSTS" />
      <span aria-hidden className="accent-bar bg-brand mt-3" />
      <p className="text-body-sm text-muted mt-2">
        {post.status === "draft" ? "An unfinished post" : "Published"} ·{" "}
        {formatPostDate(post.publishedOn)}
      </p>

      <div className="mt-6">
        <StudioTabs />
      </div>

      <Link
        href={ROUTES.STUDIO_POSTS}
        className="text-body-sm text-muted hover:text-brand focus-visible:outline-brand transition-fast mt-6 inline-flex items-center gap-2"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to the archive
      </Link>

      <div className="mt-6">
        <PostEditor
          post={{
            slug: post.slug,
            title: post.title,
            category: post.category,
            excerpt: post.excerpt,
            body: article.contentParagraphs.join("\n\n"),
            status: post.status,
            publishedOn: post.publishedOn,
            cover: post.cover,
            coverAlt: post.coverAlt,
          }}
        />
      </div>
    </div>
  );
}
