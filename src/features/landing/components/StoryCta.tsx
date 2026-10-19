import Image from "next/image";
import { BookOpen, UserRoundPlus } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { storyCta } from "@/lib/images";

export function StoryCta() {
  return (
    <section className="from-primary to-primary/55 text-surface overflow-hidden bg-linear-to-r">
      <div className="grid items-center md:grid-cols-[1fr_minmax(0,34rem)]">
        <div className="mx-auto w-full max-w-xl px-4 py-14 md:px-8 md:py-20">
          <h2 className="text-h2-m md:text-h2">
            Your Story Is Part of Our History
          </h2>

          <p className="text-body text-surface/90 mt-5">
            We remember where we came from, celebrate where we are, and build
            toward where we are going. Together, we preserve our memories and
            carry our family story forward.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href={ROUTES.SIGNUP} variant="light">
              Join as a Member
              <UserRoundPlus className="size-4" />
            </ButtonLink>

            <ButtonLink
              href={ROUTES.OUR_STORY}
              className="border-surface text-surface hover:bg-surface/10 border bg-transparent"
            >
              Explore Our Story
              <BookOpen className="size-4" />
            </ButtonLink>
          </div>
        </div>

        {/* Runs to the right edge of the viewport. */}
        <Image
          src={storyCta}
          alt="Students of the IMENA family outside their school"
          placeholder="blur"
          sizes="(min-width: 768px) 34rem, 100vw"
          /* The export is already cut to the arc, so no clipping is applied here. */
          className="hidden h-full w-full object-cover md:block"
        />
      </div>
    </section>
  );
}
