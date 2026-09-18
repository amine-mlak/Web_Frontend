import { notFound, redirect } from "next/navigation";
import Entdecken from "@/components/Entdecken";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import Kacheln from "@/components/Kacheln";
import LeadCta from "@/components/LeadCta";
import Process from "@/components/Process";
import { fetchLandingBySlug } from "@/lib/strapi";

export const revalidate = 120;

export default async function LandingSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "home") {
    redirect("/");
  }

  const page = await fetchLandingBySlug(slug);
  if (!page) {
    notFound();
  }

  return (
    <main className="bg-paper">
      {page.heroSlides.length > 0 ? <Hero slides={page.heroSlides} /> : null}
      {page.kacheln ? <Kacheln content={page.kacheln} /> : null}
      {page.ablauf ? <Process content={page.ablauf} /> : null}
      {page.entdecken ? <Entdecken content={page.entdecken} /> : null}
      {page.faq ? <Faq content={page.faq} /> : null}
      {page.beratung ? <LeadCta content={page.beratung} /> : null}
    </main>
  );
}
