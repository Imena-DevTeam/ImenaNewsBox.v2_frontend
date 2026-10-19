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
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <dl className="flex flex-col-reverse items-center text-center">
      <dt className="text-body-lg">{label}</dt>
      <dd className={cn("text-primary", className)}>{value}</dd>
    </dl>
  );
}

export function StatsStrip() {
  return (
    <section className="section-y relative overflow-hidden">
      <HouseHeartOrnament className="absolute top-6 left-4 size-14 md:size-16" />

      <Container className="relative">
        <SectionTitle title="OUR STORY" />

        <p className="text-body-lg text-muted mx-auto mt-12 max-w-2xl text-center">
          IMENA is not just a family but a spirit and&mdash;culture that{" "}
          <span className="text-text font-semibold">
            embodies what we do plus the way we live
          </span>
          .
        </p>

        {/* The portrait and both figures share one line. Both figures take the
            brand colour and sit one size step apart, so they read as a pair. */}
        <div className="mt-12 grid items-center gap-10 md:grid-cols-3 md:gap-8">
          <Stat
            value="3"
            label="Subfamilies"
            className="text-h1-m md:text-h1"
          />

          <Image
            src="/images/story-circle.jpg"
            alt="Members of the IMENA family gathered outside their home"
            width={810}
            height={810}
            sizes="(min-width: 768px) 18rem, 14rem"
            className="rounded-pill mx-auto aspect-square w-56 object-cover md:w-72"
          />

          <Stat
            value="140+"
            label="Members"
            className="text-display-m md:text-display"
          />
        </div>

        <hr className="border-border mt-14 border-t" />

        <p className="text-body text-muted mx-auto mt-10 max-w-2xl text-center">
          IMENA is not just a family but a{" "}
          <span className="text-text font-semibold">spirit</span>, the
          solidarity endures across all chapters.
        </p>
      </Container>
    </section>
  );
}
