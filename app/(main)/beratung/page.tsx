import LeadCta from "@/components/LeadCta";
import { fetchHomeCms } from "@/lib/strapi";

export const revalidate = 120;

export default async function BeratungPage() {
  const { beratung } = await fetchHomeCms();

  return (
    <main className="bg-paper">
      <LeadCta content={beratung} />
    </main>
  );
}
