import { PageHeaderSkeleton } from "@/components/layout/PageHeaderSkeleton";
import { Skeleton, SkeletonPage, SkeletonText } from "@/components/ui/Skeleton";

/** The profile: header, the large portrait beside name and actions, then
    the detail cards two by two. */
export function ProfileSkeleton() {
  return (
    <SkeletonPage
      label="Loading your profile"
      className="mx-auto flex w-full max-w-5xl flex-col gap-10 pb-28"
    >
      <PageHeaderSkeleton badge />

      <div className="mt-2 flex flex-col items-center gap-8 p-6 sm:flex-row sm:gap-12 sm:p-10">
        <Skeleton className="size-48 shrink-0 rounded-full sm:size-56 md:size-64" />
        <div className="flex w-full flex-1 flex-col items-center sm:items-start">
          <Skeleton className="rounded-pill h-6 w-28" />
          <Skeleton className="mt-3 h-12 w-64 max-w-full rounded-lg md:h-16" />
          <SkeletonText lines={2} className="mt-5 w-full max-w-sm" />
          <div className="mt-6 flex flex-wrap gap-4">
            <Skeleton className="rounded-pill h-11 w-36" />
            <Skeleton className="rounded-pill h-11 w-36" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="border-member-border rounded-2xl border p-5"
          >
            <Skeleton className="h-5 w-32" />
            <SkeletonText lines={3} className="mt-4" />
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}
