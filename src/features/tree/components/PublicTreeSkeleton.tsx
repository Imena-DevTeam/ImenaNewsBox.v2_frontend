import { Container } from "@/components/layout/Container";
import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

/** The public tree: the headline and button, then the tree illustration. */
export function PublicTreeSkeleton() {
  return (
    <SkeletonPage label="Loading the family tree">
      <Container className="pt-8 pb-14 md:pt-12 md:pb-20">
        <div className="flex flex-col items-center">
          <Skeleton className="h-10 w-72 max-w-full rounded-lg md:h-14 md:w-md" />
          <Skeleton className="mt-3 h-10 w-56 rounded-lg md:h-14 md:w-80" />
          <Skeleton className="mt-6 h-4 w-80 max-w-full" />
          <Skeleton className="rounded-pill mt-8 h-12 w-44" />
        </div>
        <Skeleton className="mx-auto mt-12 aspect-[1000/680] w-full max-w-5xl rounded-lg md:mt-16" />
      </Container>
    </SkeletonPage>
  );
}
