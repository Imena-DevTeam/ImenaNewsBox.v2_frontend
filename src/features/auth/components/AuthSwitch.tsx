import Link from "next/link";

type AuthSwitchProps = {
  prompt: string;
  href: string;
  label: string;
};

/** Small line under the auth buttons linking the member and admin logins. */
export function AuthSwitch({ prompt, href, label }: AuthSwitchProps) {
  return (
    <p className="text-muted mt-auth-md text-center text-base">
      {prompt}{" "}
      <Link
        href={href}
        className="text-brand hover:text-brand-hover transition-fast rounded-sm font-medium underline-offset-4 hover:underline"
      >
        {label}
      </Link>
    </p>
  );
}
