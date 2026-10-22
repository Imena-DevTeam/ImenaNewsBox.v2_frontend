import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { heroFamily } from "@/lib/images";
import { TreePreviewCard } from "@/features/landing/components/TreePreviewCard";

export function Hero() {
  return (
    <section className="relative -mt-[6.5rem] flex min-h-dvh items-center overflow-hidden">
      {/* Decorative rings from the design. */}
      <span
        aria-hidden
        className="rounded-pill border-primary/5 pointer-events-none absolute -top-24 -left-40 size-96 border-[3rem]"
      />
      <span
        aria-hidden
        className="rounded-pill border-primary/5 pointer-events-none absolute right-0 -bottom-40 size-[28rem] border-[3rem]"
      />

      <Container className="relative grid w-full gap-12 pt-28 pb-16 lg:grid-cols-2 lg:items-center lg:gap-8">
        <div className="max-w-xl">
          <h1 className="text-display-m md:text-display">
            Rediscover
            <br />
            <span className="text-display-soft">Your Legacy.</span>
          </h1>

          <p className="text-body-lg text-primary mt-5 max-w-md">
            A modern space for family history, connections, and stories.
          </p>

          <ButtonLink href={ROUTES.FAMILY_TREE} size="lg" className="mt-9">
            Explore the Tree
          </ButtonLink>
        </div>

        <div className="relative">
          <Image
            src={heroFamily}
            alt="Members of the IMENA family posing together outside a family home"
            priority
            placeholder="blur"
            className="motion-safe:animate-float ml-auto w-full max-w-xl"
          />
          <TreePreviewCard className="motion-safe:animate-float-slow absolute -bottom-6 -left-2 w-64 md:w-80 lg:-left-10" />
        </div>
      </Container>
    </section>
  );
}
