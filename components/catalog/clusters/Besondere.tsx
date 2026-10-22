import LocaleLink from "@/components/LocaleLink";
import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
import CloseAtelier from "@/components/catalog/hub/CloseAtelier";
import { Frame } from "@/components/catalog/collections/parts";
import {
  ClusterLinks,
  Crumbs,
  HouseLine,
  IndexRows,
  QuoteLine,
  RuledPoints,
  SoftClose,
} from "@/components/catalog/clusters/parts";
import type { PresentedCluster } from "@/lib/collection-clusters";
import type { PresentedTopic } from "@/lib/collection-topics";

function housesTitle(locale: PresentedCluster["locale"]) {
  return locale === "en" ? "Where the grid ended" : "Wo das Raster endete";
}

export function BesondereCluster({ hub }: { hub: PresentedCluster }) {
  const open = hub.locale === "en" ? "Open the file" : "Akte öffnen";

  return (
    <main className="bg-paper">
      <header className="px-5 pt-10 sm:px-8 lg:px-14 lg:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <p className="type-eyebrow text-gold">{hub.eyebrow}</p>
          <p className="font-sans text-[11px] tracking-[0.22em] text-muted uppercase">
            {hub.locale === "en" ? "Workshop file" : "Werkstattakte"}
          </p>
        </div>
        <h1 className="mt-8 max-w-4xl font-serif text-[52px] leading-[0.9] font-medium tracking-[-0.045em] text-ink sm:text-[80px]">
          {hub.title}
          <span className="mt-2 block italic">{hub.emphasis}</span>
        </h1>
        <p className="mt-6 max-w-xl font-sans text-[17px] leading-relaxed font-light text-muted">
          {hub.lede}
        </p>
      </header>

      <section aria-labelledby="besondere-index" className="mt-12">
        <h2 id="besondere-index" className="sr-only">
          {hub.indexEyebrow}
        </h2>
        <ol>
          {hub.branches.map((branch) => (
            <li key={branch.href ?? branch.title} className="border-t border-line">
              <LocaleLink
                href={branch.href ?? "/kuechen/besondere"}
                className="group grid items-center gap-6 px-5 py-8 sm:px-8 lg:grid-cols-12 lg:px-14 lg:py-10"
              >
                <p className="font-serif text-[40px] leading-none text-gold lg:col-span-1">
                  {branch.kicker}
                </p>
                <div className="lg:col-span-5">
                  <h3 className="font-serif text-[32px] leading-tight font-medium tracking-[-0.03em] text-ink md:text-[40px]">
                    {branch.title}
                  </h3>
                  <p className="mt-4 max-w-md font-sans text-[15px] leading-relaxed text-muted">
                    {branch.text}
                  </p>
                  <span className="type-eyebrow mt-5 inline-block text-gold">{open}</span>
                </div>
                <Frame
                  src={branch.image}
                  alt={branch.alt}
                  srcSet={branch.srcSet}
                  className="aspect-[4/3] lg:col-span-6"
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </LocaleLink>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-4">
        <AtelierFacts
          facts={hub.facts}
          kicker={hub.indexEyebrow}
          image={hub.ledgerImage}
          sentence={hub.ledgerLine}
        />
      </div>

      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <HouseLine houses={hub.houses} title={housesTitle(hub.locale)} />
      <ClusterLinks hub={hub} />
      <CloseAtelier hub={hub} />
    </main>
  );
}

export function BesondereTopic({ hub }: { hub: PresentedTopic }) {
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
          <p className="font-serif text-[26px] leading-snug font-medium tracking-[-0.02em] text-ink">
            {hub.statement}
          </p>
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

      <IndexRows items={hub.siblings} eyebrow={hub.siblingEyebrow} title={hub.siblingTitle} />
      <HouseLine houses={hub.houses} title={housesTitle(hub.locale)} />
      <SoftClose hub={hub} />
    </main>
  );
}
