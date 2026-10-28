"use client";

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
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          aria-describedby={state.message ? "newsletter-status" : undefined}
          aria-invalid={state.status === "error" || undefined}
          className="h-10 w-48 rounded-lg border border-white/20 bg-white/10 px-3.5 text-sm text-white transition-colors outline-none placeholder:text-white/60 focus:border-white/40 sm:w-56"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-10 rounded-lg bg-white/20 px-5 text-sm font-medium text-white transition-colors hover:bg-white/30 disabled:opacity-60"
        >
          {pending ? "Sending…" : "Subscribe"}
        </button>
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
