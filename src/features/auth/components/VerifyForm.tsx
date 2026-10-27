"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { startMemberSession } from "@/app/actions/session";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";
import { useCountdown } from "../hooks/useCountdown";
import { OTP_LENGTH, verifySchema } from "../schemas";
import { AuthHeading } from "./AuthHeading";
import { OtpInput } from "./OtpInput";

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
 */
export function VerifyForm({
  email,
  returnTo,
}: {
  email?: string;
  returnTo?: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
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

    setStatus("verified");

    /* The gate the middleware reads. Until the auth API exists this is the
       whole of the session; see @/lib/session. */
    await startMemberSession();

    // TODO: once roles exist, send each one to its own home (the member
    // dashboard, the admin panel). `replace` keeps the code step out of
    // history, and returnTo carries whoever was bounced here back.
    router.replace(returnTo ?? ROUTES.DASHBOARD);
  };

  const handleChange = (next: string) => {
    setCode(next);
    setError(null);
    if (next.length === OTP_LENGTH && status === "idle") void verify(next);
  };

  return (
    <div className="flex w-full flex-col items-center">
      <VerifiedBadge
        className={cn(
          "transition-base size-16",
          status === "verified" && "scale-110",
        )}
      />

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
          <span role="alert" className="text-danger">
            {error}
          </span>
        ) : null}
      </div>

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
