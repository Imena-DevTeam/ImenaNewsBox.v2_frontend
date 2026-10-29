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
    <div className="overflow-x-clip">
      <Hero />
      <AboutSection />
      <CoreValues />
      <RecentHandovers />
      <BlogHighlights />
      <StoryCta />
      <EldersQuotes />
    </div>
  );
}
