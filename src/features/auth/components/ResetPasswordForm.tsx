"use client";

import { SetPasswordForm } from "./SetPasswordForm";

/**
 * An administrator setting a new password, behind a link another
 * administrator sent them.
 *
 * The same form as the invitation's, because it is the same act. What is
 * different is only how they got here, and that is one sentence.
 *
 * TODO: the backend's reset link is an invitation link (`/invitation`), so
 * step 3 of CLAUDE.md §23 retires this page. Until then nothing is stored.
 */
export function ResetPasswordForm() {
  return (
    <SetPasswordForm
      submitLabel="Set new password"
      doneTitle="Your new password is set."
      doneBody="The link you used has been spent. Sign in with your name and the password you just chose."
      intro={
        <p className="text-muted text-body">
          Choose a new password. The old one stops working as soon as this one
          is set, on every device.
        </p>
      }
    />
  );
}
