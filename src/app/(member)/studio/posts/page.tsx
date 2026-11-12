import type { Metadata } from "next";
import { PenLine } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { StudioTabs } from "@/features/studio/components/StudioTabs";
import { PostsArchive } from "@/features/studio/components/PostsArchive";
import { BLOG_PAGE_POSTS } from "@/features/blogs/data";

export const metadata: Metadata = {
  title: "Manage Posts",
  description: "Every post in the family archive.",
};

export default function AdminPostsPage() {
  /* What the keeper of the archive needs from a subtitle is not how many
     there are, but how many are still waiting on them. */
  const drafts = BLOG_PAGE_POSTS.filter(
    (post) => post.status === "draft",
  ).length;
  const subtitle =
    drafts > 0
      ? `${BLOG_PAGE_POSTS.length} posts, ${drafts} unfinished`
      : `${BLOG_PAGE_POSTS.length} posts, all published`;

  return (
    <div className="section-enter min-w-0 pb-12">
      {/* The bar sits between the title and the line under it, so the
          subtitle reads as a caption to the page rather than to the rule. */}
      <PageHeader title="POSTS" />
      <span aria-hidden className="accent-bar bg-brand mt-3" />
      <p className="text-body-sm text-muted mt-2">{subtitle}</p>

      <div className="mt-5 flex justify-end">
        <ButtonLink variant="brand" size="sm" href={ROUTES.STUDIO_POST_NEW}>
          <PenLine aria-hidden className="size-4" />
          Write a post
        </ButtonLink>
      </div>

      <div className="mt-6">
        <StudioTabs />
      </div>

      <div className="mt-6">
        <PostsArchive posts={BLOG_PAGE_POSTS} />
      </div>
    </div>
  );
}
