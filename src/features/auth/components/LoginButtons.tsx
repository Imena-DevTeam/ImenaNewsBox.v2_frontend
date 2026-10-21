"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";

/** Google's mark. lucide-react no longer ships brand icons. */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.4 14.4 0 0 1 9.77 24c0-1.6.27-3.15.76-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.88.93 7.54 2.56 10.78l7.97-6.19Z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
    </svg>
  );
}

/**
 * The two ways in.
 *
 * Both are real submit buttons on the one form, so Enter in any field signs
 * in and the Google button is no longer an inert control that looks pressable
 * and does nothing. While the form is in flight both are disabled and the one
 * that was pressed says what it is doing — no new furniture on the page, the
 * same two buttons in a different state.
 */
export function LoginButtons() {
  const { pending } = useFormStatus();
  const [pressed, setPressed] = useState<"password" | "google" | null>(null);

  /* Gated on pending rather than reset afterwards: once the form is idle a
     stale value cannot show, so there is nothing to clear. */
  const working = (which: "password" | "google") =>
    pending && pressed === which;

  return (
    <>
      <button
        type="submit"
        disabled={pending}
        onClick={() => setPressed("password")}
        className="bg-heading text-surface hover:bg-heading/90 h-control-lg text-ui transition-fast mt-8 flex w-full items-center justify-center gap-2 rounded-md disabled:opacity-70"
      >
        {working("password") ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            Signing in…
          </>
        ) : (
          "Log In"
        )}
      </button>

      <div className="text-body text-muted mt-6 flex items-center gap-4">
        <span className="border-border h-px flex-1 border-t" aria-hidden />
        OR
        <span className="border-border h-px flex-1 border-t" aria-hidden />
      </div>

      <button
        type="submit"
        name="provider"
        value="google"
        disabled={pending}
        onClick={() => setPressed("google")}
        className="border-border bg-surface text-ui hover:border-heading active:bg-band h-control-lg transition-fast mt-6 flex w-full items-center justify-center gap-3 rounded-md border disabled:opacity-70"
      >
        {working("google") ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            Taking you to Google…
          </>
        ) : (
          <>
            <GoogleIcon className="size-5" />
            Continue with Google
          </>
        )}
      </button>
    </>
  );
}
