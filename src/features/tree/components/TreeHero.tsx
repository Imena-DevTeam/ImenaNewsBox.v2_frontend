import { Container } from "@/components/layout/Container";
import { PublicTreeIllustration } from "@/features/tree/components/PublicTreeIllustration";
import type { PromotionYear } from "@/features/tree/publicTreeData";

interface TreeHeroProps {
  activeYear?: PromotionYear;
  onSelectYear?: (year: PromotionYear) => void;
}

export function TreeHero({ activeYear, onSelectYear }: TreeHeroProps) {
  return (
    <section className="relative isolate overflow-hidden pt-8 pb-14 md:pt-12 md:pb-20">
      <Container className="relative">
        {/* A pair of marks above the title, as in the design. */}
        <div aria-hidden className="mb-8 flex items-center gap-1.5 md:mb-10">
          <span className="bg-text rounded-pill size-7 md:size-8" />
          <span className="bg-heading size-7 md:size-8" />
        </div>

        {/* Title matching exact 3-line layout from design */}
        <h1 className="text-display-m md:text-display max-w-2xl font-bold tracking-tight">
          Family is a huge part of
          <br />
          who we are, so does its
          <br />
          <span className="text-heading">history.</span>
        </h1>

        {/* Offset accent mark on the right edge */}
        <div
          aria-hidden
          className="absolute top-12 right-6 hidden md:block lg:right-12"
        >
          <span className="bg-display-soft absolute top-0 right-0 size-7" />
          <span className="bg-primary absolute top-6 right-6 size-7" />
        </div>

        {/* The organic illustrated family tree with circles and connecting branches */}
        <div className="mt-12 md:mt-16">
          <PublicTreeIllustration
            activeYear={activeYear}
            onSelectYear={onSelectYear}
          />
        </div>
      </Container>
    </section>
  );
}
