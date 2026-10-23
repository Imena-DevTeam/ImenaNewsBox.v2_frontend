import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
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
    <section id="values" className="section-y overflow-x-clip">
      <Container>
        <SectionTitle title="Core Family Values" />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <Parallax distance={-30} className="mx-auto w-full max-w-sm">
            <MaskReveal
              from="top"
              className="border-primary/15 overflow-hidden rounded-md border"
            >
              <Image
                src={coreValues}
                alt="Young members of the IMENA family standing together"
                placeholder="blur"
                sizes="(min-width: 1024px) 22rem, 24rem"
                className="w-full object-cover"
              />
            </MaskReveal>
          </Parallax>

          {/* The four values come in one by one, each from the outside edge
              of its column, so the pairs close in toward the middle. */}
          <Stagger
            as="dl"
            stagger={0.15}
            delay={0.2}
            className="grid gap-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-16"
          >
            {VALUES.map((value, index) => (
              <StaggerItem
                key={value.title}
                from={index % 2 === 0 ? "left" : "right"}
                className="group text-center"
              >
                <dt className="text-ui text-text tracking-wider uppercase">
                  {value.title}
                  {/* The value's own short rule, drawing out under its name
                      on hover. Inside the dt, since a dl group may only hold
                      dt and dd. */}
                  <span
                    aria-hidden
                    className="bg-heading rounded-pill transition-base mx-auto mt-2 block h-0.5 w-8 scale-x-0 group-hover:scale-x-100"
                  />
                </dt>
                <dd className="text-body text-text mt-3">{value.body}</dd>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
