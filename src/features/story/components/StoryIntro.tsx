"use client";

import Image from "next/image";
import { m } from "motion/react";
import { Container } from "@/components/layout/Container";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { EASE_OUT_SOFT, VIEWPORT } from "@/components/motion/tokens";
import { storyIntro } from "@/lib/images";

export function StoryIntro() {
  return (
    /* overflow-x-clip: a guard, so the offset card behind the photo can never
       push the page sideways at a width we have not measured. */
    <section className="overflow-x-clip">
      <Container className="relative grid items-center gap-12 pb-14 md:grid-cols-2 md:gap-16 md:pb-24">
        <m.div
          className="group relative"
          initial="hidden"
          whileInView="shown"
          viewport={VIEWPORT}
        >
          {/* The outlined card peeking out behind the photo. It starts tucked
              further behind the photo and slides out to its offset once the
              photo is uncovered, like a second print pulled from under the
              first. The offset is smaller on a phone, where the photo already
              reaches the page margin and a 24px offset would hang off the
              screen. On hover it eases a little further out. */}
          <m.span
            aria-hidden
            data-motion
            className="absolute inset-0"
            variants={{
              hidden: { x: "-0.75rem", y: "-0.75rem", opacity: 0 },
              shown: {
                x: 0,
                y: 0,
                opacity: 1,
                transition: { delay: 0.9, duration: 0.8, ease: EASE_OUT_SOFT },
              },
            }}
          >
            <span className="border-frame-accent bg-surface transition-base absolute inset-0 translate-x-3 translate-y-3 rounded-lg border md:translate-x-6 md:translate-y-6 motion-safe:md:group-hover:translate-x-8 motion-safe:md:group-hover:translate-y-8" />
          </m.span>
          <MaskReveal from="left" className="relative">
            <Image
              src={storyIntro}
              alt="Four members of the IMENA family together outside a family home"
              placeholder="blur"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="border-frame w-full rounded-lg border-[14px] object-cover"
            />
          </MaskReveal>
        </m.div>

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
