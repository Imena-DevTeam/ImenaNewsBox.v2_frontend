import { Camera, Sun } from "lucide-react";

/*
 * The line-drawn camera and sun from the design, kept small and
 * soft. They are handed to SectionHeading, which sets them beside the words
 * they decorate, so they read as part of the heading rather than as stray
 * marks in the margin.
 */

export function CameraOrnament() {
  return <Camera className="size-12 -rotate-12" strokeWidth={1.5} />;
}

export function SunOrnament() {
  return <Sun className="size-12" strokeWidth={1.5} />;
}
