import { PageHeaderSkeleton } from "@/components/layout/PageHeaderSkeleton";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

/* Mixed heights, so the placeholder reads as a wall of photographs rather
   than a spreadsheet. */
const HEIGHTS = [
  "aspect-4/5",
  "aspect-square",
  "aspect-4/3",
  "aspect-square",
  "aspect-4/5",
  "aspect-4/3",
];

/** One album: header, the back link and title, then its photographs. */
export function AlbumSkeleton() {
  return (
    <SkeletonPage label="Loading the album" className="min-w-0">
      <PageHeaderSkeleton />
      <Skeleton className="mt-8 h-4 w-32" />
      <div className="mt-6 flex flex-col items-center">
        <Skeleton className="h-10 w-72 max-w-full rounded-lg" />
        <Skeleton className="mt-3 h-4 w-40" />
      </div>
      <div className="mt-10 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {HEIGHTS.concat(HEIGHTS).map((aspect, index) => (
          <Skeleton key={index} className={`${aspect} w-full rounded-lg`} />
        ))}
      </div>
    </SkeletonPage>
  );
}
