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
    <section className="relative overflow-hidden">
      {/* Decorative rings from the design. They sit on a farther plane, so
          they drift against the scroll. */}
      <Parallax
        distance={50}
        className="pointer-events-none absolute -top-24 -left-40"
      >
        <Reveal onMount from="none" duration={1.6} delay={T.rings}>
          <span
            aria-hidden
            className="rounded-pill border-primary/5 block size-96 border-[3rem]"
          />
        </Reveal>
      </Parallax>
      <Parallax
        distance={-40}
        className="pointer-events-none absolute right-0 -bottom-40"
      >
        <Reveal onMount from="none" duration={1.6} delay={T.rings + 0.2}>
          <span
            aria-hidden
            className="rounded-pill border-primary/5 block size-[28rem] border-[3rem]"
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

          <Parallax distance={-24}>
            <MaskReveal
              onMount
              from="bottom"
              delay={T.photo}
              className="ml-auto w-full max-w-xl"
            >
              <Image
                src={heroFamily}
                alt="Members of the IMENA family posing together outside a family home"
                priority
                placeholder="blur"
                className="motion-safe:animate-float w-full"
              />
            </MaskReveal>
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
