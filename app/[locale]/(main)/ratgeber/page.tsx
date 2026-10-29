import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import ArticleIndex from "@/components/catalog/hub/ArticleIndex";
import { isPressArticle } from "@/lib/catalog";
import { fetchArticles } from "@/lib/catalog-api";
import {
  collectionHub,
  collectionHubMetadata,
  overlayBranchImages,
} from "@/lib/collection-hubs";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("ratgeber");
}

export default async function RatgeberPage() {
  const locale = await getRequestLocale();
  const articles = await fetchArticles();
  const images: Record<string, string> = {};
  for (const article of articles) {
    if (isPressArticle(article) || !article.image) {
      continue;
    }
    images[`/ratgeber/${article.slug}`] = article.image;
  }
  if (images["/ratgeber/was-kostet-eine-kueche"]) {
    images["/faq"] = images["/ratgeber/was-kostet-eine-kueche"];
  }
  return (
    <CollectionHub
      id="ratgeber"
      locale={locale}
      branches={overlayBranchImages(collectionHub("ratgeber", locale).branches, images)}
    >
      <ArticleIndex articles={articles.filter((article) => !isPressArticle(article))} locale={locale} />
    </CollectionHub>
  );
}
