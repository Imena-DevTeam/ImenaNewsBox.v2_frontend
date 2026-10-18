import { Container } from "@/components/layout/Container";
import { HeartsOrnament } from "@/features/story/components/Ornaments";
import { cn } from "@/lib/cn";

const QUOTE = {
  kinyarwanda: "Ku bw’umurava n’ikizere imbere yacu heza ntituzazima.",
  english:
    "A living, vibrant network of thousands of leaders across the globe.",
};

/* Top, left, right and bottom of the cross; the middle cell stays empty. */
const PLACEMENTS = [
  "md:col-start-2 md:row-start-1",
  "md:col-start-1 md:row-start-2",
  "md:col-start-3 md:row-start-2",
  "md:col-start-2 md:row-start-3",
];

export function Slogans() {
  return (
    /* overflow-x-clip: the turning cards sweep past the grid box, and without
   this they would add a horizontal scrollbar at tablet widths. */
    <section className="overflow-x-clip pt-16 pb-28 md:pt-24 md:pb-40">
      <Container>
        {/* The whole cross turns slowly, so the cards travel in a circle. */}
        <div
          className={cn(
            "mx-auto grid max-w-sm grid-cols-1 gap-6 md:max-w-2xl md:grid-cols-3 md:grid-rows-3 lg:max-w-3xl",
            "motion-safe:md:animate-orbit",
          )}
        >
          {PLACEMENTS.map((placement, index) => (
            <article
              key={index}
              /* Turns against the wrapper at the same rate, so the text
                 stays upright all the way round. */
              className={cn(
                "bg-placeholder flex aspect-square flex-col justify-center p-7",
                "motion-safe:md:animate-orbit-reverse",
                placement,
              )}
            >
              <blockquote className="text-body-sm text-muted">
                <span className="text-text italic">
                  &ldquo;{QUOTE.kinyarwanda}&rdquo;
                </span>{" "}
                {QUOTE.english}
              </blockquote>
            </article>
          ))}

          <div className="hidden place-items-center md:col-start-2 md:row-start-2 md:grid">
            <HeartsOrnament className="motion-safe:md:animate-orbit-reverse w-16" />
          </div>
        </div>
      </Container>
    </section>
  );
}
