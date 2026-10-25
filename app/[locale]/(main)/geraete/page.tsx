import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import { fetchAppliances } from "@/lib/catalog-api";
import {
  collectionHub,
  collectionHubMetadata,
  overlayBranchImages,
} from "@/lib/collection-hubs";
import { GERAETE_KIND_ROUTES } from "@/lib/collection-entries";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("geraete");
}

export default async function GeraetePage() {
  const locale = await getRequestLocale();
  const appliances = await fetchAppliances();
  const images: Record<string, string> = {};
  for (const appliance of appliances) {
    const route = GERAETE_KIND_ROUTES.find((item) => item.slug === appliance.kind);
    if (route && !images[route.href]) {
      images[route.href] = appliance.image;
    }
  }
  return (
    <CollectionHub
      id="geraete"
      locale={locale}
      branches={overlayBranchImages(collectionHub("geraete", locale).branches, images)}
    />
  );
}
