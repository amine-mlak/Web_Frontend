import { notFound } from "next/navigation";
import HousePage from "@/components/catalog/house/HousePage";
import { presentHouse } from "@/lib/house-pages";
import { getRequestLocale } from "@/lib/locale";
import { fetchHomeCms } from "@/lib/strapi";

export default async function HouseScreen({ slug }: { slug: string }) {
  const locale = await getRequestLocale();
  const house = await presentHouse(slug, locale);
  if (!house) {
    notFound();
  }

  const extras = house.showLead ? await fetchHomeCms() : null;

  return <HousePage house={house} lead={extras?.beratung ?? null} />;
}
