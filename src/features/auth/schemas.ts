import * as z from "zod";

/** User login: the family name is the only credential; an OTP follows. */
export const userLoginSchema = z.object({
  name: z.string().trim().min(1, "Family name is required"),
});

/**
 * Admin login: the family name, plus a password.
 *
 * It asked for an email address between 11 and 12 Nov 2026, on the reasoning
 * that a name seventy-three people share cannot identify one administrator.
 * The design asks for a name on both doors and the design wins — but the
 * objection was real, so the name is not waved through: `checkAdminCredential`
 * looks it up in the register and the person it finds has to hold the
 * administrator role. **The password is what makes it a credential.**
 */
export const adminLoginSchema = z.object({
  name: z.string().trim().min(1, "Family name is required"),
  /* Any length: the backend checks it, and a password set before the
     eight-character rule must still open the door. */
  password: z.string().min(1, "Password is required"),
});

/** One-time password sent to the account's email. */
export const OTP_LENGTH = 5;

export const verifySchema = z.object({
  code: z
    .string()
    .regex(
      new RegExp(String.raw`^\d{${OTP_LENGTH}}$`),
      `Enter the ${OTP_LENGTH}-digit code`,
    ),
});

/**
 * A new administrator password: 8 to 256 characters, the backend's rule for
 * accepting an invitation (`POST /auth/invitations/accept`). The server
 * action checks it again, since anyone can call one.
 */
export const newPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(256, "Password must be at most 256 characters");

/**
 * Setting a password, from an administrator's invitation link. The backend
 * sends the same link when another administrator answers a reset request,
 * so this is also how a forgotten password is replaced.
 *
 * The confirmation field is not ceremony: this is the only time the
 * password is typed before it is needed, so a typo here is a lockout that
 * needs another administrator to undo.
 */
export const setPasswordSchema = z
  .object({
    password: newPasswordSchema,
    confirm: z.string().min(1, "Type the password again"),
  })
  /* On the confirmation field, so the message appears under the field that
     is wrong rather than at the top of the form. */
  .refine((values) => values.password === values.confirm, {
    message: "The two passwords are not the same",
    path: ["confirm"],
  });

/**
 * Asking for a new password: a name, and nothing else.
 *
 * No email field, deliberately. The link goes to the address already on the
 * record — an address typed here would let anybody redirect somebody else's
 * reset, which is a takeover with extra steps.
 */
export const forgotPasswordSchema = z.object({
  name: z.string().trim().min(1, "Family name is required"),
});

export type UserLoginValues = z.infer<typeof userLoginSchema>;
export type SetPasswordValues = z.infer<typeof setPasswordSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
export type VerifyValues = z.infer<typeof verifySchema>;
