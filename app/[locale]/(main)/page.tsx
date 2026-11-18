import type { Metadata } from "next";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import InstagramFeed from "@/components/InstagramFeed";
import HomeProjects from "@/components/HomeProjects";
import HomeWays from "@/components/HomeWays";
import HomeWorkshop from "@/components/HomeWorkshop";
import PlannerSection from "@/components/planner/PlannerSection";
import LocalBusinessJsonLd from "@/components/LocalBusinessJsonLd";
import { getRequestLocale } from "@/lib/locale";
import { seoFor } from "@/lib/cms-seo";
import { pageMetadata } from "@/lib/seo";
import { fetchHomeCms, type HeroIntroContent } from "@/lib/strapi";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const home = await fetchHomeCms();
  const { heroPanel, heroSlides } = home;
  const panel = heroPanel ?? fallbackHeroPanel[locale];
  return pageMetadata({
    title: "BEER Küchenmanufaktur | Wolfersdorf bei Freising",
    description: panel.text,
    path: "/",
    image: heroSlides[0]?.src,
    cms: seoFor(locale, home),
  });
}

const fallbackHeroPanel: Record<"de" | "en", HeroIntroContent> = {
  de: {
    eyebrow: "Küche planen · Inspiration",
    title: "Noch keine Idee?",
    emphasis: "Perfekt.",
    text: "Die meisten unserer Kunden starten genau hier: mit Bildern statt Plänen. Schauen Sie sich um – der Rest ergibt sich im Gespräch.",
    buttonLabel: "Ideen ansehen",
    buttonHref: "/kuechen",
  },
  en: {
    eyebrow: "Kitchen planning · Inspiration",
    title: "No idea yet?",
    emphasis: "Perfect.",
    text: "Most of our clients start right here: with pictures, not plans. Have a look around — the rest comes together in conversation.",
    buttonLabel: "See ideas",
    buttonHref: "/kuechen",
  },
};

export default async function Home() {
  const locale = await getRequestLocale();
  const { heroSlides, heroPanel, kacheln, entdecken, projekte, faq, ablauf } =
    await fetchHomeCms();

  return (
    <main className="bg-paper">
      <LocalBusinessJsonLd />
      <Hero slides={heroSlides} panel={heroPanel ?? fallbackHeroPanel[locale]} />
      <HomeWays panels={entdecken} colours={kacheln} />
      <HomeProjects content={projekte} />
      <HomeWorkshop content={ablauf} quote={{ text: faq?.quote, source: faq?.quoteSource }} />
      <Faq content={faq} band={false} />
      <PlannerSection />
      <InstagramFeed />
    </main>
  );
}
