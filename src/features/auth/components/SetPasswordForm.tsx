"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/ui/TextField";
import { ROUTES } from "@/constants/routes";
import { hasApi } from "@/lib/env";
import { ApiError } from "@/types/api";
import { setPasswordSchema, type SetPasswordValues } from "../schemas";
import { AuthButton, AuthButtonLink } from "./AuthButton";

/**
 * Choosing a password: on an administrator's invitation, and on a reset.
 *
 * One component, because they are one act. The two screens differ only in
 * what they say above the fields and what they say when it worked, and
 * those are props — a second copy of this form would be a second place for
 * the confirmation field, the lockout warning and the API-less case to
 * drift apart.
 *
 * > [!IMPORTANT]
 * > The token is sent **as it arrived**. Nothing here reads what is inside
 * > it, and the name shown above the fields came from the server, which
 * > asked the backend what the token was worth. A role read out of a URL is
 * > a role the caller chose — see §17.
 *
 * It issues no session. Setting a password is not signing in: the
 * administrators' door asks for both halves and this form only ever had one.
 */
export function SetPasswordForm({
  intro,
  submitLabel,
  doneTitle,
  doneBody,
  send,
}: {
  intro: ReactNode;
  submitLabel: string;
  doneTitle: string;
  doneBody: string;
  /** The service call. Only reached when a backend is configured. */
  send: (password: string) => Promise<unknown>;
}) {
  const [done, setDone] = useState(false);
  const [stored, setStored] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFailed(null);

    /* With no backend there is nowhere for a password to go. Saying so is
       better than a thrown "NEXT_PUBLIC_API_URL is not set" in front of
       somebody who was asked to choose a password and did. */
    if (!hasApi()) {
      setStored(false);
      setDone(true);
      return;
    }

    try {
      await send(values.password);
      setStored(true);
      setDone(true);
    } catch (error) {
      setFailed(
        error instanceof ApiError
          ? error.message
          : "The password could not be set. Try again in a moment.",
      );
    }
  });

  if (done) {
    return (
      <div className="flex flex-col gap-7">
        {/* No rosette here, deliberately, though /verify has one and this is
            the same kind of moment. SuccessBadge pulls Motion into the
            bundle, and these two pages are **public** and opened once, from
            a link, by somebody who may be on a phone on mobile data: it
            cost 43 kB of first load to say what one sentence and a button
            already say. The rosette stays where it is the climax of
            something — the one-time password — rather than the preamble to
            a link. */}
        <div>
          <p className="text-text text-h4 font-medium">{doneTitle}</p>
          <p className="text-muted text-body mt-2">{doneBody}</p>
          {!stored ? (
            <p className="text-muted text-body mt-3">
              Nothing was stored: the auth service does not exist yet, so this
              password was not saved and no account was changed.
            </p>
          ) : null}
        </div>

        <AuthButtonLink href={ROUTES.ADMIN_LOGIN}>
          Go to admin login
        </AuthButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {intro}

      <TextField
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <TextField
        label="Confirm password"
        type="password"
        placeholder="Type it again"
        autoComplete="new-password"
        error={errors.confirm?.message}
        {...register("confirm")}
      />

      {/* The honest reason the second field is here: a typo is a lockout
          that needs another administrator to undo. */}
      <p className="text-muted text-body">
        Nobody else can see this password, and nobody can tell you what it was.
        If you lose it, another administrator sends you a new link.
      </p>

      <AuthButton type="submit" disabled={isSubmitting} className="mt-6!">
        {submitLabel}
      </AuthButton>

      {failed ? (
        <p role="alert" className="text-danger text-body mt-4 text-center">
          {failed}
        </p>
      ) : null}
    </form>
  );
}
