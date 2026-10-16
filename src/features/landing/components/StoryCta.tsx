import Image from "next/image";
import { BookOpen, UserRoundPlus } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

export function StoryCta() {
  return (
    <section className="from-primary to-primary/55 relative overflow-hidden bg-linear-to-r">
      <div className="max-w-page mx-auto grid items-center gap-10 md:grid-cols-[1fr_auto]">
        <div className="text-surface px-4 py-14 md:px-8 md:py-20">
          <h2 className="text-h2-m md:text-h2">
            Your Story Is Part of Our History
          </h2>

          <p className="text-body text-surface/90 mt-5 max-w-xl">
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

        <Image
          src="/images/story-cta.png"
          alt="Students of the IMENA family outside their school"
          width={509}
          height={360}
          className="hidden h-full w-full rounded-l-[16rem] object-cover md:block md:max-w-md"
        />
      </div>
    </section>
  );
}
