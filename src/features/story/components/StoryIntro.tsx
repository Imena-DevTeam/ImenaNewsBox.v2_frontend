import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { storyIntro } from "@/lib/images";

export function StoryIntro() {
  return (
    /* overflow-x-clip: a guard, so the offset card behind the photo can never
       push the page sideways at a width we have not measured. */
    <section className="overflow-x-clip">
      <Container className="relative grid items-center gap-12 pb-14 md:grid-cols-2 md:gap-16 md:pb-24">
        <div className="reveal relative">
          {/* The outlined card peeking out behind the photo. The offset is
              smaller on a phone, where the photo already reaches the page
              margin and a 24px offset would hang off the screen. */}
          <span
            aria-hidden
            className="border-frame-accent bg-surface absolute inset-0 translate-x-3 translate-y-3 rounded-lg border md:translate-x-6 md:translate-y-6"
          />
          <Image
            src={storyIntro}
            alt="Four members of the IMENA family together outside a family home"
            placeholder="blur"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="border-frame relative w-full rounded-lg border-[14px] object-cover"
          />
        </div>

        <div className="reveal">
          {/* Set to the same edge as the paragraph below it. */}
          <h2 className="text-h3-m md:text-h2">
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
