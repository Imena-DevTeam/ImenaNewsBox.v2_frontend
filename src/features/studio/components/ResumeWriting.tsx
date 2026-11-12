import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PenLine } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { formatPostDate, type BlogPagePost } from "@/features/blogs/data";

/**
 * The thing she came here to do.
 *
 * Her overview opened with an identity line and two buttons — the admin's
 * layout with different words, which suits somebody checking a register and
 * not somebody deciding what to write. A writer's first question is "where
 * was I", so the page answers that before anything else.
 *
 * It is built as the page's one hero rather than as another panel in the
 * stack: the photograph goes to the edge of the band at every width wide
 * enough to hold it, so the band reads as the unfinished post itself, and
 * **Carry on** is the only filled button on the whole page. The two create
 * buttons below it are outlines on purpose — one filled button, on the thing
 * she is most likely to want.
 *
 * With nothing unfinished it says so and offers the blank page instead. An
 * empty queue is a good result, not a blank panel.
 */
export function ResumeWriting({ drafts }: { drafts: BlogPagePost[] }) {
  const [newest, ...rest] = [...drafts].sort((a, b) =>
    b.publishedOn.localeCompare(a.publishedOn),
  );

  if (!newest) {
    return (
      <div className="border-member-border bg-member-panel rounded-md border p-6">
        <p className="text-h4-m text-member-ink">Nothing is unfinished.</p>
        <p className="text-body-sm text-muted mt-2">
          Every story you have started is published.
        </p>
        <div className="mt-5">
          <ButtonLink variant="brand" size="md" href={ROUTES.STUDIO_POST_NEW}>
            <PenLine aria-hidden className="size-4" />
            Start something new
          </ButtonLink>
        </div>
      </div>
    );
  }

  const href = `${ROUTES.STUDIO_POSTS}/${newest.slug}/edit`;

  return (
    /* No padding on the band itself: the photograph takes the left edge, and
       everything else carries its own. */
    <div className="border-member-border bg-member-panel overflow-hidden rounded-md border">
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {/* Full height of the band rather than a thumbnail inside it. It is
            decorative — the title beside it is the link and the label — so it
            takes an empty alt. */}
        <Link
          href={href}
          aria-hidden
          tabIndex={-1}
          className="group relative block shrink-0 overflow-hidden sm:w-48 lg:w-64"
        >
          <Image
            src={newest.cover}
            alt=""
            width={512}
            height={384}
            className="transition-base h-32 w-full object-cover group-hover:scale-105 motion-reduce:transition-none sm:h-full"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
          <div className="min-w-0 flex-1">
            <p className="text-caption text-muted tracking-[0.14em] uppercase">
              Where you left off
            </p>

            <Link href={href} className="focus-visible:outline-brand group">
              <span className="text-h4-m text-member-ink group-hover:text-brand transition-fast mt-2 block text-balance">
                {newest.title}
              </span>
            </Link>

            <p className="text-body-sm text-muted mt-2">
              Draft · {newest.category} · started{" "}
              {formatPostDate(newest.publishedOn)}
            </p>
          </div>

          <ButtonLink
            variant="brand"
            size="md"
            href={href}
            className="shrink-0 self-start sm:self-auto"
          >
            Carry on
            <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
      </div>

      {rest.length > 0 ? (
        <p className="text-caption text-muted border-member-border border-t px-5 py-3 sm:px-6">
          {rest.length} other draft{rest.length === 1 ? "" : "s"} waiting ·{" "}
          <Link
            href={ROUTES.STUDIO_POSTS}
            className="text-brand hover:text-brand-hover font-semibold underline-offset-4 hover:underline"
          >
            see them
          </Link>
        </p>
      ) : null}
    </div>
  );
}
