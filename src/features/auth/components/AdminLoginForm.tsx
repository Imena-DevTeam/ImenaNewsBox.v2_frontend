"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/ui/TextField";
import { ROUTES } from "@/constants/routes";
import { adminLoginSchema, type AdminLoginValues } from "../schemas";
import { AuthButton } from "./AuthButton";
import { AuthSwitch } from "./AuthSwitch";
import { GoogleButton } from "./GoogleButton";
import { OrDivider } from "./OrDivider";

/** Admin login: family name plus password, then the same emailed code. */
export function AdminLoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { name: "", password: "" },
  });

  // TODO: swap for the real auth call; the API will supply the address the
  // one-time password was sent to, which /verify renders.
  const onSubmit = handleSubmit(() => {
    router.push(`${ROUTES.VERIFY}?role=admin`);
  });

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <TextField
          label="Name"
          placeholder="Enter family name"
          autoComplete="organization"
          error={errors.name?.message}
          {...register("name")}
        />

        <TextField
          label="Password"
          type="password"
          placeholder="Enter password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <AuthButton type="submit" disabled={isSubmitting} className="mt-6!">
          Log In
        </AuthButton>
      </form>

      <OrDivider />
      <GoogleButton />

      <AuthSwitch
        prompt="Not an admin?"
        href={ROUTES.LOGIN}
        label="Member log in"
      />
    </>
  );
}
