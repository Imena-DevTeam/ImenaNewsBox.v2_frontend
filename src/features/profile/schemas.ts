import * as z from "zod";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * What a member changes about themselves: the backend's `ProfileUpdate`.
 * Everything else on their account (family name, email, branch, promotion,
 * role) is an administrator's to change.
 */
export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Your name cannot be empty")
    .max(100, "At most 100 characters"),
  bornOn: z
    .string()
    .refine(
      (iso) => !iso || (iso >= "1900-01-01" && iso <= today()),
      "A date between 1900 and today",
    ),
  bio: z.string(),
});

export type ProfileValues = z.infer<typeof profileSchema>;

/** Only what changed, as the action takes it. An empty birthday or bio
    clears it. */
export const profileChangesSchema = z
  .object({
    fullName: z.string().trim().min(1).max(100),
    bornOn: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable(),
    bio: z.string().nullable(),
  })
  .partial();

export type ProfileChanges = z.infer<typeof profileChangesSchema>;

/** The backend's rule for a profile photo, checked before it is sent. It
    checks the content itself, so this is only a courtesy. */
export const PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export const codeSchema = z.string().regex(/^\d{5}$/, "Enter all five digits");
