"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

type TextFieldProps = Omit<React.ComponentPropsWithoutRef<"input">, "id"> & {
  label: string;
  error?: string;
  icon?: React.ReactNode;
};

/**
 * Labelled auth input — a 48px rounded white field with an optional leading
 * icon. Focus only darkens the border; an error turns it red. Password fields
 * get a show/hide toggle.
 */
export function TextField({
  label,
  error,
  icon,
  type,
  className,
  ref,
  ...props
}: TextFieldProps & { ref?: React.Ref<HTMLInputElement> }) {
  const id = useId();
  const errorId = `${id}-error`;
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-neutral-700"
      >
        {label}
      </label>

      <div
        className={cn(
          "rounded-field relative flex items-center border bg-white",
          error
            ? "border-red-500"
            : "border-field-border focus-within:border-neutral-500",
        )}
      >
        {icon ? (
          <span className="pointer-events-none pl-4 text-neutral-400 [&_svg]:size-5">
            {icon}
          </span>
        ) : null}

        <input
          id={id}
          ref={ref}
          type={isPassword && revealed ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "rounded-field h-12 w-full min-w-0 bg-transparent px-4 text-base text-black focus:outline-none",
            "placeholder:text-placeholder",
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
            className="focus-visible:ring-brand mr-2 flex size-10 shrink-0 items-center justify-center rounded-xl text-neutral-400 focus-visible:ring-2 focus-visible:outline-none"
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
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
