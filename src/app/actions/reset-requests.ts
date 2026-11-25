"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ROUTES } from "@/constants/routes";
import { forgotPasswordSchema } from "@/features/auth/schemas";
import { apiAuth } from "@/lib/api-auth";
import { authMode } from "@/lib/auth-mode";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/types/api";

/**
 * Forgotten administrator passwords (the backend's decision 77): one
 * administrator asks, another answers from /admin, and the link goes to the
 * address already on the account.
 *
 * > [!IMPORTANT]
 * > These are **public endpoints**, like every server action. Asking needs
 * > no login and answers the same way for every name, so it never says who
 * > is an administrator. Answering is the backend's to allow: it refuses
 * > anybody who is not an administrator, and anybody answering their own.
 */

export type AskOutcome =
  { ok: true; message: string } | { ok: false; message: string };

/** `gone`: the request is no longer open (another administrator answered
    it, or the person is no longer an administrator), so it leaves the list. */
export type AnswerOutcome =
  { ok: true } | { ok: false; message: string; gone?: boolean };

/** What the backend answers every name with; fixture mode says the same. */
const ASKED =
  "If that's an admin's family name, the other admins have been asked. When one of them answers, a link to set a new password arrives at the email address on the account.";
const OFF = "Password resets are not set up on this site yet.";
const UNREACHABLE = "We could not reach the server. Try again in a moment.";

const idSchema = z.string().trim().min(1).max(64);

function said(error: unknown): string {
  return error instanceof ApiError && error.status !== 0
    ? error.message
    : UNREACHABLE;
}

/** "I cannot get in": the other administrators are asked. */
export async function askForPasswordReset(name: string): Promise<AskOutcome> {
  const checked = forgotPasswordSchema.safeParse({ name });
  if (!checked.success) {
    return {
      ok: false,
      message: checked.error.issues[0]?.message ?? "That name cannot be used.",
    };
  }

  const mode = authMode();
  if (mode === "off") return { ok: false, message: OFF };
  /* Fixture mode: nothing to ask, and the same words as the backend. */
  if (mode === "fixture") return { ok: true, message: ASKED };

  try {
    const answer = await authService.requestPasswordReset(checked.data.name);
    return { ok: true, message: answer.message };
  } catch (error) {
    return { ok: false, message: said(error) };
  }
}

/** Sends the requester a link to set a new password, at their address. */
export async function approveResetRequest(
  requestId: string,
): Promise<AnswerOutcome> {
  return answer(requestId, (id, auth) => authService.approveReset(id, auth));
}

/** Closes the request. Nobody is emailed. */
export async function declineResetRequest(
  requestId: string,
): Promise<AnswerOutcome> {
  return answer(requestId, (id, auth) => authService.declineReset(id, auth));
}

async function answer(
  requestId: string,
  call: (
    id: string,
    auth: Awaited<ReturnType<typeof apiAuth>>,
  ) => Promise<void>,
): Promise<AnswerOutcome> {
  const parsed = idSchema.safeParse(requestId);
  if (!parsed.success) {
    return { ok: false, message: "That request does not exist.", gone: true };
  }

  const mode = authMode();
  if (mode === "off") return { ok: false, message: OFF };
  /* Fixture mode: the sample request leaves the list, and nothing is sent. */
  if (mode === "fixture") return { ok: true };

  try {
    await call(parsed.data, await apiAuth());
  } catch (error) {
    if (error instanceof ApiError && error.code === "reset_request_not_found") {
      revalidatePath(ROUTES.ADMIN);
      return {
        ok: false,
        gone: true,
        message:
          "That request is no longer open: another administrator has answered it, or the person is no longer an administrator.",
      };
    }
    return { ok: false, message: said(error) };
  }

  revalidatePath(ROUTES.ADMIN);
  return { ok: true };
}
