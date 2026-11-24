import KitchenShowcase from "@/components/catalog/KitchenShowcase";
import { Frame } from "@/components/catalog/collections/parts";
import { Crumbs, PointsSection, SoftClose } from "@/components/catalog/clusters/parts";
import type { PresentedCluster } from "@/lib/collection-clusters";
import type { PresentedTopic } from "@/lib/collection-topics";
import TopicReading from "@/components/catalog/clusters/TopicReading";
import { PageGuide, PageQuestions } from "@/components/catalog/PageDepth";

function housesTitle(locale: PresentedCluster["locale"]) {
  return locale === "en" ? "Projects with an island" : "Projekte mit Insel";
}

/**
 * One island (Kochinsel, Arbeitsinsel, Insel mit Sitzplatz). It opens like the islands overview:
 * a photo that drifts while the page scrolls, with the name on it. Then what the island is and
 * what we plan for it, the reading text, the built kitchens, guide and questions. The other
 * islands stand at the end, beside the next step.
 */
export function InselnTopic({ hub, slug }: { hub: PresentedTopic; slug: string }) {
  return (
    <main className="bg-paper">
      <section data-site-hero="" className="relative isolate -mt-14 min-h-[80svh] bg-nacht" aria-labelledby="insel-hero">
        <Frame src={hub.heroImage} alt={hub.heroAlt} className="absolute inset-0" priority sizes="100vw" drift />
        <div className="hero-scrim absolute inset-0" aria-hidden />
        <div className="relative z-10 flex min-h-[80svh] items-end px-5 pb-12 sm:px-8 lg:px-gutter lg:pb-16">
          <div className="max-w-2xl">
            <Crumbs hub={hub} tone="paper" />
            <h1 id="insel-hero" className="t-display mt-6 text-paper">
              {hub.title}
              {hub.emphasis ? <span className="block">{hub.emphasis}</span> : null}
            </h1>
            {hub.lede ? <p className="t-lede mt-5 max-w-lg text-paper/90">{hub.lede}</p> : null}
          </div>
        </div>
      </section>

      <PointsSection hub={hub} />
      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <KitchenShowcase hub={hub} title={hub.showcaseTitle || housesTitle(hub.locale)} />
      <PageGuide hub={hub} />
      <PageQuestions hub={hub} />
      <SoftClose
        hub={hub}
        tiles={hub.siblings.map((item) => ({ href: item.href, title: item.title, text: item.text, image: item.image }))}
        tilesTitle={hub.siblingTitle}
      />
    </main>
  );
}
