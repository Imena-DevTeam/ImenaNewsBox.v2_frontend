"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/ui/TextField";
import { ROUTES } from "@/constants/routes";
import { RETURN_PARAM } from "@/lib/session";
import { userLoginSchema, type UserLoginValues } from "../schemas";
import { AuthButton } from "./AuthButton";
import { AuthSwitch } from "./AuthSwitch";
import { GoogleButton } from "./GoogleButton";
import { OrDivider } from "./OrDivider";

/** Family-member login: a family name, then an emailed one-time password. */
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
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
  /* Carry on to wherever the member was headed when the gate stopped them. */
  const onSubmit = handleSubmit(() => {
    const next = params.get(RETURN_PARAM);
    router.push(
      next
        ? `${ROUTES.VERIFY}?${RETURN_PARAM}=${encodeURIComponent(next)}`
        : ROUTES.VERIFY,
    );
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
