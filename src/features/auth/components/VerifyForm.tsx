"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { startMemberSession } from "@/app/actions/session";
import { ROUTES } from "@/constants/routes";
import { useCountdown } from "../hooks/useCountdown";
import { OTP_LENGTH, verifySchema } from "../schemas";
import { AuthHeading } from "./AuthHeading";
import { OtpInput } from "./OtpInput";
import { SuccessBadge } from "./SuccessBadge";

const RESEND_SECONDS = 34;

type Status = "idle" | "verifying" | "verified";

// TODO: swap for the real verification call once the auth API exists.
async function verifyCode(code: string) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return code.length === OTP_LENGTH;
}

/**
 * Email OTP step shown after a successful login. There is no submit button:
 * the code is checked as soon as the last digit lands, and a correct code
 * takes you into the site.
 *
 * What the code is worth is decided elsewhere. startMemberSession takes no
 * arguments: it reads the role out of the signed cookie the login step set,
 * so arriving at this screen without going through a login grants nothing
 * and says so.
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
    if (!(await verifyCode(value))) {
      setStatus("idle");
      setError("That code isn't right. Check your email and try again.");
      return;
    }

    try {
      setStatus("verified");

      /* The gate the middleware reads. Until the auth API exists this is the
         whole of the session; see @/lib/session. The code itself still does
         not prove anything — the login step did, and the role it decided is
         in a cookie this call reads for itself. */
      await startMemberSession();

      /* Everyone lands on the same dashboard, admins included: the admin
         door is in the rail, not a separate home. `replace` keeps the code
         step out of history, and returnTo carries whoever was bounced here
         back to where they were going. */
      router.replace(returnTo ?? ROUTES.DASHBOARD);
    } catch {
      setStatus("idle");
      setExpired(true);
      setError(
        "This code can't be used — the login it belongs to has expired, or you came straight to this page.",
      );
    }
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

      <p className="text-muted mt-auth-sm text-center text-xl">
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
        className="mt-4 flex min-h-6 items-center gap-2 text-base"
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
          className="text-brand hover:text-brand-hover transition-fast mt-4 text-xl underline underline-offset-2"
        >
          Start again from the login page
        </Link>
      ) : null}

      <div className="mt-auth-md flex items-center gap-3.75">
        <Image src="/icons/info-circle.svg" alt="" width={20} height={20} />
        {isComplete ? (
          <button
            type="button"
            onClick={restart}
            className="text-brand hover:text-brand-hover transition-fast text-xl underline underline-offset-2"
          >
            Resend code
          </button>
        ) : (
          <p className="text-muted text-xl">Resend code in {remaining}s</p>
        )}
      </div>
    </div>
  );
}
