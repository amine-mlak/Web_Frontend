import KitchenPlanner from "@/components/planner/KitchenPlanner";
import { getKitchenPlanner } from "@/lib/kitchen-planner";
import { getRequestLocale } from "@/lib/locale";

/** The kitchen planner with its content from the CMS, in the page's language. */
export default async function PlannerSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const content = await getKitchenPlanner(await getRequestLocale());
  return <KitchenPlanner content={content} headingLevel={headingLevel} />;
}
