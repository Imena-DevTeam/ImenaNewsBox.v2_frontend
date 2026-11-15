import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { heroFamily } from "@/lib/images";

/**
 * The first screen: one photograph, one line, one action.
 *
 * The heading and the photograph are in the server's HTML from the first
 * frame. Only the copy under the heading eases in, once, so the screen is
 * never blank while it waits for an entrance. The tree preview that used to
 * overlap the photograph has its own section further down the page.
 */
export function Hero() {
  return (
    <section className="relative -mt-20 overflow-x-clip pt-20">
      <Container className="grid w-full gap-12 pt-28 pb-16 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="max-w-xl">
          <h1 className="text-display-m md:text-display">
            Rediscover{" "}
            <span className="text-display-soft block">Your Legacy.</span>
          </h1>

          <Reveal onMount delay={0.15} distance={12}>
            <p className="text-body-lg text-brand mt-5 max-w-md">
              A modern space for family history, connections, and stories.
            </p>
            <div className="mt-9">
              <ButtonLink href={ROUTES.FAMILY_TREE} size="lg">
                Explore the tree
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <Image
          src={heroFamily}
          alt="Members of the IMENA family posing together outside a family home"
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 36rem, 100vw"
          className="ml-auto w-full max-w-xl rounded-lg"
        />
      </Container>
    </section>
  );
}
