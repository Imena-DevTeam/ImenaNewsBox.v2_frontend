import { PageHeaderSkeleton } from "@/components/layout/PageHeaderSkeleton";
import { Skeleton, SkeletonPage, SkeletonText } from "@/components/ui/Skeleton";

/** One resource card: chips, the file icon, title, summary and actions. */
function ResourceCardSkeleton() {
  return (
    <div className="border-border bg-surface flex h-full flex-col items-center rounded-3xl border p-6">
      <div className="flex gap-2">
        <Skeleton className="rounded-pill h-5 w-20" />
        <Skeleton className="rounded-pill h-5 w-14" />
      </div>
      <Skeleton className="mt-4 size-14 rounded-2xl" />
      <Skeleton className="mt-4 h-6 w-4/5 rounded-lg" />
      <SkeletonText lines={3} className="mt-3 w-full" />
      <div className="border-border/60 mt-6 flex w-full gap-2 border-t pt-4">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="size-11 shrink-0 rounded-xl" />
      </div>
    </div>
  );
}

/** The resources page: header, the heading, the featured banner, filters
    and search, then the cards. */
export function ResourcesSkeleton() {
  return (
    <SkeletonPage label="Loading family resources" className="min-w-0 pb-12">
      <PageHeaderSkeleton />

      <div className="mt-6 flex flex-col items-center md:mt-8">
        <Skeleton className="h-9 w-64 max-w-full rounded-lg" />
        <Skeleton className="mt-2 h-1 w-12 rounded-full" />
      </div>

      <div className="mt-8 space-y-8 md:mt-10 md:space-y-10">
        <Skeleton className="h-40 w-full rounded-3xl md:h-48" />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="rounded-pill h-10 w-28" />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="rounded-pill h-11 w-full sm:w-64 md:w-72" />
            <Skeleton className="rounded-pill h-11 w-20 shrink-0" />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <ResourceCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
