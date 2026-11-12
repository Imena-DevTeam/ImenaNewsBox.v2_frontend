"use client";

import Image from "next/image";
import { AuthButton } from "./AuthButton";

/**
 * Outlined "Continue with Google" OAuth button.
 *
 * Disabled until Google sign-in exists. Neither login screen ever passed an
 * `onClick`, so this was a full-width control in the most prominent place on
 * both pages that silently did nothing when pressed. A control that cannot
 * do its job says so rather than ignoring the press.
 *
 * TODO: `next-auth` is installed and unused. When the Google provider is
 * wired up, pass `onClick` and drop the note.
 */
export function GoogleButton({ onClick }: { onClick?: () => void }) {
  const ready = Boolean(onClick);

  return (
    <div>
      <AuthButton
        variant="outline"
        onClick={onClick}
        disabled={!ready}
        aria-describedby={ready ? undefined : "google-unavailable"}
        className="gap-3"
      >
        <Image src="/icons/google.svg" alt="" width={20} height={20} />
        Continue with Google
      </AuthButton>

      {ready ? null : (
        <p
          id="google-unavailable"
          className="text-muted mt-2 text-center text-sm"
        >
          Google sign-in is not connected yet. Use your family name above.
        </p>
      )}
    </div>
  );
}
