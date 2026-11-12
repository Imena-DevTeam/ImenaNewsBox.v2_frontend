"use client";

import { RefreshCw } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

/**
 * Whatever fails on a public page lands here rather than on a blank one. The
 * layout keeps the navigation bar and the footer around it, so there is always
 * a way on.
 */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-24 text-center md:py-32">
      <p className="text-caption text-heading font-semibold tracking-[0.16em] uppercase">
        Something went wrong
      </p>
      <h1 className="text-h2-m md:text-h2 mt-4">We could not load this page</h1>
      <p className="text-body text-muted mx-auto mt-4 max-w-md">
        Nothing is lost. Try again, and if it keeps happening, tell whoever
        looks after the site.
      </p>
      {error.digest ? (
        <p className="text-caption text-muted mt-3">
          Reference: {error.digest}
        </p>
      ) : null}

      <Button onClick={reset} className="mt-8">
        <RefreshCw aria-hidden className="size-4" />
        Try again
      </Button>
    </Container>
  );
}
