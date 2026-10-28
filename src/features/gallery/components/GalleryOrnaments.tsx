import { Camera, Heart, Sun } from "lucide-react";

/*
 * The line-drawn camera, hearts and sun from the design, kept small and
 * soft. They are handed to SectionHeading, which sets them beside the words
 * they decorate, so they read as part of the heading rather than as stray
 * marks in the margin.
 */

export function CameraOrnament() {
  return <Camera className="size-12 -rotate-12" strokeWidth={1.5} />;
}

export function HeartsOrnament() {
  return (
    <span className="relative block size-12">
      <Heart
        className="absolute top-0 left-0 size-8 -rotate-12"
        strokeWidth={1.8}
      />
      <Heart
        className="absolute right-0 bottom-0 size-9 rotate-6"
        strokeWidth={1.8}
      />
    </span>
  );
}

export function SunOrnament() {
  return <Sun className="size-12" strokeWidth={1.5} />;
}
