import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FamilyTagline } from "@/components/layout/FamilyTagline";
import { PageHeader } from "@/components/layout/PageHeader";
import { SloganCallout } from "@/features/families/components/SloganCallout";
import { SubfamilyHeader } from "@/features/families/components/SubfamilyHeader";
import { SUBFAMILY_SLUGS, getSubfamilyBySlug } from "@/features/families/data";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SUBFAMILY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const family = getSubfamilyBySlug(slug);
  if (!family) return { title: "Family branch not found" };
  return {
    title: `${family.name} Family`,
    description: family.holds,
  };
}

export default async function SubfamilyPage({ params }: Params) {
  const { slug } = await params;
  const family = getSubfamilyBySlug(slug);
  if (!family) notFound();

  const facts = [
    { label: "Members", value: String(family.members) },
    { label: "Generations", value: String(family.generations) },
    { label: "Since", value: String(family.founded) },
  ];

  return (
    <div className="min-w-0 pb-12">
      <PageHeader title={family.name} />

      <div className="mt-6 md:mt-8">
        <SubfamilyHeader family={family} />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="border-member-border bg-member-panel rounded-lg border px-4 py-4 text-center"
          >
            <dt className="text-caption text-muted font-semibold tracking-[0.14em] uppercase">
              {fact.label}
            </dt>
            <dd className="text-h3-m text-member-ink mt-1 font-semibold">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="subfamily-story" className="mt-10 md:mt-14">
        <h2 id="subfamily-story" className="text-h3-m text-member-ink">
          The branch, in its own words
        </h2>
        <span aria-hidden className="accent-bar bg-brand mt-2" />
        <div className="mt-5 max-w-prose space-y-4">
          {family.story.map((paragraph) => (
            <p key={paragraph} className="text-body text-text">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <div className="mt-10 md:mt-14">
        <SloganCallout family={family} />
      </div>

      <section aria-labelledby="subfamily-moments" className="mt-10 md:mt-14">
        <h2 id="subfamily-moments" className="text-h3-m text-member-ink">
          Moments from this house
        </h2>
        <span aria-hidden className="accent-bar bg-brand mt-2" />
        <ul className="reveal-stagger mt-6 grid gap-5 sm:grid-cols-2">
          {family.moments.map((moment) => (
            <li key={moment.caption}>
              <figure>
                <div className="shadow-member relative aspect-4/3 overflow-hidden rounded-lg">
                  <Image
                    src={moment.image}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-body-sm text-muted mt-2">
                  {moment.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <FamilyTagline className="mt-16 md:mt-24" />
    </div>
  );
}
