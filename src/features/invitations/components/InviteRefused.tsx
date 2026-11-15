import { AuthButtonLink } from "@/features/auth/components/AuthButton";
import { ROUTES } from "@/constants/routes";
import type { TokenRefusal } from "@/types/invitation";

/**
 * A link that is no good, and what to do about it.
 *
 * Three refusals rather than one message, because the next step differs: an
 * expired link needs a new one, a spent one means you already have an
 * account, and an unrecognised one is usually a link that was cut in half by
 * an email client.
 *
 * None of them says whether the token ever existed, which is why "unknown"
 * reads as a broken link rather than "no such invitation".
 */
const SAID: Record<TokenRefusal, { title: string; body: string }> = {
  expired: {
    title: "This invitation has expired.",
    body: "Invitations last ten days. Ask whoever invited you to send another one, and it will come to the same address.",
  },
  used: {
    title: "This invitation has already been used.",
    body: "Your account exists, so you can sign in. If it was not you who used it, tell an administrator.",
  },
  unknown: {
    title: "This link does not work.",
    body: "It may have been cut in half on its way to you. Try opening it again from the email, and ask an administrator for a new one if it still fails.",
  },
};

export function InviteRefused({
  reason,
  signIn = false,
}: {
  reason: TokenRefusal;
  /** A spent invitation means there is an account to sign in to. */
  signIn?: boolean;
}) {
  const said = SAID[reason];

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="text-text text-h4 font-medium">{said.title}</p>
        <p className="text-muted text-body mt-3">{said.body}</p>
      </div>

      {signIn || reason === "used" ? (
        <AuthButtonLink href={ROUTES.LOGIN}>Go to login</AuthButtonLink>
      ) : (
        <AuthButtonLink variant="outline" href={ROUTES.HOME}>
          Back to home
        </AuthButtonLink>
      )}
    </div>
  );
}
