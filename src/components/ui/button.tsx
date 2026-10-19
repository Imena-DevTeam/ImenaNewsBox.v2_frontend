import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "social";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

/**
 * Auth action button — 48px tall, 15px radius, full width of the form column.
 * `primary` is the brand fill, `social` is the black OAuth pill.
 */
const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  social: "bg-black text-white hover:bg-neutral-800",
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "border-field-border flex h-12 w-full items-center justify-center gap-2.5 rounded-[15px] border text-xl transition-colors",
        "focus-visible:ring-brand focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
