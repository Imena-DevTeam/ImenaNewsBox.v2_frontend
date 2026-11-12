"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { AdminTabs } from "@/features/admin/components/AdminTabs";

/** What failed, read from the path, so the page says which tool rather than
    "this tool". */
function sectionOf(pathname: string): string {
  if (pathname.startsWith(ROUTES.ADMIN_MEMBERS)) return "the family register";
  return "this page";
}

/**
 * A failure inside the admin area keeps the member frame around it, so the
 * rail and the footer are still there and nobody is stranded on a tool page.
 * It keeps the tab row too, which is the difference between a dead end and a
 * page you can leave.
 *
 * "Nothing has been changed" is the first thing it says, because the person
 * reading it was in the middle of editing somebody's record.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="section-enter min-w-0 pb-12">
      <AdminTabs />

      <div className="py-24 text-center">
        <p className="text-caption text-brand font-semibold tracking-[0.16em] uppercase">
          Something went wrong
        </p>
        <h1 className="text-h2-m md:text-h2 text-member-ink mt-4">
          We could not load {sectionOf(pathname)}
        </h1>
        <p className="text-body text-muted mx-auto mt-4 max-w-md">
          Nothing has been changed, and nothing you had typed was saved. Try
          again, and if it keeps happening, tell whoever looks after the site.
        </p>
        {error.digest ? (
          <p className="text-caption text-muted mt-3">
            Reference: {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button variant="brand" onClick={reset}>
            <RefreshCw aria-hidden className="size-4" />
            Try again
          </Button>
          <Link
            href={ROUTES.ADMIN}
            className="text-body text-brand hover:text-brand-hover focus-visible:outline-brand font-medium underline-offset-4 hover:underline"
          >
            Back to what needs doing
          </Link>
        </div>
      </div>
    </div>
  );
}
