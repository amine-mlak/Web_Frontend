import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import { fetchRegions } from "@/lib/catalog-api";
import {
  collectionHub,
  collectionHubMetadata,
  overlayBranchImages,
} from "@/lib/collection-hubs";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("regionen");
}

const featuredSlugs = new Set([
  "muenchen",
  "freising",
  "erding",
  "pfaffenhofen",
]);

export default async function RegionenPage() {
  const locale = await getRequestLocale();
  const regions = await fetchRegions();
  const images: Record<string, string> = {};
  for (const region of regions) {
    if (region.image) {
      images[`/regionen/${region.slug}`] = region.image;
    }
  }
  const extras = regions
    .filter((region) => !featuredSlugs.has(region.slug))
    .map((region) => ({
      href: `/regionen/${region.slug}`,
      title: region.name,
      image: region.image,
    }));

  return (
    <CollectionHub
      id="regionen"
      locale={locale}
      branches={overlayBranchImages(collectionHub("regionen", locale).branches, images)}
      extras={extras}
      extrasTitle={locale === "en" ? "Further places" : "Weitere Orte"}
    />
  );
}
