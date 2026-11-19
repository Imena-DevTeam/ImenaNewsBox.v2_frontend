import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline";

/* `primary` is the brand fill, `outline` the white button with a black border
   used for Google sign-in. On hover both swap fill and text colour. */
const VARIANTS: Record<Variant, string> = {
  primary:
    "border-field-border bg-brand text-surface not-disabled:hover:border-brand not-disabled:hover:bg-surface not-disabled:hover:text-brand",
  outline:
    "border-text bg-surface text-text not-disabled:hover:bg-text not-disabled:hover:text-surface",
};

const BASE =
  "rounded-field transition-base flex h-12 w-full items-center justify-center gap-2.5 border text-body font-medium";

/**
 * The full-width, 48px action button of the auth forms. It is not the shared
 * Button: the auth frames use a squarer radius and the violet brand fill.
 */
export function AuthButton({
  variant = "primary",
  type = "button",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={cn(
        BASE,
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}

/**
 * The same button, as a link.
 *
 * The invitation pages end in a destination rather than an action — **Go to
 * login** is a journey, not a submit — and a link is what a person expects
 * to be able to open in a new tab or come back to.
 */
export function AuthButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(BASE, VARIANTS[variant], className)} {...props} />;
}
