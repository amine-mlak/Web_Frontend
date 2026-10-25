import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import { fetchFurniture } from "@/lib/catalog-api";
import {
  collectionHub,
  collectionHubMetadata,
  overlayBranchImages,
} from "@/lib/collection-hubs";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("moebel");
}

export default async function MoebelPage() {
  const locale = await getRequestLocale();
  const items = await fetchFurniture();
  const images: Record<string, string> = {};
  for (const item of items) {
    images[`/moebel/${item.slug}`] = item.image;
  }
  return (
    <CollectionHub
      id="moebel"
      locale={locale}
      branches={overlayBranchImages(collectionHub("moebel", locale).branches, images)}
    />
  );
}
