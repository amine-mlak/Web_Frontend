import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import { fetchAppliances, fetchMaterials } from "@/lib/catalog-api";
import {
  collectionHub,
  collectionHubMetadata,
  overlayBranchImages,
} from "@/lib/collection-hubs";
import { MATERIAL_KIND_ROUTES } from "@/lib/collection-entries";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("material");
}

export default async function MaterialPage() {
  const locale = await getRequestLocale();
  const [materials, appliances] = await Promise.all([
    fetchMaterials(),
    fetchAppliances(),
  ]);
  const images: Record<string, string> = {};
  for (const material of materials) {
    const route = MATERIAL_KIND_ROUTES.find((item) => item.kind === material.kind);
    if (route && !images[route.href]) {
      images[route.href] = material.image;
    }
  }
  const tap = appliances.find((item) => item.slug === "quooker-armatur");
  if (tap?.image) {
    images["/material/spuele"] = tap.image;
  }
  return (
    <CollectionHub
      id="material"
      locale={locale}
      branches={overlayBranchImages(collectionHub("material", locale).branches, images)}
    />
  );
}
