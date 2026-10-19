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
    <div className="page-enter">
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
