import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import { fetchKitchenTopics } from "@/lib/catalog-api";
import {
  collectionHub,
  collectionHubMetadata,
  overlayBranchImages,
} from "@/lib/collection-hubs";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("kuechen");
}

export default async function KuechenPage() {
  const locale = await getRequestLocale();
  const topics = await fetchKitchenTopics();
  const images: Record<string, string> = {};
  for (const topic of topics) {
    const href = `/kuechen/${topic.cluster}`;
    if (!images[href]) {
      images[href] = topic.image;
    }
  }
  return (
    <CollectionHub
      id="kuechen"
      locale={locale}
      branches={overlayBranchImages(collectionHub("kuechen", locale).branches, images)}
    />
  );
}
