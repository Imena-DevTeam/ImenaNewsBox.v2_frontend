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
    <>
      <form onSubmit={onSubmit} noValidate>
        <TextField
          label="Name"
          placeholder="Enter family name"
          autoComplete="organization"
          error={errors.name?.message}
          {...register("name")}
        />

        <Button type="submit" disabled={isSubmitting} className="mt-6">
          Log In
        </Button>
      </form>

      <OrDivider />
      <GoogleButton />
    </>
  );
}
