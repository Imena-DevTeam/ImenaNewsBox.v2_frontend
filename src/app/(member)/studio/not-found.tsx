import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { StudioTabs } from "@/features/studio/components/StudioTabs";

/**
 * A post or album that is not there. This is what a bookmarked edit link to
 * a deleted post renders, which is how most people will meet it.
 */
export default function StudioNotFound() {
  return (
    <div className="section-enter min-w-0 pb-12">
      <StudioTabs />

      <div className="py-24 text-center">
        <p className="text-caption text-brand font-semibold tracking-[0.16em] uppercase">
          Not found
        </p>
        <h1 className="text-h2-m md:text-h2 text-member-ink mt-4">
          There is nothing here to work on
        </h1>
        <p className="text-body text-muted mx-auto mt-4 max-w-md">
          Whatever this link pointed at has been renamed or removed. Nothing has
          been changed.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link
            href={ROUTES.STUDIO_POSTS}
            className="text-body text-brand hover:text-brand-hover focus-visible:outline-brand font-medium underline-offset-4 hover:underline"
          >
            The archive
          </Link>
          <Link
            href={ROUTES.STUDIO_ALBUMS}
            className="text-body text-brand hover:text-brand-hover focus-visible:outline-brand font-medium underline-offset-4 hover:underline"
          >
            The albums
          </Link>
        </div>
      </div>
    </div>
  );
}
