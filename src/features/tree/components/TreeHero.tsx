import { Container } from "@/components/layout/Container";

export function TreeHero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* The tinted band sits at a slight angle, rising to the right, and is
          wider than the viewport so the rotation never exposes a corner. */}
      <div
        aria-hidden
        className="bg-band absolute inset-y-0 left-1/2 -z-10 w-[150vw] -translate-x-1/2 -rotate-3"
      />

      <Container className="relative py-20 md:py-28">
        {/* A pair of marks above the title, as in the design. */}
        <div
          aria-hidden
          className="mx-auto mb-10 flex max-w-2xl items-center gap-1"
        >
          <span className="bg-text rounded-pill size-8" />
          <span className="bg-heading size-8" />
        </div>

        {/* Centred as a block, but set left, so the three lines break where
            the design breaks them. */}
        <h1 className="text-display-m md:text-display mx-auto max-w-2xl">
          Family is a huge part of who we are, so does its{" "}
          <span className="text-heading">history.</span>
        </h1>
      </Container>

      {/* The offset pair in the lower right. */}
      <div
        aria-hidden
        className="absolute right-6 bottom-6 hidden md:right-12 md:block"
      >
        <span className="bg-display-soft absolute right-0 bottom-8 size-9" />
        <span className="bg-tree-mark absolute right-8 bottom-0 size-9" />
      </div>
    </section>
  );
}
