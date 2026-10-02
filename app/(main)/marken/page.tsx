import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import { collectionHubMetadata } from "@/lib/collection-hubs";
import { fetchBrands } from "@/lib/catalog-api";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("marken");
}

export default async function MarkenPage() {
  const locale = await getRequestLocale();
  const brands = await fetchBrands();
  const featured = brands.slice(0, 5).map((brand) => ({
    href: `/marken/${brand.slug}`,
    title: brand.name,
    text: brand.intro,
    image: brand.image,
    srcSet: brand.srcSet,
    alt: brand.name,
  }));
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
