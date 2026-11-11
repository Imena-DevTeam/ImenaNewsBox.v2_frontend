import type { Metadata } from "next";
import { Slogans } from "@/features/story/components/Slogans";
import { StatsStrip } from "@/features/story/components/StatsStrip";
import { StoryHero } from "@/features/story/components/StoryHero";
import { StoryIntro } from "@/features/story/components/StoryIntro";
import { Timeline } from "@/features/story/components/Timeline";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Where the IMENA family began, what it stands for and where it is going.",
};

export default function OurStoryPage() {
  return (
    <>
      <StoryHero />
      <StoryIntro />
      <StatsStrip />
      <Timeline />
      <Slogans />
    </>
  );
}
