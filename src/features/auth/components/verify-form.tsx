"use client";

import { useState } from "react";
import Image from "next/image";
import { useCountdown } from "../hooks/use-countdown";
import { OTP_LENGTH, verifySchema } from "../schemas";
import { OtpInput } from "./otp-input";

const RESEND_SECONDS = 34;

/** Email OTP step shown after a successful login. */
export function VerifyForm({ email }: { email?: string }) {
  const destination = email ?? "your email";
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { remaining, isComplete, restart } = useCountdown(RESEND_SECONDS);

  const handleChange = (next: string) => {
    setCode(next);
    setError(null);
    if (next.length === OTP_LENGTH) {
      const result = verifySchema.safeParse({ code: next });
      if (!result.success) {
        setError(result.error.issues[0]?.message ?? "Invalid code");
      }
    }
  };

  return (
    <div className="flex w-full max-w-[490px] flex-col items-center">
      <h1 className="font-display text-center text-[36px] leading-tight font-bold text-black">
        Verify your account
      </h1>

      <p className="text-muted mt-[31px] text-center text-xl">
        Verify your email, by entering the one time password that we sent to{" "}
        {destination}
      </p>

      <div className="mt-[37px]">
        <OtpInput
          value={code}
          onChange={handleChange}
          invalid={Boolean(error)}
        />
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-[30px] flex w-full items-center gap-2.5">
        <Image src="/icons/info-circle.svg" alt="" width={20} height={20} />
        {isComplete ? (
          <button
            type="button"
            onClick={restart}
            className="text-brand text-xl underline underline-offset-2"
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
