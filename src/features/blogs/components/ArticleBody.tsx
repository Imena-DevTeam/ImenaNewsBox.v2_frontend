import { Fragment } from "react";
import type { BlogArticleDetail } from "../types";
import { ArticleMediaBlock } from "./ArticleMediaBlock";

/**
 * The headline, the lead and the story, in sentence case at a width that is
 * comfortable to read. The photograph comes in after the paragraph the
 * article names.
 */
export function ArticleBody({ article }: { article: BlogArticleDetail }) {
  return (
    <div className="mt-8 sm:mt-10">
      <h1 className="font-heading text-member-ink text-h4-m sm:text-h3 lg:text-h2 leading-tight font-bold tracking-tight uppercase">
        {article.title}
      </h1>

      <div className="mt-6 max-w-3xl">
        <p className="border-brand text-member-ink text-body-lg sm:text-h4 border-l-4 py-0.5 pl-4 font-medium italic">
          {article.excerpt}
        </p>

        <div className="text-body sm:text-body-lg text-member-ink/80 mt-6 space-y-5 font-normal">
          {article.contentParagraphs.map((paragraph, index) => (
            <Fragment key={paragraph}>
              <p>{paragraph}</p>
              {index + 1 === article.secondaryImageAfter ? (
                <ArticleMediaBlock
                  image={article.secondaryImage}
                  alt={article.secondaryImageAlt}
                  caption={article.secondaryImageCaption}
                />
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
