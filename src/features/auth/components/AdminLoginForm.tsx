"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { TextField } from "@/components/ui/TextField";
import { ROUTES } from "@/constants/routes";
import { RETURN_PARAM } from "@/lib/session";
import { beginAdminLogin } from "@/app/actions/session";
import { adminLoginSchema, type AdminLoginValues } from "../schemas";
import { AuthButton } from "./AuthButton";
import { AuthSwitch } from "./AuthSwitch";
import { GoogleButton } from "./GoogleButton";
import { OrDivider } from "./OrDivider";

/**
 * Admin login: the family name, a password, then the same emailed code.
 *
 * The field was an email address for a day, on the reasoning that a name
 * seventy-three people share cannot identify one administrator. The design
 * asks for a name on both doors, so it is a name again — but the objection
 * stands, which is why `checkAdminCredential` looks it up in the register
 * and requires the person it finds to be an administrator. The password is
 * what makes this a credential.
 *
 * It threw away where the administrator was going. The middleware sends
 * anyone without an admin session here carrying ?next=, and the member login
 * has always forwarded it — this one did not, so being stopped on the way to
 * /admin/members landed you on /admin and you had to find your way back.
 *
 * It also threw away the credential. handleSubmit ignored its values
 * entirely and pushed /verify?role=admin, so the password was validated for
 * shape and never read, and the URL it pushed was one anybody could type.
 * Both fields now go to beginAdminLogin, which checks them on the server
 * before anything is held.
 */
export function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [failed, setFailed] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { name: "", password: "" },
  });

  /* Only ever a path on this site, checked again in VerifyPanel. */
  const requested = params.get(RETURN_PARAM) ?? "";
  const next =
    requested.startsWith("/") && !requested.startsWith("//") ? requested : null;

  // TODO: swap for the real auth call; the API will supply the address the
  // one-time password was sent to, which /verify renders.
  const onSubmit = handleSubmit(async (values) => {
    setFailed(null);

    const outcome = await beginAdminLogin(values.name, values.password);
    if (!outcome.ok) {
      setFailed(outcome.message);
      return;
    }

    /* `from` chooses the back link on the verify screen and nothing else.
       The role is in a signed cookie beginAdminLogin set; this is a
       breadcrumb, not a credential. */
    const query = new URLSearchParams({ from: "admin" });
    if (next) query.set(RETURN_PARAM, next);
    router.push(`${ROUTES.VERIFY}?${query}`);
  });

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <TextField
          label="Name"
          placeholder="Enter family name"
          autoComplete="username"
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
        {failed ? (
          <p role="alert" className="text-danger mt-4 text-center text-base">
            {failed}
          </p>
        ) : null}
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
