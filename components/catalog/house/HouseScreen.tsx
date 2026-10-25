import { notFound } from "next/navigation";
import HousePage from "@/components/catalog/house/HousePage";
import { presentHouse } from "@/lib/house-pages";
import { getRequestLocale } from "@/lib/locale";

export default async function HouseScreen({ slug }: { slug: string }) {
  const locale = await getRequestLocale();
  const house = await presentHouse(slug, locale);
  if (!house) {
    notFound();
  }

  return <HousePage house={house} />;
}
