"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/ui/TextField";
import { ROUTES } from "@/constants/routes";
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
 *
 * TODO: step 4 of CLAUDE.md §23 sends the name through a server action to
 * `POST /auth/reset-requests`. The browser never calls the backend itself,
 * so until then nothing is stored.
 */
export function ForgotPasswordForm() {
  const [asked, setAsked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { name: "" },
  });

  /* Deliberately no error branch. A refusal here would say something about
     the name, and the one thing this screen must not do is tell a stranger
     whether a name is an administrator's. */
  const onSubmit = handleSubmit(() => {
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
          <p className="text-muted text-body mt-3">
            Nothing was stored and no email was sent: this screen is not
            connected to the server yet.
          </p>
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
