import { PageHeaderSkeleton } from "@/components/layout/PageHeaderSkeleton";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

/** Shaped like a person's page: the name card, then three facts. */
export default function PersonLoading() {
  return (
    <SkeletonPage
      label="Loading this family member"
      className="mx-auto flex w-full max-w-4xl flex-col gap-8 pb-24"
    >
      <PageHeaderSkeleton />
      <Skeleton className="h-48 rounded-lg" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-18 rounded-md" />
        ))}
      </div>
    </SkeletonPage>
  );
}
