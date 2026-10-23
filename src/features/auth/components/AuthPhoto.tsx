import Image from "next/image";
import { blogReunion, handover1, storyCircle, storyIntro } from "@/lib/images";

/* The pictures that pass through the blob, in order. */
const PHOTOS = [storyCircle, storyIntro, blogReunion, handover1];

/** How far apart the layers sit in the 24s cycle, as a negative delay. */
const STEP = -24 / PHOTOS.length;

/**
 * The photograph on the login pages, dissolving between several pictures
 * inside the designer's blob.
 *
 * The silhouette is a CSS mask rather than a cut-out image, which is what
 * lets the picture behind it change. It is CSS all the way down, so this
 * stays a server component and the slideshow costs no JavaScript.
 *
 * The background sits inside the mask too, so a photograph with a
 * transparent corner shows the band colour rather than the page.
 */
export function AuthPhoto({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="auth-photo-mask bg-band relative aspect-[1036/1008] size-full">
        {PHOTOS.map((photo, i) => (
          <Image
            key={photo.src}
            src={photo}
            alt=""
            priority={i === 0}
            placeholder="blur"
            sizes="700px"
            draggable={false}
            style={{ animationDelay: `${i * STEP}s` }}
            className="auth-photo-cycle absolute inset-0 size-full object-cover select-none"
          />
        ))}
      </div>
    </div>
  );
}
