import LocaleLink from "@/components/LocaleLink";
import FullChapter from "@/components/catalog/FullChapter";
import PageEnd from "@/components/catalog/PageEnd";
import { Frame } from "@/components/catalog/collections/parts";
import { Crumbs, HouseLine, QuoteLine } from "@/components/catalog/clusters/parts";
import type { PresentedCluster } from "@/lib/collection-clusters";
import { photoKey } from "@/lib/utils";

const COPY = {
  de: {
    discover: "Entdecken",
    projects: (count: number) => `${count} ${count === 1 ? "Projekt" : "Projekte"}`,
    houses: "Küchen aus unseren Projekten",
    allProjects: "Alle Projekte",
    more: "Weitere Küchenwelten",
  },
  en: {
    discover: "Discover",
    projects: (count: number) => `${count} ${count === 1 ? "project" : "projects"}`,
    houses: "Kitchens from our projects",
    allProjects: "All projects",
    more: "More kitchen worlds",
  },
} as const;

/** The overview of one kitchen world (Farben, Stile, Formen, Inseln, Besondere). */
export default function ClusterPage({ hub }: { hub: PresentedCluster }) {
  const copy = COPY[hub.locale === "en" ? "en" : "de"];
  const first = hub.branches[0];
  // The hero photo is not the first chapter's photo again.
  const firstImage = first ? first.cover || first.image : "";
  const hero = firstImage && photoKey(firstImage) === photoKey(hub.heroImage) ? hub.statementImage : hub.heroImage;

  return (
    <main className="bg-paper">
      <section data-site-hero="" className="relative isolate -mt-14 min-h-[88svh] bg-nacht" aria-labelledby="cluster-hero">
        <Frame src={hero} alt={hub.heroAlt} className="absolute inset-0" priority sizes="100vw" />
        <div className="hero-scrim absolute inset-0" aria-hidden />
        <div className="relative z-10 flex min-h-[88svh] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-16">
          <div className="max-w-2xl">
            <Crumbs hub={hub} tone="paper" />
            <h1
              id="cluster-hero"
              className="mt-6 font-serif text-[56px] leading-[0.92] font-medium tracking-[-0.045em] text-paper sm:text-[88px]"
            >
              {hub.title}
              {hub.emphasis ? <span className="block">{hub.emphasis}</span> : null}
            </h1>
            {hub.lede ? <p className="mt-5 max-w-lg font-sans text-[18px] leading-relaxed text-paper/90">{hub.lede}</p> : null}
          </div>
        </div>
      </section>

      {hub.statement ? (
        <section className="px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-serif text-[28px] leading-snug font-medium tracking-[-0.02em] text-ink md:text-[38px]">{hub.statement}</p>
            {hub.statementNote ? (
              <p className="mx-auto mt-6 max-w-xl font-sans text-[17px] leading-relaxed text-muted">{hub.statementNote}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="space-y-3 px-3 sm:space-y-4 sm:px-4">
        {hub.branches.map((branch, index) => (
          <FullChapter
            key={branch.href ?? branch.title}
            id={`chapter-${index}`}
            index={index}
            image={branch.cover || branch.image}
            alt={branch.alt}
            title={branch.title}
            text={branch.text}
            href={branch.href ?? "/kuechen"}
            linkLabel={copy.discover}
            kicker={branch.count ? copy.projects(branch.count) : undefined}
            hex={branch.hex}
            lang={hub.locale}
          />
        ))}
      </div>

      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <div className="mt-12">
        <HouseLine houses={hub.houses} title={copy.houses} />
      </div>
      <div className="px-5 pb-4 sm:px-8 lg:px-14">
        <LocaleLink href="/projekte" className="btn-quiet text-ink">
          {copy.allProjects}
        </LocaleLink>
      </div>

      <PageEnd
        title={hub.closeTitle}
        text={hub.closeText}
        primary={{ href: hub.ctaHref, label: hub.ctaLabel }}
        tiles={hub.siblings.map((sibling) => ({ href: sibling.href, title: sibling.title, text: sibling.text, image: sibling.image }))}
        tilesTitle={copy.more}
        locale={hub.locale}
      />
    </main>
  );
}
