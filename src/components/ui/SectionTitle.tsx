import { cn } from "@/lib/cn";

export function SectionTitle({
  title,
  align = "center",
  className,
}: {
  title: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <h2 className="text-h2-m text-primary md:text-h2">{title}</h2>
      <span className="accent-bar" />
    </div>
  );
}
