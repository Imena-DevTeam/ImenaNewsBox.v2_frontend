"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/ui/TextField";
import { ROUTES } from "@/constants/routes";
import { hasApi } from "@/lib/env";
import { authService } from "@/services/auth.service";
import { forgotPasswordSchema, type ForgotPasswordValues } from "../schemas";
import { AuthButton, AuthButtonLink } from "./AuthButton";
import { AuthSwitch } from "./AuthSwitch";

/**
 * An administrator who cannot get in.
 *
 * The family's answer is a person rather than an inbox: asking here tells
 * the **other** administrators, and one of them sends the link. That is why
 * there have to be at least two — see `MIN_ADMINS`.
 *
 * > [!IMPORTANT]
 * > There is no email field, and there is no "we have sent you an email".
 * > The link goes to the address already on the record. An address typed
 * > here would let anybody redirect somebody else's reset, and the whole
 * > protection in this flow is that the destination was decided before the
 * > request was made.
 *
 * It answers the same way whoever asks, so it cannot be used to find out
 * which of seventy-three people is an administrator. The register is
 * readable by anyone who can see the site; which rows hold the role is not.
 */
export function ForgotPasswordForm() {
  const [asked, setAsked] = useState(false);
  const [stored, setStored] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    /* Deliberately no error branch worth showing. A refusal here would say
       something about the name, and the one thing this screen must not do
       is tell a stranger whether a name is an administrator's. */
    if (hasApi()) {
      try {
        await authService.forgotPassword(values.name);
        setStored(true);
      } catch {
        /* Same answer either way. A reset that failed on the server is
           reported by the silence: no link arrives, and the administrator
           asks in person, which is what this flow was always going to come
           down to. */
      }
    }
    setAsked(true);
  });

  if (asked) {
    return (
      <div className="flex flex-col gap-7">
        <div>
          <p className="text-text text-h4 font-medium">
            The other administrators have been told.
          </p>
          <p className="text-muted text-body mt-3">
            If that name belongs to an administrator, one of them can now send
            you a reset link. It goes to the address already on your record —
            not to one typed here — so check that inbox.
          </p>
          {!stored ? (
            <p className="text-muted text-body mt-3">
              Nothing was stored and no email was sent: the auth service does
              not exist yet.
            </p>
          ) : null}
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
          Give your name and the other administrators will be told. One of them
          sends you a link to the address on your record.
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
      </form>

      <AuthSwitch
        prompt="Remembered it?"
        href={ROUTES.ADMIN_LOGIN}
        label="Admin log in"
      />
    </>
  );
}
