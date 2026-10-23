import Image from "next/image";
import { BookOpen, UserRoundPlus } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { storyCta } from "@/lib/images";

export function StoryCta() {
  return (
    <section className="from-primary to-primary/55 text-surface gradient-drift overflow-hidden bg-linear-to-r">
      <div className="grid items-center md:grid-cols-[1fr_minmax(0,34rem)]">
        <div className="mx-auto w-full max-w-xl px-4 py-14 md:px-8 md:py-20">
          <SplitText
            lines={[["Your Story Is Part of Our History"]]}
            className="text-h2-m md:text-h2"
          />

          <Reveal blur delay={0.45} distance={24}>
            <p className="text-body text-surface/90 mt-5">
              We remember where we came from, celebrate where we are, and build
              toward where we are going. Together, we preserve our memories and
              carry our family story forward.
            </p>
          </Reveal>

          <Stagger delay={0.65} className="mt-8 flex flex-wrap gap-4">
            <StaggerItem distance={20}>
              <Magnetic>
                <ButtonLink href={ROUTES.SIGNUP} variant="light">
                  Join as a Member
                  <UserRoundPlus className="size-4" />
                </ButtonLink>
              </Magnetic>
            </StaggerItem>

            <StaggerItem distance={20}>
              <Magnetic>
                <ButtonLink
                  href={ROUTES.OUR_STORY}
                  className="border-surface text-surface hover:bg-surface/10 border bg-transparent"
                >
                  Explore Our Story
                  <BookOpen className="size-4" />
                </ButtonLink>
              </Magnetic>
            </StaggerItem>
          </Stagger>
        </div>

        {/* Runs to the right edge of the viewport, and is uncovered from
            that edge inward. The export is already cut to the arc, so no
            clipping is applied beyond the reveal. */}
        <MaskReveal from="right" className="hidden h-full md:block">
          <Image
            src={storyCta}
            alt="Students of the IMENA family outside their school"
            placeholder="blur"
            sizes="(min-width: 768px) 34rem, 100vw"
            className="h-full w-full object-cover"
          />
        </MaskReveal>
      </div>
    </section>
  );
}
