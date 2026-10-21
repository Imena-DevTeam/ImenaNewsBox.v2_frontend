import Image from "next/image";
import { blogReunion, storyCircle, storyIntro } from "@/lib/images";

/* The silhouette, traced from the shape as it is drawn in Figma rather than
   from a screenshot of the page: there the photograph met the form, and the
   edge came back lumpy. Here it stands against white, so flooding out from
   the middle gives a clean mask, measured as a radius per ray about its own
   centroid — six lobes, radius varying 227 to 290.

   553 x 539 is the shape's own size, so the SVG scales it rather than
   stretching it. */
const BLOB =
  "M 551.9 269.1 C 550.2 277.0 546.8 285.0 542.9 292.4 C 539.0 299.8 533.7 306.9 528.4 313.5 C 523.1 320.1 516.6 326.1 511 331.9 C 505.4 337.7 499.4 342.9 494.6 348.4 C 489.8 353.9 485.6 359.2 482.3 365 C 479.0 370.8 476.6 376.8 474.6 383.4 C 472.6 390.0 471.7 397.1 470.5 404.8 C 469.3 412.5 468.8 420.8 467.6 429.3 C 466.4 437.8 465.5 447.2 463.5 456 C 461.5 464.8 459.3 474.3 455.5 482.3 C 451.8 490.3 446.9 497.9 441 503.9 C 435.1 509.9 428.0 515.0 420.4 518.2 C 412.8 521.5 403.8 522.9 395.2 523.4 C 386.6 523.9 377.3 522.9 368.5 521.5 C 359.7 520.1 350.8 517.3 342.5 515.1 C 334.2 512.9 326.3 510.0 318.8 508.4 C 311.3 506.8 304.3 505.5 297.3 505.5 C 290.3 505.5 283.7 506.5 276.6 508.4 C 269.5 510.3 262.5 513.6 254.9 516.8 C 247.3 520.0 239.4 524.1 231.1 527.4 C 222.8 530.6 213.8 534.4 205 536.3 C 196.2 538.2 187.0 539.5 178.5 538.8 C 170.0 538.1 161.5 535.8 154.1 531.9 C 146.7 528.0 140.0 522.2 134.3 515.6 C 128.7 509.0 124.1 500.6 120.2 492.4 C 116.3 484.2 113.7 474.8 111.2 466.2 C 108.7 457.6 107.1 448.7 105 440.7 C 102.9 432.7 101.2 425.2 98.6 418.4 C 96.0 411.6 93.3 405.6 89.6 400 C 85.9 394.4 81.6 389.5 76.6 384.6 C 71.6 379.7 65.5 375.3 59.4 370.4 C 53.3 365.5 46.1 360.8 39.8 355.3 C 33.4 349.8 26.8 343.9 21.3 337.5 C 15.9 331.1 10.7 324.0 7.1 316.6 C 3.5 309.2 1.0 301.2 0 293.3 C -1.0 285.4 -0.4 277.0 1.3 269.1 C 3.0 261.2 6.3 253.2 10.3 245.8 C 14.3 238.4 19.9 231.3 25.2 224.7 C 30.5 218.1 36.4 212.1 41.9 206.2 C 47.4 200.3 53.2 195.0 58 189.5 C 62.8 184.0 67.1 178.8 70.6 173 C 74.1 167.2 76.8 161.5 78.9 154.9 C 81.0 148.3 81.9 141.2 83 133.5 C 84.1 125.8 84.5 117.4 85.6 108.8 C 86.7 100.2 87.5 90.7 89.5 81.9 C 91.5 73.1 94.0 63.8 97.7 55.8 C 101.5 47.8 106.2 40.0 112 34 C 117.8 28.0 124.9 23.0 132.6 19.7 C 140.3 16.4 149.2 14.9 157.9 14.4 C 166.6 13.9 175.9 15.2 184.7 16.6 C 193.5 18.1 202.4 20.9 210.7 23.1 C 219.0 25.3 226.9 28.2 234.4 29.8 C 241.9 31.4 248.9 32.6 255.9 32.6 C 262.9 32.6 269.5 31.6 276.6 29.7 C 283.7 27.8 290.7 24.2 298.3 21 C 305.9 17.8 313.9 13.6 322.2 10.4 C 330.5 7.2 339.5 3.5 348.2 1.8 C 356.9 0.1 366.1 -0.8 374.5 0 C 382.9 0.8 391.5 3.0 398.9 6.8 C 406.3 10.6 413.1 16.3 418.8 22.8 C 424.5 29.3 429.1 37.5 433 45.7 C 436.9 53.9 439.5 63.3 442 71.9 C 444.5 80.5 446.1 89.5 448.2 97.5 C 450.3 105.5 452.0 113.0 454.6 119.7 C 457.2 126.4 460.1 132.3 463.9 137.9 C 467.7 143.5 472.1 148.3 477.2 153.2 C 482.3 158.1 488.3 162.6 494.4 167.5 C 500.5 172.4 507.4 177.3 513.7 182.8 C 520.0 188.3 526.8 194.2 532.3 200.6 C 537.8 207.0 542.9 214.1 546.4 221.5 C 549.9 228.9 552.3 237.0 553.2 244.9 C 554.1 252.8 553.6 261.2 551.9 269.1 Z";

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
      <div className="relative mx-auto aspect-[553/539] w-full max-w-xl">
        {/* The mask itself. Referenced by the layers below. */}
        <svg
          viewBox="0 0 553 539"
          className="pointer-events-none absolute size-0"
          aria-hidden
        >
          <defs>
            <clipPath
              id="login-blob"
              clipPathUnits="objectBoundingBox"
              transform="scale(0.0018083 0.0018553)"
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
