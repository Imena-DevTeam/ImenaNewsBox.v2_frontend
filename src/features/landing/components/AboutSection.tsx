import Image from "next/image";

export function AboutSection() {
  return (
    <section className="bg-primary/4">
      <div className="max-w-page mx-auto grid items-center gap-10 py-12 md:grid-cols-2 md:gap-16 md:py-16">
        {/* Full-bleed on the left, with the large rounded right edge. */}
        <Image
          src="/images/about-family.png"
          alt="The IMENA family gathered for a celebration"
          width={522}
          height={367}
          className="border-primary/20 w-full rounded-r-[14rem] border-r object-cover md:max-h-[22rem]"
        />

        <div className="px-4 text-center md:px-8">
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
