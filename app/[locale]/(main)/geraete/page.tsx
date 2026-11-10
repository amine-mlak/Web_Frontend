import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import { fetchAppliances, fetchProjects } from "@/lib/catalog-api";
import {
  collectionHub,
  collectionHubMetadata,
  overlayBranchImages,
} from "@/lib/collection-hubs";
import { GERAETE_KIND_ROUTES, withAreaPhotos } from "@/lib/collection-entries";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("geraete");
}

export default async function GeraetePage() {
  const locale = await getRequestLocale();
  const [appliances, projects] = await Promise.all([fetchAppliances(), fetchProjects()]);
  const images: Record<string, string> = {};
  for (const appliance of appliances) {
    const route = GERAETE_KIND_ROUTES.find((item) => item.slug === appliance.kind);
    if (route && !images[route.href]) {
      images[route.href] = appliance.image;
    }
  }
  // Each task shows a kitchen we built where one of its appliances stands.
  const branches = overlayBranchImages(collectionHub("geraete", locale).branches, images).map((branch) => {
    const route = GERAETE_KIND_ROUTES.find((item) => item.href === branch.href);
    const slugs = appliances.filter((appliance) => route && appliance.kind === route.slug).map((appliance) => appliance.slug);
    return withAreaPhotos(branch, slugs, projects);
  });
  return <CollectionHub id="geraete" locale={locale} branches={branches} />;
}
