import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "social";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

/**
 * Auth action button — 48px tall, 15px radius, full width of the form column.
 * `primary` is the brand fill, `social` is the black OAuth pill. On hover
 * both swap fill and text colour.
 */
const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white enabled:hover:border-brand enabled:hover:bg-white enabled:hover:text-brand",
  social:
    "bg-black text-white enabled:hover:border-black enabled:hover:bg-white enabled:hover:text-black",
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
        "border-field-border flex h-12 w-full items-center justify-center gap-2.5 rounded-[15px] border text-xl font-medium transition-colors duration-300 ease-out",
        "focus-visible:ring-brand focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
