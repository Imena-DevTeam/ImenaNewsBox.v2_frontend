import { UserRound } from "lucide-react";
import { cn } from "@/lib/cn";

/** The floating family-tree window that overlaps the hero photo. */
export function TreePreviewCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "border-border bg-surface shadow-main rounded-md border",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 px-3 py-2.5">
        <span className="rounded-pill bg-window-red size-2" />
        <span className="rounded-pill bg-window-amber size-2" />
        <span className="rounded-pill bg-window-green size-2" />
      </div>

      <div className="space-y-4 px-4 pt-2 pb-8">
        <Row offset="pl-0" />
        <div className="bg-border ml-10 h-4 w-px" />
        <Row offset="pl-6" />
        <div className="bg-border ml-6 h-4 w-px" />
        <Node />
      </div>
    </div>
  );
}

function Row({ offset }: { offset: string }) {
  return (
    <div className={cn("flex items-center", offset)}>
      <Node />
      <span className="bg-border h-px flex-1" />
      <Node muted />
    </div>
  );
}

function Node({ muted = false }: { muted?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-pill bg-surface flex size-7 shrink-0 items-center justify-center border",
        muted ? "border-border text-muted" : "border-primary text-primary",
      )}
    >
      <UserRound className="size-3.5" />
    </span>
  );
}
