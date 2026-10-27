import { cn } from "@/lib/cn";

/**
 * The line every member page closes on, in the one place it is written.
 * "Our Family." is the single italic phrase in the row.
 */
export function FamilyTagline({ className }: { className?: string }) {
  return (
    <h2
      className={cn(
        "font-member-serif text-tagline-ink text-tagline-m md:text-tagline text-center",
        className,
      )}
    >
      Our History.
      <span className="text-tagline-accent italic">Our Family.</span>Our Future.
    </h2>
  );
}
