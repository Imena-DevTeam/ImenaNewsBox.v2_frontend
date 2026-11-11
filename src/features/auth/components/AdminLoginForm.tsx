"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/ui/TextField";
import { ROUTES } from "@/constants/routes";
import { RETURN_PARAM } from "@/lib/session";
import { adminLoginSchema, type AdminLoginValues } from "../schemas";
import { AuthButton } from "./AuthButton";
import { AuthSwitch } from "./AuthSwitch";
import { GoogleButton } from "./GoogleButton";
import { OrDivider } from "./OrDivider";

/**
 * Admin login: the address in the register, a password, then the same emailed
 * code.
 *
 * It threw away where the administrator was going. The middleware sends
 * anyone without an admin session here carrying ?next=, and the member login
 * has always forwarded it — this one did not, so being stopped on the way to
 * /admin/members landed you on /admin and you had to find your way back.
 */
export function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  /* Only ever a path on this site, checked again in VerifyPanel. */
  const requested = params.get(RETURN_PARAM) ?? "";
  const next =
    requested.startsWith("/") && !requested.startsWith("//") ? requested : null;

  // TODO: swap for the real auth call; the API will supply the address the
  // one-time password was sent to, which /verify renders.
  const onSubmit = handleSubmit(() => {
    const query = new URLSearchParams({ role: "admin" });
    if (next) query.set(RETURN_PARAM, next);
    router.push(`${ROUTES.VERIFY}?${query}`);
  });

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <TextField
          label="Email address"
          type="email"
          placeholder="you@imenafamily.rw"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
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

      {/* Where they were going before the gate stopped them, so the extra
          step reads as a detour rather than a dead end. */}
      {next ? (
        <p className="text-muted mt-4 text-center text-base">
          You will carry on to{" "}
          <span className="text-member-ink font-medium">{next}</span>.
        </p>
      ) : null}

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
