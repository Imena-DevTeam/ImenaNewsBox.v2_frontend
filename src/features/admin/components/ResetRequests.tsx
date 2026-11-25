"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import {
  approveResetRequest,
  declineResetRequest,
  type AnswerOutcome,
} from "@/app/actions/reset-requests";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { RelativeTime } from "@/components/ui/RelativeTime";
import type { ResetRequest } from "@/types/invitation";

/**
 * Administrators waiting on a new password: the other half of
 * `/admin/forgot-password`.
 *
 * > [!IMPORTANT]
 * > **The address is shown, never typed.** The link can only go to the one
 * > already on the account, and it is on screen so whoever sends it can see
 * > where it is going. They never see the link itself.
 *
 * Anybody who knows an administrator's family name can ask on their
 * behalf, so sending is behind a confirmation that says to check with them
 * first. Declining sends nothing, and they can ask again.
 */
export function ResetRequests({
  requests,
  now,
}: {
  /** `null`: the backend could not be asked. */
  requests: ResetRequest[] | null;
  /** Fixed on the server, so "2 hours ago" agrees across the boundary. */
  now: string;
}) {
  const [answered, setAnswered] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [sending, setSending] = useState<ResetRequest | null>(null);
  const [outcome, setOutcome] = useState<string | null>(null);

  if (requests === null) {
    return (
      <p role="alert" className="text-body-sm text-muted px-5 py-5">
        The requests could not be loaded. Reload the page in a moment.
      </p>
    );
  }

  const waiting = requests.filter((request) => !answered.includes(request.id));

  const settle = async (
    request: ResetRequest,
    call: (id: string) => Promise<AnswerOutcome>,
    done: string,
  ) => {
    setBusy(request.id);
    setOutcome(null);
    const result = await call(request.id).catch(() => null);
    setBusy(null);

    if (result?.ok || (result && result.gone)) {
      setAnswered((was) => [...was, request.id]);
    }
    setOutcome(
      result?.ok
        ? done
        : (result?.message ??
            "We could not reach the server. Try again in a moment."),
    );
  };

  const send = (request: ResetRequest) => {
    setSending(null);
    void settle(
      request,
      approveResetRequest,
      `A link to set a new password is on its way to ${request.email}.`,
    );
  };

  const decline = (request: ResetRequest) =>
    void settle(
      request,
      declineResetRequest,
      `${request.displayName}'s request is closed. Nobody was emailed.`,
    );

  const status = (
    <p
      role="status"
      aria-live="polite"
      className="text-body-sm text-muted px-5 pb-5"
    >
      {outcome ?? ""}
    </p>
  );

  if (waiting.length === 0) {
    return (
      <div>
        <EmptyState
          icon={<KeyRound aria-hidden className="size-6" />}
          title="Nobody has lost their password."
          description="When an administrator cannot get in, their request waits here for another one to send them a link."
        />
        {status}
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-member-border divide-y">
        {waiting.map((request) => (
          <li key={request.id} className="px-5 py-3.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-body-sm text-member-ink min-w-0 flex-1 font-medium">
                {request.displayName}
              </p>
              <RelativeTime
                iso={request.requestedAt}
                now={now}
                className="text-caption text-muted shrink-0 tracking-widest uppercase"
              />
            </div>

            <p className="text-caption text-muted mt-0.5">
              Cannot log in. The link would go to {request.email}.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="brand"
                size="sm"
                type="button"
                disabled={busy !== null}
                onClick={() => setSending(request)}
              >
                Send the link
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={busy !== null}
                onClick={() => decline(request)}
              >
                Decline
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {status}

      <ConfirmDialog
        open={sending !== null}
        title={
          sending ? `Send ${sending.displayName} a link?` : "Send a reset link?"
        }
        description={
          sending
            ? `It goes to ${sending.email}, the address on their account, and lets them set a new password. Anybody who knows their family name can ask on their behalf, so check with them first.`
            : ""
        }
        confirmLabel="Send it"
        cancelLabel="Cancel"
        onCancel={() => setSending(null)}
        onConfirm={() => sending && send(sending)}
      />
    </div>
  );
}
