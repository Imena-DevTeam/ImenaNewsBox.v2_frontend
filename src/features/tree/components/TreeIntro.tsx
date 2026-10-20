import { Container } from "@/components/layout/Container";
import { PROMOTION } from "@/features/tree/data";

export function TreeIntro() {
  return (
    <Container className="text-center">
      <h2 className="text-h1-m md:text-h1">
        IMENA Family <span className="text-heading">Tree</span>
      </h2>

      <p className="text-body-lg mx-auto mt-6 max-w-2xl">
        Discover the connections and relationships within our extended family.
        Each level represents a generation, and each circle represents a family
        member.
      </p>

      <p className="text-body-lg mt-10">
        The <span className="text-heading">{PROMOTION}</span> Promotion
      </p>
    </Container>
  );
}
