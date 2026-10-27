import type { Metadata } from "next";
import { GalleryHome } from "@/features/gallery/components/GalleryHome";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Family photographs, video highlights and albums.",
};

export default function GalleryPage() {
  return <GalleryHome />;
}
