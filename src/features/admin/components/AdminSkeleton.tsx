import { Skeleton, SkeletonPage, SkeletonText } from "@/components/ui/Skeleton";

/** The two tabs and the accent bar both pages open with. */
function AdminHead() {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-40" />
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
        </div>
      </div>

      <Skeleton className="mt-3 h-1 w-14" />
      <Skeleton className="mt-2 h-3.5 w-48" />

      <div className="border-member-border mt-6 flex gap-8 border-b pb-3">
        {Array.from({ length: 2 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>
    </>
  );
}

/**
 * The shape of the admin overview while it streams in: the header, the two
 * tabs, the identity line, one button beside the palette, then the two
 * bands and the three branch counts.
 *
 * It previewed a four-tab row and three action buttons until 11 Nov 2026,
 * which is a layout the page had not had for two refinements. A skeleton
 * that does not match what arrives is worse than none, because the page
 * jumps when it lands.
 */
export function AdminSkeleton() {
  return (
    <SkeletonPage label="Loading the admin overview" className="min-w-0 pb-12">
      <AdminHead />

      <Skeleton className="mt-6 h-4 w-64" />

      <div className="mt-5 flex flex-wrap gap-3">
        <Skeleton className="rounded-pill h-12 w-44" />
        <Skeleton className="h-10 w-56 rounded-lg" />
      </div>

      <Skeleton className="mt-10 h-5 w-36" />
      <div className="border-member-border mt-4 rounded-lg border">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="border-member-border border-b p-5 last:border-0"
          >
            <SkeletonText lines={2} />
          </div>
        ))}
      </div>

      <Skeleton className="mt-10 h-5 w-36" />
      <div className="border-member-border mt-4 rounded-lg border">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="border-member-border border-b p-4 last:border-0"
          >
            <Skeleton className="h-3.5 w-3/4" />
          </div>
        ))}
      </div>

      <div className="border-member-border mt-10 flex flex-col rounded-md border sm:flex-row">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="flex flex-1 flex-col items-center gap-2 px-5 py-7"
          >
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}

/**
 * The register while it streams in: the count and the add button, the filter
 * row, then eight rows of the table. Eight rather than twenty-five, because
 * a screen holds about eight and a skeleton below the fold is grey for
 * nobody.
 */
export function MembersSkeleton() {
  return (
    <SkeletonPage label="Loading the family register" className="min-w-0 pb-12">
      <AdminHead />

      <div className="mt-8 flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="rounded-pill h-10 w-36" />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Skeleton className="rounded-pill h-11 min-w-56 flex-1" />
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="rounded-pill h-11 w-36" />
        ))}
      </div>

      <div className="border-member-border mt-5 overflow-hidden rounded-md border">
        <div className="border-member-border bg-member-panel flex gap-6 border-b px-4 py-3.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="hidden h-3 w-40 md:block" />
          <Skeleton className="hidden h-3 w-20 lg:block" />
        </div>
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="border-member-border flex items-center gap-6 border-b px-4 py-4 last:border-0"
          >
            <Skeleton className="h-3.5 w-44" />
            <Skeleton className="hidden h-3.5 w-56 md:block" />
            <Skeleton className="ml-auto h-3.5 w-12" />
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}
