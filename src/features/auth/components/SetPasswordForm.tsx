"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/ui/TextField";
import { setPasswordSchema, type SetPasswordValues } from "../schemas";
import { AuthButton, AuthButtonLink } from "./AuthButton";

/** What sending the password came to. A server action cannot throw an
    error the browser can read, so a refusal is a value. */
export type PasswordSent = { ok: true } | { ok: false; message: string };

/**
 * Choosing an administrator's password, from an invitation link: the first
 * one, or a new one after a reset request (the backend sends the same link
 * for both).
 *
 * It issues no session. Setting a password is not signing in: the
 * administrators' door asks for the password and an emailed code, and this
 * form only ever had the first.
 */
export function SetPasswordForm({
  intro,
  submitLabel,
  doneTitle,
  doneBody,
  doneHref,
  doneLabel,
  send,
}: {
  intro: ReactNode;
  submitLabel: string;
  doneTitle: string;
  doneBody: string;
  /** Where the person goes next: the administrators' login. */
  doneHref: string;
  doneLabel: string;
  /** A server action that stores the password. */
  send: (password: string) => Promise<PasswordSent>;
}) {
  const [done, setDone] = useState(false);
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
    try {
      const sent = await send(values.password);
      if (sent.ok) setDone(true);
      else setFailed(sent.message);
    } catch {
      setFailed("The password could not be set. Try again in a moment.");
    }
  });

  if (done) {
    return (
      <div className="flex flex-col gap-7">
        {/* No rosette here, deliberately, though /verify has one and this is
            the same kind of moment. SuccessBadge pulls Motion into the
            bundle, and this page is **public** and opened once, from a
            link, by somebody who may be on a phone on mobile data: it cost
            43 kB of first load to say what one sentence and a button
            already say. */}
        <div role="status">
          <p className="text-text text-h4 font-medium">{doneTitle}</p>
          <p className="text-muted text-body mt-2">{doneBody}</p>
        </div>

        <AuthButtonLink href={doneHref}>{doneLabel}</AuthButtonLink>
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
