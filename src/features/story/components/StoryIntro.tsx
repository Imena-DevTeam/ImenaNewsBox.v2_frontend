"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { storyIntro } from "@/lib/images";

export function StoryIntro() {
  return (
    <section className="overflow-x-clip">
      <Container className="relative grid items-center gap-12 pb-14 md:grid-cols-2 md:gap-16 md:pb-24">
        <MaskReveal from="left">
          <Image
            src={storyIntro}
            alt="Four members of the IMENA family together outside a family home"
            placeholder="blur"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="w-full rounded-2xl object-cover"
          />
        </MaskReveal>

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
