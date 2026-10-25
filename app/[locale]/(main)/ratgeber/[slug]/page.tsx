import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ArticlePage from "@/components/catalog/entries/ArticlePage";
import { findBySlug, isPressArticle } from "@/lib/catalog";
import { fetchArticles } from "@/lib/catalog-api";
import { getRequestLocale } from "@/lib/locale";
import { brandedTitle, pageMetadata } from "@/lib/seo";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await fetchArticles();
  return articles
    .filter((item) => !isPressArticle(item))
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = findBySlug(await fetchArticles(), (await params).slug);
  if (!item) {
    return { title: "Ratgeber | BEER Küchenmanufaktur" };
  }
  return pageMetadata({
    title: brandedTitle(item.title),
    description: item.description,
    path: `/ratgeber/${item.slug}`,
    image: item.image,
    article: { publishedTime: item.publishedAt, modifiedTime: item.updatedAt, section: item.category?.name },
  });
}

export default async function RatgeberArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getRequestLocale();
  const articles = await fetchArticles();
  const item = findBySlug(articles, (await params).slug);
  if (!item) {
    notFound();
  }
  if (isPressArticle(item)) {
    redirect(`/presse/${item.slug}`);
  }
  return <ArticlePage item={item} articles={articles} locale={locale} />;
}
