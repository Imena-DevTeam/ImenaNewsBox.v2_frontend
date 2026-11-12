import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/* The Our Story design runs wider than the rest of the site: 1350px of
   content at 1440px, so a 45px margin each side. */
export function StoryContainer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("max-w-story mx-auto w-full px-4 md:px-8", className)}
      {...props}
    />
  );
}
