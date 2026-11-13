import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Grow } from "@/components/motion/Grow";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { RayedSunOrnament, TreeOrnament } from "@/components/ui/Ornaments";
import { PublicTreeIllustration } from "@/features/tree/components/PublicTreeIllustration";
import type { PromotionYear } from "@/features/tree/publicTreeData";

interface TreeHeroProps {
  activeYear?: PromotionYear;
  onSelectYear?: (year: PromotionYear) => void;
}

export function TreeHero({ activeYear, onSelectYear }: TreeHeroProps) {
  return (
    /* The band runs up behind the navigation, as on Our Story: the section
       is pulled up under the bar by the amount it is padded, so the band has
       room to paint there and the title does not move. */
    <section className="relative isolate -mt-12 overflow-hidden pt-12 pb-14 md:-mt-20 md:pt-20 md:pb-20">
      <Container className="relative">
        <div className="relative pt-14 pb-14 md:pt-24 md:pb-20">
          {/* Far wider than the viewport, so the angle never shows a corner. */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 -z-10 w-[150vw] -translate-x-1/2 -rotate-3"
          >
            <Grow
              onMount
              duration={1.1}
              className="bg-band size-full origin-center"
            />
          </div>

          {/* The pair of marks sits in the margin, level with the first line;
              the title is set in from them. */}
          <Reveal
            onMount
            from="left"
            distance={20}
            duration={0.6}
            delay={0.05}
            className="mb-5 md:absolute md:top-20 md:left-0 md:mb-0"
          >
            <div aria-hidden className="flex items-center gap-1.5">
              <span className="bg-text rounded-pill size-6 md:size-7" />
              <span className="bg-heading size-6 md:size-7" />
            </div>
          </Reveal>

          <SplitText
            as="h1"
            onMount
            by="char"
            delay={0.15}
            stagger={0.02}
            className="text-display-m md:text-display max-w-2xl font-bold tracking-tight md:ml-28 lg:ml-40"
            lines={[
              ["Family is a huge part of"],
              ["who we are, so does its"],
              [{ text: "history.", className: "text-heading" }],
            ]}
          />

          {/* Two squares stepping off the band's lower edge, on the right. */}
          <Reveal
            onMount
            from="right"
            distance={30}
            duration={0.8}
            delay={0.3}
            className="absolute right-2 bottom-4 hidden md:block lg:right-6"
          >
            <div aria-hidden className="relative size-14">
              <span className="bg-gallery-ornament absolute top-0 right-0 size-7" />
              <span className="bg-tree-mark absolute bottom-0 left-0 size-7" />
            </div>
          </Reveal>
        </div>

        {/* The organic illustrated family tree with circles and connecting
            branches, and the design's stickers in the margins beside it.
            Below lg the drawing takes the whole width, so only the sun, which
            sits above it, is shown. */}
        <div className="relative mt-8 pt-24 md:mt-10 md:pt-32">
          <div aria-hidden className="pointer-events-none">
            <RayedSunOrnament className="text-gallery-ornament absolute top-0 left-0 size-20 md:size-28 lg:size-40" />
            <Image
              src="/images/house.svg"
              alt=""
              width={149}
              height={155}
              className="absolute top-3/5 left-0 hidden w-36 -rotate-24 lg:block"
            />
            <TreeOrnament className="text-gallery-ornament absolute right-0 bottom-16 hidden w-40 rotate-12 lg:block" />
          </div>

          <Reveal
            onMount
            from="bottom"
            distance={32}
            duration={0.9}
            delay={0.4}
            blur
          >
            <PublicTreeIllustration
              activeYear={activeYear}
              onSelectYear={onSelectYear}
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
