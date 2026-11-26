"use client";

import { useState } from "react";
import { confirmEmail, sendEmailCode } from "@/app/actions/profile";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/features/auth/components/OtpInput";
import type { MyAccount } from "@/types/member";

/**
 * Shown only while the address on the account is unconfirmed, which happens
 * when an administrator changes it: the backend sends a code to the new
 * address, and the member types it in here, signed in.
 *
 * A login code does not work here, and the page says nothing about one.
 */
export function EmailConfirmation({
  email,
  onConfirmed,
}: {
  email: string;
  onConfirmed: (account: MyAccount | null) => void;
}) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [refused, setRefused] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  /* The backend allows one code a minute. The button waits as long as it
     says, on a timer started by the click itself. */
  const [waiting, setWaiting] = useState(false);

  const confirm = async () => {
    setBusy(true);
    setRefused(null);
    const outcome = await confirmEmail(code);
    setBusy(false);
    if (!outcome.ok) {
      setRefused(outcome.message);
      setCode("");
      return;
    }
    onConfirmed(outcome.account);
  };

  const resend = async () => {
    setRefused(null);
    setWaiting(true);
    const outcome = await sendEmailCode();
    if (!outcome.ok) {
      setWaiting(false);
      setRefused(outcome.message);
      return;
    }
    setNote(outcome.message);
    window.setTimeout(
      () => setWaiting(false),
      Math.max(outcome.resendAfter, 1) * 1000,
    );
  };

  return (
    <section
      aria-labelledby="confirm-email"
      className="border-member-border bg-member-tint flex flex-col gap-4 rounded-md border p-5 sm:p-6"
    >
      <div>
        <h2
          id="confirm-email"
          className="text-body text-member-ink font-semibold"
        >
          Confirm your email address
        </h2>
        <p className="text-body-sm text-muted mt-1 text-pretty">
          Your address is now{" "}
          <span className="text-member-ink font-medium">{email}</span>. Type the
          code that was sent there.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void confirm();
        }}
        className="flex flex-col gap-4"
      >
        <OtpInput
          value={code}
          onChange={setCode}
          invalid={refused !== null}
          disabled={busy}
        />
        {refused ? (
          <p role="alert" className="text-body-sm text-danger">
            {refused}
          </p>
        ) : note ? (
          <p role="status" className="text-body-sm text-muted">
            {note}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="sm" disabled={busy || code.length < 5}>
            {busy ? "Checking…" : "Confirm"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={waiting}
            onClick={() => void resend()}
          >
            Send a new code
          </Button>
        </div>
      </form>
    </section>
  );
}
