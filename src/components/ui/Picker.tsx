"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/** The shared shape of the controls that sit above a list: the search field
    and the pickers are the same height and the same radius. */
export const CONTROL =
  "rounded-pill bg-surface border-member-border text-body-sm transition-fast hover:border-brand h-11 border px-4";

/**
 * A dropdown that is as wide as the option showing in it.
 *
 * A native <select> sizes itself to its *longest* option, so "All
 * categories" sat in a box built for "Remembering (Kwibuka)" and its chevron
 * drifted an inch from the label while a narrower neighbour hugged its own.
 * `field-sizing: content` sizes the control to the option actually showing,
 * which is what makes a row of these read as evenly spaced.
 *
 * It needs the browser's arrow gone — `appearance-none` — because that arrow
 * brings its own margin and differs between engines. The chevron is drawn
 * here instead, always the same distance from the edge. Where `field-sizing`
 * is unsupported the control falls back to its old width; nothing breaks.
 *
 * This lived inside PostsArchive until the members table needed the same
 * three dropdowns. It is in components/ui because the bug it fixes should be
 * fixed in exactly one place.
 */
export function Picker({
  id,
  label,
  value,
  onChange,
  className,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          CONTROL,
          "field-sizing-content appearance-none pr-11",
          className,
        )}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="text-muted pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
      />
    </div>
  );
}
