"use client";

import { POPULAR_POSTS } from "../data";
import { FeaturedPost } from "./FeaturedPost";
import { cn } from "@/lib/cn";
import { useSearchQuery } from "@/hooks/useSearchQuery";

/**
 * The article column, and the thing the search pill above actually filters.
 *
 * It leads with the family's featured story and follows with the rest of the
 * archive as cards, so a search has more than one place to land — a pill
 * that invites a query over a single record answers most of them with
 * "nothing found", which reads as an error rather than an empty state.
 *
 * The count is announced as the list changes, and the sample disclaimer is
 * shown the way the birthday column shows its own: visibly, rather than
 * only where a screen reader can find it.
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
  const rest = posts.slice(1);

  return (
    <section
      aria-labelledby="popular-articles"
      className={cn(
        "border-member-border bg-member-panel shadow-member rounded-lg border p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        {/* No scroll reveal on this heading: it must sit on the same line
            as the birthday board's at every scroll position. */}
        <div>
          <p className="text-brand text-caption mb-2 font-semibold tracking-[0.16em] uppercase">
            From the archive
          </p>
          <h2
            id="popular-articles"
            className="text-h2-m text-member-ink md:text-h2"
          >
            Popular Articles and Blogs
          </h2>
        </div>
        <p className="text-muted text-caption" aria-live="polite">
          {q
            ? `${posts.length} of ${POPULAR_POSTS.length} match “${query.trim()}”`
            : `${POPULAR_POSTS.length} in the family archive`}
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {q
          ? posts.length === 1
            ? "1 article matches your search."
            : `${posts.length} articles match your search.`
          : ""}
      </p>

      {posts.length === 0 ? (
        <p className="border-member-border text-body text-muted bg-member-tint mt-8 rounded-lg border px-6 py-12 text-center">
          Nothing in the family blog matches “{query.trim()}”. Try a word from
          the title, the tag or the story itself.
        </p>
      ) : (
        <>
          {lead ? <FeaturedPost post={lead} className="reveal mt-8" /> : null}

          {rest.length > 0 ? (
            <ul
              className={cn("reveal-stagger", "mt-8 grid gap-5 sm:grid-cols-2")}
            >
              {rest.map((post) => (
                <li key={post.slug}>
                  <FeaturedPost post={post} compact className="h-full" />
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}

      <p className="text-caption text-muted mt-6 text-center">
        Sample articles, shown until the family blog is connected.
      </p>
    </section>
  );
}
