import { sampleResetRequests } from "@/features/invitations/data";
import { apiAuth } from "@/lib/api-auth";
import { authMode } from "@/lib/auth-mode";
import { authService } from "@/services/auth.service";
import type { ResetRequest } from "@/types/invitation";

/**
 * Other administrators' open password reset requests, oldest first, for the
 * band on /admin. Never the viewer's own: the backend leaves it out.
 *
 * `null` when the backend could not be asked, so the band can say so rather
 * than claim nobody is waiting.
 */
export async function loadResetRequests(): Promise<ResetRequest[] | null> {
  const mode = authMode();
  if (mode === "fixture") return sampleResetRequests();
  if (mode === "off") return [];

  try {
    const requests = await authService.resetRequests(await apiAuth());
    return requests.map((request) => ({
      id: request.id,
      userId: request.user.id,
      familyName: request.user.family_name,
      displayName: request.user.display_name,
      email: request.user.email,
      requestedAt: request.requested_at,
    }));
  } catch {
    return null;
  }
}
