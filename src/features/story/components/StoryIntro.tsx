import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SunOrnament } from "@/features/story/components/Ornaments";

export function StoryIntro() {
  return (
    <section className="relative">
      <SunOrnament className="absolute right-6 bottom-8 size-12 md:size-14" />

      <Container className="relative grid items-center gap-12 pb-20 md:grid-cols-2 md:gap-16 md:pb-28">
        <div className="relative">
          {/* The outlined card peeking out behind the photo. */}
          <span
            aria-hidden
            className="border-frame-accent bg-surface absolute inset-0 translate-x-6 translate-y-6 rounded-lg border"
          />
          <Image
            src="/images/story-intro.jpg"
            alt="Four members of the IMENA family together outside a family home"
            width={1080}
            height={600}
            className="border-frame relative w-full rounded-lg border-[14px] object-cover"
          />
        </div>

        <div>
          <h2 className="text-h3-m md:text-h2 text-center">
            Transforming each other&rsquo;s lives with love and care
          </h2>

          <p className="text-body text-muted mt-6">
            &ldquo; IMENA FAMILY is part of a community founded on the values of
            remembering, protecting one another, mentoring each other, and
            striving to live well. When family structures were broken, students
            came together at university to recreate what was lost&mdash;becoming
            mothers, fathers, brothers, and sisters to one another. &rdquo;
          </p>
        </div>
      </Container>
    </section>
  );
}
