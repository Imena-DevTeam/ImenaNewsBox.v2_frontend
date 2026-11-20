import { PageHeaderSkeleton } from "@/components/layout/PageHeaderSkeleton";
import { Skeleton, SkeletonPage, SkeletonText } from "@/components/ui/Skeleton";

/** One resource card: the crest, title, summary and the three actions. */
function ResourceCardSkeleton() {
  return (
    <div className="border-border bg-surface flex h-full flex-col rounded-3xl border p-6 sm:p-8">
      <div className="mb-6 flex justify-center">
        <Skeleton className="size-16 rounded-2xl" />
      </div>
      <Skeleton className="h-6 w-4/5 rounded-lg" />
      <SkeletonText lines={2} className="mt-3 w-full" />
      <div className="mt-6 space-y-3 md:mt-8">
        <Skeleton className="h-11 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/** The resources page: header, the heading, the category filter, the cards. */
export function ResourcesSkeleton() {
  return (
    <SkeletonPage label="Loading family resources" className="min-w-0 pb-12">
      <PageHeaderSkeleton />

      <div className="mt-6 flex flex-col items-center md:mt-8">
        <Skeleton className="h-9 w-64 max-w-full rounded-lg" />
        <Skeleton className="mt-2 h-1 w-12 rounded-full" />
      </div>

      <div className="mt-8 space-y-8 md:mt-10 md:space-y-10">
        <div className="space-y-4">
          <Skeleton className="rounded-pill h-10 w-36" />
          <div className="flex flex-wrap gap-2.5">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="rounded-pill h-9 w-28" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <ResourceCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
