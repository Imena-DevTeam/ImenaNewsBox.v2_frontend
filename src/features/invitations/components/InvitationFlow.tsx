"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { acceptInvitation, checkInvitation } from "@/app/actions/invitation";
import { ROUTES } from "@/constants/routes";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthTitle } from "@/features/auth/components/AuthShell";
import { SetPasswordForm } from "@/features/auth/components/SetPasswordForm";
import { NAME_PARAM } from "@/lib/session";
import type { InvitationDetails } from "@/types/invitation";
import { InviteRefused, type Refusal } from "./InviteRefused";

/**
 * The backend's invitation link, `/invitation#token=…`.
 *
 * The token is after the `#`, which a browser never sends to a server, so
 * it stays out of every log on the way here; this component reads it from
 * `location.hash` and hands it to a server action. Opening the page only
 * asks who the link is for. Nothing is accepted until the person presses
 * the button, so a mail scanner that opens the link changes nothing.
 *
 * A member is shown the family name they log in with, and accepting
 * confirms their address. An administrator chooses a password: their
 * first, or a new one when another administrator answered their reset
 * request (the backend sends the same link). Either way, accepting does not
 * sign anybody in; the login that follows starts with the name filled in.
 */
export function InvitationFlow() {
  /* undefined until the browser has been read: the server cannot see the
     fragment, so it renders the waiting state. */
  const token = useSyncExternalStore(
    subscribeToHash,
    () => tokenFromHash(window.location.hash),
    () => undefined,
  );
  const [spent, setSpent] = useState(false);

  const check = useQuery({
    queryKey: ["invitation", token],
    queryFn: () => checkInvitation(token!),
    enabled: typeof token === "string",
    retry: false,
    staleTime: Infinity,
  });

  if (token === null) return <Refused refusal={{ kind: "incomplete" }} />;
  if (spent) return <Refused refusal={{ kind: "invalid" }} />;

  if (token === undefined || check.isPending) {
    return (
      <>
        <AuthTitle lines={["Your", "invitation"]} />
        <p role="status" className="text-muted text-body">
          Checking your link…
        </p>
      </>
    );
  }

  const outcome = check.data;
  if (!outcome || !outcome.ok) {
    const refusal: Refusal = outcome?.invalid
      ? { kind: "invalid" }
      : {
          kind: "failed",
          message:
            outcome?.message ??
            "We could not check this link. Try again in a moment.",
          retry: () => void check.refetch(),
        };
    return <Refused refusal={refusal} />;
  }

  const onInvalid = () => setSpent(true);
  return outcome.invitation.needsPassword ? (
    <AdminInvitation
      token={token}
      invitation={outcome.invitation}
      onInvalid={onInvalid}
    />
  ) : (
    <MemberInvitation
      token={token}
      invitation={outcome.invitation}
      onInvalid={onInvalid}
    />
  );
}

/** The token after `#token=`, or null when the address has none. */
export function tokenFromHash(hash: string): string | null {
  const token = new URLSearchParams(hash.replace(/^#/, "")).get("token");
  return token?.trim() ? token.trim() : null;
}

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

/** A login door with the family name already in its field. */
function loginWith(door: string, familyName: string): string {
  return `${door}?${new URLSearchParams({ [NAME_PARAM]: familyName })}`;
}

function Refused({ refusal }: { refusal: Refusal }) {
  return (
    <>
      <AuthTitle lines={["About this", "invitation"]} />
      <InviteRefused refusal={refusal} />
    </>
  );
}

interface InvitationProps {
  token: string;
  invitation: InvitationDetails;
  /** The backend refused the link when it was used. */
  onInvalid: () => void;
}

/**
 * A member's invitation: the name they log in with, and one button.
 *
 * The name is the loudest thing on the page because it is the one thing
 * they have to carry to the next screen.
 */
function MemberInvitation({ token, invitation, onInvalid }: InvitationProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  const accept = async () => {
    setBusy(true);
    setFailed(null);
    const outcome = await acceptInvitation(token).catch(() => null);
    if (outcome?.ok) {
      router.push(loginWith(ROUTES.LOGIN, invitation.familyName));
      return;
    }
    setBusy(false);
    if (outcome?.invalid) onInvalid();
    else
      setFailed(
        outcome?.message ??
          "We could not reach the server. Try again in a moment.",
      );
  };

  return (
    <>
      <AuthTitle lines={["Welcome to the", "family register"]} />
      <div className="flex flex-col gap-7">
        <div>
          <p className="text-muted text-body">
            Welcome, {invitation.displayName}.
          </p>

          <p className="text-muted text-body mt-7">You log in as</p>
          <p className="font-auth-heading text-text text-h1 mt-1">
            {invitation.familyName}
          </p>
          <p className="text-muted text-body mt-2">
            There is no password to remember: you type your family name, and we
            email you a code.
          </p>
        </div>

        <AuthButton onClick={accept} disabled={busy}>
          Go to login
        </AuthButton>

        {failed ? (
          <p role="alert" className="text-danger text-body text-center">
            {failed}
          </p>
        ) : null}
      </div>
    </>
  );
}

/** An administrator's invitation, or their answered reset request. */
function AdminInvitation({ token, invitation, onInvalid }: InvitationProps) {
  const send = async (password: string) => {
    const outcome = await acceptInvitation(token, password);
    if (!outcome.ok && outcome.invalid) onInvalid();
    return outcome;
  };

  return (
    <>
      <AuthTitle lines={["Dear Admin,", "set your password"]} />
      <SetPasswordForm
        send={send}
        submitLabel="Set password"
        doneTitle="Your password is set."
        doneBody="Log in with your family name and this password, then the code we email you."
        doneHref={loginWith(ROUTES.ADMIN_LOGIN, invitation.familyName)}
        doneLabel="Go to admin login"
        intro={
          <div>
            <p className="text-muted text-body">
              Welcome, {invitation.displayName}. You log in as{" "}
              <span className="text-text font-medium">
                {invitation.familyName}
              </span>
              , with the password you choose here.
            </p>
            <p className="text-muted text-body mt-1">
              If you had a password before, it stops working once this one is
              set.
            </p>
          </div>
        }
      />
    </>
  );
}
