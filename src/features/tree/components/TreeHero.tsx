import { Container } from "@/components/layout/Container";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { PublicTreeIllustration } from "@/features/tree/components/PublicTreeIllustration";
import type { PromotionYear } from "@/features/tree/publicTreeData";

interface TreeHeroProps {
  activeYear?: PromotionYear;
  onSelectYear?: (year: PromotionYear) => void;
}

export function TreeHero({ activeYear, onSelectYear }: TreeHeroProps) {
  return (
    <section className="relative isolate overflow-hidden pt-8 pb-14 md:pt-12 md:pb-20">
      {/* Decorative rings from the landing page design */}
      <Parallax
        distance={35}
        className="pointer-events-none absolute -top-36 -left-36 lg:-top-48 lg:-left-36"
      >
        <Reveal onMount from="none" duration={1.6} delay={0}>
          <span
            aria-hidden
            className="border-primary/5 block size-[32rem] rounded-full border-[3rem] lg:size-[42rem] lg:border-[3.5rem]"
          />
        </Reveal>
      </Parallax>
      <Parallax
        distance={-35}
        className="pointer-events-none absolute top-20 -right-24 lg:top-24 lg:-right-36"
      >
        <Reveal onMount from="none" duration={1.6} delay={0.2}>
          <span
            aria-hidden
            className="border-primary/5 block size-[28rem] rounded-full border-[2.75rem] lg:size-[36rem] lg:border-[3.5rem]"
          />
        </Reveal>
      </Parallax>

      <Container className="relative">
        {/* A pair of marks above the title, as in the design. */}
        <Reveal onMount from="left" distance={20} duration={0.6} delay={0.05}>
          <div aria-hidden className="mb-8 flex items-center gap-1.5 md:mb-10">
            <span className="bg-text rounded-pill size-7 md:size-8" />
            <span className="bg-heading size-7 md:size-8" />
          </div>
        </Reveal>

        {/* Title matching exact 3-line layout from design */}
        <SplitText
          as="h1"
          onMount
          by="char"
          delay={0.15}
          stagger={0.02}
          className="text-display-m md:text-display max-w-2xl font-bold tracking-tight"
          lines={[
            ["Family is a huge part of"],
            ["who we are, so does its"],
            [{ text: "history.", className: "text-heading" }],
          ]}
        />

        {/* Offset accent mark on the right edge */}
        <Reveal onMount from="right" distance={30} duration={0.8} delay={0.3}>
          <div
            aria-hidden
            className="absolute top-12 right-6 hidden md:block lg:right-12"
          >
            <span className="bg-display-soft absolute top-0 right-0 size-7" />
            <span className="bg-primary absolute top-6 right-6 size-7" />
          </div>
        </Reveal>

        {/* The organic illustrated family tree with circles and connecting branches */}
        <Reveal
          onMount
          from="bottom"
          distance={32}
          duration={0.9}
          delay={0.4}
          blur
        >
          <div className="mt-12 md:mt-16">
            <PublicTreeIllustration
              activeYear={activeYear}
              onSelectYear={onSelectYear}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
