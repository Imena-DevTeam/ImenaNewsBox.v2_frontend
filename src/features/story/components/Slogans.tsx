import { Users } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { HeartsOrnament, HouseOrnament } from "@/components/ui/Ornaments";
import { StoryContainer } from "./StoryContainer";

/* The four slogans, placed at the top, left, right and bottom of the cross.
   The middle cell holds the hearts. The top card stands a little clear of
   the side cards; the bottom card meets them. */
const SLOGANS = [
  {
    title: "IMENA FAMILY",
    slogan: "Kubw’umurava n’ikizere imbere hacu heza ntituzazima",
    placement: "md:col-start-2 md:row-start-1 md:mb-2 xl:mb-[18px]",
  },
  {
    title: "WIHOGORA",
    slogan: "Rooted in love, rising in life, resilience is our might",
    placement: "md:col-start-1 md:row-start-2",
  },
  {
    title: "LIGHT FAMILY",
    slogan: "Fly over dangers and go high because you are light",
    placement: "md:col-start-3 md:row-start-2",
  },
  {
    title: "HOPE FAMILY",
    slogan:
      "Ba umwana mu gihe ukina, ba umugabo mu gihe ukora, kora igikwiye mu gihe gikwiye.",
    placement: "md:col-start-2 md:row-start-3",
  },
];

export function Slogans() {
  return (
    <section className="relative overflow-x-clip pb-16 md:pb-24 xl:pb-[140px]">
      <StoryContainer>
        <SplitText
          as="h2"
          lines={[["OUR SLOGANS"]]}
          className="text-h2-m md:text-h2 xl:text-story-title text-heading text-center"
        />

        <Reveal blur delay={0.3} distance={16}>
          <p className="text-h3-m md:text-h3 xl:text-story-sub text-text mt-6 xl:mt-[30px]">
            Passionately Spoken
          </p>
        </Reveal>

        <div className="relative mt-10 md:mt-6 xl:mt-[18px]">
          {/* The ornaments around the cross: hearts off the top right, hearts
              low on the left, and a tilted house in the lower right. */}
          <HeartsOrnament className="motion-safe:animate-float-slow absolute top-[69px] -right-[15px] hidden w-[110px] xl:block" />
          <HeartsOrnament className="motion-safe:animate-float-slow absolute top-[1180px] left-px hidden w-[104px] xl:block" />
          <HouseOrnament className="motion-safe:animate-float-slow absolute top-[1272px] right-[67px] hidden size-[155px] -rotate-[18deg] xl:block" />

          {/* The cards assemble one after another, top first, then the
              hearts land in the middle. */}
          <Stagger
            as="ul"
            stagger={0.12}
            delay={0.2}
            className="mx-auto grid max-w-sm grid-cols-1 gap-4 md:max-w-[1149px] md:grid-cols-3 md:gap-0"
          >
            {SLOGANS.map((item) => (
              <StaggerItem
                key={item.title}
                as="li"
                from="none"
                scale={0.85}
                className={item.placement}
              >
                <figure className="bg-slogan-card md:aspect-slogan-card relative h-full rounded-[20px] p-6 pt-24 shadow-[0_2px_8px_rgb(26_26_41/0.08)] md:px-[7%] md:pt-[50%]">
                  <span
                    aria-hidden
                    className="bg-stat text-surface rounded-pill absolute top-6 left-6 flex size-11 items-center justify-center md:top-[7%] md:left-[7%] xl:size-[52px]"
                  >
                    <Users className="size-5" />
                  </span>

                  <figcaption className="text-h4-m md:text-h4 xl:text-slogan-title font-heading text-story-ink">
                    {item.title}
                  </figcaption>

                  <blockquote className="text-body-sm xl:text-slogan text-slogan-ink mt-3 tracking-wider xl:mt-[14px] xl:max-w-[300px] xl:tracking-[0.03em]">
                    {item.slogan}
                  </blockquote>
                </figure>
              </StaggerItem>
            ))}

            <li className="hidden place-items-center md:col-start-2 md:row-start-2 md:grid">
              <StaggerItem from="none" scale={0.4}>
                <HeartsOrnament className="w-16 xl:w-[110px]" />
              </StaggerItem>
            </li>
          </Stagger>
        </div>
      </StoryContainer>
    </section>
  );
}
