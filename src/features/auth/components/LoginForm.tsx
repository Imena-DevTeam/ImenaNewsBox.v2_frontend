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
 * The family's one login: a name, then an emailed one-time password.
 *
 * The name decides what you land with. The register holds one blogger, and
 * typing her name signs her in as one, which puts the studio in her rail —
 * see features/auth/roles.ts. Everybody else lands as a member. Nothing here
 * grants an administrator anything: that door asks for a password.
 *
 * The lookup happens on the **server**, in beginMemberLogin, and the answer
 * is held in a signed cookie the browser cannot write. It used to be decided
 * here and passed on in the query string, which meant the address bar
 * decided what you were — /verify?role=admin and any five digits made you an
 * administrator. Nothing about the role travels in a URL now.
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

  // TODO: swap for the real auth call; the API will supply the address the
  // one-time password was sent to, which /verify renders.
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
          autoComplete="organization"
          error={errors.name?.message}
          {...register("name")}
        />

        <AuthButton type="submit" disabled={isSubmitting} className="mt-6">
          Log In
        </AuthButton>

        {failed ? (
          <p role="alert" className="text-danger mt-4 text-center text-base">
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
