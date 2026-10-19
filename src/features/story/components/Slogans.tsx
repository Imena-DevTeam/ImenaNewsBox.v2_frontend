import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HeartsOrnament } from "@/features/story/components/Ornaments";
import { cn } from "@/lib/cn";

/* The four values the family was founded on, in the order the story tells
   them: remembering, protecting one another, mentoring each other and
   striving to live well.

   Only the fourth has its Kinyarwanda line; it is the one the design supplied.
   The other three carry the English alone until the family gives us theirs,
   rather than inventing Kinyarwanda for them.

   placement: top, left, right and bottom of the cross. The middle cell stays
   empty. */
const SLOGANS = [
  {
    value: "Kwibuka",
    slogan: "We remember where we came from, and we carry it with us.",
    placement: "md:col-start-2 md:row-start-1",
  },
  {
    value: "Protection",
    slogan: "We stand for one another, in every season.",
    placement: "md:col-start-1 md:row-start-2",
  },
  {
    value: "Mentorship",
    slogan: "We teach each other, so that no one climbs alone.",
    placement: "md:col-start-3 md:row-start-2",
  },
  {
    value: "Living well",
    kinyarwanda: "Ku bw’umurava n’ikizere imbere yacu heza ntituzazima.",
    slogan: "Through perseverance and hope, what is ahead of us will not dim.",
    placement: "md:col-start-2 md:row-start-3",
  },
];

export function Slogans() {
  return (
    /* overflow-x-clip: the turning cards sweep past the grid box, and without
   this they would add a horizontal scrollbar at tablet widths. */
    <section className="section-y overflow-x-clip">
      <Container>
        <SectionTitle title="OUR SLOGANS" />

        <p className="text-h3-m md:text-h3 mt-6 text-center">
          Passionately Spoken
        </p>

        {/* The whole cross turns slowly, so the cards travel in a circle. */}
        <ul
          className={cn(
            "mx-auto mt-14 grid max-w-sm grid-cols-1 gap-6 md:mt-20 md:max-w-2xl md:grid-cols-3 md:grid-rows-3 lg:max-w-3xl",
            "motion-safe:md:animate-orbit",
          )}
        >
          {SLOGANS.map((item) => (
            <li
              key={item.value}
              /* Turns against the wrapper at the same rate, so the text
                 stays upright all the way round. */
              className={cn(
                "motion-safe:md:animate-orbit-reverse",
                item.placement,
              )}
            >
              {/* The square is what makes the cross read as a cross, so it
                  only applies from md. On a phone the cards are full width,
                  and a square would leave most of each one empty. */}
              <figure className="bg-placeholder flex h-full flex-col justify-center gap-3 p-5 md:aspect-square md:p-6">
                <figcaption className="text-caption text-primary tracking-wide uppercase">
                  {item.value}
                </figcaption>

                <blockquote className="text-body-sm text-text">
                  {item.kinyarwanda && (
                    <span className="block italic">
                      &ldquo;{item.kinyarwanda}&rdquo;
                    </span>
                  )}
                  {item.slogan}
                </blockquote>
              </figure>
            </li>
          ))}

          <li className="hidden place-items-center md:col-start-2 md:row-start-2 md:grid">
            <HeartsOrnament className="motion-safe:md:animate-orbit-reverse w-16" />
          </li>
        </ul>
      </Container>
    </section>
  );
}
