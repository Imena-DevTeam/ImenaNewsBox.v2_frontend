import { Container } from "@/components/layout/Container";
import { HeartsOrnament } from "@/features/story/components/Ornaments";
import { cn } from "@/lib/cn";

const SLOGANS = [
  {
    kinyarwanda: "Ku bw’umurava n’ikizere imbere yacu heza ntituzazima.",
    english:
      "A living, vibrant network of thousands of leaders across the globe.",
  },
  {
    kinyarwanda: "Ku bw’umurava n’ikizere imbere yacu heza ntituzazima.",
    english:
      "A living, vibrant network of thousands of leaders across the globe.",
  },
  {
    kinyarwanda: "Ku bw’umurava n’ikizere imbere yacu heza ntituzazima.",
    english:
      "A living, vibrant network of thousands of leaders across the globe.",
  },
];

export function Slogans() {
  return (
    <section className="relative overflow-hidden pb-20 md:pb-28">
      <HeartsOrnament className="absolute bottom-6 left-6 w-16 md:w-20" />
      <HeartsOrnament className="absolute top-1/3 left-1/2 hidden w-12 -translate-x-1/2 md:block" />

      <Container>
        <ul className="grid gap-8 md:grid-cols-3 md:gap-6">
          {SLOGANS.map((slogan, index) => (
            <li
              key={index}
              /* The design drops the middle card below its neighbours. */
              className={cn(
                "bg-placeholder flex aspect-[4/5] flex-col justify-center p-8",
                index === 1 && "md:mt-28",
              )}
            >
              <blockquote className="text-body-sm text-muted">
                <span className="text-text italic">
                  &ldquo;{slogan.kinyarwanda}&rdquo;
                </span>{" "}
                {slogan.english}
              </blockquote>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
