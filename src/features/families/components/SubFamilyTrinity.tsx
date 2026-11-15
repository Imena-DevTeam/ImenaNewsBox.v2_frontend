import { Quote } from "@/components/ui/Quote";
import { placeholderFor } from "@/types/media";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crown, Users } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { TRINITY } from "../data";

/**
 * The three subfamilies of the trinity, each a photograph under a brand
 * wash with its name, motto, what it holds, its generation leader and a
 * member-count badge — solid enough to read as a card you can open, not a
 * pale placeholder.
 *
 * Each card opens that branch's own page, and is labelled individually so
 * screen readers hear which card is which.
 */
export function SubFamilyTrinity() {
  return (
    <section aria-labelledby="sub-family-trinity">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-brand text-caption mb-2 font-semibold tracking-widest uppercase">
            Our roots
          </p>
          <h2
            id="sub-family-trinity"
            className="text-h2-m text-member-ink md:text-h2"
          >
            Sub Family Trinity
          </h2>
        </div>
        <Link
          href={ROUTES.TREE}
          className="text-brand transition-fast hover:text-brand-hover text-caption inline-flex items-center gap-1 font-semibold"
        >
          Explore each family branch
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>

      <ul className="reveal-stagger mt-8 grid gap-5 sm:grid-cols-3">
        {TRINITY.map((family) => (
          <li key={family.name}>
            <Link
              href={`${ROUTES.FAMILIES}/${family.slug}`}
              className="shadow-member lift group relative flex aspect-4/3 items-end overflow-hidden rounded-lg"
              aria-label={`${family.name} subfamily, ${family.members} members, led by ${family.leader}`}
            >
              <Image
                src={family.image}
                alt=""
                fill
                placeholder={placeholderFor(family.image)}
                sizes="(min-width: 640px) 33vw, 100vw"
                className="transition-base object-cover group-hover:scale-105"
              />
              {/* A brand wash deep enough for white type at any point of
                  the photograph. */}
              <span
                aria-hidden
                className="from-member-ink/95 via-member-ink/65 to-member-ink/10 absolute inset-0 bg-gradient-to-t"
              />

              <span className="text-member-ink text-caption border-surface/60 bg-surface/80 absolute top-4 right-4 flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold backdrop-blur-md">
                <Users aria-hidden className="text-brand size-3.5" />
                {family.members} members
              </span>

              <span className="text-surface relative w-full p-5">
                <span className="text-caption text-surface/80 block font-semibold tracking-widest uppercase">
                  Family branch
                </span>
                <span className="text-h3-m mt-1 flex items-center gap-2 font-semibold">
                  {family.name}
                  <ArrowRight
                    aria-hidden
                    className="transition-base size-5 group-hover:translate-x-1"
                  />
                </span>
                <Quote
                  tone="light"
                  meaning={family.mottoMeaning}
                  className="mt-2"
                >
                  {family.motto}
                </Quote>
                <span className="text-body-sm text-surface/85 mt-2 block">
                  {family.holds}
                </span>
                <span className="text-caption text-surface/80 border-surface/20 mt-3 flex items-center gap-1.5 border-t pt-3">
                  <Crown
                    aria-hidden
                    className="text-celebration-gold size-3.5"
                  />
                  Generation leader: {family.leader}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
