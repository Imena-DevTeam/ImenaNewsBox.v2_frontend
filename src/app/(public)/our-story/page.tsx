import type { Metadata } from "next";
import {
  Slogans,
  StatsStrip,
  StoryHero,
  StoryIntro,
} from "@/features/story/components";

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
      <Slogans />
    </>
  );
}
