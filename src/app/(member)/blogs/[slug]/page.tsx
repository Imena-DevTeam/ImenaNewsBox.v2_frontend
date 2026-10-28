import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetailView } from "@/features/blogs/components/ArticleDetailView";
import { ARTICLE_SLUGS, getArticleBySlug } from "@/features/blogs/data";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTICLE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Story not found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
    },
  };
}

export default async function MemberBlogArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  return <ArticleDetailView article={article} />;
}
