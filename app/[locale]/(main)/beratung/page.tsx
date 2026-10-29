import type { Metadata } from "next";
import PlannerSection from "@/components/planner/PlannerSection";
import { getKitchenPlanner } from "@/lib/kitchen-planner";
import { getRequestLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  // The planner's own heading and intro from the CMS: what the visitor reads first on the page.
  const planner = await getKitchenPlanner(await getRequestLocale());
  const heading = [planner.title, planner.titleEmphasis].filter(Boolean).join(" ").replace(/\.$/, "");
  return pageMetadata({
    title: `${heading} | BEER Küchenmanufaktur`,
    description: planner.intro,
    path: "/beratung",
  });
}

export default function BeratungPage() {
  return (
    <main className="bg-paper">
      <PlannerSection headingLevel="h1" />
    </main>
  );
}
