import Image from "next/image";
import { Container } from "@/components/layout/Container";
import {
  HouseHeartOrnament,
  SunOrnament,
} from "@/features/story/components/Ornaments";

export function StatsStrip() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <HouseHeartOrnament className="absolute top-6 left-4 size-14 md:size-16" />
      <SunOrnament className="absolute top-10 right-[22%] hidden size-12 md:block md:size-14" />

      <Container className="relative">
        <h2 className="text-h2-m text-heading decoration-heading md:text-h2 mx-auto w-fit underline underline-offset-8">
          OUR STORY
        </h2>

        <p className="text-body-lg mx-auto mt-12 max-w-2xl text-center">
          IMENA is not just a family but a spirit and&mdash;culture that{" "}
          <span className="text-display-soft">
            embodies what we do plus the way we live
          </span>
          .
        </p>

        {/* The portrait and both figures share one line. */}
        <div className="mt-12 grid items-center gap-10 md:grid-cols-3 md:gap-8">
          <div className="text-center">
            <p className="text-primary text-h1-m md:text-h1">3</p>
            <p className="text-body-lg">Subfamilies</p>
          </div>

          <Image
            src="/images/story-circle.jpg"
            alt="Members of the IMENA family gathered outside their home"
            width={810}
            height={810}
            className="rounded-pill mx-auto aspect-square w-56 object-cover md:w-72"
          />

          <div className="text-center">
            <p className="text-stat text-display-m md:text-display">140+</p>
            <p className="text-body-lg">Members</p>
          </div>
        </div>

        <hr className="border-border mt-14 border-t" />

        <p className="text-body text-muted mx-auto mt-10 max-w-2xl text-center">
          IMENA is not just a family but a{" "}
          <span className="text-text">spirit</span>, the solidarity endures
          across all chapters.
        </p>
      </Container>
    </section>
  );
}
