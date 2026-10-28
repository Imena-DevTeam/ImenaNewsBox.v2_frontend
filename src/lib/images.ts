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

import aboutFamily from "@public/images/about-family.webp";
import blogReunion from "@public/images/blog-reunion.webp";
import coreValues from "@public/images/core-values.webp";
import dashboardFamilyGathering from "@public/images/dashboard-family-gathering.webp";
import elder1 from "@public/images/elder-1.webp";
import elder2 from "@public/images/elder-2.webp";
import elder3 from "@public/images/elder-3.webp";
import elder4 from "@public/images/elder-4.webp";
import imenaCrest from "@public/images/imena-crest.webp";
import ghost from "@public/images/ghost.webp";
import handover1 from "@public/images/handover-1.webp";
import handover2 from "@public/images/handover-2.webp";
import handover3 from "@public/images/handover-3.webp";
import heroFamily from "@public/images/hero-family.webp";
import storyCircle from "@public/images/story-circle.webp";
import storyCta from "@public/images/story-cta.webp";
import storyIntro from "@public/images/story-intro.webp";

export {
  aboutFamily,
  blogReunion,
  coreValues,
  dashboardFamilyGathering,
  elder1,
  elder2,
  elder3,
  elder4,
  handover1,
  handover2,
  handover3,
  ghost,
  heroFamily,
  imenaCrest,
  storyCircle,
  storyCta,
  storyIntro,
};
