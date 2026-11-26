import * as z from "zod";

/**
 * Add somebody to the register, or edit them: the fields of the backend's
 * `UserCreate` and `UserUpdate`, with its limits.
 *
 * The family name and the email are each unique, ignoring case and counting
 * deactivated people, so both are checked against everybody else here. That
 * is a courtesy that saves a round trip; the backend refuses a duplicate
 * itself (409 `family_name_taken`, `email_taken`), and the panel shows that
 * refusal on the same field.
 *
 * The selects hold ids as strings, because that is what an `<option>` has.
 * An empty promotion is "none yet": people imported from v1 have none.
 *
 * There is no status field. Deactivating is an action with consequences —
 * the person is signed out everywhere — so it is a button with a
 * confirmation, not an option in a select.
 */
export function memberEditSchema({
  takenEmails,
  takenFamilyNames,
}: {
  takenEmails: string[];
  takenFamilyNames: string[];
}) {
  const emails = new Set(takenEmails.map((email) => email.toLowerCase()));
  const names = new Set(takenFamilyNames.map((name) => name.toLowerCase()));

  return z.object({
    fullName: z
      .string()
      .trim()
      .min(1, "The member needs a name")
      .max(100, "At most 100 characters"),
    familyName: z
      .string()
      .trim()
      .min(1, "A family name is what they log in with")
      .max(64, "At most 64 characters")
      .refine(
        (name) => !names.has(name.toLowerCase()),
        "Somebody else already logs in with that family name",
      ),
    email: z
      .string()
      .trim()
      .min(1, "Their login codes and invitation go to this address")
      .email("That does not look like an email address")
      .refine(
        (email) => !emails.has(email.toLowerCase()),
        "Somebody else in the register already uses that address",
      ),
    subFamilyId: z.string().regex(/^\d+$/, "Choose a family branch"),
    promotionId: z.string().regex(/^\d*$/, "Choose a promotion"),
    bornOn: z
      .string()
      .refine(
        (iso) => !iso || (iso >= "1900-01-01" && iso <= today()),
        "A date of birth between 1900 and today",
      ),
    role: z.enum(["member", "social_media_manager", "admin"], {
      message: "Choose a role",
    }),
  });
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export type MemberEditValues = z.infer<ReturnType<typeof memberEditSchema>>;

/**
 * What the server actions accept: the form's values with the ids as
 * numbers. Every field is checked again there, because a server action is a
 * public endpoint and the form is only a courtesy to whoever is typing.
 */
export const memberFieldsSchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  familyName: z.string().trim().min(1).max(64),
  email: z.string().trim().email(),
  subFamilyId: z.number().int().positive(),
  promotionId: z.number().int().positive().nullable(),
  bornOn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  role: z.enum(["member", "social_media_manager", "admin"]),
});

export type MemberFields = z.infer<typeof memberFieldsSchema>;

/** Only what changed, for an edit. */
export const memberChangesSchema = memberFieldsSchema.partial();

export type MemberChanges = z.infer<typeof memberChangesSchema>;

/** The form's strings, as the actions take them. */
export function toFields(values: MemberEditValues): MemberFields {
  return {
    fullName: values.fullName.trim(),
    familyName: values.familyName.trim(),
    email: values.email.trim(),
    subFamilyId: Number(values.subFamilyId),
    promotionId: values.promotionId ? Number(values.promotionId) : null,
    bornOn: values.bornOn || null,
    role: values.role,
  };
}
