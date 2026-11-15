import Image from "next/image";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { PopperOrnament } from "@/components/ui/Ornaments";
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
 * hero photograph, two headings, the decoration and the tagline
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

      <section className="shadow-member relative mx-auto w-full max-w-200 overflow-hidden rounded-lg">
        <Image
          src={dashboardFamilyGathering}
          alt="Family members smiling together at a reunion"
          priority
          sizes="(min-width: 1024px) 800px, 100vw"
          className="aspect-29/20 w-full object-cover sm:aspect-9/5"
        />
        <div
          aria-hidden
          className="from-member-ink/65 via-member-ink/10 absolute inset-0 bg-gradient-to-t to-transparent"
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

      <section aria-labelledby="recent-posts" className="space-y-10">
        <SectionHeading
          id="recent-posts"
          before={<PopperOrnament />}
          after={<PopperOrnament className="-scale-x-100" />}
        >
          Recent posts
        </SectionHeading>

        <BlogFeed />
      </section>

      <FamilyTagline className="mt-4" />
    </div>
  );
}
