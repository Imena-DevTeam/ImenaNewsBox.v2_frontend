import { Flag, Infinity as InfinityIcon, Landmark, Users } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/cn";
import { StoryContainer } from "./StoryContainer";

/* The four milestones, in the order the design lists them. The badges step
   from blue through the violets and close on a pale lavender; every label
   is set in the same violet. */
const MILESTONES = [
  {
    year: "1996",
    label: "The beginning (Oct 20)",
    body: "Founded at the former National University of Rwanda (UNR) in Butare by survivor students seeking solidarity and mutual survival.",
    Icon: Flag,
    badge: "bg-milestone-blue text-surface",
  },
  {
    year: "2000",
    label: "Family system begins",
    body: "The artificial family structure is officially instituted. Members elect campus parents (Papa na Maman) to re-establish family love.",
    Icon: Users,
    badge: "bg-stat text-surface",
  },
  {
    year: "2003",
    label: "GAERG is established",
    body: "Graduating elders transition to the professional realm, creating the GAERG alumni union to continue the cradle of support beyond school.",
    Icon: Landmark,
    badge: "bg-milestone text-surface",
  },
  {
    year: "Today",
    label: "Unbroken chain",
    body: "A living, vibrant network of thousands of leaders across the globe.",
    quote: "Ku bw’umurava n’ikizere imbere yacu heza ntituzazima.",
    Icon: InfinityIcon,
    badge: "bg-milestone-soft text-milestone-ink",
  },
];

export function Timeline() {
  return (
    <section className="pb-14 md:pb-20 xl:pb-[66px]">
      <StoryContainer>
        <Reveal
          distance={56}
          className="bg-timeline-panel rounded-2xl px-5 py-10 md:px-10 md:py-12 xl:mr-[10px] xl:px-[39px] xl:pt-[45px] xl:pb-[27px]"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <SplitText
              delay={0.2}
              className="text-h2-m md:text-h1 xl:text-timeline-title text-story-ink font-serif"
              lines={[["Our Journey Through Time"]]}
            />

            <p className="text-body-sm text-timeline-copy flex items-center gap-2 xl:mt-[22px]">
              <span
                aria-hidden
                className="bg-milestone-blue rounded-pill inline-block size-3"
              />
              Archival Record: 1996 &mdash; Present
            </p>
          </div>

          {/* The milestones come in one after another from the left, in
              the order they happened, so the row reads as time passing. A
              short line joins each card to the next at the height of the
              badges. */}
          <Stagger
            as="ol"
            stagger={0.14}
            delay={0.35}
            className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:mt-[100px] xl:gap-[28px]"
          >
            {MILESTONES.map(({ year, label, body, quote, Icon, badge }, i) => (
              <StaggerItem
                key={year}
                as="li"
                from="left"
                className="relative h-full"
              >
                {i < MILESTONES.length - 1 && (
                  <span
                    aria-hidden
                    className="bg-timeline-link rounded-pill absolute top-[33px] -right-[30px] hidden h-[3px] w-[32px] xl:block"
                  />
                )}
                <TiltCard className="group bg-surface transition-base hover:shadow-main h-full rounded-xl p-5 shadow-[0_2px_12px_rgb(26_26_41/0.03)] md:p-6 xl:rounded-[13px] xl:px-[26px] xl:pt-[27px] xl:pb-[33px]">
                  {/* The badge gives a small turn as the card is picked up. */}
                  <span
                    className={cn(
                      badge,
                      "rounded-pill transition-base flex size-11 items-center justify-center shadow-[0_2px_6px_rgb(26_26_41/0.12)] motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-12 xl:size-[54px]",
                    )}
                  >
                    <Icon aria-hidden className="size-5 xl:size-[22px]" />
                  </span>

                  <p className="text-h3-m xl:text-timeline-year text-story-ink mt-5 font-serif font-bold uppercase oldstyle-nums xl:mt-[16px]">
                    {year}
                  </p>

                  <p className="text-caption xl:text-timeline-label text-stat mt-1.5 uppercase xl:mt-[6px]">
                    {label}
                  </p>

                  <p className="text-body-sm xl:text-timeline-body text-timeline-copy mt-3 xl:mt-[8px] xl:max-w-[215px]">
                    {quote && <>&ldquo;{quote}&rdquo; </>}
                    {body}
                  </p>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>
      </StoryContainer>
    </section>
  );
}
