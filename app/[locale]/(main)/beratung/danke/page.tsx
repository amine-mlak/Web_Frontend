import type { Metadata } from "next";
import ThankYou from "@/components/ThankYou";
import { getKitchenPlanner } from "@/lib/kitchen-planner";
import { getRequestLocale } from "@/lib/locale";
import { brandedTitle } from "@/lib/seo";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const en = (await getRequestLocale()) === "en";
  return { title: brandedTitle(en ? "Thank you" : "Danke"), robots: { index: false, follow: false } };
}

/** Thank-you page after the kitchen planner (/beratung/danke). Title and text come from the planner's CMS entry. */
export default async function PlannerThanksPage() {
  const locale = await getRequestLocale();
  const { done } = await getKitchenPlanner(locale);
  const en = locale === "en";
  const next = [
    ...(done.linkHref ? [{ href: done.linkHref, label: done.linkLabel }] : []),
    { href: "/kontakt", label: en ? "Book an appointment now" : "Gleich einen Termin vereinbaren" },
    { href: "/projekte", label: en ? "See real kitchens" : "Echte Küchen ansehen" },
  ].filter((step, index, all) => all.findIndex((other) => other.href === step.href) === index);

  return (
    <ThankYou
      kind="planner"
      eyebrow={en ? "Kitchen planner" : "Küchenplaner"}
      title={done.title}
      text={`${done.text}\n${en ? "We will get back to you within one working day." : "Wir melden uns innerhalb eines Werktags bei Ihnen."}`}
      nextTitle={en ? "What next" : "Wie es weitergeht"}
      next={next}
    />
  );
}
