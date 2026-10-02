import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import { collectionHubMetadata } from "@/lib/collection-hubs";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("material");
}

export default async function MaterialPage() {
  const locale = await getRequestLocale();
  return <CollectionHub id="material" locale={locale} />;
}
