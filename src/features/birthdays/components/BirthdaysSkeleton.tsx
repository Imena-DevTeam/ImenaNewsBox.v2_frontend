import { PageHeaderSkeleton } from "@/components/layout/PageHeaderSkeleton";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";

/* The same scatter the real constellation uses, so the cards land where
   their placeholders were. */
const CONSTELLATION = [
  "justify-self-start sm:ml-4 md:ml-10",
  "justify-self-end sm:mr-4 md:mr-16",
  "justify-self-center sm:col-span-2",
  "justify-self-start sm:ml-2 md:ml-6",
  "justify-self-end sm:mr-8 md:mr-24",
];

/** The birthdays page: header, kicker, the month pills, today's spotlight
    card, then the scattered celebrant cards. */
export function BirthdaysSkeleton() {
  return (
    <SkeletonPage
      label="Loading family birthdays"
      className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-24"
    >
      <PageHeaderSkeleton badge />

      <div className="flex flex-col items-center">
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="mt-10 h-3 w-36" />
      </div>

      <Skeleton className="mt-2 h-5 w-44 self-end" />
      <div className="flex gap-2.5 overflow-hidden pt-1 pb-3">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton
            key={index}
            className={cn(
              "rounded-pill h-10 shrink-0",
              index === 2 ? "w-28" : "w-20",
            )}
          />
        ))}
      </div>

      <div className="border-member-border mx-auto my-8 w-full max-w-xl rounded-2xl border p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2 pb-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="rounded-pill h-5 w-16" />
        </div>
        <div className="my-5 flex items-center gap-4">
          <Skeleton className="size-16 shrink-0 rounded-2xl sm:size-18" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-32 rounded-lg" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {CONSTELLATION.map((place) => (
          <div
            key={place}
            className={cn(
              "border-member-border flex w-full max-w-xs items-center gap-3 rounded-2xl border p-3",
              place,
            )}
          >
            <Skeleton className="h-12 w-11 shrink-0 rounded-xl" />
            <Skeleton className="size-11 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="size-8 shrink-0 rounded-xl" />
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}
