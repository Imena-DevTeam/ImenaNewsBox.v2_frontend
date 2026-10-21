import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signIn } from "@/app/actions/login";
import { LoginButtons } from "@/features/auth/components/LoginButtons";
import { HeartsOrnament } from "@/features/story/components/Ornaments";
import { ROUTES } from "@/constants/routes";

/* The design sets the placeholder at #c3c2c2 and the labels at #a8a8a8,
   which land near 1.9:1 and 2.3:1 on white. Both take --color-muted here so
   they clear AA; the labels sit above the fields either way, so nothing is
   carried by the placeholder alone.

   The focus ring matches the verification boxes: a border colour change on
   its own is easy to miss when tabbing through. */
const field =
  "border-border bg-surface text-body h-control-lg placeholder:text-muted focus:border-heading focus:ring-heading/25 transition-fast mt-2 w-full rounded-md border px-4 outline-none focus:ring-4";

export function LoginForm({ audience }: { audience: string }) {
  return (
    <div className="relative">
      <HeartsOrnament className="absolute top-6 -left-4 hidden w-20 md:block" />

      <div className="relative mx-auto w-full max-w-sm pt-24 md:pt-28">
        <h1 className="text-h1-m md:text-h1">
          Dear {audience},
          <br />
          Welcome back!
        </h1>

        {/* A real form on a server action: Enter in any field signs in, and it
            still submits with JavaScript turned off. The divider and the
            Google button live inside it too, so that button can submit rather
            than sit there inert. */}
        <form action={signIn} className="mt-10">
          <div>
            <label htmlFor="login-name" className="text-body text-muted">
              Name
            </label>
            <input
              id="login-name"
              name="name"
              autoComplete="username"
              autoFocus
              placeholder="Enter family name"
              className={field}
            />
          </div>

          <div className="mt-6">
            <label htmlFor="login-password" className="text-body text-muted">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              className={field}
            />
          </div>

          <LoginButtons />
        </form>
      </div>
    </div>
  );
}

export function BackToHome() {
  return (
    <Link
      href={ROUTES.HOME}
      className="border-border text-ui hover:border-heading h-control-md transition-fast rounded-pill inline-flex items-center gap-3 border px-5"
    >
      <ArrowLeft className="size-4" />
      Back To Home
    </Link>
  );
}
