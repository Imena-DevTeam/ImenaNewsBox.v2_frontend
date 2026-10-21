"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CircleAlert, LoaderCircle } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";

const LENGTH = 5;
const RESEND_SECONDS = 34;

type Status = "idle" | "checking" | "wrong" | "done";

/**
 * The one-time code.
 *
 * There is no confirm button on purpose: the moment the last box is filled
 * the code submits itself, which is how every current app behaves and is one
 * less thing to reach for on a phone.
 *
 * Each box is its own input so the caret lands where you expect, and the set
 * behaves like one field: typing advances, Backspace walks back, the arrows
 * move, and pasting a whole code fills every box at once rather than dropping
 * five characters into the first one.
 */
export function VerifyForm({ email }: { email: string }) {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [status, setStatus] = useState<Status>("idle");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join("");

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [secondsLeft]);

  /* Submits itself as soon as the last box is filled.
     The guard is a ref, not the status: with status in the dependencies,
     setting it to "checking" re-ran this effect, and the cleanup cancelled
     the very timeout it had just started, so the code never resolved. */
  const sent = useRef(false);

  useEffect(() => {
    if (code.length < LENGTH) {
      sent.current = false;
      return;
    }
    if (sent.current) return;
    sent.current = true;

    setStatus("checking");
    const id = setTimeout(() => {
      /* TODO: check the code against the backend. Until there is one, any
         five digits are accepted so the flow can be walked end to end. */
      setStatus("done");
    }, 900);
    return () => clearTimeout(id);
  }, [code]);

  const put = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (status === "wrong") setStatus("idle");
  };

  const onChange = (index: number, raw: string) => {
    const typed = raw.replace(/\D/g, "");
    if (!typed) return put(index, "");

    /* A paste, or a fast typist: spread the characters across the boxes. */
    if (typed.length > 1) {
      const next = [...digits];
      for (let i = 0; i < typed.length && index + i < LENGTH; i++)
        next[index + i] = typed[i]!;
      setDigits(next);
      const last = Math.min(index + typed.length, LENGTH - 1);
      boxes.current[last]?.focus();
      return;
    }

    put(index, typed);
    if (index < LENGTH - 1) boxes.current[index + 1]?.focus();
  };

  const onKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      e.preventDefault();
      put(index - 1, "");
      boxes.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) boxes.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < LENGTH - 1)
      boxes.current[index + 1]?.focus();
  };

  const resend = () => {
    setSecondsLeft(RESEND_SECONDS);
    sent.current = false;
    setDigits(Array(LENGTH).fill(""));
    setStatus("idle");
    boxes.current[0]?.focus();
  };

  return (
    <div className="mx-auto w-full max-w-lg text-center">
      <h1 className="text-h1-m md:text-h1">Verify your account</h1>

      <p className="text-body-lg text-muted mx-auto mt-6 max-w-md">
        Verify your email by entering the one time password that we sent to{" "}
        <span className="text-text">{email}</span>
      </p>

      {/* No submit button: the code goes the moment it is complete. */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-10 flex justify-center gap-3 md:gap-4"
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              boxes.current[i] = el;
            }}
            value={digit}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={LENGTH}
            aria-label={`Digit ${i + 1} of ${LENGTH}`}
            disabled={status === "checking" || status === "done"}
            className={cn(
              "text-h3-m md:text-h3 size-14 rounded-md border text-center outline-none md:size-16",
              "transition-fast focus:border-heading focus:ring-heading/25 focus:ring-4",
              status === "wrong"
                ? "border-window-red"
                : "border-text/70 disabled:opacity-60",
            )}
          />
        ))}
      </form>

      {/* One live region for every outcome, so a screen reader is told what
          happened without anything stealing focus. */}
      <p role="status" aria-live="polite" className="mt-8 min-h-6">
        {status === "checking" ? (
          <span className="text-body text-muted inline-flex items-center gap-2">
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            Checking your code…
          </span>
        ) : status === "done" ? (
          <span className="text-body text-primary">
            Verified. Taking you in…
          </span>
        ) : status === "wrong" ? (
          <span className="text-body text-window-red">
            That code did not match. Try again.
          </span>
        ) : null}
      </p>

      <div className="text-body text-muted mt-6 flex items-center justify-center gap-2">
        <CircleAlert className="size-4" aria-hidden />
        {secondsLeft > 0 ? (
          <span>Resend code in {secondsLeft}s</span>
        ) : (
          <button
            type="button"
            onClick={resend}
            className="text-primary transition-fast hover:underline"
          >
            Resend code
          </button>
        )}
      </div>

      <Link
        href={ROUTES.LOGIN}
        className="text-body-sm text-muted hover:text-text transition-fast mt-10 inline-flex items-center gap-2"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to login
      </Link>
    </div>
  );
}
