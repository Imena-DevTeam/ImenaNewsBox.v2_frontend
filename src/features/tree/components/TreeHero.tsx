import { Grow } from "@/components/motion/Grow";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { SunOrnament } from "@/components/ui/Ornaments";
import { PublicTreeIllustration } from "@/features/tree/components/PublicTreeIllustration";
import type { PromotionYear } from "@/features/tree/publicTreeData";

interface TreeHeroProps {
  activeYear?: PromotionYear;
  onSelectYear?: (year: PromotionYear) => void;
}

/* The design is laid out at 1440px. From xl up the hero places each piece
   where the design does; below that it falls back to a simple stack. */
export function TreeHero({ activeYear, onSelectYear }: TreeHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative mx-auto max-w-[1440px] px-4 pt-10 pb-20 md:px-8 md:pb-28 xl:h-[634px] xl:p-0">
        {/* The pale band behind the title, rising slightly to the right, as
            on Our Story. It sweeps out from the centre on load. */}
        <div
          aria-hidden
          className="absolute top-4 bottom-14 left-1/2 -z-10 w-[150vw] -translate-x-1/2 -rotate-[3.4deg] md:bottom-20 xl:top-[40px] xl:bottom-auto xl:h-[372px]"
        >
          <Grow
            onMount
            duration={1.1}
            className="bg-story-band size-full origin-center"
          />
        </div>

        {/* A black dot and a violet square above the title. */}
        <Reveal onMount from="left" distance={20} duration={0.6} delay={0.05}>
          <div
            aria-hidden
            className="flex items-center gap-1 pt-6 xl:absolute xl:top-[150px] xl:left-[86px] xl:pt-0"
          >
            <span className="rounded-pill size-7 bg-black xl:size-[37px]" />
            <span className="bg-heading size-7 xl:size-[37px]" />
          </div>
        </Reveal>

        <SplitText
          as="h1"
          onMount
          by="char"
          delay={0.15}
          stagger={0.02}
          className="text-h2-m sm:text-display-m md:text-display xl:text-story-hero mt-8 xl:absolute xl:top-[186px] xl:left-[300px] xl:mt-0"
          lines={[
            ["Family is a huge part of"],
            ["who we are, so does its"],
            [{ text: "history.", className: "text-heading" }],
          ]}
        />

        {/* Two small squares where the band meets the right edge: a pale
            one, and the teal one tucked below and to its left. */}
        <Reveal
          onMount
          from="right"
          distance={30}
          duration={0.8}
          delay={0.3}
          className="absolute right-6 bottom-8 md:right-12 md:bottom-12 xl:top-[360px] xl:right-[135px] xl:bottom-auto"
        >
          <div aria-hidden className="relative size-12 xl:size-[74px]">
            <span className="bg-story-ornament absolute top-0 right-0 size-6 rounded-sm xl:size-[37px]" />
            <span className="bg-tree-mark absolute right-6 bottom-0 size-6 xl:right-[36px] xl:size-[38px]" />
          </div>
        </Reveal>

        {/* The sun, just under the band on the left. */}
        <Reveal
          onMount
          from="top"
          delay={0.9}
          className="absolute bottom-0 left-3 hidden md:block xl:top-[459px] xl:bottom-auto xl:left-[36px]"
        >
          <SunOrnament className="motion-safe:animate-float-slow size-24 xl:size-[172px]" />
        </Reveal>
      </div>

      {/* The tree spans the page, as in the design. */}
      <Reveal
        onMount
        from="bottom"
        distance={32}
        duration={0.9}
        delay={0.4}
        className="px-4 md:px-8 xl:px-0"
      >
        <PublicTreeIllustration
          activeYear={activeYear}
          onSelectYear={onSelectYear}
        />
      </Reveal>
    </section>
  );
}
