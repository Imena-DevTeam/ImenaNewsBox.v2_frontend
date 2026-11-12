import { Skeleton, SkeletonPage, SkeletonText } from "@/components/ui/Skeleton";

/** A blog card's shape: the photograph, then category, title and lead. */
function BlogCardSkeleton() {
  return (
    <div className="border-member-border bg-surface overflow-hidden rounded-lg border">
      <Skeleton className="aspect-[1.8] w-full rounded-none" />
      <div className="p-4 sm:p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-6 w-4/5 rounded-lg" />
        <SkeletonText lines={3} className="mt-4" />
      </div>
    </div>
  );
}

/** The blogs page: the cover story, the heading, filters, then the cards. */
export function BlogsSkeleton() {
  return (
    <SkeletonPage
      label="Loading the family blog"
      className="min-w-0 space-y-12 md:space-y-16"
    >
      <Skeleton className="mx-auto aspect-[1.45] w-full max-w-[50rem] rounded-lg sm:aspect-[1.8]" />

      <div>
        <div className="flex flex-col items-center">
          <Skeleton className="h-9 w-56 rounded-lg" />
          <Skeleton className="rounded-pill mt-3 h-1 w-11" />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2 px-4 lg:px-10">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="rounded-pill h-10 w-24" />
          ))}
        </div>
        <div className="mt-8 grid gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
          {Array.from({ length: 6 }, (_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
