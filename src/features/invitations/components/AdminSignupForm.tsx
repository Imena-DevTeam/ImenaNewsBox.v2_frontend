"use client";

import { SetPasswordForm } from "@/features/auth/components/SetPasswordForm";

/**
 * An invited administrator choosing their password, for the first time.
 *
 * The form itself is `SetPasswordForm`, shared with the reset — the two are
 * the same act and the lockout warning should not have two copies. What
 * belongs here is who the invitation was for and what it makes them.
 *
 * This screen is the reason `ADMIN_PASSWORD` has to go: one shared secret in
 * the environment cannot be set per person, so it cannot be set here. See
 * CLAUDE.md §21.
 *
 * TODO: step 3 of CLAUDE.md §23 replaces this page with `/invitation`, whose
 * server action accepts the invitation. Until then nothing is stored.
 */
export function AdminSignupForm({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  return (
    <SetPasswordForm
      submitLabel="Set password"
      doneTitle="Your password is set."
      doneBody="Sign in with your name and the password you just chose."
      intro={
        <div>
          <p className="text-muted text-body">
            You were invited as an administrator at{" "}
            <span className="text-text font-medium">{email}</span>.
          </p>
          <p className="text-muted text-body mt-1">
            You will sign in as{" "}
            <span className="text-text font-medium">{fullName}</span>, with the
            password you choose here.
          </p>
        </div>
      }
    />
  );
}
