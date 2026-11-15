import { api } from "@/lib/api-client";
import type { ResetRequest } from "@/types/invitation";
import { ENDPOINTS } from "./endpoints";

/**
 * The administrators' password, and losing it.
 *
 * Three of these five calls are public, because they are used by somebody
 * who cannot sign in. That is the whole difficulty of a password reset, and
 * the design answers it by putting a **person** in the loop rather than
 * trusting an inbox: asking tells the other administrators, and only one of
 * them can send the link.
 *
 * > [!CAUTION]
 * > `forgotPassword` sends a **name and nothing else**, and `approve` takes
 * > no address. The link goes to the address already on the record. A reset
 * > link sent to an address supplied at reset time is a takeover with extra
 * > steps, and no amount of care on this side would fix it.
 */
export const authService = {
  /**
   * "I cannot get in." Public.
   *
   * It answers the same way whether or not the name belongs to an
   * administrator, so it cannot be used to find out who is one.
   */
  forgotPassword: (name: string) =>
    api.post<void>(ENDPOINTS.auth.forgotPassword, { name }),

  /** Who is waiting. Administrators only. */
  resetRequests: (token?: string) =>
    api.get<ResetRequest[]>(ENDPOINTS.auth.resetRequests, { token }),

  /** One administrator sends another the link, to the address on file. */
  approveReset: (id: string, token?: string) =>
    api.post<ResetRequest>(ENDPOINTS.auth.approveReset(id), {}, { token }),

  /** Not them, or not now. The request goes; nothing is sent. */
  declineReset: (id: string, token?: string) =>
    api.post<void>(ENDPOINTS.auth.declineReset(id), {}, { token }),

  /** Setting the new password. Public: the token in the path is the whole
      credential, and spending it is the backend's job. */
  resetPassword: (resetToken: string, password: string) =>
    api.post<void>(ENDPOINTS.auth.resetPassword(resetToken), { password }),
};
