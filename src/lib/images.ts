/**
 * Statically imported photographs.
 *
 * Importing the file rather than passing a "/images/…" string is what lets
 * next/image generate a blur placeholder at build time, so a photo fades up
 * from its own colours instead of popping in. It also carries the intrinsic
 * width and height, so no component has to restate them.
 *
 * Only the large photographs need this. Small decorative art can stay as a
 * plain path. The @public alias is declared in tsconfig.json.
 */

import aboutFamily from "@public/images/about-family.png";
import blogReunion from "@public/images/blog-reunion.png";
import coreValues from "@public/images/core-values.png";
import handover1 from "@public/images/handover-1.png";
import heroFamily from "@public/images/hero-family.png";
import storyCircle from "@public/images/story-circle.jpg";
import storyCta from "@public/images/story-cta.png";
import storyIntro from "@public/images/story-intro.jpg";

export {
  aboutFamily,
  blogReunion,
  coreValues,
  handover1,
  heroFamily,
  storyCircle,
  storyCta,
  storyIntro,
};
