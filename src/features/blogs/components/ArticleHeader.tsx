import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";

/** The category pill, and the way back to the list of stories. */
export function ArticleHeader({ tag }: { tag: string }) {
  return (
    <div>
      <p className="bg-brand text-surface text-caption rounded-pill inline-flex items-center px-5 py-2 font-bold tracking-wider uppercase shadow-xs">
        {tag}
      </p>
      <div className="mt-5">
        <Link
          href={ROUTES.BLOGS}
          aria-label="Back to all stories"
          title="Back to all stories"
          className="group border-brand/40 text-brand hover:border-brand hover:bg-brand/10 focus-visible:outline-brand inline-flex size-11 items-center justify-center rounded-full border transition-colors"
        >
          <ChevronLeft
            aria-hidden
            className="size-5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      </div>
    </div>
  );
}
