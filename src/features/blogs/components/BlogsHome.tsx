"use client";

import Image from "next/image";
import { PartyPopper } from "lucide-react";
import { useMemo, useState } from "react";
import { BlogCard } from "./BlogCard";
import { BLOG_CATEGORIES, BLOG_PAGE_POSTS, type BlogCategory } from "../data";
import { dashboardFamilyGathering } from "@/lib/images";
import { cn } from "@/lib/cn";
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
    <div className="page-enter min-w-0 space-y-12 md:space-y-16">
      <div className="relative min-w-0">
        <div className="flex items-start justify-between gap-4">
          <PageHeader title="Blogs" subtitle="Stories From Our Family" />
          <PartyPopper
            aria-hidden
            className="text-gallery-ornament absolute top-0 right-2 hidden size-16 rotate-12 lg:block"
            strokeWidth={1.8}
          />
        </div>
      </div>

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

      <section aria-labelledby="recent-posts" className="relative">
        <PartyPopper
          aria-hidden
          className="text-gallery-ornament absolute top-0 left-[4%] hidden size-20 -rotate-12 lg:block"
          strokeWidth={1.6}
        />
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
          <div className="bg-brand text-surface rounded-pill text-body-sm inline-flex px-4 py-2 font-semibold">
            Categories →
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
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

        <div className="mt-8 grid gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        {posts.length === 0 ? (
          <p className="text-muted mt-10 text-center">
            No posts in this category yet.
          </p>
        ) : null}
      </section>

      <FamilyTagline className="mt-4" />
    </div>
  );
}
