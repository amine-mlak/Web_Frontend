import { redirect } from "next/navigation";
import Entdecken from "@/components/Entdecken";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import Kacheln from "@/components/Kacheln";
import LeadCta from "@/components/LeadCta";
import Process from "@/components/Process";
import HouseScreen from "@/components/catalog/house/HouseScreen";
import type { Metadata } from "next";
import { houseMetadata } from "@/lib/house-pages";
import { brandedTitle, pageMetadata } from "@/lib/seo";
import { fetchLandingBySlug } from "@/lib/strapi";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "home") {
    return pageMetadata({
      title: "BEER Küchenmanufaktur | Wolfersdorf bei Freising",
      path: "/",
    });
  }

  const landing = await fetchLandingBySlug(slug);
  if (landing) {
    const title = landing.heroPanel
      ? `${landing.heroPanel.title} ${landing.heroPanel.emphasis}`.trim()
      : landing.kacheln?.eyebrow;
    return pageMetadata({
      title: brandedTitle(title || slug),
      description: landing.heroPanel?.text,
      path: `/${slug}`,
      image: landing.heroSlides[0]?.src,
    });
  }

  return houseMetadata(slug);
}

export default async function LandingSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "home") {
    redirect("/");
  }

  const landing = await fetchLandingBySlug(slug);
  if (landing) {
    return (
      <main className="bg-paper">
        {landing.heroSlides.length > 0 ? (
          <Hero slides={landing.heroSlides} panel={landing.heroPanel ?? undefined} />
        ) : null}
        {landing.kacheln ? <Kacheln content={landing.kacheln} /> : null}
        {landing.ablauf ? <Process content={landing.ablauf} /> : null}
        {landing.entdecken ? <Entdecken content={landing.entdecken} /> : null}
        {landing.faq ? <Faq content={landing.faq} /> : null}
        {landing.beratung ? <LeadCta content={landing.beratung} /> : null}
      </main>
    );
  }

  return <HouseScreen slug={slug} />;
}
