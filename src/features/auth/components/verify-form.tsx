"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCountdown } from "../hooks/use-countdown";
import { OTP_LENGTH, verifySchema } from "../schemas";
import { OtpInput } from "./otp-input";

const RESEND_SECONDS = 34;

/** Email OTP step shown after a successful login. */
export function VerifyForm({ email }: { email?: string }) {
  const router = useRouter();
  const destination = email ?? "your email";
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { remaining, isComplete, restart } = useCountdown(RESEND_SECONDS);

  const handleChange = (next: string) => {
    setCode(next);
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = verifySchema.safeParse({ code });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid code");
      return;
    }
    setIsSubmitting(true);
    // TODO: swap for the real verification call and route by role once the
    // auth API exists.
    router.push("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col items-center"
    >
      <h1 className="font-display text-center text-[36px] leading-[normal] font-bold text-black">
        Verify your account
      </h1>

      <p className="text-muted mt-[clamp(16px,3.5dvh,31px)] text-center text-xl leading-[normal]">
        Verify your email, by entering the one time password that{" "}
        <br className="hidden sm:inline" />
        we sent to {destination}
      </p>

      <div className="mt-[clamp(24px,6dvh,56px)]">
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

      <div className="mt-[30px] flex w-full items-center gap-[15px] leading-[normal]">
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

      {/* Matches the width of the code boxes above it. */}
      <Button
        type="submit"
        disabled={code.length < OTP_LENGTH || isSubmitting}
        className="mt-[clamp(20px,4dvh,40px)] max-w-[395px]"
      >
        Verify
      </Button>
    </form>
  );
}
