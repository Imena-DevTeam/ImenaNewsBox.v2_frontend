import { Users } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HeartsOrnament } from "@/components/ui/Ornaments";
import { cn } from "@/lib/cn";

/* The four slogans, placed at the top, left, right and bottom of the cross.
   The middle cell stays empty. */
const SLOGANS = [
  {
    title: "IMENA FAMILY",
    slogan: "Kubw’umurava n’ikizere imbere hacu heza ntituzazima",
    placement: "md:col-start-2 md:row-start-1",
  },
  {
    title: "WIHOGORA",
    slogan: "Rooted in love, rising in life, resilience is our might",
    placement: "md:col-start-1 md:row-start-2",
  },
  {
    title: "LIGHT FAMILY",
    slogan: "Fly over dangers and go high because you are light",
    placement: "md:col-start-3 md:row-start-2",
  },
  {
    title: "FAMILY HOPE",
    slogan: "Learn from the past, live for today, hope for tomorrow",
    placement: "md:col-start-2 md:row-start-3",
  },
];

export function Slogans() {
  return (
    /* overflow-x-clip: the turning cards sweep well past the grid box at this
       size, and without this they would add a horizontal scrollbar. The tall
       vertical padding is the other half of the same problem — the rotation
       carries the corners far above and below the grid. */
    <section className="overflow-x-clip py-16 md:py-32 lg:py-52">
      <Container>
        <SectionTitle title="OUR SLOGANS" />

        <Reveal blur delay={0.3} distance={16}>
          <p className="text-h3-m md:text-h3 mt-6 text-center">
            Passionately Spoken
          </p>
        </Reveal>

        {/* The whole cross turns slowly, so the cards travel in a circle.
            Before it starts, the cards assemble: each grows into its arm of
            the cross in turn, top first, then the heart lands in the middle.
            Motion only scales the cards inside each item, so it never touches
            the transforms the orbit animation runs on. */}
        <Stagger
          as="ul"
          stagger={0.12}
          delay={0.2}
          className={cn(
            "mx-auto mt-14 grid max-w-sm grid-cols-1 gap-6 md:mt-24",
            "md:max-w-slogan-cross md:grid-cols-3 md:grid-rows-3",
            /* pause-on-hover: the cards carry body text, and text cannot be
               read while it is travelling. Hovering or tabbing into the cross
               stops it, which is also what WCAG 2.2.2 asks for. */
            "pause-on-hover motion-safe:md:animate-orbit",
          )}
        >
          {SLOGANS.map((item) => (
            <li
              key={item.title}
              /* Turns against the wrapper at the same rate, so the text
                 stays upright all the way round. */
              className={cn(
                "motion-safe:md:animate-orbit-reverse",
                item.placement,
              )}
            >
              <figure className="bg-slogan-card md:aspect-slogan-card relative flex h-full flex-col justify-center rounded-md p-6 md:p-8">
                <span
                  aria-hidden
                  className="bg-stat text-surface rounded-pill absolute top-6 left-6 flex size-9 items-center justify-center md:top-8 md:left-8"
                >
                  <Users className="size-4" />
                </span>

                <figcaption className="text-h4-m md:text-h4 font-heading text-text mt-10 tracking-wide md:mt-6">
                  {item.title}
                </figcaption>

                {/* text-text, not the usual muted grey: on the lavender card
                    #6b6b6b reaches only 2.9:1. The title still leads on weight
                    and size. */}
                <blockquote className="text-body-sm text-text mt-3">
                  {item.slogan}
                </blockquote>
              </figure>
            </li>
          ))}

          <li className="hidden place-items-center md:col-start-2 md:row-start-2 md:grid">
            <StaggerItem from="none" scale={0.4}>
              <HeartsOrnament className="motion-safe:md:animate-orbit-reverse w-16" />
            </StaggerItem>
          </li>
        </Stagger>
      </Container>
    </section>
  );
}
