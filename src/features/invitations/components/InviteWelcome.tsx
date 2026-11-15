import { AuthButtonLink } from "@/features/auth/components/AuthButton";
import { ROUTES } from "@/constants/routes";
import type { Invitation } from "@/types/invitation";

/**
 * The end of a member's invitation: the name they sign in with.
 *
 * **This is not a form, and that is the point.** `/login` asks for a name
 * and no password, so there is no credential for an invited member to
 * invent — the only thing they are missing is knowing what to type. So the
 * page tells them, and then gets out of the way.
 *
 * The name is the loudest thing on the page because it is the one thing
 * they have to carry to the next screen. Everything else is one line.
 */
export function InviteWelcome({ invitation }: { invitation: Invitation }) {
  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="text-muted text-body">
          Your invitation was sent to{" "}
          <span className="text-text font-medium">{invitation.email}</span>.
        </p>

        <p className="text-muted text-body mt-7">You sign in as</p>
        <p className="font-auth-heading text-text text-h1 mt-1">
          {invitation.fullName}
        </p>
        {/* The login matches the whole name or either part of it, so saying
            so here saves the one failure this page can cause: somebody
            typing the half they are actually called and not trusting it. */}
        <p className="text-muted text-body mt-2">
          Either part of your name works, and there is no password to remember.
        </p>
      </div>

      <AuthButtonLink href={ROUTES.LOGIN}>Go to login</AuthButtonLink>
    </div>
  );
}
