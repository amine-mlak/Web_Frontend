import Entdecken from "@/components/Entdecken";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import Kacheln from "@/components/Kacheln";
import LeadCta from "@/components/LeadCta";
import Process from "@/components/Process";
import { fetchHomeCms, type HeroIntroContent } from "@/lib/strapi";

export const revalidate = 120;

const fallbackHeroPanel: HeroIntroContent = {
  eyebrow: "Küche planen · Inspiration",
  title: "Noch keine Idee?",
  emphasis: "Perfekt.",
  text: "Die meisten unserer Kunden starten genau hier: mit Bildern statt Plänen. Schauen Sie sich um – der Rest ergibt sich im Gespräch.",
  buttonLabel: "Ideen ansehen",
  buttonHref: "/kuechen",
};

export default async function Home() {
  const { heroSlides, heroPanel, kacheln, entdecken, faq, ablauf, beratung } =
    await fetchHomeCms();

  return (
    <main className="bg-paper">
      <Hero slides={heroSlides} panel={heroPanel ?? fallbackHeroPanel} />
      <Kacheln content={kacheln} />
      <Process content={ablauf} />
      <Entdecken content={entdecken} />
      <Faq content={faq} />
      <LeadCta content={beratung} />
    </main>
  );
}
