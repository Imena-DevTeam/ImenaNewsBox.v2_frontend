import Image from "next/image";

export function AboutSection() {
  return (
    <section className="bg-band">
      <div className="grid items-center md:grid-cols-[minmax(0,37%)_1fr]">
        {/* Runs to the left edge of the viewport and is clipped by a wide arc. */}
        <div className="border-heading/25 relative h-72 w-full overflow-hidden rounded-r-full border-r md:h-90">
          <Image
            src="/images/about-family.png"
            alt="The IMENA family gathered for a celebration"
            fill
            sizes="(min-width: 768px) 37vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="mx-auto max-w-xl px-4 py-12 text-center md:px-10 md:py-14">
          <h2 className="text-h3-m text-heading md:text-h3">
            About Imena Family
          </h2>
          <p className="text-body text-text mt-6">
            The Imena family is built on love, unity, and the memories we create
            together. Across generations, we remain connected by our shared
            history, values, and traditions. We celebrate our achievements,
            support one another, and preserve the stories that shaped who we
            are. Together, we continue to grow, create meaningful moments, and
            leave a legacy for future generations.
          </p>
        </div>
      </div>
    </section>
  );
}
