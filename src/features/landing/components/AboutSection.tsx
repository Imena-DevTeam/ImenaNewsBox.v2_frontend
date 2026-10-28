import Image from "next/image";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { aboutFamily } from "@/lib/images";

export function AboutSection() {
  return (
    <section className="bg-band overflow-hidden">
      <div className="grid items-center md:grid-cols-[minmax(0,40%)_1fr]">
        {/* The photo opens from the page edge it is anchored to, and the copy
            answers from the other side. The export is already cut to the arc,
            so no clipping is applied beyond the reveal. */}
        <MaskReveal from="left">
          <Image
            src={aboutFamily}
            alt="The IMENA family gathered for a celebration"
            placeholder="blur"
            sizes="(min-width: 768px) 40vw, 100vw"
            className="w-full"
          />
        </MaskReveal>

        <div className="mx-auto max-w-xl px-4 py-12 text-center md:px-10 md:py-14">
          <SplitText
            lines={[["About Imena Family"]]}
            delay={0.3}
            className="text-h3-m text-heading md:text-h3"
          />
          <Reveal from="right" delay={0.5} distance={32}>
            <p className="text-body text-text mt-6">
              The Imena family is built on love, unity, and the memories we
              create together. Across generations, we remain connected by our
              shared history, values, and traditions. We celebrate our
              achievements, support one another, and preserve the stories that
              shaped who we are. Together, we continue to grow, create
              meaningful moments, and leave a legacy for future generations.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
