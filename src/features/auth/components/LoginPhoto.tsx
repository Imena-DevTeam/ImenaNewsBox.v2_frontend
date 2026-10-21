import Image from "next/image";
import { blogReunion, storyCircle, storyIntro } from "@/lib/images";

/* The silhouette, traced from the design in polar coordinates: for each of
   64 rays out of the shape's centroid, the furthest pixel of the photograph
   along it, smoothed around the circle and fitted as a closed curve.

   Read row by row instead, the outline came out notched — the shape curves
   back on itself, so a row's leftmost pixel jumps between lobes. 519 x 494
   is the shape's own size, so the SVG scales it rather than stretching it. */
const BLOB =
  "M 518.6 246.9 C 517.6 255.1 515.1 263.3 512.4 271.2 C 509.6 279.1 505.8 286.7 502.1 294 C 498.4 301.3 493.9 308.1 490 315 C 486.1 321.9 482.1 328.4 478.5 335.1 C 474.9 341.8 471.7 348.4 468.7 355.4 C 465.7 362.4 463.1 369.6 460.3 377 C 457.5 384.4 455.0 392.0 451.9 399.7 C 448.8 407.4 445.8 415.5 441.8 423 C 437.8 430.5 433.3 438.1 427.9 444.6 C 422.5 451.1 416.3 457.3 409.5 462.2 C 402.7 467.1 395.0 471.2 387.2 474.3 C 379.4 477.4 370.9 479.5 362.6 481 C 354.3 482.5 345.7 482.9 337.4 483.4 C 329.1 483.9 320.9 483.8 312.9 484 C 304.8 484.2 297.0 484.1 289.1 484.5 C 281.2 484.9 273.6 485.8 265.7 486.7 C 257.8 487.6 250.0 489.1 241.8 490.1 C 233.7 491.1 225.2 492.4 216.8 492.8 C 208.4 493.2 199.7 493.4 191.3 492.4 C 182.9 491.3 176.1 486.2 166.5 486.5 C 156.9 486.8 144.5 493.0 133.5 494.3 C 122.5 495.6 111.0 495.9 100.5 494.3 C 90.0 492.7 78.5 490.4 70.8 484.5 C 63.0 478.6 60.3 466.3 54 458.6 C 47.7 450.9 39.0 445.7 32.8 438.1 C 26.6 430.5 22.5 421.3 17 413.1 C 11.5 404.9 2.3 398.6 0 389 C -2.3 379.4 1.8 366.4 3.2 355.7 C 4.6 345.0 6.7 334.8 8.4 325 C 10.1 315.2 13.8 305.9 13.5 297.1 C 13.2 288.3 6.6 280.8 6.8 272.4 C 7.0 264.0 12.2 255.2 14.4 246.9 C 16.6 238.6 17.4 230.6 20 222.8 C 22.6 215.0 26.4 207.4 30.1 200.1 C 33.8 192.8 38.1 185.9 42 179.1 C 45.9 172.3 50.1 165.8 53.7 159.1 C 57.3 152.4 60.6 145.9 63.7 139 C 66.8 132.1 69.4 125.1 72.2 117.7 C 75.0 110.3 77.4 102.5 80.4 94.8 C 83.4 87.1 86.5 79.1 90.4 71.6 C 94.3 64.1 98.7 56.4 103.9 49.8 C 109.2 43.1 115.2 36.8 121.9 31.7 C 128.6 26.6 136.2 22.3 143.9 19 C 151.7 15.7 160.1 13.6 168.4 12 C 176.7 10.4 185.3 9.8 193.6 9.3 C 201.9 8.8 210.3 9.2 218.4 9 C 226.5 8.8 234.3 8.8 242.2 8.3 C 250.1 7.9 257.8 7.2 265.7 6.3 C 273.6 5.4 281.5 4.0 289.7 3 C 297.9 1.9 306.3 0.5 314.8 0 C 323.3 -0.5 332.0 -0.6 340.5 0.3 C 349.0 1.2 357.7 2.8 365.7 5.6 C 373.7 8.4 381.5 12.3 388.5 17.1 C 395.5 21.9 401.9 28.1 407.7 34.4 C 413.5 40.7 418.6 47.9 423.3 55 C 428.0 62.1 431.7 69.9 435.6 77.1 C 439.5 84.3 443.0 91.6 446.8 98.4 C 450.6 105.2 454.5 111.6 458.7 118 C 462.9 124.4 467.4 130.4 472.1 136.6 C 476.8 142.8 482.0 148.8 486.8 155.3 C 491.6 161.8 496.9 168.4 501.1 175.5 C 505.3 182.6 509.3 190.2 512.2 197.9 C 515.1 205.7 517.5 213.8 518.6 222 C 519.7 230.2 519.6 238.7 518.6 246.9 Z";

const PHOTOS = [storyCircle, storyIntro, blogReunion];

/**
 * The photograph beside the login form, dissolving between several pictures.
 *
 * CSS only, so this stays a server component: the layers are stacked in one
 * clipped box and each runs the same cycle on a different offset. The first
 * picture also sits underneath them all, so a dissolve never shows a gap.
 */
export function LoginPhoto({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative mx-auto aspect-[519/494] w-full max-w-xl">
        {/* The mask itself. Referenced by the layers below. */}
        <svg
          viewBox="0 0 519 494"
          className="pointer-events-none absolute size-0"
          aria-hidden
        >
          <defs>
            <clipPath
              id="login-blob"
              clipPathUnits="objectBoundingBox"
              transform="scale(0.0019268 0.0020243)"
            >
              <path d={BLOB} />
            </clipPath>
          </defs>
        </svg>

        <div
          className="bg-band absolute inset-0"
          style={{ clipPath: "url(#login-blob)" }}
        >
          <Image
            src={PHOTOS[0]!}
            alt="Members of the IMENA family together"
            placeholder="blur"
            sizes="(min-width: 1024px) 36rem, 90vw"
            className="absolute inset-0 size-full object-cover"
          />

          {PHOTOS.map((photo, i) => (
            <Image
              key={photo.src}
              src={photo}
              alt=""
              aria-hidden
              placeholder="blur"
              sizes="(min-width: 1024px) 36rem, 90vw"
              style={{ animationDelay: `${i * -6}s` }}
              className="photo-cycle absolute inset-0 size-full object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
