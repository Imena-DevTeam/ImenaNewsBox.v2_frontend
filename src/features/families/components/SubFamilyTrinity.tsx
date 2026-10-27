import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { TRINITY } from "../data";

/**
 * The three subfamilies of the trinity. The design shows each as a photo
 * aperture; until subfamily artwork exists the cards keep their shape and
 * describe themselves instead, so three identical "portrait coming" lines
 * never read as a failed load.
 *
 * They all lead to the family tree for now — that page is the one place the
 * branches are drawn — and are labelled individually so screen readers hear
 * which card is which.
 */
export function SubFamilyTrinity() {
  return (
    <section aria-labelledby="sub-family-trinity">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-brand text-caption mb-2 font-semibold tracking-[0.16em] uppercase">
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
          href={ROUTES.FAMILY_TREE}
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
              href={ROUTES.FAMILY_TREE}
              className="border-member-border bg-surface shadow-member lift hover:border-brand relative flex aspect-video items-end overflow-hidden rounded-lg border p-5"
              aria-label={`${family.name} subfamily — expand the family tree`}
            >
              <span
                aria-hidden
                className="bg-member-tint absolute inset-0 opacity-75"
              />
              <span className="relative">
                <span className="text-brand text-caption block font-semibold tracking-[0.14em] uppercase">
                  Family branch
                </span>
                <span className="text-h3-m text-member-ink mt-2 block font-semibold">
                  {family.name}
                </span>
                <span className="text-body-sm text-muted mt-3 block">
                  {family.holds}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
