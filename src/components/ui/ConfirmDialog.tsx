"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { useModalDialog } from "./useModalDialog";

/**
 * The question asked before something cannot be taken back.
 *
 * Wraps the native <dialog> and showModal(), which gives Escape, focus
 * trapping, inertness behind the dialog and focus restoration on close —
 * all from the browser, none of it hand-rolled. Six dialogs in this codebase
 * already work this way; anything new should too.
 *
 * The open and the close both animate, which is useModalDialog's whole job:
 * close() leaves no frame to animate in, so the dialog is held open for the
 * length of the closing animation.
 *
 * The confirming button says what it does ("Delete the album"), never "OK":
 * a button read on its own should still be unambiguous.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useModalDialog(open);

  return (
    <dialog
      ref={ref}
      /* Escape closes the dialog itself; this keeps React's state in step. */
      onClose={onCancel}
      onCancel={onCancel}
      aria-labelledby="confirm-title"
      className="bg-surface open:animate-dialog-pop m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg p-0 shadow-xl backdrop:bg-black/50 motion-reduce:animate-none"
    >
      <div className="p-6">
        <h2
          id="confirm-title"
          className="text-h4 text-member-ink font-semibold"
        >
          {title}
        </h2>
        <div className="text-body-sm text-muted mt-2">{description}</div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="outline" size="sm" type="button" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "primary" : "brand"}
            size="sm"
            type="button"
            onClick={onConfirm}
            className={destructive ? "bg-danger hover:bg-danger/90" : undefined}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
