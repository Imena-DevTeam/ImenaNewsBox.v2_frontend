import Image from "next/image";

export function AboutSection() {
  return (
    <section className="bg-band">
      <div className="grid items-center md:grid-cols-[minmax(0,40%)_1fr]">
        {/* The export is already cut to the arc, so no clipping is applied here. */}
        <Image
          src="/images/about-family.png"
          alt="The IMENA family gathered for a celebration"
          width={522}
          height={367}
          className="w-full"
        />

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
