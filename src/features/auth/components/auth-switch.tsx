import Link from "next/link";

type AuthSwitchProps = {
  prompt: string;
  href: string;
  label: string;
};

/** Small line under the auth buttons linking the user and admin logins. */
export function AuthSwitch({ prompt, href, label }: AuthSwitchProps) {
  return (
    <p className="text-muted mt-[clamp(16px,3dvh,28px)] text-center text-base">
      {prompt}{" "}
      <Link
        href={href}
        className="text-brand hover:text-brand-hover focus-visible:ring-brand rounded-sm font-medium underline-offset-4 transition-colors duration-300 ease-out hover:underline focus-visible:ring-2 focus-visible:outline-none"
      >
        {label}
      </Link>
    </p>
  );
}
