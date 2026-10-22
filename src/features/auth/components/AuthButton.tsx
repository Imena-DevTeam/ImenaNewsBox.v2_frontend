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
        "rounded-field transition-base flex h-12 w-full items-center justify-center gap-2.5 border text-base font-medium",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
