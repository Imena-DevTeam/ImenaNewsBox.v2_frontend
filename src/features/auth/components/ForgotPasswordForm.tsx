"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/ui/TextField";
import { askForPasswordReset } from "@/app/actions/reset-requests";
import { ROUTES } from "@/constants/routes";
import { forgotPasswordSchema, type ForgotPasswordValues } from "../schemas";
import { AuthButton, AuthButtonLink } from "./AuthButton";
import { AuthSwitch } from "./AuthSwitch";

/**
 * An administrator who cannot get in.
 *
 * The family's answer is a person rather than an inbox: asking here tells
 * the **other** administrators (`POST /auth/reset-requests`), and one of
 * them sends a link from /admin. That is why the backend keeps at least two.
 *
 * > [!IMPORTANT]
 * > There is no email field. The link goes to the address already on the
 * > account: an address typed here would let anybody redirect somebody
 * > else's reset.
 *
 * The backend answers every name with the same words, and they are shown as
 * they are, so this screen never says whether a name is an administrator's.
 * The only other answer is a failure to reach the server, which says
 * nothing about the name either.
 */
export function ForgotPasswordForm() {
  const [asked, setAsked] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFailed(null);
    const outcome = await askForPasswordReset(values.name).catch(() => null);
    if (outcome?.ok) setAsked(outcome.message);
    else
      setFailed(
        outcome?.message ??
          "We could not reach the server. Try again in a moment.",
      );
  });

  if (asked) {
    return (
      <div className="flex flex-col gap-7">
        <div>
          <p className="text-text text-h4 font-medium">Request received.</p>
          <p className="text-muted text-body mt-3">{asked}</p>
        </div>

        <AuthButtonLink variant="outline" href={ROUTES.ADMIN_LOGIN}>
          Back to admin login
        </AuthButtonLink>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <p className="text-muted text-body">
          Give your family name and the other administrators will be asked. When
          one of them answers, a link to set a new password arrives at the
          address on your account.
        </p>

        <TextField
          label="Name"
          placeholder="Enter family name"
          autoComplete="username"
          error={errors.name?.message}
          {...register("name")}
        />

        <AuthButton type="submit" disabled={isSubmitting} className="mt-6!">
          Ask for a reset
        </AuthButton>

        {failed ? (
          <p role="alert" className="text-danger text-body mt-4 text-center">
            {failed}
          </p>
        ) : null}
      </form>

      <AuthSwitch
        prompt="Remembered it?"
        href={ROUTES.ADMIN_LOGIN}
        label="Admin log in"
      />
    </>
  );
}
