import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import { collectionHubMetadata } from "@/lib/collection-hubs";
import { fetchBrands, fetchProjects } from "@/lib/catalog-api";
import { brandCover } from "@/lib/photo-match";
import { photoKey } from "@/lib/utils";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("marken");
}

export default async function MarkenPage() {
  const locale = await getRequestLocale();
  const [brands, projects] = await Promise.all([fetchBrands(), fetchProjects()]);
  // A brand's row shows a kitchen BEER built with it, when a photo in the projects names the brand.
  // Without one, the row keeps the photo from the CMS.
  const shown = new Set<string>();
  const featured = brands.slice(0, 5).map((brand) => {
    const built = brandCover(brand.name, projects, shown);
    if (built) shown.add(photoKey(built.src));
    return {
      href: `/marken/${brand.slug}`,
      title: brand.name,
      text: brand.intro,
      image: built?.src ?? brand.image,
      srcSet: built ? built.srcSet : brand.srcSet,
      alt: built?.alt || brand.name,
    };
  });
  const extras = brands.slice(5).map((brand) => ({
    href: `/marken/${brand.slug}`,
    title: brand.name,
    image: brand.image,
  }));

  return (
    <CollectionHub
      id="marken"
      locale={locale}
      branches={featured.length > 0 ? featured : undefined}
      extras={extras}
      extrasTitle={locale === "en" ? "Further brands" : "Weitere Marken"}
    />
  );
}
