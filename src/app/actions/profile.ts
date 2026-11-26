"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ROUTES } from "@/constants/routes";
import { accountFromMe } from "@/features/members/wire";
import {
  codeSchema,
  PHOTO_MAX_BYTES,
  PHOTO_TYPES,
  profileChangesSchema,
  type ProfileChanges,
} from "@/features/profile/schemas";
import { apiAuth } from "@/lib/api-auth";
import { authMode } from "@/lib/auth-mode";
import { getViewer } from "@/lib/viewer";
import { authService } from "@/services/auth.service";
import { usersService } from "@/services/users.service";
import { ApiError } from "@/types/api";
import type { MyAccount } from "@/types/member";
import type { ProfileUpdate, UserRead } from "@/types/wire";

/**
 * A member's own account: their profile, their photo, confirming a changed
 * email address, and signing their other devices out.
 *
 * > [!IMPORTANT]
 * > These are **public endpoints**, like every server action. Each one acts
 * > as whoever's access token the request carries, and the backend decides
 * > what that person may do: `/users/me` is only ever your own account, a
 * > photo is yours or an administrator's to change, and a device is yours
 * > to sign out.
 *
 * `account` is the account as the backend now holds it. Fixture mode stores
 * nothing and answers `null`, and the page keeps what was typed.
 */
export type AccountOutcome =
  | { ok: true; message: string; account: MyAccount | null }
  | { ok: false; message: string };

export type CodeOutcome =
  | { ok: true; message: string; resendAfter: number }
  | { ok: false; message: string };

export type DeviceOutcome =
  { ok: true; message: string } | { ok: false; message: string };

const OFF = "Accounts are not connected on this site yet.";
const UNREACHABLE = "We could not reach the server. Try again in a moment.";
const SAMPLE = "This is the sample account, so nothing was stored or sent.";

function said(error: unknown): string {
  if (!(error instanceof ApiError) || error.status === 0) return UNREACHABLE;
  const first = error.fields ? Object.values(error.fields)[0] : undefined;
  return first ?? error.message;
}

/** The display name shows in every page's frame, so all of them refresh. */
function changed() {
  revalidatePath("/", "layout");
}

function done(user: UserRead, message: string): AccountOutcome {
  changed();
  return { ok: true, message, account: accountFromMe(user) };
}

/** Display name, birthday and bio. Send only what changed. */
export async function updateProfile(
  changes: ProfileChanges,
): Promise<AccountOutcome> {
  const parsed = profileChangesSchema.safeParse(changes);
  if (!parsed.success) {
    return { ok: false, message: "Some of those details cannot be used." };
  }

  const mode = authMode();
  if (mode === "off") return { ok: false, message: OFF };
  if (mode === "fixture") return { ok: true, message: SAMPLE, account: null };

  const next = parsed.data;
  const update: ProfileUpdate = {};
  if (next.fullName !== undefined) update.display_name = next.fullName;
  if (next.bornOn !== undefined) update.birthday = next.bornOn;
  if (next.bio !== undefined) update.bio = next.bio;

  try {
    const user = await usersService.updateMe(update, await apiAuth());
    return done(user, "Your profile was saved.");
  } catch (error) {
    return { ok: false, message: said(error) };
  }
}

/** A new profile photo. JPEG, PNG, WebP or HEIC, at most 5 MB. */
export async function setProfilePhoto(form: FormData): Promise<AccountOutcome> {
  const photo = form.get("photo");
  if (!(photo instanceof Blob) || photo.size === 0) {
    return { ok: false, message: "Choose a photograph first." };
  }
  if (!PHOTO_TYPES.includes(photo.type)) {
    return { ok: false, message: "Use a JPEG, PNG, WebP or HEIC photograph." };
  }
  if (photo.size > PHOTO_MAX_BYTES) {
    return { ok: false, message: "That photograph is over 5 MB." };
  }

  const mode = authMode();
  if (mode === "off") return { ok: false, message: OFF };
  if (mode === "fixture") return { ok: true, message: SAMPLE, account: null };

  const viewer = await getViewer();
  if (!viewer) return { ok: false, message: "Log in again to change it." };

  try {
    const user = await usersService.setPhoto(viewer.id, photo, await apiAuth());
    return done(user, "Your photograph was changed.");
  } catch (error) {
    return { ok: false, message: said(error) };
  }
}

export async function removeProfilePhoto(): Promise<AccountOutcome> {
  const mode = authMode();
  if (mode === "off") return { ok: false, message: OFF };
  if (mode === "fixture") return { ok: true, message: SAMPLE, account: null };

  const viewer = await getViewer();
  if (!viewer) return { ok: false, message: "Log in again to change it." };

  try {
    const user = await usersService.removePhoto(viewer.id, await apiAuth());
    return done(user, "Your photograph was removed.");
  } catch (error) {
    return { ok: false, message: said(error) };
  }
}

/**
 * Another code to the address on the account, for confirming it after an
 * administrator changed it. One a minute, ten a day, like login codes.
 */
export async function sendEmailCode(): Promise<CodeOutcome> {
  const mode = authMode();
  if (mode === "off") return { ok: false, message: OFF };
  if (mode === "fixture") return { ok: true, message: SAMPLE, resendAfter: 60 };

  try {
    const sent = await usersService.resendEmailCode(await apiAuth());
    return { ok: true, message: sent.message, resendAfter: sent.resend_after };
  } catch (error) {
    if (error instanceof ApiError && error.code === "email_already_verified") {
      changed();
      return { ok: true, message: error.message, resendAfter: 0 };
    }
    return { ok: false, message: said(error) };
  }
}

/** Confirms the address with the code sent to it. A login code does not
    work here. */
export async function confirmEmail(code: string): Promise<AccountOutcome> {
  const parsed = codeSchema.safeParse(code);
  if (!parsed.success) {
    return { ok: false, message: "Enter all five digits of the code." };
  }

  const mode = authMode();
  if (mode === "off") return { ok: false, message: OFF };
  if (mode === "fixture") return { ok: true, message: SAMPLE, account: null };

  try {
    const user = await usersService.verifyEmail(parsed.data, await apiAuth());
    return done(user, "Your email address is confirmed.");
  } catch (error) {
    return { ok: false, message: said(error) };
  }
}

const sessionId = z.string().trim().min(1).max(64);

/** Signs one of your other devices out. Its next request fails. */
export async function signOutDevice(id: string): Promise<DeviceOutcome> {
  const parsed = sessionId.safeParse(id);
  if (!parsed.success) return { ok: false, message: "That device is unknown." };

  const mode = authMode();
  if (mode === "off") return { ok: false, message: OFF };
  if (mode === "fixture") return { ok: true, message: SAMPLE };

  try {
    await authService.revokeSession(parsed.data, await apiAuth());
  } catch (error) {
    /* Already gone is what was asked for. */
    if (!(error instanceof ApiError && error.code === "session_not_found")) {
      return { ok: false, message: said(error) };
    }
  }
  revalidatePath(ROUTES.PROFILE);
  return { ok: true, message: "That device was signed out." };
}
