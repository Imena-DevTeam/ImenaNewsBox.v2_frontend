import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
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
        <h1 className="text-display-m md:text-display max-w-2xl font-bold tracking-tight">
          Family is a huge part of who we are, so does its{" "}
          <span className="text-brand">history.</span>
        </h1>

        {/* The organic illustrated family tree with circles and connecting branches */}
        <Reveal onMount from="bottom" distance={32} duration={0.9} delay={0.1}>
          <div className="mt-12 md:mt-16">
            <PublicTreeIllustration
              activeYear={activeYear}
              onSelectYear={onSelectYear}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
