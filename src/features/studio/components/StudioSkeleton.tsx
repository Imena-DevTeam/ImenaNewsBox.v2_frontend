import { Skeleton, SkeletonPage, SkeletonText } from "@/components/ui/Skeleton";

/** The tabs and the accent bar every studio page opens with. */
function StudioHead() {
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
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>
    </>
  );
}

/**
 * The studio's loading shapes. They came out of AdminSkeleton with the pages
 * they stand in for: a skeleton that does not match what lands is worse than
 * none, because the page jumps when it arrives.
 */
/**
 * The archive while it streams in: the header, the write button, the filter
 * row, then six entry cards with the date block the real card carries on its
 * left edge.
 */
export function PostsSkeleton() {
  return (
    <SkeletonPage label="Loading the archive" className="min-w-0 pb-12">
      <StudioHead />

      <div className="mt-8 flex flex-wrap gap-3">
        <Skeleton className="rounded-pill h-11 min-w-56 flex-1" />
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="rounded-pill h-11 w-36" />
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="border-member-border flex items-center gap-4 rounded-md border p-4"
          >
            <Skeleton className="size-4" />
            <div className="flex w-10 shrink-0 flex-col items-center gap-1.5">
              <Skeleton className="h-6 w-7" />
              <Skeleton className="h-2.5 w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-2.5 h-3 w-1/2" />
            </div>
            <Skeleton className="hidden size-20 shrink-0 sm:block" />
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}

/**
 * A writing surface while it streams in: the title rule, the body, and the
 * rail beside them. Shaped like the editor, so the page does not jump when
 * the fields arrive.
 */
export function EditorSkeleton({ label }: { label: string }) {
  return (
    <SkeletonPage label={label} className="min-w-0 pb-12">
      <StudioHead />

      <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          <Skeleton className="h-10 w-2/3" />
          <div className="border-member-border rounded-lg border p-5">
            <SkeletonText lines={8} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border-member-border flex flex-col gap-3 rounded-md border p-5">
            <Skeleton className="rounded-pill h-12 w-full" />
            <Skeleton className="rounded-pill h-12 w-full" />
          </div>
          <Skeleton className="rounded-field h-12 w-full" />
          <Skeleton className="rounded-field h-24 w-full" />
        </div>
      </div>
    </SkeletonPage>
  );
}

/** The albums while they stream in: the filter row, then six cards. */
export function AlbumsSkeleton() {
  return (
    <SkeletonPage label="Loading the albums" className="min-w-0 pb-12">
      <StudioHead />

      <div className="mt-8 flex flex-wrap gap-3">
        <Skeleton className="rounded-pill h-11 min-w-56 flex-1" />
        <Skeleton className="rounded-pill h-11 w-36" />
        <Skeleton className="rounded-pill h-11 w-40" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="border-member-border overflow-hidden rounded-md border"
          >
            <Skeleton className="h-40 w-full rounded-none" />
            <div className="p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-2.5 h-3 w-1/2" />
              <Skeleton className="rounded-pill mt-4 h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}

/** The album form while it streams in: the dropzone takes the width, the
    details sit in the rail. */
export function AlbumFormSkeleton() {
  return (
    <SkeletonPage label="Loading the album form" className="min-w-0 pb-12">
      <StudioHead />

      <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-48 w-full rounded-lg" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="border-member-border rounded-md border p-5">
            <Skeleton className="rounded-pill h-12 w-full" />
          </div>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="rounded-field h-12 w-full" />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}

/**
 * The studio overview while it streams in: the identity line, the two
 * buttons, the two bands, then the three counts.
 */
export function StudioOverviewSkeleton() {
  return (
    <SkeletonPage label="Loading the studio" className="min-w-0 pb-12">
      <StudioHead />

      <Skeleton className="mt-6 h-4 w-56" />

      <div className="mt-5 flex flex-wrap gap-3">
        <Skeleton className="rounded-pill h-12 w-40" />
        <Skeleton className="rounded-pill h-12 w-44" />
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

      <Skeleton className="mt-10 h-5 w-40" />
      <div className="border-member-border mt-4 rounded-lg border">
        {Array.from({ length: 3 }, (_, i) => (
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
