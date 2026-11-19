"use client";

import { POPULAR_POSTS } from "../data";
import { FeaturedPost } from "./FeaturedPost";
import { PersonalisedGallery } from "@/features/dashboard/components/PersonalisedGallery";
import { cn } from "@/lib/cn";
import { useSearchQuery } from "@/hooks/useSearchQuery";

/**
 * The dashboard's article column: the family's featured story, then the
 * photograph that leads into the gallery. The search pill above filters the
 * story in real time; when nothing matches, the column says so in a sentence
 * rather than reading as an error.
 */
export function PopularArticles({ className }: { className?: string }) {
  const { query } = useSearchQuery();

  const q = query.trim().toLowerCase();
  const posts = !q
    ? POPULAR_POSTS
    : POPULAR_POSTS.filter((post) =>
        [post.title, post.tag, post.excerpt].some((field) =>
          field.toLowerCase().includes(q),
        ),
      );

  const lead = posts[0];

  return (
    <section aria-labelledby="popular-articles" className={cn(className)}>
      <h2
        id="popular-articles"
        className="text-h2-m text-member-ink md:text-h2"
      >
        Popular Articles and Blogs
      </h2>

      <p aria-live="polite" className="sr-only">
        {q
          ? posts.length === 0
            ? "No articles match your search."
            : "1 article matches your search."
          : ""}
      </p>

      {posts.length === 0 ? (
        <p className="border-member-border text-body text-muted bg-member-tint mt-8 rounded-lg border px-6 py-12 text-center">
          Nothing in the family blog matches “{query.trim()}”. Try a word from
          the title, the tag or the story itself.
        </p>
      ) : (
        <>
          {lead ? (
            <FeaturedPost
              post={lead}
              showCover={false}
              framed={false}
              className="mt-6"
            />
          ) : null}

          <PersonalisedGallery className="mt-8" />
        </>
      )}
    </section>
  );
}
