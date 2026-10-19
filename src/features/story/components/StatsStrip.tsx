import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HouseHeartOrnament } from "@/features/story/components/Ornaments";
import { cn } from "@/lib/cn";

/* A description list, so each figure is announced together with its label
   instead of as a loose number. The label comes first in the markup, as
   HTML requires, and flex-col-reverse puts the figure above it on screen. */
function Stat({
  value,
  label,
  size,
  colour,
  className,
}: {
  value: string;
  label: string;
  size: string;
  colour: string;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "flex flex-col-reverse items-center text-center",
        className,
      )}
    >
      <dt className="text-body-lg">{label}</dt>
      <dd className={cn(colour, size)}>{value}</dd>
    </dl>
  );
}

export function StatsStrip() {
  return (
    <section className="section-y relative overflow-hidden">
      <HouseHeartOrnament className="absolute top-6 left-4 size-14 md:size-16" />

      <Container className="relative">
        <SectionTitle title="OUR STORY" />

        {/* Two rows either side of the portrait, which spans both. The rule
            under each upper cell gives the single line that runs out to both
            edges and stops at the circle. */}
        <div className="mt-12 grid items-center gap-8 md:mt-16 md:grid-cols-[1fr_auto_1fr] md:grid-rows-2 md:gap-x-5 md:gap-y-0">
          <p className="text-body md:border-border md:col-start-1 md:row-start-1 md:self-stretch md:border-b md:pb-10 md:text-left">
            IMENA is not just a family but a spirit and&mdash;culture that{" "}
            <span className="text-text font-semibold">
              embodies what we do plus the way we live
            </span>
            .
          </p>

          <Image
            src="/images/story-circle.jpg"
            alt="Members of the IMENA family gathered outside their home"
            width={810}
            height={810}
            sizes="(min-width: 768px) 18rem, 14rem"
            className="rounded-pill mx-auto aspect-square w-56 object-cover md:col-start-2 md:row-span-2 md:row-start-1 md:w-72"
          />

          <Stat
            value="140+"
            label="Members"
            size="text-display-m md:text-display"
            colour="text-stat"
            className="md:border-border md:col-start-3 md:row-start-1 md:justify-center md:self-stretch md:border-b md:pb-10"
          />

          <Stat
            value="3"
            label="Subfamilies"
            size="text-h1-m md:text-h1"
            colour="text-primary"
            className="md:col-start-1 md:row-start-2 md:justify-center md:pt-10"
          />

          <p className="text-body text-muted md:col-start-3 md:row-start-2 md:pt-10 md:text-left">
            IMENA is not just a family but a{" "}
            <span className="text-text font-semibold">spirit</span>, the
            solidarity endures across all chapters.
          </p>
        </div>
      </Container>
    </section>
  );
}
