import { z } from "zod";

/** User login: the family name is the only credential; an OTP follows. */
export const userLoginSchema = z.object({
  name: z.string().trim().min(1, "Family name is required"),
});

/** Admin login: family name plus a password. */
export const adminLoginSchema = z.object({
  name: z.string().trim().min(1, "Family name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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

export type UserLoginValues = z.infer<typeof userLoginSchema>;
export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
export type VerifyValues = z.infer<typeof verifySchema>;
