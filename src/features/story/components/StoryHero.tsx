import { Container } from "@/components/layout/Container";
import { HouseHeartOrnament } from "@/components/ui/Ornaments";

export function StoryHero() {
  return (
    <section className="section-y relative isolate overflow-hidden">
      {/* One ornament each side, in the margins beside the title. */}
      <HouseHeartOrnament className="absolute top-40 left-3 hidden size-12 md:block md:size-14" />
      <HouseHeartOrnament className="absolute right-3 bottom-4 size-14 md:size-16" />

      <Container className="relative">
        {/* The band is sized by the title rather than by a fixed height, so it
            still sits behind it when the title wraps to another line. It is
            far wider than the viewport, so the angle never exposes a corner. */}
        <div className="relative mx-auto max-w-3xl py-12 text-center md:py-16">
          <div
            aria-hidden
            className="bg-band absolute inset-y-0 left-1/2 -z-10 w-[150vw] -translate-x-1/2 -rotate-2"
          />

          <h1 className="text-display-m md:text-display relative">
            IMENA FAMILY
            <br />
            Crafting Stories that <span className="text-heading">connect.</span>
          </h1>
        </div>
      </Container>
    </section>
  );
}
