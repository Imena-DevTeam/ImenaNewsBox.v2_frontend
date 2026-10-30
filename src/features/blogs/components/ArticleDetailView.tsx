import { PageHeader } from "@/components/layout/PageHeader";
import { FamilyTagline } from "@/components/layout/FamilyTagline";
import type { BlogArticleDetail } from "../types";
import { ArticleAuthorBar } from "./ArticleAuthorBar";
import { ArticleBody } from "./ArticleBody";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleHeroMedia } from "./ArticleHeroMedia";
import { CelebrationOrnaments } from "./CelebrationOrnaments";

/** One story, from its category pill to the author bar. */
export function ArticleDetailView({ article }: { article: BlogArticleDetail }) {
  return (
    <div className="min-w-0">
      <PageHeader title="Blogs" subtitle="Stories From Our Family" as="p" />

      <article className="relative mx-auto mt-8 max-w-5xl md:mt-10">
        <CelebrationOrnaments />
        <ArticleHeader tag={article.tag} />
        <div className="mt-5">
          <ArticleHeroMedia article={article} />
        </div>
        <ArticleBody article={article} />
        <ArticleAuthorBar article={article} />
        <p className="text-caption text-muted mt-6 font-normal">
          Sample story. The family blog is not connected yet, so this text and
          its numbers are placeholders.
        </p>
      </article>

      <FamilyTagline className="mt-16 sm:mt-24" />
    </div>
  );
}
