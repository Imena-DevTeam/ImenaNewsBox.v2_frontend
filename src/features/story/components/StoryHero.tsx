import { Container } from "@/components/layout/Container";
import { HouseHeartOrnament } from "@/components/ui/Ornaments";
import { Grow } from "@/components/motion/Grow";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";


export function StoryHero() {
  return (
    <section className="section-y relative isolate overflow-hidden">
      {/* One ornament each side, in the margins beside the title. They drop
          in after the title and then rest, bobbing very slightly. */}
      <Reveal
        onMount
        from="top"
        delay={1}
        className="absolute top-40 left-3 hidden md:block"
      >
        <HouseHeartOrnament className="motion-safe:animate-float-slow size-12 md:size-14" />
      </Reveal>
      <Reveal
        onMount
        from="bottom"
        delay={1.15}
        className="absolute right-3 bottom-4"
      >
        <HouseHeartOrnament className="motion-safe:animate-float-slow size-14 md:size-16" />
      </Reveal>

      <Container className="relative">
        {/* The band is sized by the title rather than by a fixed height, so it
            still sits behind it when the title wraps to another line. It is
            far wider than the viewport, so the angle never exposes a corner.
            It is laid down first, sweeping out from the centre, and the title
            is written onto it. */}
        <div className="relative mx-auto max-w-3xl py-12 text-center md:py-16">
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 -z-10 w-[150vw] -translate-x-1/2 -rotate-2"
          >
            <Grow
              onMount
              duration={1.1}
              className="bg-band size-full origin-center"
            />
          </div>

          <SplitText
            as="h1"
            onMount
            delay={0.35}
            stagger={0.09}
            className="text-display-m md:text-display relative"
            lines={[
              ["IMENA FAMILY"],
              [
                "Crafting Stories that ",
                { text: "connect.", className: "text-heading" },
              ],
            ]}
          />
        </div>
      </Container>
    </section>
  );
}
