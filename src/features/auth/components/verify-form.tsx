"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { cn } from "@/lib/cn";
import { useCountdown } from "../hooks/use-countdown";
import { OTP_LENGTH, verifySchema } from "../schemas";
import { AuthHeading } from "./auth-heading";
import { OtpInput } from "./otp-input";

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
 * reloads the route.
 */
export function VerifyForm({ email }: { email?: string }) {
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
    // TODO: once the session cookie exists, the server will route the
    // refreshed request to the right home for the user's role.
    router.refresh();
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
          "size-16 transition-transform duration-500 ease-out",
          status === "verified" && "scale-110",
        )}
      />

      <AuthHeading
        lines={["Verify your", "account"]}
        className="mt-[clamp(16px,3dvh,24px)] text-center"
      />

      <p className="text-muted mt-[clamp(12px,2.5dvh,20px)] text-center text-xl leading-[normal]">
        Enter the one-time password we sent to{" "}
        {email ? (
          <span className="font-medium text-black">{email}</span>
        ) : (
          "your email"
        )}
      </p>

      <div className="motion-safe:animate-rise mt-[clamp(24px,5dvh,48px)] [animation-delay:90ms]">
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
          <span role="alert" className="text-red-600">
            {error}
          </span>
        ) : null}
      </div>

      <div className="mt-[clamp(16px,3dvh,28px)] flex items-center gap-[15px] leading-[normal]">
        {/* The icon's stroke overflows its 20px slot by 0.75px per side. */}
        <Image
          src="/icons/info-circle.svg"
          alt=""
          width={21.5}
          height={21.5}
          className="-m-[0.75px]"
        />
        {isComplete ? (
          <button
            type="button"
            onClick={restart}
            className="text-brand hover:text-brand-hover text-xl underline underline-offset-2 transition-colors duration-300 ease-out"
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
