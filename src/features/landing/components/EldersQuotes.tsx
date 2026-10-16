import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/cn";

const QUOTE =
  "Our history is our foundation. Let us remember where we came from while building a better future together.";

const ELDERS = [
  { name: "Rwamamara Mugisha Pacifique", image: "/images/elder-2.png" },
  { name: "Rwamamara Mugisha Pacifique", image: "/images/elder-1.png" },
  { name: "Rwamamara Mugisha Pacifique", image: "/images/elder-4.png" },
  { name: "Rwamamara Mugisha Pacifique", image: "/images/elder-3.png" },
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
                "flex items-start",
                /* The design staggers the cards down the column. */
                index % 2 === 1 && "md:mt-24",
              )}
            >
              <Image
                src={elder.image}
                alt={elder.name}
                width={313}
                height={471}
                className="border-border w-32 shrink-0 rounded-md border object-cover sm:w-40"
              />

              {/* The card slides under the photo, so its content is padded clear of it. */}
              <figure className="bg-primary/5 shadow-main mt-10 -ml-8 rounded-md py-5 pr-5 pl-14 sm:py-6 sm:pr-6 sm:pl-16">
                <figcaption className="text-h4-m text-text md:text-h4">
                  {elder.name}
                </figcaption>
                <blockquote className="text-body text-text mt-4">
                  “{QUOTE}”
                </blockquote>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
