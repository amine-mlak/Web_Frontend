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
  // A brand's tile shows the photo of its CMS entry, with the photo's description and credit line
  // from the media library.
  const featured = brands.slice(0, 5).map((brand) => ({
    href: `/marken/${brand.slug}`,
    title: brand.name,
    text: [brand.intro, brand.body].filter(Boolean).join(" "),
    image: brand.image,
    srcSet: brand.srcSet,
    alt: brand.imageAlt || brand.name,
    credit: brand.imageCredit,
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
