import LocaleLink from "@/components/LocaleLink";
import CollectionJsonLd from "@/components/catalog/CollectionJsonLd";
import PageEnd from "@/components/catalog/PageEnd";
import Questions from "@/components/catalog/Questions";
import { Frame, StatementBand } from "@/components/catalog/collections/parts";
import ChapterStack from "@/components/catalog/clusters/ChapterStack";
import { Crumbs, HouseLine } from "@/components/catalog/clusters/parts";
import type { KitchenTopic } from "@/lib/catalog";
import type { PresentedCluster } from "@/lib/collection-clusters";
import { pageDepth } from "@/lib/page-depth";
import { photoKey } from "@/lib/utils";

const COPY = {
  de: {
    open: (name: string) => `${name} ansehen`,
    houses: "Küchen aus unseren Projekten",
    allProjects: "Alle Projekte",
    worlds: "Weitere Küchenwelten",
  },
  en: {
    open: (name: string) => `See ${name.charAt(0).toLowerCase()}${name.slice(1)}`,
    houses: "Kitchens from our projects",
    allProjects: "All projects",
    worlds: "More kitchen worlds",
  },
} as const;

/**
 * The Küchenstile overview. Each style has a chapter of its own: its photo, what the style is and
 * its key facts. On wide screens a chapter stays in place while the next one slides over it
 * (ChapterStack). Everything comes from the styles' entries; nothing is typed here a second time.
 */
export default function StileHub({
  hub,
  topics,
  path,
}: {
  hub: PresentedCluster;
  topics: KitchenTopic[];
  path: string;
}) {
  const copy = COPY[hub.locale === "en" ? "en" : "de"];
  const depth = pageDepth(path);
  const used = new Set<string>();
  const unused = (src?: string) => Boolean(src && !used.has(photoKey(src)));

  const chapters = hub.branches.map((branch) => {
    const slug = branch.href?.split("/").pop();
    const topic = topics.find((item) => item.slug === slug);
    // The entry's own texts, only when they are written in the page's language.
    const own = topic && (!topic.contentLocale || topic.contentLocale === hub.locale) ? topic : undefined;
    // No photo twice on the page: each chapter takes the first of its photos that is still free.
    const photo =
      [branch.cover, branch.image, topic?.blocks?.head?.photo?.src].find(unused) || branch.cover || branch.image || "";
    if (photo) {
      used.add(photoKey(photo));
    }
    return { branch, photo, statement: own?.blocks?.statement, facts: own?.blocks?.facts?.rows ?? [] };
  });

  return (
    <main className="bg-paper">
      <CollectionJsonLd path={path} name={hub.title} description={hub.lede} items={hub.branches} locale={hub.locale} />
      <header className="grid items-end gap-x-16 gap-y-6 px-5 pb-10 pt-10 sm:px-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:px-gutter lg:pb-14 lg:pt-16">
        <div>
          <Crumbs hub={hub} />
          <h1 className="t-display mt-6 text-ink">
            {hub.title}
            {hub.emphasis ? <span className="block">{hub.emphasis}</span> : null}
          </h1>
        </div>
        {hub.lede ? <p className="t-lede max-w-lg text-ink/85 lg:pb-3">{hub.lede}</p> : null}
      </header>

      <ChapterStack>
        {chapters.map(({ branch, photo, statement, facts }, index) => {
          const flip = index % 2 === 1;
          const href = branch.href ?? "/kuechen";
          return (
            <section
              key={href}
              data-stack-panel=""
              // The photo takes the wider column on either side.
              className={`stack-panel grid border-t border-line bg-paper ${
                flip ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]" : "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
              }`}
              aria-labelledby={`stil-${index}`}
            >
              {photo ? (
                <Frame
                  src={photo}
                  alt={branch.alt}
                  className={`aspect-[4/3] lg:aspect-auto lg:min-h-full ${flip ? "lg:order-2" : ""}`}
                  sizes="(max-width: 1024px) 100vw, 57vw"
                  priority={index === 0}
                  drift
                />
              ) : null}
              <div
                className={`flex min-w-0 flex-col justify-center px-5 py-9 sm:px-8 lg:py-10 ${
                  flip ? "lg:pl-edge lg:pr-16" : "lg:pl-16 lg:pr-edge"
                }`}
              >
                <h2 id={`stil-${index}`} className="t-section text-ink">
                  {branch.title}
                </h2>
                {branch.text ? <p className="t-lede mt-4 max-w-lg text-ink/85">{branch.text}</p> : null}
                {statement?.text ? (
                  <p className="mt-4 max-w-lg font-sans text-[16px] leading-[1.7] text-muted">{statement.text}</p>
                ) : null}
                {facts.length ? (
                  <dl className="mt-7 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 border-t border-ink pt-6">
                    {facts.map((fact) => (
                      <div key={`${fact.value}-${fact.label}`}>
                        <dt className="font-serif text-[22px] leading-[1.15] text-ink lg:text-[26px]">{fact.value}</dt>
                        <dd className="mt-1 font-sans text-[15px] leading-[1.5] text-muted">{fact.label}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <LocaleLink href={href} className="btn-quiet mt-8 self-start">
                  {copy.open(branch.title)} <span aria-hidden="true">→</span>
                </LocaleLink>
              </div>
            </section>
          );
        })}
      </ChapterStack>

      <div className="relative bg-paper pt-14 lg:pt-20">
        <HouseLine houses={hub.houses} title={copy.houses} />
      </div>
      <div className="px-5 pb-6 sm:px-8 lg:px-gutter">
        <LocaleLink href="/projekte" className="btn-quiet">
          {copy.allProjects}
        </LocaleLink>
      </div>

      <StatementBand statement={hub.statement} note={hub.statementNote} rule={false} />

      <Questions slugs={depth?.questions} theme={depth?.theme ?? "stile"} title={hub.title} locale={hub.locale} limit={5} />

      <PageEnd
        title={hub.closeTitle}
        text={hub.closeText}
        primary={{ href: hub.ctaHref, label: hub.ctaLabel }}
        tiles={hub.siblings.map((sibling) => ({ href: sibling.href, title: sibling.title, text: sibling.text, image: sibling.image }))}
        tilesTitle={copy.worlds}
        locale={hub.locale}
      />
    </main>
  );
}
