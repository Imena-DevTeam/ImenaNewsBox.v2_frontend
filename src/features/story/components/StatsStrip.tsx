import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { CountUp } from "@/components/ui/CountUp";
import { cn } from "@/lib/cn";
import { storyCircle } from "@/lib/images";

/* A description list, so each figure is announced together with its label
   instead of as a loose number. The label comes first in the markup, as
   HTML requires, and flex-col-reverse puts the figure above it on screen. */
function Stat({
  value,
  suffix,
  label,
  colour,
  className,
}: {
  value: number;
  suffix?: string;
  label: string;
  colour: string;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "flex flex-col-reverse items-center text-center",
        className,
      )}
    >
      <dt className="text-h4-m md:text-h3 font-normal">{label}</dt>
      {/* The figure comes into focus as it starts to count. */}
      <dd className={cn("text-display-m md:text-display", colour)}>
        <Reveal from="none" blur duration={0.8}>
          <CountUp value={value} suffix={suffix} />
        </Reveal>
      </dd>
    </dl>
  );
}

/* The rule that runs from the page edge to the portrait and opens into a
   flare cupping it. Drawn in the direction of the left-hand one; the right
   one is the same thing mirrored. The inner edge of the flare is an arc of
   the portrait's own circle, so the gap between them stays even. */
function Rule({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "text-border pointer-events-none absolute top-1/2 hidden h-20 w-screen -translate-y-1/2 items-center md:flex",
        side === "left" ? "right-full mr-2" : "left-full ml-2 flex-row-reverse",
      )}
    >
      <span className="h-2 flex-1 bg-current" />
      <svg
        viewBox="0 0 40 100"
        preserveAspectRatio="none"
        fill="currentColor"
        className={cn("h-full w-10", side === "right" && "-scale-x-100")}
      >
        <path d="M0 45C22 45 35 38 40 0Q31 50 40 100C35 62 22 55 0 55Z" />
      </svg>
    </span>
  );
}

export function StatsStrip() {
  return (
    <section className="section-y relative overflow-hidden">
      <Container className="relative">
        {/* Underlined to the width of the words, with a sparkle hung off each
            end of the line — this title only; the others keep the short bar. */}
        <div className="relative mx-auto w-fit">
          <SplitText
            as="h2"
            lines={[["OUR STORY"]]}
            className="text-h3-m text-heading border-heading md:text-h2 border-b-4 pb-1"
          />
          <Sparkles
            aria-hidden
            className="text-heading absolute top-full right-full mt-2 mr-1 size-5 md:size-6"
          />
          <Sparkles
            aria-hidden
            className="text-heading absolute top-full left-full ml-1 size-5 -scale-x-100 md:size-6"
          />
        </div>

        {/* Two rows either side of the portrait, which spans both. The rule
            sits on the line between the rows, at the portrait's middle. */}
        <div className="mt-16 grid items-center gap-8 md:mt-24 md:grid-cols-[1fr_auto_1fr] md:grid-rows-2 md:gap-x-12 md:gap-y-0">
          {/* The faded half is --color-display-soft, not the design's paler
              lavender, which could not be read; it needs the large size. */}
          <p className="font-heading text-h4-m text-text lg:text-h3 tracking-tighter md:col-start-1 md:row-start-1 md:self-end md:pb-12 md:text-left">
            <Reveal as="span" from="left" className="block">
              IMENA is not just a family but a spirit and&mdash;culture that{" "}
              <span className="text-display-soft">
                embodies what we do plus the way we live.
              </span>
            </Reveal>
          </p>

          {/* The portrait opens as a circle from its centre, the figures
              around it following. On hover it turns very slightly, like a
              photograph picked up to look at. The shadow is on a wrapper
              because the reveal's clip would cut it off. */}
          <div className="rounded-pill shadow-portrait relative mx-auto w-56 md:col-start-2 md:row-span-2 md:row-start-1 md:w-72 lg:w-96">
            <Rule side="left" />
            <Rule side="right" />
            <MaskReveal from="center" className="rounded-pill overflow-hidden">
              <Image
                src={storyCircle}
                alt="Members of the IMENA family gathered outside their home"
                placeholder="blur"
                sizes="(min-width: 1024px) 24rem, (min-width: 768px) 18rem, 14rem"
                className="transition-base aspect-square w-full object-cover motion-safe:hover:scale-105 motion-safe:hover:rotate-2"
              />
            </MaskReveal>
          </div>

          <Stat
            value={140}
            suffix="+"
            label="Members"
            colour="text-stat"
            className="md:col-start-3 md:row-start-1 md:self-end md:pb-12"
          />

          <Stat
            value={3}
            label="Subfamilies"
            colour="text-primary"
            className="md:col-start-1 md:row-start-2 md:self-start md:pt-12"
          />

          <p className="text-body-lg text-muted md:text-h4 font-normal md:col-start-3 md:row-start-2 md:self-start md:pt-12 md:text-left">
            <Reveal as="span" from="right" delay={0.15} className="block">
              IMENA is not just a family but a{" "}
              <span className="font-semibold">spirit,</span> the solidarity
              endures across all chapters.
            </Reveal>
          </p>
        </div>
      </Container>
    </section>
  );
}
