"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  error?: string;
  icon?: ReactNode;
};

/**
 * Labelled input — a 48px rounded white field with an optional leading icon.
 * An error turns the border red. Password fields get a show/hide toggle.
 *
 * Focus darkens the border **and** keeps the outline globals.css gives every
 * focusable thing. The outline was turned off here, leaving a 1px border
 * going from one grey to a slightly darker grey as the only sign of where
 * the keyboard was — on the fields that matter most, and nowhere near
 * enough to see.
 */
export function TextField({
  label,
  error,
  icon,
  type,
  className,
  ...props
}: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <div
        className={cn(
          "rounded-field bg-surface transition-fast relative flex items-center border",
          error
            ? "border-danger"
            : "border-field-border focus-within:border-muted",
        )}
      >
        {icon ? (
          <span className="text-muted pointer-events-none pl-4 [&_svg]:size-5">
            {icon}
          </span>
        ) : null}

        <input
          id={id}
          type={isPassword && revealed ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "rounded-field text-text placeholder:text-field-placeholder h-12 w-full min-w-0 bg-transparent px-4 text-base",
            className,
          )}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            className="text-muted mr-2 flex size-10 shrink-0 items-center justify-center rounded-xl"
          >
            {revealed ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-danger mt-1.5 text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
