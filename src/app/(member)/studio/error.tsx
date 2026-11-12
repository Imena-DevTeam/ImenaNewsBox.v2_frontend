"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { StudioTabs } from "@/features/studio/components/StudioTabs";

/**
 * A failure in the studio keeps the member frame, and the tab row with it,
 * which is the difference between a dead end and a page you can leave.
 *
 * "Nothing you had written was saved" is the first thing it says, because
 * the person reading it may have been a thousand words into a story.
 */
export default function StudioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="section-enter min-w-0 pb-12">
      <StudioTabs />

      <div className="py-24 text-center">
        <p className="text-caption text-brand font-semibold tracking-[0.16em] uppercase">
          Something went wrong
        </p>
        <h1 className="text-h2-m md:text-h2 text-member-ink mt-4">
          We could not load the studio
        </h1>
        <p className="text-body text-muted mx-auto mt-4 max-w-md">
          Nothing has been published, and nothing you had written was saved. Try
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
            href={ROUTES.STUDIO}
            className="text-body text-brand hover:text-brand-hover focus-visible:outline-brand font-medium underline-offset-4 hover:underline"
          >
            Back to what needs doing
          </Link>
        </div>
      </div>
    </div>
  );
}
