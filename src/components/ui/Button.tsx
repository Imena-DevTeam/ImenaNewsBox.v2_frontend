import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "light";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-surface hover:bg-primary-hover",
  outline: "border border-border bg-surface text-text hover:border-primary",
  /* On dark or photographic backgrounds. */
  light: "bg-surface text-primary hover:bg-surface/90",
};

const SIZES: Record<Size, string> = {
  sm: "h-control-sm px-5",
  md: "h-control-md px-7",
  lg: "h-control-lg px-8",
};

/* `transition` rather than transition-colors, so a transform added at the
   call site animates instead of snapping. */
const base =
  "inline-flex items-center justify-center gap-2 rounded-pill text-ui transition-fast disabled:pointer-events-none disabled:opacity-50";

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
