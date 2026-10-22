import LocaleLink from "@/components/LocaleLink";
import CloseAtelier from "@/components/catalog/hub/CloseAtelier";
import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
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
  return locale === "en" ? "Built to these plans" : "Nach diesen Grundrissen";
}

export function FormenCluster({ hub }: { hub: PresentedCluster }) {
  const open = hub.locale === "en" ? "Open" : "Öffnen";

  return (
    <main className="bg-paper">
      <header className="px-5 pt-10 sm:px-8 lg:px-14 lg:pt-16">
        <p className="type-eyebrow text-gold">{hub.eyebrow}</p>
        <div className="mt-6 grid items-end gap-8 lg:grid-cols-12">
          <h1 className="font-serif text-[52px] leading-[0.9] font-medium tracking-[-0.045em] text-ink sm:text-[80px] lg:col-span-7 lg:text-[96px]">
            {hub.title}
            <span className="mt-2 block italic">{hub.emphasis}</span>
          </h1>
          <p className="max-w-md font-sans text-[17px] leading-relaxed font-light text-muted lg:col-span-5">
            {hub.lede}
          </p>
        </div>
      </header>

      <div className="mt-12">
        <AtelierFacts
          facts={hub.facts}
          kicker={hub.indexEyebrow}
          image={hub.ledgerImage}
          sentence={hub.ledgerLine}
        />
      </div>

      <section aria-labelledby="formen-index">
        <h2 id="formen-index" className="sr-only">
          {hub.indexEyebrow}
        </h2>
        <ol>
          {hub.branches.map((branch) => (
            <li key={branch.href ?? branch.title} className="border-t border-line">
              <LocaleLink
                href={branch.href ?? "/kuechen/formen"}
                className="group grid items-center lg:grid-cols-12"
              >
                <div className="px-5 py-8 sm:px-8 lg:col-span-4 lg:px-14 lg:py-12">
                  <p className="font-serif text-[28px] text-gold">{branch.kicker}</p>
                  <h3 className="mt-3 font-serif text-[32px] leading-tight font-medium tracking-[-0.03em] text-ink md:text-[40px]">
                    {branch.title}
                  </h3>
                  <p className="mt-4 max-w-sm font-sans text-[15px] leading-relaxed text-muted">
                    {branch.text}
                  </p>
                  <span className="type-eyebrow mt-6 inline-block text-gold">{open}</span>
                </div>
                <Frame
                  src={branch.image}
                  alt={branch.alt}
                  srcSet={branch.srcSet}
                  className="aspect-[16/9] lg:col-span-8 lg:aspect-[2/1]"
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </LocaleLink>
            </li>
          ))}
        </ol>
      </section>

      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <HouseLine houses={hub.houses} title={housesTitle(hub.locale)} />
      <ClusterLinks hub={hub} />
      <CloseAtelier hub={hub} />
    </main>
  );
}

export function FormenTopic({ hub }: { hub: PresentedTopic }) {
  return (
    <main className="bg-paper">
      <header className="px-5 pt-10 sm:px-8 lg:px-14 lg:pt-16">
        <Crumbs hub={hub} />
        <h1 className="mt-6 max-w-4xl font-serif text-[48px] leading-[0.92] font-medium tracking-[-0.04em] text-ink sm:text-[72px]">
          {hub.title}{" "}
          <em className="italic">{hub.emphasis}</em>
        </h1>
        <p className="mt-6 max-w-xl font-sans text-[17px] leading-relaxed font-light text-muted">
          {hub.lede}
        </p>
      </header>

      <Frame
        src={hub.heroImage}
        alt={hub.heroAlt}
        className="mt-10 aspect-[21/9] w-full"
        priority
        sizes="100vw"
      />

      <section className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-14">
        <p className="font-serif text-[28px] leading-snug font-medium tracking-[-0.03em] text-ink italic lg:col-span-5 md:text-[34px]">
          {hub.statement}
        </p>
        <div className="lg:col-span-7">
          <RuledPoints branches={hub.branches} />
          {hub.statementNote ? (
            <p className="mt-8 max-w-xl font-sans text-[15px] leading-relaxed text-muted">
              {hub.statementNote}
            </p>
          ) : null}
        </div>
      </section>

      <IndexRows
        items={hub.siblings}
        eyebrow={hub.siblingEyebrow}
        title={hub.siblingTitle}
      />
      <HouseLine houses={hub.houses} title={housesTitle(hub.locale)} />
      <SoftClose hub={hub} />
    </main>
  );
}
