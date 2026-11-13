import { Container } from "@/components/layout/Container";
import { SunOrnament } from "@/components/ui/Ornaments";
import { Grow } from "@/components/motion/Grow";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

export function StoryHero() {
  return (
    /* The band runs up behind the navigation, as the design has it: its high
       corner is level with the bar. The section is pulled up under the bar by
       the same amount it is padded, so the title does not move with it — the
       band only needs the room, because the section clips what it paints. */
    <section className="relative isolate -mt-12 overflow-hidden pt-12 pb-8 md:-mt-20 md:pt-20 md:pb-10">
      {/* The sun sits on the band's right edge, as the design has it. It
          drops in after the title and then rests, bobbing very slightly. */}
      <Reveal
        onMount
        from="top"
        delay={1}
        className="absolute top-14 right-3 md:top-30 md:right-12"
      >
        <SunOrnament className="text-gallery-ornament motion-safe:animate-float-slow size-12 md:size-28 lg:size-36" />
      </Reveal>

      <Container className="relative">
        {/* The band is sized by the title rather than by a fixed height, so it
            still sits behind it when the title wraps to another line. It is
            far wider than the viewport, so the angle never exposes a corner.
            It is laid down first, sweeping out from the centre, and the title
            is written onto it. */}
        <div className="relative mx-auto max-w-3xl pt-14 pb-16 text-center md:pt-24 md:pb-28">
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
