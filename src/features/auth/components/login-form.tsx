"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { userLoginSchema, type UserLoginValues } from "../schemas";
import { GoogleButton } from "./google-button";
import { OrDivider } from "./or-divider";

/** Family-member login: a family name, then an emailed one-time password. */
export function LoginForm() {
  const router = useRouter();
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
  const onSubmit = handleSubmit(() => {
    router.push("/verify");
  });

  return (
    <div className="w-full">
      <h1 className="font-display text-[36px] leading-tight font-bold text-black lg:whitespace-nowrap">
        Welcome back,
        <br />
        Login to catch up
      </h1>

      <form onSubmit={onSubmit} noValidate className="mt-[72px] max-w-[343px]">
        <TextField
          label="Name"
          placeholder="Enter family name"
          autoComplete="organization"
          error={errors.name?.message}
          {...register("name")}
        />

        <Button type="submit" disabled={isSubmitting} className="mt-[19px]">
          Log In
        </Button>
      </form>

      <div className="max-w-[343px]">
        <OrDivider />
        <GoogleButton />
      </div>
    </div>
  );
}
