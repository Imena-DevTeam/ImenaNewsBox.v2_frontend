"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { TextField } from "@/components/ui/TextField";
import { ROUTES } from "@/constants/routes";
import { RETURN_PARAM } from "@/lib/session";
import { beginMemberLogin } from "@/app/actions/session";
import { userLoginSchema, type UserLoginValues } from "../schemas";
import { AuthButton } from "./AuthButton";
import { AuthSwitch } from "./AuthSwitch";
import { GoogleButton } from "./GoogleButton";
import { OrDivider } from "./OrDivider";

/**
 * The family's one login: a family name, then an emailed code.
 *
 * The name goes to the server, never anywhere else: `beginMemberLogin`
 * asks the backend to email a code (or, in fixture mode, asks the sample
 * register what the name is), and holds the login in a signed cookie the
 * browser cannot write. What the person is — member, social media manager,
 * administrator — is the backend's answer after the code, never something
 * this form or the URL decides.
 */
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [failed, setFailed] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginValues>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: { name: "" },
  });

  /* Carry on to wherever the member was headed when the gate stopped them.
     The destination is the only thing worth putting in the URL: it decides
     where you land, not what you are allowed to do there. */
  const onSubmit = handleSubmit(async (values) => {
    setFailed(null);

    const outcome = await beginMemberLogin(values.name);
    if (!outcome.ok) {
      setFailed(outcome.message);
      return;
    }

    const query = new URLSearchParams();
    const next = params.get(RETURN_PARAM);
    if (next) query.set(RETURN_PARAM, next);

    const search = query.toString();
    router.push(search ? `${ROUTES.VERIFY}?${search}` : ROUTES.VERIFY);
  });

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        <TextField
          label="Name"
          placeholder="Enter family name"
          autoComplete="username"
          error={errors.name?.message}
          {...register("name")}
        />

        <AuthButton type="submit" disabled={isSubmitting} className="mt-6">
          Log in
        </AuthButton>

        {failed ? (
          <p role="alert" className="text-danger text-body mt-4 text-center">
            {failed}
          </p>
        ) : null}
      </form>

      <OrDivider />
      <GoogleButton />

      <AuthSwitch
        prompt="Family admin?"
        href={ROUTES.ADMIN_LOGIN}
        label="Log in here"
      />
    </>
  );
}
