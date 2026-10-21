import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HeartsOrnament } from "@/features/story/components/Ornaments";
import { ROUTES } from "@/constants/routes";

/** Google's mark. lucide-react no longer ships brand icons. */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.4 14.4 0 0 1 9.77 24c0-1.6.27-3.15.76-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.88.93 7.54 2.56 10.78l7.97-6.19Z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
    </svg>
  );
}

/* The design sets the placeholder at #c3c2c2 and the labels at #a8a8a8,
   which land near 1.9:1 and 2.3:1 on white. Both take --color-muted here so
   they clear AA; the labels sit above the fields either way, so nothing is
   carried by the placeholder alone. */
const field =
  "border-border bg-surface text-body h-control-lg placeholder:text-muted focus:border-heading transition-fast mt-2 w-full rounded-md border px-4 outline-none";

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

        <form className="mt-10">
          <div>
            <label htmlFor="login-name" className="text-body text-muted">
              Name
            </label>
            <input
              id="login-name"
              name="name"
              autoComplete="username"
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

          {/* Sign-in has no backend yet, so this goes to the step that does:
              the one-time code. */}
          <Link
            href={ROUTES.VERIFY}
            className="bg-heading text-surface hover:bg-heading/90 h-control-lg text-ui transition-fast mt-8 flex w-full items-center justify-center rounded-md"
          >
            Log In
          </Link>
        </form>

        <div className="text-body text-muted mt-6 flex items-center gap-4">
          <span className="border-border h-px flex-1 border-t" aria-hidden />
          OR
          <span className="border-border h-px flex-1 border-t" aria-hidden />
        </div>

        <button
          type="button"
          className="border-border bg-surface text-ui hover:border-heading h-control-lg transition-fast mt-6 flex w-full items-center justify-center gap-3 rounded-md border"
        >
          <GoogleIcon className="size-5" />
          Continue with Google
        </button>
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
