"use client";

import Image from "next/image";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { storyIntro } from "@/lib/images";
import { StoryContainer } from "./StoryContainer";

export function StoryIntro() {
  return (
    <section className="overflow-x-clip">
      <StoryContainer className="grid items-center gap-12 md:grid-cols-2 xl:gap-[75px]">
        {/* The photograph sits in a thick grey mat. Behind it, a pale card
            with a teal edge, set lower and further right. */}
        <div className="relative pr-4 pb-3 xl:pr-[40px] xl:pb-[23px]">
          <div
            aria-hidden
            className="bg-frame-card border-frame-accent absolute top-4 right-0 bottom-0 left-3 rounded-2xl border-2 xl:top-[25px] xl:left-[19px] xl:rounded-[25px]"
          />
          <MaskReveal from="left" className="relative">
            <div className="bg-frame rounded-2xl p-2.5 shadow-[0_10px_24px_rgb(0_0_0/0.12)] xl:rounded-[25px] xl:p-[23px]">
              <Image
                src={storyIntro}
                alt="Four members of the IMENA family together outside a family home"
                placeholder="blur"
                sizes="(min-width: 1280px) 550px, (min-width: 768px) 50vw, 100vw"
                className="aspect-[549/300] w-full rounded-lg object-cover"
              />
            </div>
          </MaskReveal>
        </div>

        <div>
          <SplitText
            delay={0.3}
            className="text-h3-m md:text-h3 xl:text-story-lead text-story-ink text-center"
            lines={[["Transforming each other’s lives with love and care"]]}
          />

          <Reveal from="right" delay={0.6} distance={32}>
            <p className="text-body-sm xl:text-story-body text-story-copy mt-6 tracking-tight xl:mt-[36px] xl:tracking-normal">
              &ldquo; IMENA FAMILY is part of a community founded on the values
              of remembering, protecting one another, mentoring each other, and
              striving to live well. When family structures were broken,
              students came together at university to recreate what was
              lost&mdash;becoming mothers, fathers, brothers, and sisters to one
              another. &rdquo;
            </p>
          </Reveal>
        </div>
      </StoryContainer>
    </section>
  );
}
