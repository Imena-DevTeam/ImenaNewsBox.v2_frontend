import { Container } from "@/components/layout/Container";
import {
  HouseHeartOrnament,
  SunOrnament,
  TreeOrnament,
} from "@/features/story/components/Ornaments";

export function StoryHero() {
  return (
    <section className="relative isolate overflow-hidden pt-10">
      {/* The tinted band sits at a slight angle behind the title. It is wider
          than the viewport so the rotation never exposes a corner. */}
      <div
        aria-hidden
        className="bg-band absolute top-16 -left-[5%] -z-10 h-72 w-[110%] -rotate-2 md:h-80"
      />

      {/* Ornaments, clockwise from the top left. */}
      <SunOrnament className="absolute top-2 left-2 size-10 md:size-12" />
      <TreeOrnament className="absolute top-24 left-[12%] hidden size-12 md:block" />
      <HouseHeartOrnament className="absolute top-40 left-3 size-12 md:size-14" />
      <SunOrnament className="absolute top-4 right-[14%] hidden size-12 md:block" />
      <TreeOrnament className="absolute top-12 right-[3%] hidden size-14 md:block" />
      <TreeOrnament className="absolute top-32 right-[18%] hidden size-12 lg:block" />
      <HouseHeartOrnament className="absolute top-40 right-3 size-14 md:size-16" />

      <Container className="relative py-20 text-center md:py-28">
        <h1 className="text-display-m md:text-display">
          IMENA FAMILY
          <br />
          Crafting Stories that <span className="text-heading">connect.</span>
        </h1>
      </Container>
    </section>
  );
}
