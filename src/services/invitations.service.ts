import { api } from "@/lib/api-client";
import { ApiError } from "@/types/api";
import type {
  Invitation,
  InvitationCheck,
  InvitationInput,
} from "@/types/invitation";
import { ENDPOINTS } from "./endpoints";

/**
 * Invitations: the only way a person enters this system.
 *
 * An administrator creates one, the backend emails the link, and the person
 * holding that link gets exactly one action out of it.
 *
 * > [!IMPORTANT]
 * > `check` takes **no token argument for authentication** — the invitation
 * > token *is* the credential, and the caller has no session yet. That is
 * > the one public read in this whole service layer, so it answers with a
 * > name and a role or it refuses, and never with anything else about the
 * > register.
 */
export const invitationsService = {
  /**
   * What a link is worth.
   *
   * A refusal comes back as a value rather than a throw: an expired
   * invitation is the ordinary end of an invitation's life, and the page it
   * lands on has something to say about it. Anything else — the backend
   * being down, a timeout — still throws, because that is not an answer.
   */
  check: async (token: string): Promise<InvitationCheck> => {
    try {
      const invitation = await api.get<Invitation>(
        ENDPOINTS.invitations.one(token),
      );
      return { ok: true, invitation };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 410) return { ok: false, reason: "used" };
        if (error.status === 404) return { ok: false, reason: "unknown" };
        if (error.isValidation) return { ok: false, reason: "expired" };
      }
      throw error;
    }
  },

  /** An administrator invites somebody. The backend sends the email. */
  create: (input: InvitationInput, token?: string) =>
    api.post<Invitation>(ENDPOINTS.invitations.create, input, { token }),

  /**
   * Accepting it.
   *
   * A member sends nothing: their credential is their name, and the member
   * door asks for no password. An administrator sends the password they have
   * just chosen, which is the first and only time this frontend handles it.
   */
  accept: (token: string, password?: string) =>
    api.post<void>(
      ENDPOINTS.invitations.accept(token),
      password ? { password } : {},
    ),

  /** Send it again, when somebody never got the first one. */
  resend: (id: string, token?: string) =>
    api.post<void>(ENDPOINTS.invitations.resend(id), {}, { token }),
};
