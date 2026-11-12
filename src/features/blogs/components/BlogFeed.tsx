"use client";

import { useMemo, useState } from "react";
import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { BlogCard } from "./BlogCard";
import { BLOG_CATEGORIES, BLOG_PAGE_POSTS, type BlogCategory } from "../data";

/**
 * The category row and the stories under it.
 *
 * This is the only part of the blogs page that needs the browser: one piece
 * of state deciding which category is open. It used to be the whole page —
 * the hero photograph, the headings, the ornaments and the tagline were all
 * inside the same client component because of this one `useState`, so every
 * line of that static markup was compiled into the browser bundle to render
 * something that never changes.
 *
 * The posts are read from the module here rather than passed in as a prop.
 * `BlogCard` already imports from the same module, so handing them down from
 * the server would serialise the whole list into the RSC payload **and**
 * keep it in the bundle: the same data, shipped twice.
 */
export function BlogFeed() {
  const [category, setCategory] = useState<BlogCategory>("All");

  const posts = useMemo(
    () =>
      category === "All"
        ? BLOG_PAGE_POSTS
        : BLOG_PAGE_POSTS.filter((post) => post.category === category),
    [category],
  );

  return (
    <>
      <div className="mt-6 px-4 lg:px-10">
        <div
          role="group"
          aria-labelledby="blog-categories"
          className="flex flex-wrap items-center gap-2"
        >
          <span
            id="blog-categories"
            className="text-member-ink text-body-sm mr-1 font-semibold"
          >
            Categories:
          </span>
          {BLOG_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={cn(
                "rounded-pill text-caption transition-fast px-3 py-1.5",
                category === item
                  ? "bg-brand text-surface"
                  : "bg-member-tint text-member-ink hover:bg-brand/20",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="border-member-border bg-member-tint mx-4 mt-8 rounded-lg border px-6 py-14 text-center lg:mx-10">
          <span className="bg-surface text-brand shadow-menu rounded-pill mx-auto grid size-14 place-items-center">
            <NotebookPen aria-hidden className="size-6" />
          </span>
          <p className="text-h4-m md:text-h4 text-member-ink mt-5">
            No {category.toLowerCase()} stories yet
          </p>
          <p className="text-body-sm text-muted mx-auto mt-2 max-w-sm">
            Nobody has written one up so far. The rest of the family&rsquo;s
            stories are a click away.
          </p>
          <Button
            variant="brand"
            size="sm"
            className="mt-6"
            onClick={() => setCategory("All")}
          >
            View all stories
          </Button>
        </div>
      ) : (
        /* A short result is centred rather than left hanging in the first
           columns of a three-column grid. */
        <div
          className={cn(
            "mx-auto mt-8 grid gap-6 px-4 sm:grid-cols-2 lg:px-10",
            posts.length >= 3 && "lg:grid-cols-3",
            posts.length === 2 && "max-w-4xl",
            posts.length === 1 && "max-w-md sm:grid-cols-1",
          )}
        >
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
