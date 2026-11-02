import { PageHeaderSkeleton } from "@/components/layout/PageHeaderSkeleton";
import { Skeleton, SkeletonPage, SkeletonText } from "@/components/ui/Skeleton";

/* Where the floating faces sit, as percentages of the hero, so the
   placeholders scatter the way the portraits do. */
const FACES = [
  { left: "12%", top: "30%", size: "size-16 md:size-20" },
  { left: "30%", top: "62%", size: "size-14 md:size-16" },
  { left: "50%", top: "28%", size: "size-20 md:size-24" },
  { left: "70%", top: "64%", size: "size-14 md:size-16" },
  { left: "88%", top: "34%", size: "size-16 md:size-20" },
];

/** The member tree: header, the floating faces, the promotion pills, then
    the member cards two by two. */
export function TreeSkeleton() {
  return (
    <SkeletonPage label="Loading the family tree" className="min-w-0">
      <PageHeaderSkeleton />

      <div className="relative mt-2 h-80 w-full md:h-112">
        {FACES.map((face) => (
          <Skeleton
            key={face.left}
            style={{ left: face.left, top: face.top }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${face.size}`}
          />
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center md:mt-20">
        <Skeleton className="h-3 w-40" />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="rounded-pill h-10 w-28" />
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="border-member-border flex gap-4 rounded-md border p-2.5 md:gap-5"
          >
            <Skeleton className="h-40 w-28 shrink-0 rounded-sm sm:w-36 md:w-44" />
            <div className="flex flex-1 flex-col justify-center gap-3 py-3 pr-3">
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-6 w-24 rounded-sm" />
              <SkeletonText lines={2} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}
