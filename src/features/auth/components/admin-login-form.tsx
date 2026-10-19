"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { adminLoginSchema, type AdminLoginValues } from "../schemas";
import { GoogleButton } from "./google-button";
import { OrDivider } from "./or-divider";

/** Admin login: family name plus password. */
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
    router.push("/verify");
  });

  return (
    <div className="w-full">
      <h1 className="font-display text-[clamp(28px,4.6dvh,36px)] leading-[normal] font-bold text-black lg:whitespace-nowrap">
        Dear Admin,
        <br />
        Welcome back,
        <br />
        Login to catch up
      </h1>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-[clamp(12px,3dvh,28px)] max-w-[343px] space-y-[clamp(10px,2.2dvh,22px)]"
      >
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="!mt-[clamp(10px,2.2dvh,22px)]"
        >
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
