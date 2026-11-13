import LocaleLink from "@/components/LocaleLink";
import CollectionJsonLd from "@/components/catalog/CollectionJsonLd";
import FullChapter from "@/components/catalog/FullChapter";
import PageEnd from "@/components/catalog/PageEnd";
import { Frame, StatementBand } from "@/components/catalog/collections/parts";
import { Crumbs, HouseLine, QuoteLine } from "@/components/catalog/clusters/parts";
import PlanDrawing, { hasPlanDrawing } from "@/components/catalog/shapes/PlanDrawing";
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

/**
 * The chapters in rows: one across the whole width, then two side by side, then one again.
 * A single chapter left over at the end takes the whole width.
 */
function chapterRows<T>(items: T[]) {
  // `side` counts the wide chapters, so their text alternates left and right.
  const rows: { item: T; index: number; side: number }[][] = [];
  let index = 0;
  let side = 0;
  while (index < items.length) {
    rows.push([{ item: items[index], index, side: side++ }]);
    index += 1;
    if (items.length - index >= 2) {
      rows.push([
        { item: items[index], index, side: 0 },
        { item: items[index + 1], index: index + 1, side: 0 },
      ]);
      index += 2;
    }
  }
  return rows;
}

/** The overview of one kitchen world (Farben, Stile, Formen, Inseln, Besondere). */
export default function ClusterPage({ hub, path }: { hub: PresentedCluster; path?: string }) {
  const copy = COPY[hub.locale === "en" ? "en" : "de"];
  const first = hub.branches[0];
  // The hero photo is not the first chapter's photo again.
  const firstImage = first ? first.cover || first.image : "";
  const hero = firstImage && photoKey(firstImage) === photoKey(hub.heroImage) ? hub.statementImage : hub.heroImage;
  const rows = chapterRows(hub.branches);
  const chapter = (branch: PresentedCluster["branches"][number], index: number, size: "full" | "card", side: number) => {
    // A layout shows its floor plan before its name.
    const form = branch.href?.includes("/formen/") ? branch.href.split("/").pop() : undefined;
    return (
      <FullChapter
        key={branch.href ?? branch.title}
        id={`chapter-${index}`}
        index={side}
        size={size}
        image={branch.cover || branch.image}
        alt={branch.alt}
        title={branch.title}
        text={branch.text}
        href={branch.href ?? "/kuechen"}
        linkLabel={copy.discover}
        kicker={branch.count ? copy.projects(branch.count) : undefined}
        hex={branch.hex}
        mark={hasPlanDrawing(form) ? <PlanDrawing form={form} className="h-11 w-auto md:h-14" /> : undefined}
        lang={hub.locale}
      />
    );
  };

  return (
    <main className="bg-paper">
      {path ? (
        <CollectionJsonLd path={path} name={hub.title} description={hub.lede} items={hub.branches} locale={hub.locale} />
      ) : null}
      <section data-site-hero="" className="relative isolate -mt-14 min-h-[88svh] bg-nacht" aria-labelledby="cluster-hero">
        <Frame src={hero} alt={hub.heroAlt} className="absolute inset-0" priority sizes="100vw" />
        <div className="hero-scrim absolute inset-0" aria-hidden />
        <div className="relative z-10 flex min-h-[88svh] items-end px-5 pb-12 sm:px-8 lg:px-gutter lg:pb-16">
          <div className="max-w-2xl">
            <Crumbs hub={hub} tone="paper" />
            <h1
              id="cluster-hero"
              className="t-display mt-6 text-paper"
            >
              {hub.title}
              {hub.emphasis ? <span className="block">{hub.emphasis}</span> : null}
            </h1>
            {hub.lede ? <p className="t-lede mt-5 max-w-lg text-paper/90">{hub.lede}</p> : null}
          </div>
        </div>
      </section>

      <StatementBand statement={hub.statement} note={hub.statementNote} rule={false} />

      <div className="space-y-3 px-3 sm:space-y-4 sm:px-4">
        {rows.map((row) =>
          row.length === 1 ? (
            chapter(row[0].item, row[0].index, "full", row[0].side)
          ) : (
            <div key={`pair-${row[0].index}`} className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {row.map(({ item, index }) => chapter(item, index, "card", 0))}
            </div>
          ),
        )}
      </div>

      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <div className="mt-12">
        <HouseLine houses={hub.houses} title={copy.houses} />
      </div>
      <div className="px-5 pb-4 sm:px-8 lg:px-gutter">
        <LocaleLink href="/projekte" className="btn-quiet">
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
