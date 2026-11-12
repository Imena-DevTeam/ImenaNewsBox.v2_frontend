import { SunOrnament } from "@/components/ui/Ornaments";
import { Grow } from "@/components/motion/Grow";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { StoryContainer } from "./StoryContainer";

export function StoryHero() {
  return (
    <section className="relative isolate overflow-hidden pt-4 pb-10 xl:pt-[21px] xl:pb-[55px]">
      <StoryContainer className="relative">
        {/* The band sits behind the title, rising slightly to the right. It
            is far wider than the viewport, so the angle never exposes a
            corner. It sweeps out from the centre and the title is written
            onto it. */}
        <div className="relative flex items-center justify-center py-14 md:py-20 xl:h-[354px] xl:py-0 xl:pt-[24px]">
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 -z-10 w-[150vw] -translate-x-1/2 -rotate-[3.3deg]"
          >
            <Grow
              onMount
              duration={1.1}
              className="bg-story-band size-full origin-center"
            />
          </div>

          <SplitText
            as="h1"
            onMount
            delay={0.35}
            stagger={0.09}
            className="text-display-m md:text-display xl:text-story-hero text-center"
            lines={[
              ["IMENA FAMILY"],
              [
                "Crafting Stories that ",
                { text: "connect.", className: "text-heading" },
              ],
            ]}
          />
        </div>

        {/* The sun on the right edge of the band. It drops in after the
            title and then rests, bobbing very slightly. */}
        <Reveal
          onMount
          from="top"
          delay={1}
          className="absolute -top-2 right-3 md:right-8 xl:top-[11px] xl:right-[38px]"
        >
          <SunOrnament className="motion-safe:animate-float-slow size-14 md:size-24 xl:size-[165px]" />
        </Reveal>
      </StoryContainer>
    </section>
  );
}
