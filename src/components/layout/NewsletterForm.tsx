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
          className="border-surface/25 bg-surface/10 text-surface placeholder:text-surface/70 focus:border-surface h-control-md text-body-sm w-56 rounded-sm border px-4 outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-surface/20 hover:bg-surface/30 h-control-md text-body-sm transition-fast rounded-sm px-6 disabled:opacity-60"
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
