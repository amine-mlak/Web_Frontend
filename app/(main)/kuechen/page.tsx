import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import { collectionHubMetadata } from "@/lib/collection-hubs";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("kuechen");
}

export default async function KuechenPage() {
  const locale = await getRequestLocale();
  return <CollectionHub id="kuechen" locale={locale} />;
}
