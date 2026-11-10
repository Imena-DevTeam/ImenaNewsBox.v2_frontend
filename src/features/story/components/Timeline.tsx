import { Flag, Infinity as InfinityIcon, Landmark, Users } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TiltCard } from "@/components/motion/TiltCard";

/* The four milestones, in the order the design lists them. The badge colours
   step from the brand blue through the violets and close on a pale lavender. */
const MILESTONES = [
  {
    year: "1996",
    label: "The beginning (Oct 20)",
    body: "Founded at the former National University of Rwanda (UNR) in Butare by survivor students seeking solidarity and mutual survival.",
    Icon: Flag,
    badge: "bg-primary text-surface",
    accent: "text-primary",
  },
  {
    year: "2000",
    label: "Family system begins",
    body: "The artificial family structure is officially instituted. Members elect campus parents (Papa na Maman) to re-establish family love.",
    Icon: Users,
    badge: "bg-stat text-surface",
    accent: "text-stat",
  },
  {
    year: "2003",
    label: "GAERG is established",
    body: "Graduating elders transition to the professional realm, creating the GAERG alumni union to continue the cradle of support beyond school.",
    Icon: Landmark,
    badge: "bg-milestone text-surface",
    accent: "text-milestone",
  },
  {
    year: "Today",
    label: "Unbroken chain",
    body: "A living, vibrant network of thousands of leaders across the globe.",
    quote: "Ku bw’umurava n’ikizere imbere yacu heza ntituzazima.",
    Icon: InfinityIcon,
    badge: "bg-milestone-soft text-heading",
    /* The badge is too pale to carry text, so the label closes the
       sequence back on the brand colour, as in the design. */
    accent: "text-primary",
  },
];

export function Timeline() {
  return (
    <section className="pb-14 md:pb-20">
      <Container>
        <Reveal
          distance={56}
          className="bg-heading/8 rounded-md px-5 py-10 md:px-10 md:py-12"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SplitText
              delay={0.2}
              className="text-h2-m md:text-h2 font-serif font-medium"
              lines={[["Our Journey Through Time"]]}
            />

            <p className="text-caption text-text flex items-center gap-2 font-normal">
              <span
                aria-hidden
                className="bg-primary rounded-pill inline-block size-2"
              />
              Archival Record: 1996 &mdash; Present
            </p>
          </div>

          {/* The milestones come in one after another from the left, in
              the order they happened, so the row reads as time passing. */}
          <Stagger
            as="ol"
            stagger={0.14}
            delay={0.35}
            className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {MILESTONES.map(
              ({ year, label, body, quote, Icon, badge, accent }) => (
                <StaggerItem key={year} as="li" from="left" className="h-full">
                  <TiltCard className="group bg-surface transition-base hover:shadow-main h-full rounded-md p-5 md:p-6">
                    {/* The badge gives a small turn as the card is picked up. */}
                    <span
                      className={`${badge} rounded-pill transition-base mb-5 flex size-9 items-center justify-center motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-12`}
                    >
                      <Icon aria-hidden className="size-4" />
                    </span>

                    <p className="text-h4-m md:text-h4 font-serif font-bold uppercase">
                      {year}
                    </p>

                    <p
                      className={`${accent} text-caption mt-1 tracking-wide uppercase`}
                    >
                      {label}
                    </p>

                    <p className="text-body-sm text-muted mt-3">
                      {quote && <>&ldquo;{quote}&rdquo; </>}
                      {body}
                    </p>
                  </TiltCard>
                </StaggerItem>
              ),
            )}
          </Stagger>
        </Reveal>
      </Container>
    </section>
  );
}
