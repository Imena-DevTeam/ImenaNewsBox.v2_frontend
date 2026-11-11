"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

/**
 * The sign-in pages carry no navigation of their own, so a failure here would
 * otherwise leave nowhere to go. This offers both: try again, or go home.
 */
export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-caption text-brand font-semibold tracking-[0.16em] uppercase">
        Something went wrong
      </p>
      <h1 className="text-h2-m md:text-h2 mt-4">We could not sign you in</h1>
      <p className="text-body text-muted mt-4 max-w-md">
        This is a problem on our side, not with your details. Try again, and if
        it keeps happening, tell whoever looks after the site.
      </p>
      {error.digest ? (
        <p className="text-caption text-muted mt-3">
          Reference: {error.digest}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>
          <RefreshCw aria-hidden className="size-4" />
          Try again
        </Button>
        <Link
          href={ROUTES.HOME}
          className="text-ui text-muted hover:text-text transition-fast"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
