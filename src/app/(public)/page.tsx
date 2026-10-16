import {
  AboutSection,
  BlogHighlights,
  CoreValues,
  EldersQuotes,
  Hero,
  RecentHandovers,
  StoryCta,
} from "@/features/landing/components";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <CoreValues />
      <RecentHandovers />
      <BlogHighlights />
      <StoryCta />
      <EldersQuotes />
    </>
  );
}
