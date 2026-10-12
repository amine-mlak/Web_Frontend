import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import DetailPage from "@/components/catalog/DetailPage";
import { findBySlug, isPressArticle } from "@/lib/catalog";
import { fetchArticles } from "@/lib/catalog-api";
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
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = findBySlug(await fetchArticles(), (await params).slug);
  if (!item) {
    notFound();
  }
  if (isPressArticle(item)) {
    redirect(`/presse/${item.slug}`);
  }
  return (
    <DetailPage
      eyebrow={item.category?.name || "Ratgeber"}
      title={item.title}
      intro={item.description}
      body={item.body}
      image={item.image}
      srcSet={item.srcSet}
      ctaLabel="Gespräch vereinbaren"
    />
  );
}
