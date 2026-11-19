import { PageHeaderSkeleton } from "@/components/layout/PageHeaderSkeleton";
import { Skeleton, SkeletonPage, SkeletonText } from "@/components/ui/Skeleton";

/** Shaped like the subfamily page: banner, three counts, story, moments. */
export default function FamilyLoading() {
  return (
    <SkeletonPage label="Loading the family" className="min-w-0 pb-12">
      <PageHeaderSkeleton />
      <Skeleton className="mt-6 min-h-70 rounded-lg md:mt-8 md:min-h-96" />
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="mt-10 h-7 w-48 md:mt-14" />
      <SkeletonText lines={4} className="mt-5 max-w-prose" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="aspect-4/3 rounded-lg" />
        ))}
      </div>
    </SkeletonPage>
  );
}
