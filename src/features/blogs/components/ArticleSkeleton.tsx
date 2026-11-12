import { PageHeaderSkeleton } from "@/components/layout/PageHeaderSkeleton";
import { Skeleton, SkeletonPage, SkeletonText } from "@/components/ui/Skeleton";

/** One article: tag, title, the author bar, the photograph, then the text. */
export function ArticleSkeleton() {
  return (
    <SkeletonPage label="Loading the story" className="min-w-0">
      <PageHeaderSkeleton />

      <div className="mx-auto mt-8 max-w-5xl md:mt-10">
        <Skeleton className="rounded-pill h-7 w-24" />
        <Skeleton className="mt-5 h-9 w-full rounded-lg md:h-11" />
        <Skeleton className="mt-3 h-9 w-2/3 rounded-lg md:h-11" />

        <div className="mt-6 flex items-center gap-3">
          <Skeleton className="size-11 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="rounded-pill h-10 w-28" />
        </div>

        <Skeleton className="mt-8 aspect-video w-full rounded-lg" />

        <div className="mt-8 space-y-6">
          <SkeletonText lines={4} />
          <SkeletonText lines={5} />
          <SkeletonText lines={3} />
        </div>
      </div>
    </SkeletonPage>
  );
}
