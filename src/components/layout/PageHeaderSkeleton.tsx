import { Skeleton } from "@/components/ui/Skeleton";

/** The shape of PageHeader: an optional badge, the title, bell and avatar. */
export function PageHeaderSkeleton({ badge = false }: { badge?: boolean }) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-3 sm:gap-4">
        {badge ? (
          <Skeleton className="size-14 shrink-0 rounded-full sm:size-16" />
        ) : null}
        <Skeleton className="h-9 w-40 rounded-lg md:h-11 md:w-56" />
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-8">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="size-10 rounded-full" />
      </div>
    </div>
  );
}
