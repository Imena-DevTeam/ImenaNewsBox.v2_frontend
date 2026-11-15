"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useOnline } from "@/hooks/useOnline";
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
  const online = useOnline();

  /* A page that failed because the connection dropped tries again by itself
     the moment the connection is back. */
  useEffect(() => {
    const retry = () => reset();
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, [reset]);

  if (!online) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-h2-m md:text-h2 text-member-ink">
          You&rsquo;re offline
        </h1>
        <p className="text-body text-muted mx-auto mt-4 max-w-md">
          This page will load by itself as soon as the connection is back.
        </p>
      </div>
    );
  }

  return (
    <div className="py-24 text-center">
      <p className="text-caption text-member-accent font-semibold tracking-widest uppercase">
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
