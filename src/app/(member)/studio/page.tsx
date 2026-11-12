import type { Metadata } from "next";
import Link from "next/link";
import { FolderPlus, PenLine } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { ROUTES } from "@/constants/routes";
import { ActivityList } from "@/features/admin/components/ActivityList";
import { AdminBoard } from "@/features/admin/components/AdminBoard";
import { AttentionQueue } from "@/features/admin/components/AttentionQueue";
import { ResumeWriting } from "@/features/studio/components/ResumeWriting";
import { StudioTabs } from "@/features/studio/components/StudioTabs";
import { STUDIO_ACTIVITY, studioAttention } from "@/features/studio/data";
import { BLOGGER } from "@/constants/member";
import { BLOG_PAGE_POSTS } from "@/features/blogs/data";
import { FEATURED_ALBUMS } from "@/features/gallery/data";

export const metadata: Metadata = {
  title: "Studio",
  description: "What is waiting to be written, and what has been published.",
};

export default function StudioPage() {
  const drafts = [...BLOG_PAGE_POSTS]
    .filter((post) => post.status === "draft")
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));

  /* The band above the queue leads with the newest draft, so the queue
     carries the rest. */
  const waiting = studioAttention(drafts[0]?.slug);

  /* Fixed at render on the server and handed down, so the server and the
     client agree what "2 hours ago" means. */
  const now = new Date().toISOString();

  const counts = [
    {
      label: "Published",
      value: BLOG_PAGE_POSTS.filter((post) => post.status === "published")
        .length,
      href: ROUTES.STUDIO_POSTS,
    },
    {
      label: "Drafts",
      value: drafts.length,
      href: ROUTES.STUDIO_POSTS,
    },
    {
      label: "Albums",
      value: FEATURED_ALBUMS.length,
      href: ROUTES.STUDIO_ALBUMS,
    },
  ];

  return (
    <div className="section-enter min-w-0 pb-12">
      <PageHeader title="STUDIO" />
      <span aria-hidden className="accent-bar bg-brand mt-3" />

      <div className="mt-6">
        <StudioTabs />
      </div>

      <p className="text-body-sm text-muted mt-6 text-pretty">
        Signed in as{" "}
        <span className="text-member-ink font-medium">{BLOGGER.name}</span> ·{" "}
        {BLOGGER.role}
      </p>

      {/* The page leads with the writing, not with a row of buttons: the
          first question a writer has is where they left off. */}
      <div className="mt-5">
        <ResumeWriting drafts={drafts} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink
          variant="outline"
          size="md"
          href={ROUTES.STUDIO_POST_NEW}
          className="border-brand text-brand hover:border-brand-hover"
        >
          <PenLine aria-hidden className="size-4" />
          Write a post
        </ButtonLink>
        <ButtonLink
          variant="outline"
          size="md"
          href={ROUTES.STUDIO_ALBUM_NEW}
          className="border-brand text-brand hover:border-brand-hover"
        >
          <FolderPlus aria-hidden className="size-4" />
          Create an album
        </ButtonLink>
      </div>

      <div className="mt-10 md:mt-14">
        <AdminBoard
          bands={[
            {
              id: "attention",
              heading: "Needs attention",
              note:
                waiting.length > 0 ? `${waiting.length} waiting` : undefined,
              body: (
                <AttentionQueue
                  items={waiting}
                  emptyTitle="Nothing else is waiting."
                  emptyDescription="Every other story is published, and every album has photographs in it."
                />
              ),
            },
            {
              id: "activity",
              heading: "Recently published",
              body: <ActivityList entries={STUDIO_ACTIVITY} now={now} />,
            },
          ]}
        />
      </div>

      <section aria-labelledby="studio-counts" className="mt-10 md:mt-14">
        <h2 id="studio-counts" className="sr-only">
          The archive, in numbers
        </h2>
        <ul className="border-member-border divide-member-border bg-member-panel flex flex-col divide-y rounded-md border sm:flex-row sm:divide-x sm:divide-y-0">
          {counts.map((count) => (
            <li key={count.label} className="flex-1">
              <Link
                href={count.href}
                className="focus-visible:outline-brand hover:bg-member-tint transition-fast flex flex-col items-center gap-1 px-5 py-7"
              >
                {/* The figure climbs to itself once, when the strip is
                    scrolled to. Still no chart in here: a number that moves
                    is text, and it is the one sign this page is live rather
                    than a screenshot. Shorter than the public pages' climb,
                    because these are read rather than admired. */}
                <CountUp
                  value={count.value}
                  durationMs={420}
                  className="text-h1-m text-member-ink font-bold"
                />
                <span className="text-caption text-muted tracking-[0.14em] uppercase">
                  {count.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
