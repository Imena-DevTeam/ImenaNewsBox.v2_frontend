import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/cn";

export function Container({
  as: Tag = "div",
  className,
  ...props
}: ComponentProps<"div"> & { as?: ElementType }) {
  return (
    <Tag
      className={cn("max-w-page mx-auto w-full px-4 md:px-8", className)}
      {...props}
    />
  );
}
