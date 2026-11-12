"use client";

import { useEffect, useRef } from "react";

/**
 * A native <dialog> that animates both ways.
 *
 * Every dialog in this codebase opened with `dialog-pop` and closed with
 * nothing, because `close()` takes the element out of the top layer on the
 * same frame: there is no moment left in which to animate it. The usual
 * answer — `transition-behavior: allow-discrete` on `display` — is the one
 * globals.css already rejected, because a transition into the top layer can
 * fail to start and leave a dialog off-screen entirely.
 *
 * So the close is held. When `open` goes false the element keeps the top
 * layer, takes a `data-closing` attribute that globals.css animates, and is
 * closed when that animation's length has passed.
 *
 * Two deliberate choices in how little state this holds:
 *
 * - `data-closing` is written to the DOM rather than kept in React state.
 *   The dialog is leaving; nothing else on the page depends on the fact, and
 *   setting state from an effect is an error in this project for good
 *   reasons.
 * - The close is on a timer, not on `animationend`. A dialog whose animation
 *   never runs — reduced motion, a dropped frame, jsdom under the tests —
 *   would otherwise stay open for ever.
 *
 * Everything the browser gives a modal dialog is untouched: Escape, focus
 * trapping, inertness behind it, and focus returning to whatever opened it.
 */

/** Matches the dialog-drop animation in globals.css. */
const CLOSING_MS = 160;

export function useModalDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open) {
      dialog.removeAttribute("data-closing");
      if (!dialog.open) dialog.showModal();
      return;
    }

    if (!dialog.open) return;

    dialog.setAttribute("data-closing", "");
    const done = window.setTimeout(() => {
      dialog.removeAttribute("data-closing");
      /* Guarded: Escape may have closed it in the meantime, and close() on a
         closed dialog fires a second close event. */
      if (dialog.open) dialog.close();
    }, CLOSING_MS);

    return () => {
      window.clearTimeout(done);
      dialog.removeAttribute("data-closing");
    };
  }, [open]);

  return ref;
}
