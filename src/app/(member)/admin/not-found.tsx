import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { AdminTabs } from "@/features/admin/components/AdminTabs";

/**
 * A tool, post or album that is not there.
 *
 * The member area's own not-found speaks to somebody browsing; this one
 * speaks to somebody working, so it keeps the tab row and names the two
 * places the work actually lives. It is what `/admin/posts/<slug>/edit`
 * renders for a post that has been deleted, which is the way most people
 * will meet it: from a stale link or a bookmark.
 */
export default function AdminNotFound() {
  return (
    <div className="section-enter min-w-0 pb-12">
      <AdminTabs />

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
            href={ROUTES.ADMIN}
            className="text-body text-brand hover:text-brand-hover focus-visible:outline-brand font-medium underline-offset-4 hover:underline"
          >
            What needs doing
          </Link>
          <Link
            href={ROUTES.ADMIN_MEMBERS}
            className="text-body text-brand hover:text-brand-hover focus-visible:outline-brand font-medium underline-offset-4 hover:underline"
          >
            The family register
          </Link>
        </div>
      </div>
    </div>
  );
}
