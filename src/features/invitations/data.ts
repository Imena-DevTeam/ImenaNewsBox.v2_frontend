import type { ResetRequest } from "@/types/invitation";
import { administrators, SIGNED_IN_ID } from "@/features/members/data";

/**
 * Administrators waiting on a new password.
 *
 * A sample, because asking for one sends an email and this frontend sends
 * none. The shape is what `GET /auth/reset-requests` returns, and the band
 * on /admin is built against it.
 *
 * TODO: step 4 of CLAUDE.md §23 replaces this with the service call, and
 * this file goes with it.
 */
export function pendingResetRequests(): ResetRequest[] {
  const other = administrators().find((person) => person.id !== SIGNED_IN_ID);
  if (!other) return [];

  const requestedAt = new Date(Date.now() - 1000 * 60 * 95).toISOString();

  return [
    {
      id: "rr-1",
      memberId: other.id,
      fullName: other.fullName,
      email: other.email,
      requestedAt,
    },
  ];
}
