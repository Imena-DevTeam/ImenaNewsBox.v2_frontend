import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { TRINITY } from "../data";

/**
 * The three subfamilies, each as a light card: the branch's photograph above
 * its name, its identity line, a sentence about it, and the way through to
 * its tree. The design keeps these plain and bright rather than washed under
 * a dark overlay.
 */
export function SubFamilyTrinity() {
  return (
    <section aria-labelledby="sub-family-trinity">
      <h2
        id="sub-family-trinity"
        className="text-h2-m text-member-ink md:text-h2"
      >
        Sub Family Trinity
      </h2>
      <p className="text-body text-muted mt-3 max-w-2xl">
        Within IMENA Family, our family is connected through different
        subfamilies, each carrying its own identity, spirit, and message while
        remaining part of one greater family.
      </p>

      <ul className="reveal-stagger mt-8 grid gap-6 sm:grid-cols-3">
        {TRINITY.map((family) => (
          <li key={family.name}>
            <article className="border-member-border bg-surface shadow-member flex h-full flex-col overflow-hidden rounded-2xl border">
              <div className="relative aspect-3/2">
                <Image
                  src={family.image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-h4 text-member-ink font-bold tracking-tight uppercase">
                  {family.name}
                </h3>
                <p className="font-member-serif text-brand mt-1.5 text-sm italic">
                  {family.tagline}
                </p>
                <p className="text-body-sm text-muted mt-3 flex-1">
                  {family.summary}
                </p>

                <ButtonLink
                  href={`${ROUTES.FAMILIES}/${family.slug}`}
                  aria-label={`View the ${family.name} family tree`}
                  className="bg-member-tint text-brand hover:bg-member-active/40 rounded-field mt-5 w-full border-0 text-sm font-semibold"
                >
                  View Family Tree
                  <ArrowRight aria-hidden className="size-4" />
                </ButtonLink>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
