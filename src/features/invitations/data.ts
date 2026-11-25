import type { ResetRequest } from "@/types/invitation";
import { administrators, SIGNED_IN_ID } from "@/features/members/data";

/**
 * Fixture mode's reset requests (no `API_URL`; see lib/auth-mode.ts): one
 * sample, so the band on /admin can be worked on without a backend. With a
 * backend, `app/(member)/admin/_lib/reset-requests.ts` reads the real ones.
 *
 * It is never the signed-in administrator's own: an administrator cannot
 * answer their own request, and the backend never lists it.
 */
export function sampleResetRequests(): ResetRequest[] {
  const other = administrators().find((person) => person.id !== SIGNED_IN_ID);
  if (!other) return [];

  const [familyName = other.fullName] = other.fullName.split(" ");
  return [
    {
      id: "rr-1",
      userId: other.id,
      familyName,
      displayName: other.fullName,
      email: other.email,
      requestedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    },
  ];
}
