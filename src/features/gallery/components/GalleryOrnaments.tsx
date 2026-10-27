import { Camera, Heart, Sun } from "lucide-react";

/*
 * The line-drawn camera, hearts and sun the design scatters behind the
 * page. Each one is anchored to the section it sits beside rather than to
 * the page, so none of them move when a section grows. They step out below
 * the large breakpoint, where there is no margin left to sit in.
 */

const HIDDEN =
  "text-gallery-ornament pointer-events-none absolute hidden lg:block";

/** Top right, over the opening stage. */
export function CameraOrnament() {
  return (
    <Camera
      aria-hidden
      className={`${HIDDEN} -top-30 right-37 size-30 -rotate-12`}
      strokeWidth={1.4}
    />
  );
}

/** Left, beside the "Featured Videos" heading. */
export function HeartsOrnament() {
  return (
    <span aria-hidden className={`${HIDDEN} -top-13 left-43 size-30`}>
      <Heart
        className="absolute top-0 left-0 size-17 -rotate-12"
        strokeWidth={2}
      />
      <Heart
        className="absolute top-4 left-7 size-20 rotate-6"
        strokeWidth={2}
      />
    </span>
  );
}

/** Right, level with the video frame's shoulder. */
export function SunOrnament() {
  return (
    <Sun
      aria-hidden
      className={`${HIDDEN} top-2 right-0 size-36`}
      strokeWidth={1.3}
    />
  );
}
