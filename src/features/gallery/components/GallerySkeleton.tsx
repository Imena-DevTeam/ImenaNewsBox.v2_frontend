/**
 * The gallery's shape while its photographs are on their way. Every box
 * here is the same aspect-ratio token the real component uses, so nothing
 * moves when the pictures arrive.
 */
const SHIMMER = "bg-member-field motion-safe:animate-pulse rounded-field";

export function GallerySkeleton() {
  return (
    <div className="min-w-0" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading the family gallery</span>

      <div className="flex items-center justify-between gap-4">
        <div className={`${SHIMMER} h-14 w-64`} />
        <div className={`${SHIMMER} rounded-pill size-12`} />
      </div>

      <div>
        <div className="gallery-stage mx-auto mt-12 w-full max-w-240 md:mt-20">
          <div
            data-stage="side"
            data-depth="outer"
            className={`${SHIMMER} aspect-gallery-stage-side w-full`}
          />
          <div
            data-stage="side"
            data-depth="mid"
            className={`${SHIMMER} aspect-gallery-stage-mid w-full`}
          />
          <div
            className={`${SHIMMER} aspect-gallery-stage w-full rounded-lg`}
          />
          <div
            data-stage="side"
            data-depth="mid"
            className={`${SHIMMER} aspect-gallery-stage-mid w-full`}
          />
          <div
            data-stage="side"
            data-depth="outer"
            className={`${SHIMMER} aspect-gallery-stage-side w-full`}
          />
        </div>

        <div className="mt-16 md:mt-24">
          <div className={`${SHIMMER} mx-auto h-11 w-64`} />
          <div
            className={`${SHIMMER} rounded-media aspect-gallery-video mx-auto mt-11 w-full max-w-200`}
          />
        </div>

        <div className="mt-16 md:mt-24">
          <div className={`${SHIMMER} mx-auto h-11 w-56`} />
          <ul className="mt-11 grid gap-x-5 gap-y-13 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <li key={index}>
                <div className={`${SHIMMER} aspect-gallery-album w-full`} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
