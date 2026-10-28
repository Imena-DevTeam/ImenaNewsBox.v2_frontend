import Image from "next/image";
import { imenaCrest } from "@/lib/images";
import type { BlogArticleDetail } from "../types";

/**
 * The picture the story opens on: its photograph when it has one, otherwise
 * the family crest on a soft lavender wash.
 */
export function ArticleHeroMedia({ article }: { article: BlogArticleDetail }) {
  const frame =
    "border-member-border shadow-member relative aspect-video w-full overflow-hidden rounded-2xl border sm:rounded-3xl md:aspect-2/1";

  if (article.coverImage) {
    return (
      <div className={`${frame} group bg-member-tint`}>
        <Image
          src={article.coverImage}
          alt={article.coverAlt}
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 896px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-102 motion-reduce:transition-none"
        />
      </div>
    );
  }

  return (
    <div
      className={`${frame} from-member-tint via-surface to-member-tint bg-linear-to-br`}
    >
      <div
        aria-hidden
        className="from-brand/10 absolute inset-0 bg-radial via-transparent to-transparent"
      />
      <Image
        src={imenaCrest}
        alt="IMENA family crest"
        priority
        sizes="(min-width: 768px) 16rem, 10rem"
        className="absolute top-1/2 left-1/2 h-auto w-40 -translate-x-1/2 -translate-y-1/2 md:w-64"
      />
    </div>
  );
}
