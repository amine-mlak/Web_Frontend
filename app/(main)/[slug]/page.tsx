import { notFound, redirect } from "next/navigation";
import DetailPage from "@/components/catalog/DetailPage";
import Entdecken from "@/components/Entdecken";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import Kacheln from "@/components/Kacheln";
import LeadCta from "@/components/LeadCta";
import Process from "@/components/Process";
import type { Metadata } from "next";
import { fetchSitePage } from "@/lib/catalog-api";
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

  const page = await fetchSitePage(slug);
  if (!page) {
    return { title: "BEER Küchenmanufaktur" };
  }
  return pageMetadata({
    title: brandedTitle(page.title),
    description: page.intro,
    path: `/${slug}`,
    image: page.image,
  });
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

  const page = await fetchSitePage(slug);
  if (!page) {
    notFound();
  }

  return (
    <>
      <DetailPage
        eyebrow={page.eyebrow || "BEER"}
        title={page.title}
        intro={page.intro}
        body={page.body}
        image={page.image || undefined}
        srcSet={page.srcSet}
        ctaLabel={page.ctaLabel || undefined}
        ctaHref={page.ctaUrl || undefined}
      />
      {page.faq ? <Faq content={page.faq} /> : null}
      {slug === "kueche-planen" ? <Process content={null} /> : null}
    </>
  );
}
