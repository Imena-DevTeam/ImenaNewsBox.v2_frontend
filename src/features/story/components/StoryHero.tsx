import { Container } from "@/components/layout/Container";
import { SunOrnament } from "@/components/ui/Ornaments";
import { Grow } from "@/components/motion/Grow";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

export function StoryHero() {
  return (
    <section className="section-y relative isolate overflow-hidden">
      {/* The sun sits on the right edge of the band, as in the design. It
          drops in after the title and then rests, bobbing very slightly. */}
      <Reveal
        onMount
        from="top"
        delay={1}
        className="absolute top-8 right-2 md:top-12 md:right-8"
      >
        <SunOrnament className="motion-safe:animate-float-slow size-16 md:size-28" />
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
