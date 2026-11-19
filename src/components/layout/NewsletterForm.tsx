"use client";

import { Button } from "@/components/ui/Button";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { NEWSLETTER_INITIAL } from "@/lib/newsletter";

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    NEWSLETTER_INITIAL,
  );

  return (
    <form action={formAction} className="mt-5">
      <div className="flex flex-wrap gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          autoComplete="email"
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          aria-describedby={state.message ? "newsletter-status" : undefined}
          aria-invalid={state.status === "error" || undefined}
          className="border-surface/20 bg-surface/10 text-surface placeholder:text-surface/60 focus:border-surface/40 text-body-sm h-10 w-48 rounded-lg border px-3.5 transition-colors sm:w-56"
        />
        <Button type="submit" variant="light" size="sm" disabled={pending}>
          {pending ? "Sending…" : "Subscribe"}
        </Button>
      </div>

      {/* aria-live, so the answer is announced rather than only seen. */}
      <p
        id="newsletter-status"
        role="status"
        aria-live="polite"
        className="text-body-sm text-surface mt-3 max-w-80 empty:mt-0"
      >
        {state.message}
      </p>
    </form>
  );
}
