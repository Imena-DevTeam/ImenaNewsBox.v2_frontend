"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

type TextFieldProps = Omit<React.ComponentPropsWithoutRef<"input">, "id"> & {
  label: string;
  error?: string;
};

/**
 * Labelled auth input — 20px muted label above a 48px tall, 15px radius field.
 */
export function TextField({
  label,
  error,
  className,
  ref,
  ...props
}: TextFieldProps & { ref?: React.Ref<HTMLInputElement> }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="w-full">
      <label htmlFor={id} className="text-muted block text-xl">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "border-field-border mt-1.5 h-12 w-full rounded-[15px] border bg-white px-4 text-base text-black",
          "placeholder:text-muted focus:border-brand focus:ring-brand/30 focus:ring-2 focus:outline-none",
          error && "border-red-500",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
