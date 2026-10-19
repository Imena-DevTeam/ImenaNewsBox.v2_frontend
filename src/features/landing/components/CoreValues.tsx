import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { coreValues } from "@/lib/images";

const VALUES = [
  {
    title: "Remembering",
    body: "Preserving our history, honoring those who came before us, and keeping their memories alive.",
  },
  {
    title: "Mentorship",
    body: "Guiding, supporting, and helping one another grow across generations.",
  },
  {
    title: "Protection",
    body: "Standing together, protecting one another, and preserving the unity of our family.",
  },
  {
    title: "Resilience",
    body: "Facing challenges with strength and hope while continuing to build a better future.",
  },
];

export function CoreValues() {
  return (
    <section id="values" className="section-y">
      <Container>
        <SectionTitle title="Core Family Values" />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <Image
            src={coreValues}
            alt="Young members of the IMENA family standing together"
            placeholder="blur"
            sizes="(min-width: 1024px) 22rem, 24rem"
            className="border-primary/15 mx-auto w-full max-w-sm rounded-md border object-cover"
          />

          <dl className="reveal-stagger grid gap-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-16">
            {VALUES.map((value) => (
              <div key={value.title} className="text-center">
                <dt className="text-ui text-text tracking-wider uppercase">
                  {value.title}
                </dt>
                <dd className="text-body text-text mt-3">{value.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
