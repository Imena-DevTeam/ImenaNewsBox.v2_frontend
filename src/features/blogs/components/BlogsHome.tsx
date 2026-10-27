"use client";

import Image from "next/image";
import { NotebookPen, PartyPopper } from "lucide-react";
import { useMemo, useState } from "react";
import { BlogCard } from "./BlogCard";
import { BLOG_CATEGORIES, BLOG_PAGE_POSTS, type BlogCategory } from "../data";
import { dashboardFamilyGathering } from "@/lib/images";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { FamilyTagline } from "@/components/layout/FamilyTagline";

const HERO_TITLE = "A HEART WARMING FAMILY REUNION";

export function BlogsHome() {
  const [category, setCategory] = useState<BlogCategory>("All");
  const posts = useMemo(
    () =>
      category === "All"
        ? BLOG_PAGE_POSTS
        : BLOG_PAGE_POSTS.filter((post) => post.category === category),
    [category],
  );

  return (
    <div className="min-w-0 space-y-12 md:space-y-16">
      <PageHeader title="Blogs" subtitle="Stories From Our Family" />

      <section className="shadow-member relative mx-auto w-full max-w-[50rem] overflow-hidden rounded-lg">
        <Image
          src={dashboardFamilyGathering}
          alt="Family members smiling together at a reunion"
          priority
          sizes="(min-width: 1024px) 800px, 100vw"
          className="aspect-[1.45] w-full object-cover sm:aspect-[1.8]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"
        />
        {/* A background layer: a large, faint popper behind the banner's
            words, never near the header's bell and portrait. */}
        <PartyPopper
          aria-hidden
          className="text-surface/15 pointer-events-none absolute -top-6 -right-6 size-48 rotate-12"
          strokeWidth={1.2}
        />
        <div className="text-surface absolute inset-x-0 bottom-0 p-4 sm:p-8">
          <h2 className="text-h4-m sm:text-h3 md:text-h2 font-heading max-w-2xl leading-tight font-bold uppercase">
            {HERO_TITLE}
          </h2>
          <p className="text-caption sm:text-body-sm mt-2 line-clamp-3 max-w-2xl font-semibold">
            Amidst the hustle and bustle of our daily lives, this family reunion
            serves as a reminder of the importance of taking a pause and
            relishing the company of those who matter most.
          </p>
        </div>
      </section>

      <section aria-labelledby="recent-posts" className="relative isolate">
        {/* The section's background layer: two faint poppers behind the
            heading and filters, at an opacity that can sit under any of
            them without competing. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 overflow-hidden"
        >
          <PartyPopper
            className="text-gallery-ornament/60 absolute -top-4 left-[6%] size-36 -rotate-12"
            strokeWidth={1.2}
          />
          <PartyPopper
            className="text-gallery-ornament/60 absolute top-2 right-[6%] size-28 scale-x-[-1] rotate-6"
            strokeWidth={1.2}
          />
        </div>
        <div className="text-center">
          <h2
            id="recent-posts"
            className="text-brand text-h2-m md:text-h2 font-medium"
          >
            Recent Posts
          </h2>
          <span
            aria-hidden
            className="bg-brand rounded-pill mx-auto mt-3 block h-1 w-11"
          />
        </div>

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
      </section>

      <FamilyTagline className="mt-4" />
    </div>
  );
}
