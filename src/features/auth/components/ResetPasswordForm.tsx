"use client";

import { authService } from "@/services/auth.service";
import { SetPasswordForm } from "./SetPasswordForm";

/**
 * An administrator setting a new password, behind a link another
 * administrator sent them.
 *
 * The same form as the invitation's, because it is the same act. What is
 * different is only how they got here, and that is one sentence.
 *
 * The token is spent by the backend. Nothing on this side knows whether it
 * is still good until it is used, which is correct: a page that could tell
 * you a token was valid before you used it would be a page that answers
 * questions about other people's resets.
 */
export function ResetPasswordForm({ token }: { token: string }) {
  return (
    <SetPasswordForm
      submitLabel="Set new password"
      doneTitle="Your new password is set."
      doneBody="The link you used has been spent. Sign in with your name and the password you just chose."
      send={(password) => authService.resetPassword(token, password)}
      intro={
        <p className="text-muted text-body">
          Choose a new password. The old one stops working as soon as this one
          is set, on every device.
        </p>
      }
    />
  );
}
