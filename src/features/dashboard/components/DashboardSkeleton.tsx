import { Skeleton, SkeletonPage, SkeletonText } from "@/components/ui/Skeleton";

/** The dashboard's shape: header and search, the hero slides, the articles
    beside the birthdays column, then the three subfamily cards. */
export function DashboardSkeleton() {
  return (
    <SkeletonPage label="Loading your family dashboard" className="space-y-10">
      <div>
        <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
          <Skeleton className="h-11 w-48 rounded-lg md:w-60" />
          <Skeleton className="rounded-pill order-3 h-11 w-full lg:order-2 lg:w-auto lg:flex-1" />
          <div className="order-2 ml-auto flex items-center gap-3 lg:order-3 lg:ml-0">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="size-10 rounded-full" />
          </div>
        </div>
        <Skeleton className="mt-6 aspect-16/10 w-full rounded-lg md:aspect-9/4" />
      </div>

      <div className="grid items-start gap-6 md:gap-8 lg:grid-cols-[minmax(0,1fr)_370px]">
        <div className="order-2 lg:order-1">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-3 h-9 w-72 max-w-full rounded-lg" />
          <Skeleton className="mt-8 aspect-[1.8] w-full rounded-lg" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 2 }, (_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="aspect-[1.8] w-full rounded-lg" />
                <SkeletonText lines={2} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-member-tint order-1 rounded-lg p-5 lg:order-2">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-xl" />
            <Skeleton className="h-7 w-36 rounded-lg" />
          </div>
          <SkeletonText lines={2} className="mt-4" />
          <div className="bg-surface mt-6 rounded-2xl p-5">
            <Skeleton className="h-8 w-40 rounded-xl" />
            <div className="my-5 flex items-center gap-4">
              <Skeleton className="size-20 shrink-0 rounded-2xl" />
              <SkeletonText lines={3} className="flex-1" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>

      <div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-9 w-64 max-w-full rounded-lg" />
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="aspect-4/3 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
