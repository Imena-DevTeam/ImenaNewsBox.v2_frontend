import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/cn";
import { elder1, elder2, elder3, elder4 } from "@/lib/images";

const QUOTE =
  "Our history is our foundation. Let us remember where we came from while building a better future together.";

/* TODO: four different elders, each with their own words. All four names and
   the quote are placeholders repeated from the design. */
const ELDERS = [
  { name: "Rwamamara Mugisha Pacifique", image: elder2 },
  { name: "Rwamamara Mugisha Pacifique", image: elder1 },
  { name: "Rwamamara Mugisha Pacifique", image: elder4 },
  { name: "Rwamamara Mugisha Pacifique", image: elder3 },
];

export function EldersQuotes() {
  return (
    <section className="section-y relative overflow-hidden">
      <Container>
        <SectionTitle title="Hear from our elders" />

        <ul className="mt-14 grid gap-14 md:grid-cols-2 md:gap-x-10 md:gap-y-20">
          {ELDERS.map((elder, index) => (
            <li
              key={index}
              className={cn(
                "group flex items-start",
                /* The design staggers the cards down the column. */
                index % 2 === 1 && "md:mt-24",
              )}
            >
              {/* The portrait arrives first; its quote card slides in from
                  the photo's side a beat later, as if the elder had begun to speak.
                  Cards in the right column trail the left a little, so the
                  pairs read down the page in order. */}
              <Reveal
                from="bottom"
                delay={(index % 2) * 0.15}
                className="shrink-0"
              >
                <div className="img-zoom border-border w-32 rounded-md border sm:w-40">
                  <Image
                    src={elder.image}
                    alt={elder.name}
                    width={313}
                    height={471}
                    className="w-full object-cover"
                  />
                </div>
              </Reveal>

              {/* The card slides under the photo, so its content is padded
                  clear of it. */}
              <Reveal
                from="left"
                distance={56}
                delay={(index % 2) * 0.15 + 0.3}
                className="mt-10 -ml-8"
              >
                <figure className="bg-band shadow-main lift rounded-md py-5 pr-5 pl-14 sm:py-6 sm:pr-6 sm:pl-16">
                  <figcaption className="text-h4-m text-text md:text-h4">
                    {elder.name}
                  </figcaption>
                  <blockquote className="text-body text-text mt-4">
                    “{QUOTE}”
                  </blockquote>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
