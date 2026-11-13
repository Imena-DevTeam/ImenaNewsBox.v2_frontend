import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { storyIntro } from "@/lib/images";

/**
 * The opening of Our Story: a photograph and the words beside it.
 *
 * A server component. It carried "use client" and needed nothing from the
 * client — MaskReveal, Reveal and SplitText are the islands here, and a
 * parent does not have to be one to render one.
 */
export function StoryIntro() {
  return (
    <section className="overflow-x-clip">
      <Container className="relative grid items-center gap-12 pb-14 md:grid-cols-2 md:gap-16 md:pb-24">
        {/* The design's frame: a thick band around the photograph, and a
            pale card outlined behind it, slipped out to the right and down.
            The margin keeps room for the card, so it never leaves the
            column. */}
        <div className="relative isolate mr-6 mb-5 md:mr-8 md:mb-6">
          <span
            aria-hidden
            className="border-frame-accent bg-frame-accent/20 absolute inset-0 -z-10 translate-x-6 translate-y-5 rounded-3xl border-2 md:translate-x-8 md:translate-y-6"
          />
          <MaskReveal from="left">
            <div className="border-frame bg-frame overflow-hidden rounded-3xl border-12 md:border-16">
              <Image
                src={storyIntro}
                alt="Four members of the IMENA family together outside a family home"
                placeholder="blur"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="w-full rounded-sm object-cover"
              />
            </div>
          </MaskReveal>
        </div>

        <div>
          {/* Set to the same edge as the paragraph below it. */}
          <SplitText
            delay={0.3}
            className="text-h3-m md:text-h2"
            lines={[["Transforming each other’s lives with love and care"]]}
          />

          <Reveal from="right" delay={0.6} distance={32}>
            <p className="text-body text-muted mt-6">
              &ldquo; IMENA FAMILY is part of a community founded on the values
              of remembering, protecting one another, mentoring each other, and
              striving to live well. When family structures were broken,
              students came together at university to recreate what was
              lost&mdash;becoming mothers, fathers, brothers, and sisters to one
              another. &rdquo;
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
