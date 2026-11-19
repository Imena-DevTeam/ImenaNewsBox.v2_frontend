"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { RelativeTime } from "@/components/ui/RelativeTime";
import type { ResetRequest } from "@/types/invitation";

/**
 * Administrators waiting on a new password, and the one control that helps
 * them.
 *
 * This band is the other half of `/admin/forgot-password`. The family's
 * answer to a lost password is a **person** rather than an inbox: one
 * administrator asks, and another one here decides.
 *
 * > [!IMPORTANT]
 * > **The address is shown, never typed.** It is the one already on the
 * > record, and it is on screen so the administrator sending the link can
 * > see where it is going — which is also the check that catches an address
 * > somebody changed in order to be sent a reset.
 *
 * Sending is behind a confirmation because it is close to handing somebody
 * the account. The dialog says what it does and who else is told, because
 * the notice to the person being reset is the whole protection against a
 * quiet takeover, and the administrator doing it should know that.
 */
export function ResetRequests({
  requests,
  now,
}: {
  requests: ResetRequest[];
  /** Fixed on the server, so "2 hours ago" agrees across the boundary. */
  now: string;
}) {
  const [waiting, setWaiting] = useState(requests);
  const [sending, setSending] = useState<ResetRequest | null>(null);
  const [outcome, setOutcome] = useState<string | null>(null);

  // TODO: authService.approveReset / declineReset, once they answer.
  const send = (request: ResetRequest) => {
    setSending(null);
    setWaiting((was) => was.filter((one) => one.id !== request.id));
    setOutcome(
      `A reset link would go to ${request.email}, and ${request.fullName} would be told it was you who sent it. Nothing was stored, and no email was sent.`,
    );
  };

  const decline = (request: ResetRequest) => {
    setWaiting((was) => was.filter((one) => one.id !== request.id));
    setOutcome(
      `${request.fullName}'s request would be turned down and no link sent. Nothing was stored.`,
    );
  };

  if (waiting.length === 0) {
    return (
      <div>
        <EmptyState
          icon={<KeyRound aria-hidden className="size-6" />}
          title="Nobody has lost their password."
          description="When an administrator cannot get in, their request waits here for another one to send them a link."
        />
        {outcome ? (
          <p
            role="status"
            aria-live="polite"
            className="text-body-sm text-muted px-5 pb-5"
          >
            {outcome}
          </p>
        ) : null}
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
                {request.fullName}
              </p>
              <RelativeTime
                iso={request.requestedAt}
                now={now}
                className="text-caption text-muted shrink-0 tracking-widest uppercase"
              />
            </div>

            <p className="text-caption text-muted mt-0.5">
              Cannot sign in. The link would go to {request.email}.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="brand"
                size="sm"
                type="button"
                onClick={() => setSending(request)}
              >
                Send the link
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => decline(request)}
              >
                Not now
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <p
        role="status"
        aria-live="polite"
        className="text-body-sm text-muted px-5 pb-5"
      >
        {outcome ?? ""}
      </p>

      <ConfirmDialog
        open={sending !== null}
        title={
          sending
            ? `Send ${sending.fullName} a reset link?`
            : "Send a reset link?"
        }
        description={
          sending
            ? `It goes to ${sending.email}, the address already on their record, and lets them set a new password. They are told that you sent it, and the link stops working once it is used.`
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
