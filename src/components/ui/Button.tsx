import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "light" | "brand";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-surface hover:bg-primary-hover",
  outline: "border border-border bg-surface text-text hover:border-primary",
  /* On dark or photographic backgrounds. */
  light: "bg-surface text-primary hover:bg-surface/90",
  /* The violet fill of the auth and member frames, and their signature
     hover: the fill and text swap rather than simply darkening, the way
     AuthButton does. The frame around the rest keeps the radius visible. */
  brand:
    "border border-field-border bg-brand text-surface not-disabled:hover:border-brand not-disabled:hover:bg-surface not-disabled:hover:text-brand",
};

const SIZES: Record<Size, string> = {
  sm: "h-control-sm px-5",
  md: "h-control-md px-7",
  lg: "h-control-lg px-8",
};

/* `transition` rather than transition-colors, so a transform added at the
   call site animates instead of snapping.
   Feedback, in order: a band of light sweeps across on hover (shine), a
   trailing icon nudges forward, and the button gives a little under a press.
   Movement is held back under reduced motion; the colour change is not. */
const base =
  "group shine inline-flex items-center justify-center gap-2 rounded-pill text-ui transition-base motion-safe:active:scale-97 disabled:pointer-events-none disabled:opacity-50 [&_svg]:transition-base motion-safe:hover:[&_svg]:translate-x-0.5 motion-safe:hover:[&_svg]:-rotate-6";

type ButtonProps = { variant?: Variant; size?: Size; children: ReactNode };

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps & Omit<ComponentProps<"button">, "children">) {
  return (
    <button
      className={cn(base, VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps & Omit<ComponentProps<typeof Link>, "children">) {
  return (
    <Link
      className={cn(base, VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
