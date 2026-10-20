import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "outline";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

/**
 * `primary` is the brand fill, `outline` the white button with a black
 * border used for Google sign-in. On hover both swap fill and text colour.
 */
const variants: Record<ButtonVariant, string> = {
  primary:
    "border-field-border bg-brand text-white not-disabled:hover:border-brand not-disabled:hover:bg-white not-disabled:hover:text-brand",
  outline:
    "border-black bg-white text-black not-disabled:hover:bg-black not-disabled:hover:text-white",
};

/**
 * Auth action button classes — 48px tall, full width of the form column.
 * Shared with links that should look like buttons.
 */
export function buttonClasses(variant: ButtonVariant = "primary") {
  return cn(
    "flex h-12 w-full items-center justify-center gap-2.5 rounded-field border text-base font-medium transition-colors duration-300 ease-out",
    "focus-visible:ring-brand focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
  );
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonClasses(variant), className)}
      {...props}
    />
  );
}
