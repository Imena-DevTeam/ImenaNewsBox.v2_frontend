"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resendLoginCode, verifyLoginCode } from "@/app/actions/session";
import { ROUTES } from "@/constants/routes";
import { useCountdown } from "../hooks/useCountdown";
import { OTP_LENGTH, verifySchema } from "../schemas";
import { AuthHeading } from "./AuthHeading";
import { OtpInput } from "./OtpInput";
import { SuccessBadge } from "./SuccessBadge";

/** The backend's wait between two codes (`CODE_RESEND_COOLDOWN`). */
const RESEND_SECONDS = 60;

type Status = "idle" | "verifying" | "verified";

/**
 * Email OTP step shown after a successful login. There is no submit button:
 * the code is checked as soon as the last digit lands, and a correct code
 * takes you into the site.
 *
 * What the code is worth is decided on the server. `verifyLoginCode` takes
 * the code and nothing else: the family name it is checked against comes
 * from the signed cookie the login step set, so arriving at this screen
 * without going through a login grants nothing and says so. With a backend,
 * the backend checks the code; a wrong one costs one of its five tries.
 */
export function VerifyForm({
  email,
  returnTo,
  back = ROUTES.LOGIN,
}: {
  email?: string;
  returnTo?: string;
  /** The login this screen was reached from, for the way back on failure. */
  back?: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  /* A failure the code cannot fix: there is no login in progress, so the
     only way on is back. It gets a link rather than another attempt. */
  const [expired, setExpired] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const { remaining, isComplete, restart } = useCountdown(RESEND_SECONDS);

  const verify = async (value: string) => {
    const result = verifySchema.safeParse({ code: value });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid code");
      return;
    }

    setStatus("verifying");
    let outcome: Awaited<ReturnType<typeof verifyLoginCode>>;
    try {
      outcome = await verifyLoginCode(value);
    } catch {
      outcome = {
        ok: false,
        message: "We could not check the code. Try again in a moment.",
      };
    }

    if (!outcome.ok) {
      setStatus("idle");
      /* A wrong code is cleared so the next one can be typed straight in. */
      setCode("");
      setError(outcome.message);
      if (outcome.restart) setExpired(true);
      return;
    }

    setStatus("verified");
    /* Everyone lands on the same dashboard, admins included: the admin door
       is in the rail, not a separate home. `replace` keeps the code step out
       of history, and returnTo carries whoever was bounced here back to
       where they were going. */
    router.replace(returnTo ?? ROUTES.DASHBOARD);
  };

  const resend = async () => {
    setError(null);
    restart();
    let outcome: Awaited<ReturnType<typeof resendLoginCode>>;
    try {
      outcome = await resendLoginCode();
    } catch {
      outcome = {
        ok: false,
        message: "We could not send a code. Try again in a moment.",
      };
    }
    if (!outcome.ok) {
      restart(0);
      setError(outcome.message);
      if (outcome.restart) setExpired(true);
      return;
    }
    restart(outcome.resendAfter);
  };

  const handleChange = (next: string) => {
    setCode(next);
    setError(null);
    if (next.length === OTP_LENGTH && status === "idle") void verify(next);
  };

  return (
    <div className="flex w-full flex-col items-center">
      {/* Empty until the code is accepted; the slot keeps its size, so the
          heading never moves. */}
      <SuccessBadge show={status === "verified"} />

      <AuthHeading
        lines={["Verify your", "account"]}
        className="mt-auth-md text-center"
      />

      <p className="text-muted mt-auth-sm text-h4 text-center">
        Enter the one-time password we sent to{" "}
        {email ? (
          <span className="text-text font-medium">{email}</span>
        ) : (
          "your email"
        )}
      </p>

      <div className="mt-auth-lg page-enter">
        <OtpInput
          value={code}
          onChange={handleChange}
          invalid={Boolean(error)}
          disabled={status !== "idle"}
        />
      </div>

      <div
        aria-live="polite"
        className="text-body mt-4 flex min-h-6 items-center gap-2"
      >
        {status === "verifying" ? (
          <>
            <span className="border-brand/30 border-t-brand size-4 animate-spin rounded-full border-2" />
            <span className="text-muted">Verifying…</span>
          </>
        ) : status === "verified" ? (
          <span className="text-brand font-medium">
            Verified! Taking you in…
          </span>
        ) : error ? (
          <span role="alert" className="text-danger text-center">
            {error}
          </span>
        ) : null}
      </div>

      {expired ? (
        <Link
          href={back}
          className="text-brand hover:text-brand-hover transition-fast text-h4 mt-4 underline underline-offset-2"
        >
          Start again from the login page
        </Link>
      ) : null}

      <div className="mt-auth-md flex items-center gap-3.75">
        <Image src="/icons/info-circle.svg" alt="" width={20} height={20} />
        {isComplete ? (
          <button
            type="button"
            onClick={() => void resend()}
            className="text-brand hover:text-brand-hover transition-fast text-h4 underline underline-offset-2"
          >
            Resend code
          </button>
        ) : (
          <p className="text-muted text-h4">Resend code in {remaining}s</p>
        )}
      </div>
    </div>
  );
}
