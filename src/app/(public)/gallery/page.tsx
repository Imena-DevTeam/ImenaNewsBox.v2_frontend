import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs from reunions, handovers and the everyday moments in between.",
};

export default function GalleryPage() {
  return (
    <ComingSoon
      title="Gallery"
      description="Photographs from reunions, handovers and the everyday moments in between."
    />
  );
}
