import Image from "next/image";
import { cn } from "@/lib/cn";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * A relative's face: their portrait when the register holds one, their
 * initials when it does not. Decorative beside a name, so it carries no alt
 * text of its own unless asked to.
 */
export function PersonAvatar({
  name,
  photo,
  className,
  sizes = "6rem",
}: {
  name: string;
  photo?: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-member-tint text-brand relative grid shrink-0 place-items-center overflow-hidden rounded-full font-semibold",
        className,
      )}
    >
      {photo ? (
        <Image
          src={photo}
          alt=""
          fill
          sizes={sizes}
          className="object-cover object-top"
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}
