import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SparkleOrnament } from "@/components/ui/Ornaments";
import { cn } from "@/lib/cn";
import { storyCircle } from "@/lib/images";

/* A description list, so each figure is announced together with its label
   instead of as a loose number. The label comes first in the markup, as
   HTML requires, and flex-col-reverse puts the figure above it on screen. */
function Stat({
  value,
  suffix,
  label,
  size,
  colour,
  className,
}: {
  value: number;
  suffix?: string;
  label: string;
  size: string;
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
      <dt className="text-body-lg">{label}</dt>
      {/* The figure comes into focus as it starts to count. */}
      <dd className={cn(colour, size)}>
        <Reveal from="none" blur duration={0.8}>
          <CountUp value={value} suffix={suffix} />
        </Reveal>
      </dd>
    </dl>
  );
}

export function StatsStrip() {
  return (
    <section className="section-y relative overflow-hidden">
      <Container className="relative">
        {/* The title with a glint either side of it, below-left and
            below-right, as in the design. */}
        <div className="relative mx-auto w-fit px-10">
          <SectionTitle title="OUR STORY" />
          <SparkleOrnament className="absolute -bottom-3 left-0 size-5" />
          <SparkleOrnament className="absolute right-0 -bottom-1 size-5" />
        </div>

        {/* Two rows either side of the portrait, which spans both. A single
            rule runs out to both edges of the page through the middle and
            stops at the ring around the circle. */}
        <div className="relative mt-12 grid items-center gap-8 md:mt-16 md:grid-cols-[1fr_auto_1fr] md:grid-rows-2 md:gap-x-10 md:gap-y-0">
          <span
            aria-hidden
            className="bg-border absolute top-1/2 left-1/2 hidden h-0.5 w-screen -translate-x-1/2 md:block"
          />

          <p className="text-body-lg text-text relative font-semibold tracking-tight md:col-start-1 md:row-start-1 md:self-end md:pb-10 md:text-left">
            <Reveal as="span" from="left" className="block">
              IMENA is not just a family but a spirit and&mdash;culture that{" "}
              <span className="text-story-soft">
                embodies what we do plus the way we live.
              </span>
            </Reveal>
          </p>

          {/* The portrait opens as a circle from its centre, the figures
              around it following. A pale ring around it holds the rule off
              the photograph, and a warm light sits under its brown rim. */}
          <div className="border-border bg-background rounded-pill relative mx-auto border p-3 shadow-[0_26px_34px_-20px_var(--color-story-glow)] md:col-start-2 md:row-span-2 md:row-start-1 md:p-4">
            <MaskReveal from="center" className="rounded-pill w-56 md:w-72">
              <div className="rounded-pill border-story-ring overflow-hidden border-[6px]">
                <Image
                  src={storyCircle}
                  alt="Members of the IMENA family gathered outside their home"
                  placeholder="blur"
                  sizes="(min-width: 768px) 18rem, 14rem"
                  className="transition-base aspect-square w-full object-cover motion-safe:hover:scale-105 motion-safe:hover:rotate-2"
                />
              </div>
            </MaskReveal>
          </div>

          <Stat
            value={140}
            suffix="+"
            label="Members"
            size="text-display-m md:text-display"
            colour="text-stat"
            className="relative md:col-start-3 md:row-start-1 md:self-end md:pb-10"
          />

          <Stat
            value={3}
            label="Subfamilies"
            size="text-h1-m md:text-h1"
            colour="text-primary"
            className="relative md:col-start-1 md:row-start-2 md:self-start md:pt-10"
          />

          <p className="text-body text-muted relative md:col-start-3 md:row-start-2 md:self-start md:pt-10 md:text-left">
            <Reveal as="span" from="right" delay={0.15} className="block">
              IMENA is not just a family but a spirit, the solidarity endures
              across all chapters.
            </Reveal>
          </p>
        </div>
      </Container>
    </section>
  );
}
