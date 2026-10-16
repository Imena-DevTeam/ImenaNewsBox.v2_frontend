import Image from "next/image";

export function AboutSection() {
  return (
    <section className="bg-primary/4">
      {/* The photo runs to the left edge of the viewport, as in the design. */}
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Image
          src="/images/about-family.png"
          alt="The IMENA family gathered for a celebration"
          width={522}
          height={367}
          className="border-primary/20 h-full w-full rounded-r-[14rem] border-r object-cover md:max-h-[23rem]"
        />

        <div className="mx-auto max-w-xl px-4 py-12 text-center md:px-8 md:py-16">
          <h2 className="text-h3-m text-primary md:text-h3">
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
