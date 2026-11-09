import Image, { type StaticImageData } from "next/image";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/cn";
import { elder1, elder2, elder3, elder4 } from "@/lib/images";

interface Elder {
  name: string;
  image: StaticImageData;
  Quote: string;
}

const ELDERS: Elder[] = [
  {
    name: "SHEMA Frank",
    image: elder2,
    Quote:
      "Our history is our foundation. Let us remember where we came from while building a better future together.",
  },
  {
    name: "UMULINGA Jolie",
    image: elder1,
    Quote:
      "Out of the ashes of our darkest chapter, a new generation has risen—one defined not by division, but by a shared promise that peace and progress belong to everyone.",
  },
  {
    name: "MUHIRE Igor",
    image: elder4,
    Quote:
      "We cannot turn back the clock, nor can we erase the tragic history we have endured. But we can choose how we respond to it.",
  },
  {
    name: "MANZI Kabanda Cedric",
    image: elder3,
    Quote:
      "True reconciliation is not about forgetting the past, but about choosing to live together with a shared commitment that such horror will never happen again.",
  },
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
              <Image
                src={elder.image}
                alt={elder.name}
                placeholder="blur"
                sizes="10rem"
                className="border-border w-32 shrink-0 rounded-md border object-cover sm:w-40"
              />

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
                    “{elder.Quote}”
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
