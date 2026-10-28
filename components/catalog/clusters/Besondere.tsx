import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
import ProjectFeature from "@/components/catalog/ProjectFeature";
import {
  Crumbs,
  HouseLine,
  IndexRows,
  RuledPoints,
  SoftClose,
} from "@/components/catalog/clusters/parts";
import type { PresentedCluster } from "@/lib/collection-clusters";
import type { PresentedTopic } from "@/lib/collection-topics";
import TopicReading from "@/components/catalog/clusters/TopicReading";

function housesTitle(locale: PresentedCluster["locale"]) {
  return locale === "en" ? "Where the grid ended" : "Wo das Raster endete";
}

export function BesondereTopic({ hub, slug }: { hub: PresentedTopic; slug: string }) {
  const features = hub.features ?? [];
  return (
    <main className="bg-paper">
      <header className="px-5 pt-10 sm:px-8 lg:px-14 lg:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <Crumbs hub={hub} />
          <p className="font-sans text-[11px] tracking-[0.22em] text-muted uppercase">
            {hub.locale === "en" ? "Workshop file" : "Werkstattakte"}
          </p>
        </div>
        <h1 className="mt-8 max-w-4xl font-serif text-[48px] leading-[0.92] font-medium tracking-[-0.04em] text-ink sm:text-[72px]">
          {hub.title} <em className="italic">{hub.emphasis}</em>
        </h1>
        <p className="mt-5 max-w-xl font-sans text-[17px] leading-relaxed font-light text-muted">
          {hub.lede}
        </p>
      </header>

      <div className="mt-10">
        <AtelierFacts
          facts={hub.facts}
          kicker={hub.eyebrow}
          image={hub.heroImage}
          sentence={hub.ledgerLine}
        />
      </div>

      <section className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-14">
        <div className="lg:col-span-5">
          <h2 className="font-serif text-[26px] leading-snug font-medium tracking-[-0.02em] text-ink">
            {hub.statement}
          </h2>
          {hub.statementNote ? (
            <p className="mt-6 font-sans text-[15px] leading-relaxed text-muted">
              {hub.statementNote}
            </p>
          ) : null}
        </div>
        <div className="lg:col-span-7">
          <RuledPoints branches={hub.branches} />
        </div>
      </section>

      {/* Kitchens with this topic, one by one; the line below lists the further ones. */}
      {features.map((feature, index) => (
        <ProjectFeature key={feature.href} feature={feature} variant={index % 4} locale={hub.locale} />
      ))}

      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <IndexRows items={hub.siblings} eyebrow={hub.siblingEyebrow} title={hub.siblingTitle} />
      <HouseLine houses={features.length ? hub.taggedHouses ?? [] : hub.houses} title={housesTitle(hub.locale)} />
      <SoftClose hub={hub} />
    </main>
  );
}
