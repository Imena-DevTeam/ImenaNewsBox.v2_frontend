import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Magnetic } from "@/components/motion/Magnetic";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { heroFamily } from "@/lib/images";
import { TreePreviewCard } from "@/features/landing/components/TreePreviewCard";

/* The opening sequence, in seconds from load. The rings are already easing
   in as the title spells itself out; the photo is uncovered while the title
   is still settling; the copy and button follow; and the tree window slides
   in last and grows its branches. Each step overlaps the one before, so it
   plays as one movement rather than a queue. */
const T = {
  rings: 0,
  photo: 0.1,
  title: 0.2,
  copy: 0.75,
  button: 0.9,
  tree: 1,
};

export function Hero() {
  return (
    <section className="relative -mt-20 overflow-x-clip pt-20">
      {/* Decorative rings from the design:
          1. Top-left ring enters from the very top/left of the browser screen, curving behind navbar & title.
          2. Bottom-center ring loops underneath the tree preview card.
          3. Right-edge ring drifts behind the family photo towards the screen edge. */}
      <Parallax
        distance={40}
        className="pointer-events-none absolute -top-40 -left-40 sm:-top-48 sm:-left-44 lg:-top-56 lg:-left-36"
      >
        <Reveal onMount from="none" duration={1.6} delay={T.rings}>
          <span
            aria-hidden
            className="border-primary/5 block size-[36rem] rounded-full border-[3.5rem] sm:size-[42rem] lg:size-[48rem] lg:border-[4rem]"
          />
        </Reveal>
      </Parallax>
      <Parallax
        distance={-30}
        className="pointer-events-none absolute -bottom-48 left-[35%] sm:-bottom-56 sm:left-[42%] lg:-bottom-64 lg:left-[46%]"
      >
        <Reveal onMount from="none" duration={1.6} delay={T.rings + 0.2}>
          <span
            aria-hidden
            className="border-primary/5 block size-[30rem] rounded-full border-[3rem] sm:size-[36rem] lg:size-[42rem] lg:border-[3.5rem]"
          />
        </Reveal>
      </Parallax>
      <Parallax
        distance={-40}
        className="pointer-events-none absolute top-36 -right-28 sm:top-40 sm:-right-36 lg:top-48 lg:-right-44"
      >
        <Reveal onMount from="none" duration={1.6} delay={T.rings + 0.3}>
          <span
            aria-hidden
            className="border-primary/5 block size-[30rem] rounded-full border-[3rem] sm:size-[34rem] lg:size-[38rem] lg:border-[3.5rem]"
          />
        </Reveal>
      </Parallax>

      <Container className="relative grid w-full gap-12 pt-28 pb-16 lg:grid-cols-2 lg:items-center lg:gap-8">
        <div className="max-w-xl">
          <SplitText
            as="h1"
            onMount
            by="char"
            delay={T.title}
            stagger={0.035}
            className="text-display-m md:text-display"
            lines={[
              ["Rediscover"],
              [{ text: "Your Legacy.", className: "text-display-soft" }],
            ]}
          />

          <Reveal onMount blur delay={T.copy} distance={20}>
            <p className="text-body-lg text-primary mt-5 max-w-md">
              A modern space for family history, connections, and stories.
            </p>
          </Reveal>

          <Reveal onMount delay={T.button} distance={20} className="mt-9">
            <Magnetic>
              <ButtonLink href={ROUTES.FAMILY_TREE} size="lg">
                Explore the Tree
              </ButtonLink>
            </Magnetic>
          </Reveal>
        </div>

        <div className="relative isolate">
          {/* A faint glow of the brand colour behind the photo, breathing on
              the same slow beat as the float. */}
          <span
            aria-hidden
            className="bg-primary/6 motion-safe:animate-float-slow pointer-events-none absolute inset-10 -z-10 rounded-full blur-3xl"
          />

          <Parallax distance={-24} className="ml-auto w-full max-w-xl">
            <div className="motion-safe:animate-float">
              <MaskReveal
                onMount
                from="bottom"
                delay={T.photo}
                className="w-full"
              >
                <Image
                  src={heroFamily}
                  alt="Members of the IMENA family posing together outside a family home"
                  priority
                  placeholder="blur"
                  className="w-full"
                />
              </MaskReveal>
            </div>
          </Parallax>

          <Reveal
            onMount
            from="left"
            distance={60}
            delay={T.tree}
            duration={0.9}
            className="absolute -bottom-6 -left-2 z-10 w-64 md:w-80 lg:-left-10"
          >
            <TreePreviewCard
              buildDelay={T.tree + 0.4}
              className="motion-safe:animate-float-slow"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
