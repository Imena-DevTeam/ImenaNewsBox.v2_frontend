"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Whatever fails inside the member frames lands here rather than on a blank
 * page. It keeps the rail and the footer, so nobody is stranded.
 */
export default function MemberError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-24 text-center">
      <p className="text-caption text-member-accent font-semibold tracking-[0.16em] uppercase">
        Something went wrong
      </p>
      <h1 className="text-h2-m md:text-h2 text-member-ink mt-4">
        We could not load this page
      </h1>
      <p className="text-body text-muted mx-auto mt-4 max-w-md">
        The family record is still there. Try again, and if it keeps happening,
        tell whoever looks after the site.
      </p>
      {error.digest ? (
        <p className="text-caption text-muted mt-3">
          Reference: {error.digest}
        </p>
      ) : null}

      <Button variant="brand" onClick={reset} className="mt-8">
        <RefreshCw aria-hidden className="size-4" />
        Try again
      </Button>
    </div>
  );
}
