import {
  AuthButton,
  AuthButtonLink,
} from "@/features/auth/components/AuthButton";
import { ROUTES } from "@/constants/routes";

/** Why the invitation page cannot go on. */
export type Refusal =
  /** The backend refused the token: wrong, used, replaced or expired. */
  | { kind: "invalid" }
  /** The address arrived without `#token=…`, usually cut by a mail app. */
  | { kind: "incomplete" }
  /** The backend could not be asked, or answered with something else. */
  | { kind: "failed"; message: string; retry: () => void };

/**
 * A link that cannot be used, and what to do about it.
 *
 * The backend gives one answer for every bad link, so this page cannot say
 * which it was, and does not guess: a used link and an expired one read the
 * same. Somebody who already accepted theirs can simply log in.
 */
export function InviteRefused({ refusal }: { refusal: Refusal }) {
  if (refusal.kind === "failed") {
    return (
      <div className="flex flex-col gap-7">
        <p role="alert" className="text-text text-body">
          {refusal.message}
        </p>
        <AuthButton onClick={refusal.retry}>Try again</AuthButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      {refusal.kind === "invalid" ? (
        <div>
          <p className="text-text text-h4 font-medium">
            This link no longer works.
          </p>
          <p className="text-muted text-body mt-3">
            An invitation link works once, for seven days, and only the newest
            one sent to you. If you have already used it, you can log in. If
            not, ask an administrator to send you a new one.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-text text-h4 font-medium">
            This link is incomplete.
          </p>
          <p className="text-muted text-body mt-3">
            Part of it was lost on the way here. Open it again from the email,
            or copy the whole address into your browser.
          </p>
        </div>
      )}

      <AuthButtonLink
        href={ROUTES.LOGIN}
        variant={refusal.kind === "invalid" ? "primary" : "outline"}
      >
        Go to login
      </AuthButtonLink>
    </div>
  );
}
