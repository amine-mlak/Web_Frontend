import { notFound } from "next/navigation";
import HousePage from "@/components/catalog/house/HousePage";
import { presentHouse } from "@/lib/house-pages";
import { getRequestLocale } from "@/lib/locale";
import { fetchTeamMembers } from "@/lib/team-members";

export default async function HouseScreen({ slug }: { slug: string }) {
  const locale = await getRequestLocale();
  const house = await presentHouse(slug, locale);
  if (!house) {
    notFound();
  }

  // The team page shows its people from the CMS collection "Team".
  const team = house.layout === "people" ? await fetchTeamMembers(locale) : [];
  return <HousePage house={house} team={team} />;
}
