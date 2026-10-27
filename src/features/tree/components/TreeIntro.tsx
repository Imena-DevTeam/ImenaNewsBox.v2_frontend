import { Container } from "@/components/layout/Container";
import { HeartsOrnament } from "@/components/ui/Ornaments";

export function TreeIntro() {
  return (
    <div className="relative">
      <HeartsOrnament className="absolute top-0 left-6 hidden w-20 md:block md:w-24" />

      <Container className="relative text-center">
        <h2 className="text-h1-m md:text-h1">
          IMENA Family <span className="text-heading">Tree</span>
        </h2>

        <p className="text-body-lg mx-auto mt-6 max-w-2xl">
          Discover the connections and relationships within our extended family.
          Each level represents a generation, and each circle represents a
          family member.
        </p>
      </Container>
    </div>
  );
}
