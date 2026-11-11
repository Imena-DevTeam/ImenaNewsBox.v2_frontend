import { AboutSection } from "@/features/landing/components/AboutSection";
import { BlogHighlights } from "@/features/landing/components/BlogHighlights";
import { CoreValues } from "@/features/landing/components/CoreValues";
import { EldersQuotes } from "@/features/landing/components/EldersQuotes";
import { Hero } from "@/features/landing/components/Hero";
import { RecentHandovers } from "@/features/landing/components/RecentHandovers";
import { StoryCta } from "@/features/landing/components/StoryCta";

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
