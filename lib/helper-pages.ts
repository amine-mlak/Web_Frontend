import { KITCHEN_CLUSTERS } from "@/lib/catalog";
import { GERAETE_KIND_ROUTES, MATERIAL_KIND_ROUTES } from "@/lib/collection-entries";

/**
 * CMS site pages that only hold the texts of another address: the kitchen groups (stile → /kuechen/stile)
 * and the material and appliance kinds (fronten → /material/fronten). Their own address /stile would be a
 * copy of that page, so it forwards there and is never listed in the sitemap.
 */
export const HELPER_PAGES: Record<string, string> = Object.fromEntries([
  ...KITCHEN_CLUSTERS.map((cluster) => [cluster.slug, `/kuechen/${cluster.slug}`]),
  ...MATERIAL_KIND_ROUTES.map((route) => [route.slug, route.href]),
  ...GERAETE_KIND_ROUTES.map((route) => [route.slug, route.href]),
]);
