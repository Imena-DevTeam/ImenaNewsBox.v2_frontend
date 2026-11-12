import Image from "next/image";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { CountUp } from "@/components/ui/CountUp";
import { SparkleOrnament } from "@/components/ui/Ornaments";
import { cn } from "@/lib/cn";
import { storyCircle } from "@/lib/images";
import { StoryContainer } from "./StoryContainer";

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
      <dt className="text-h4-m md:text-h4 xl:text-story-stat-label text-story-label font-heading">
        {label}
      </dt>
      {/* The figure comes into focus as it starts to count. */}
      <dd
        className={cn(
          "text-display-m md:text-display xl:text-story-stat font-heading",
          colour,
        )}
      >
        <Reveal from="none" blur duration={0.8}>
          <CountUp value={value} suffix={suffix} />
        </Reveal>
      </dd>
    </dl>
  );
}

/* Where the rule meets the portrait it ends in a crescent whose points curve
   round towards the photograph. A round-joined stroke in the same colour
   softens its points. Drawn for the left side; the right one is mirrored. */
function RuleSpike({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 84"
      aria-hidden
      className={cn(
        "text-story-rule h-[84px] w-[36px] shrink-0 overflow-visible",
        className,
      )}
    >
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinejoin="round"
        d="M0 40.5C14 39.5 26 24 36 0 30 16 26 30 26 42s4 26 10 42C26 60 14 44.5 0 43.5Z"
      />
    </svg>
  );
}

export function StatsStrip() {
  return (
    <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-24 xl:pt-[166px] xl:pb-[230px]">
      <StoryContainer className="relative">
        {/* The title is underlined along its full width by a bar with
            rounded ends, with a cluster of glints off each end of it. */}
        <div className="relative mx-auto w-fit">
          <SplitText
            as="h2"
            lines={[["OUR STORY"]]}
            className="text-h2-m md:text-h2 xl:text-story-title text-heading pb-1 xl:pb-0"
          />
          <span
            aria-hidden
            className="bg-heading rounded-pill block h-0.5 w-full xl:h-[3px]"
          />
          <SparkleOrnament className="absolute top-full -left-7 mt-1 size-6 xl:-left-[26px] xl:mt-[8px] xl:size-[32px]" />
          <SparkleOrnament className="absolute top-full -right-7 -mt-1 size-6 xl:-right-[40px] xl:-mt-[4px] xl:size-[32px]" />
        </div>

        {/* Two rows either side of the portrait, which spans both. */}
        <div className="relative mt-14 grid justify-items-center gap-10 xl:mt-[130px] xl:grid-cols-[minmax(0,1fr)_480px_minmax(0,1fr)] xl:grid-rows-[220px_220px] xl:items-start xl:justify-items-stretch xl:gap-0">
          {/* The rule runs out to both edges of the page, a little above the
              middle of the portrait, and stops short of it in a crescent on
              either side. */}
          <div
            aria-hidden
            className="absolute top-[157px] left-1/2 hidden h-[84px] w-screen -translate-x-1/2 items-center xl:flex"
          >
            <span className="bg-story-rule rounded-pill -mr-1 h-[6px] flex-1" />
            <RuleSpike />
            <span className="w-[440px] shrink-0" />
            <RuleSpike className="-scale-x-100" />
            <span className="bg-story-rule rounded-pill -ml-1 h-[6px] flex-1" />
          </div>

          <p className="text-h4-m md:text-h3 xl:text-story-note text-text relative max-w-md text-center font-semibold tracking-tight xl:col-start-1 xl:row-start-1 xl:mt-[58px] xl:w-full xl:max-w-[428px] xl:text-left xl:tracking-[-0.045em]">
            <Reveal as="span" from="left" className="block">
              IMENA is not just a family but a spirit and &mdash;culture that{" "}
              {/* "plus the way" is kept together so the sentence breaks
                  where the design breaks it, before "plus". */}
              <span className="text-story-soft">
                embodies what we do{" "}
                <span className="xl:whitespace-nowrap">plus the way</span> we
                live.
              </span>
            </Reveal>
          </p>

          {/* The portrait is an oval, as in the design. It opens from its
              centre, the figures around it following, and a warm shadow
              sits under its lower edge. */}
          <div className="relative h-[268px] w-60 rounded-[50%] shadow-[0_14px_18px_6px_var(--color-story-shadow)] md:h-[335px] md:w-[300px] xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:h-[440px] xl:w-[393px] xl:justify-self-center">
            <MaskReveal
              from="center"
              className="size-full overflow-hidden rounded-[50%]"
            >
              <Image
                src={storyCircle}
                alt="Members of the IMENA family gathered outside their home"
                placeholder="blur"
                sizes="(min-width: 1280px) 393px, 300px"
                className="transition-base size-full object-cover motion-safe:hover:scale-105"
              />
            </MaskReveal>
          </div>

          <Stat
            value={140}
            suffix="+"
            label="Members"
            colour="text-stat"
            className="relative xl:col-start-3 xl:row-start-1 xl:mt-[21px] xl:justify-self-center"
          />

          <Stat
            value={3}
            label="Subfamilies"
            colour="text-primary"
            className="relative xl:col-start-1 xl:row-start-2 xl:mt-[50px] xl:w-full xl:max-w-[364px] xl:justify-self-start"
          />

          <p className="text-body md:text-body-lg xl:text-story-aside text-story-quiet relative max-w-sm text-center tracking-tight xl:col-start-3 xl:row-start-2 xl:mt-[48px] xl:ml-[11px] xl:w-auto xl:max-w-[346px] xl:text-left">
            <Reveal as="span" from="right" delay={0.15} className="block">
              IMENA is not just a family but a spirit, the solidarity endures
              across all chapters.
            </Reveal>
          </p>
        </div>
      </StoryContainer>
    </section>
  );
}
