import { Users } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HeartsOrnament, HouseHeartOrnament } from "@/components/ui/Ornaments";
import { cn } from "@/lib/cn";

/* The four slogans, placed at the top, left, right and bottom of the cross.
   The middle cell holds the hearts. */
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
    title: "HOPE FAMILY",
    slogan:
      "Ba umwana mu gihe ukina, ba umugabo mu gihe ukora, kora igikwiye mu gihe gikwiye.",
    placement: "md:col-start-2 md:row-start-3",
  },
];

export function Slogans() {
  return (
    <section className="relative overflow-x-clip py-16 md:py-24">
      {/* The ornaments scattered around the cross: hearts to the right of the
          top card and beside the bottom one, a house in the lower right. */}
      <HeartsOrnament className="motion-safe:animate-float-slow absolute top-[30%] right-[6%] hidden w-14 md:block" />
      <HeartsOrnament className="motion-safe:animate-float-slow absolute bottom-[14%] left-[3%] hidden w-14 md:block" />
      <HouseHeartOrnament className="motion-safe:animate-float-slow absolute right-[12%] bottom-[8%] hidden size-20 rotate-[-15deg] md:block" />

      <Container>
        <SectionTitle title="OUR SLOGANS" />

        <Reveal blur delay={0.3} distance={16}>
          <p className="text-h3-m md:text-h3 mt-6">Passionately Spoken</p>
        </Reveal>

        {/* The cards assemble one after another, top first, then the hearts
            land in the middle. The arms of the cross sit almost edge to edge,
            as in the design. */}
        <Stagger
          as="ul"
          stagger={0.12}
          delay={0.2}
          className={cn(
            "mx-auto mt-10 grid max-w-sm grid-cols-1 gap-4 md:mt-4",
            "md:max-w-slogan-cross md:grid-cols-3 md:grid-rows-3 md:gap-x-0 md:gap-y-2",
          )}
        >
          {SLOGANS.map((item) => (
            <StaggerItem
              key={item.title}
              as="li"
              from="none"
              scale={0.85}
              className={item.placement}
            >
              <figure className="bg-slogan-card md:aspect-slogan-card relative flex h-full flex-col justify-center rounded-md p-6 md:p-8">
                <span
                  aria-hidden
                  className="bg-stat text-surface rounded-pill absolute top-6 left-6 flex size-9 items-center justify-center md:top-8 md:left-8"
                >
                  <Users className="size-4" />
                </span>

                <figcaption className="text-h4-m md:text-h4 font-heading text-text mt-10 md:mt-0">
                  {item.title}
                </figcaption>

                {/* text-text, not the usual muted grey: on the lavender card
                    #6b6b6b reaches only 2.9:1. */}
                <blockquote className="text-body-sm text-text mt-3 tracking-wider">
                  {item.slogan}
                </blockquote>
              </figure>
            </StaggerItem>
          ))}

          <li className="hidden place-items-center md:col-start-2 md:row-start-2 md:grid">
            <StaggerItem from="none" scale={0.4}>
              <HeartsOrnament className="w-16" />
            </StaggerItem>
          </li>
        </Stagger>
      </Container>
    </section>
  );
}
