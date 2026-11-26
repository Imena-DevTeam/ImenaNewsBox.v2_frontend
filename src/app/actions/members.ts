"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ROUTES } from "@/constants/routes";
import {
  memberChangesSchema,
  memberFieldsSchema,
  type MemberChanges,
  type MemberFields,
} from "@/features/admin/schemas";
import { memberFromAccount } from "@/features/members/wire";
import { apiAuth } from "@/lib/api-auth";
import { authMode } from "@/lib/auth-mode";
import { usersService } from "@/services/users.service";
import { ApiError } from "@/types/api";
import type { FamilyMember } from "@/types/member";
import type { UserRead, UserUpdate } from "@/types/wire";

/**
 * The register, changed: add somebody, edit them, deactivate or reactivate
 * them, and send them a new invitation link.
 *
 * > [!IMPORTANT]
 * > These are **public endpoints**, like every server action. Every one of
 * > them is the backend's to allow: it refuses anybody who is not an
 * > administrator, an administrator changing their own role or deactivating
 * > themselves, and anything that would leave fewer than two administrators
 * > (409 `too_few_admins`). The table's disabled controls are a courtesy
 * > over those rules, never the rules themselves.
 *
 * `person` is the record as the backend now holds it. Fixture mode stores
 * nothing and answers `null`, and the table applies the change to its own
 * copy of the sample register.
 */
export type MemberOutcome =
  | { ok: true; message: string; person: FamilyMember | null }
  | { ok: false; message: string; field?: "familyName" | "email" };

const OFF = "The register is not connected on this site yet.";
const UNREACHABLE = "We could not reach the server. Try again in a moment.";
const SAMPLE = "This is the sample register, so nothing was stored or sent.";

const idSchema = z.string().trim().min(1).max(64);

function refused(error: unknown): MemberOutcome {
  if (!(error instanceof ApiError) || error.status === 0) {
    return { ok: false, message: UNREACHABLE };
  }
  if (error.code === "family_name_taken") {
    return { ok: false, message: error.message, field: "familyName" };
  }
  if (error.code === "email_taken") {
    return { ok: false, message: error.message, field: "email" };
  }
  /* A 422 names the field it objects to; say which, in its own words. */
  const first = error.fields ? Object.values(error.fields)[0] : undefined;
  return { ok: false, message: first ?? error.message };
}

function changed(paths: string[] = [ROUTES.ADMIN_MEMBERS, ROUTES.ADMIN]) {
  for (const path of paths) revalidatePath(path);
}

/** Adds somebody, and the backend emails them their invitation link. */
export async function addMember(fields: MemberFields): Promise<MemberOutcome> {
  const parsed = memberFieldsSchema.safeParse(fields);
  if (!parsed.success) {
    return { ok: false, message: "Some of those details cannot be used." };
  }

  const mode = authMode();
  if (mode === "off") return { ok: false, message: OFF };
  const person = parsed.data;
  if (mode === "fixture") {
    return {
      ok: true,
      person: null,
      message: `${person.fullName} would be added and sent an invitation link at ${person.email}. ${SAMPLE}`,
    };
  }

  let user: UserRead;
  try {
    user = await usersService.create(
      {
        family_name: person.familyName,
        display_name: person.fullName,
        email: person.email,
        sub_family_id: person.subFamilyId,
        promotion_id: person.promotionId,
        birthday: person.bornOn,
        role: person.role,
      },
      await apiAuth(),
    );
  } catch (error) {
    return refused(error);
  }

  changed();
  /* The backend keeps the person even when the email fails, and leaves
     `invited_at` empty to say so. */
  return {
    ok: true,
    person: memberFromAccount(user),
    message: user.invited_at
      ? `${user.display_name} was added. Their invitation link went to ${user.email}.`
      : `${user.display_name} was added, but the invitation email could not be sent. Open their record and send a new link.`,
  };
}

/** Changes only what is sent. */
export async function updateMember(
  userId: string,
  changes: MemberChanges,
): Promise<MemberOutcome> {
  const id = idSchema.safeParse(userId);
  const parsed = memberChangesSchema.safeParse(changes);
  if (!id.success || !parsed.success) {
    return { ok: false, message: "Some of those details cannot be used." };
  }

  const mode = authMode();
  if (mode === "off") return { ok: false, message: OFF };
  const next = parsed.data;
  if (mode === "fixture") {
    return {
      ok: true,
      person: null,
      message: `The changes were kept. ${SAMPLE}`,
    };
  }

  const update: UserUpdate = {};
  if (next.fullName !== undefined) update.display_name = next.fullName;
  if (next.familyName !== undefined) update.family_name = next.familyName;
  if (next.email !== undefined) update.email = next.email;
  if (next.subFamilyId !== undefined) update.sub_family_id = next.subFamilyId;
  if (next.promotionId !== undefined) update.promotion_id = next.promotionId;
  if (next.bornOn !== undefined) update.birthday = next.bornOn;
  if (next.role !== undefined) update.role = next.role;

  let user: UserRead;
  try {
    user = await usersService.update(id.data, update, await apiAuth());
  } catch (error) {
    return refused(error);
  }

  changed();
  const name = user.display_name;
  const said = [
    next.email !== undefined
      ? `${name} now uses ${user.email}, and was asked to confirm it there.`
      : `${name} was saved.`,
  ];
  if (next.role === "admin") {
    said.push("They were sent a link to choose their administrator password.");
  }
  return { ok: true, person: memberFromAccount(user), message: said.join(" ") };
}

/** Signs them out of every device and stops them logging in. Their record,
    family name and wishes are kept. */
export async function deactivateMember(userId: string): Promise<MemberOutcome> {
  return act(
    userId,
    (id, auth) => usersService.deactivate(id, auth),
    (user) => `${user.display_name} was deactivated and signed out everywhere.`,
  );
}

/** Lets them log in again. Each device logs in from scratch. */
export async function reactivateMember(userId: string): Promise<MemberOutcome> {
  return act(
    userId,
    (id, auth) => usersService.reactivate(id, auth),
    (user) => `${user.display_name} can log in again.`,
  );
}

/** A new invitation link, replacing the old one. For an administrator it
    also sets a new password, so it is how a forgotten one is reset. */
export async function sendNewLink(userId: string): Promise<MemberOutcome> {
  return act(
    userId,
    (id, auth) => usersService.invite(id, auth),
    (user) => `A new invitation link went to ${user.email}.`,
  );
}

async function act(
  userId: string,
  call: (
    id: string,
    auth: Awaited<ReturnType<typeof apiAuth>>,
  ) => Promise<UserRead>,
  done: (user: UserRead) => string,
): Promise<MemberOutcome> {
  const id = idSchema.safeParse(userId);
  if (!id.success) return { ok: false, message: "That person does not exist." };

  const mode = authMode();
  if (mode === "off") return { ok: false, message: OFF };
  if (mode === "fixture") return { ok: true, person: null, message: SAMPLE };

  let user: UserRead;
  try {
    user = await call(id.data, await apiAuth());
  } catch (error) {
    return refused(error);
  }

  changed();
  return { ok: true, person: memberFromAccount(user), message: done(user) };
}
