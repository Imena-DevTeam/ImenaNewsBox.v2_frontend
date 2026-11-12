import Image from "next/image";
import { PartyPopper } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FamilyTagline } from "@/components/layout/FamilyTagline";
import { dashboardFamilyGathering } from "@/lib/images";
import { BlogFeed } from "./BlogFeed";

const HERO_TITLE = "A HEART WARMING FAMILY REUNION";

/**
 * The family's stories.
 *
 * A **server component**. It was a client one for a single `useState`
 * holding which category is open — and that one piece of state pulled the
 * hero photograph, two headings, three decorative poppers and the tagline
 * into the browser bundle with it, to render markup that is the same for
 * everybody on every visit.
 *
 * What genuinely needs the browser is the category row and the grid under
 * it, and that is `BlogFeed`. Everything here is rendered once, on the
 * server, and arrives as HTML.
 */
export function BlogsHome() {
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

        <BlogFeed />
      </section>

      <FamilyTagline className="mt-4" />
    </div>
  );
}
