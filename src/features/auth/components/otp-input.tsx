"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { OTP_LENGTH } from "../schemas";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
};

/** Five single-digit boxes that behave as one field (auto-advance + paste). */
export function OtpInput({
  value,
  onChange,
  invalid,
  disabled,
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(OTP_LENGTH, " ").slice(0, OTP_LENGTH).split("");

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit || " ";
    onChange(next.join("").trimEnd());
  };

  const focus = (index: number) => refs.current[index]?.focus();

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);
    if (digit && index < OTP_LENGTH - 1) focus(index + 1);
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      event.preventDefault();
      setDigit(index - 1, "");
      focus(index - 1);
    }
    if (event.key === "ArrowLeft" && index > 0) focus(index - 1);
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) focus(index + 1);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted);
    focus(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  return (
    <div
      role="group"
      aria-label={`${OTP_LENGTH}-digit verification code`}
      className="flex items-center justify-center gap-3 sm:gap-5"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          autoFocus={index === 0}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          aria-invalid={invalid || undefined}
          value={digit.trim()}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className={cn(
            "font-display h-16 w-14 rounded-2xl border bg-white text-center text-3xl font-bold text-black",
            "focus:outline-none disabled:opacity-80",
            invalid
              ? "border-red-500"
              : "border-field-border focus:border-neutral-500",
          )}
        />
      ))}
    </div>
  );
}
