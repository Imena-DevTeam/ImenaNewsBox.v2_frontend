import { z } from "zod";
import { TRINITY } from "@/features/families/data";

const BRANCH_SLUGS = TRINITY.map((family) => family.slug) as [
  string,
  ...string[],
];

/**
 * Edit a person already in the register, or add one.
 *
 * Email is required: a record being edited has an address, and that address
 * is how the person signs in. It was optional on the form this replaces,
 * which could store a person nobody could ever sign in as.
 * Uniqueness is checked against everyone else, because two people sharing
 * one address is a broken login rather than an untidy register.
 *
 * `bornOn` stays optional. Four people in the register have none, and
 * forcing a date in before an email can be corrected would be a trap; the
 * table marks the gap instead.
 */
export function memberEditSchema(takenEmails: string[]) {
  const taken = new Set(takenEmails.map((email) => email.toLowerCase()));

  return z.object({
    fullName: z.string().trim().min(1, "The member needs a name"),
    email: z
      .string()
      .trim()
      .min(1, "An email address is how they sign in")
      .email("That does not look like an email address")
      .refine(
        (email) => !taken.has(email.toLowerCase()),
        "Somebody else in the register already uses that address",
      ),
    branch: z.enum(BRANCH_SLUGS, { message: "Choose a family branch" }),
    bornOn: z.string(),
    role: z.enum(["member", "admin", "blogger"], {
      message: "Choose a role",
    }),
    status: z.enum(["active", "invited", "suspended"], {
      message: "Choose a status",
    }),
  });
}

export type MemberEditValues = z.infer<ReturnType<typeof memberEditSchema>>;
