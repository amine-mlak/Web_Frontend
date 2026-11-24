import LocaleLink from "@/components/LocaleLink";
import CollectionJsonLd from "@/components/catalog/CollectionJsonLd";
import PageEnd from "@/components/catalog/PageEnd";
import Questions from "@/components/catalog/Questions";
import { Frame, StatementBand } from "@/components/catalog/collections/parts";
import { Crumbs, HouseLine } from "@/components/catalog/clusters/parts";
import type { KitchenTopic } from "@/lib/catalog";
import type { PresentedCluster } from "@/lib/collection-clusters";
import { formSketch } from "@/lib/form-sketches";
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
 * The Küchenformen overview. Each shape has a chapter of its own: a built kitchen whose photo
 * drifts while the page scrolls, BEER's hand sketch of the shape, what it is and what we plan
 * for it. Everything comes from the shapes' entries; nothing is typed here a second time.
 */
export default function FormenHub({
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
    const form = branch.href?.split("/").pop();
    const topic = topics.find((item) => item.slug === form);
    // The entry's own texts, only when they are written in the page's language.
    const own = topic && (!topic.contentLocale || topic.contentLocale === hub.locale) ? topic : undefined;
    return { branch, form, topic, statement: own?.blocks?.statement };
  });

  // No photo twice on the page: the hero first, then each chapter takes the first photo still free.
  const firstImage = chapters[0] ? chapters[0].branch.cover || chapters[0].branch.image : "";
  const hero = firstImage && photoKey(firstImage) === photoKey(hub.heroImage) ? hub.statementImage : hub.heroImage;
  used.add(photoKey(hero));
  const photos = chapters.map(({ branch, topic }) => {
    const own = [branch.cover, branch.image, topic?.blocks?.head?.photo?.src];
    const photo = own.find(unused) || branch.cover || branch.image || "";
    if (photo) {
      used.add(photoKey(photo));
    }
    return photo;
  });

  return (
    <main className="bg-paper">
      <CollectionJsonLd path={path} name={hub.title} description={hub.lede} items={hub.branches} locale={hub.locale} />
      <section data-site-hero="" className="relative isolate -mt-14 min-h-[88svh] bg-nacht" aria-labelledby="formen-hero">
        <Frame src={hero} alt={hub.heroAlt} className="absolute inset-0" priority sizes="100vw" drift />
        <div className="hero-scrim absolute inset-0" aria-hidden />
        <div className="relative z-10 flex min-h-[88svh] items-end px-5 pb-12 sm:px-8 lg:px-gutter lg:pb-16">
          <div className="max-w-2xl">
            <Crumbs hub={hub} tone="paper" />
            <h1 id="formen-hero" className="t-display mt-6 text-paper">
              {hub.title}
              {hub.emphasis ? <span className="block">{hub.emphasis}</span> : null}
            </h1>
            {hub.lede ? <p className="t-lede mt-5 max-w-lg text-paper/90">{hub.lede}</p> : null}
          </div>
        </div>
      </section>

      <StatementBand statement={hub.statement} note={hub.statementNote} rule={false} />

      {chapters.map(({ branch, form, statement }, index) => {
        const flip = index % 2 === 1;
        const href = branch.href ?? "/kuechen";
        const photo = photos[index];
        const sketch = formSketch(form);
        return (
          <section
            key={href}
            className="grid items-center gap-x-12 gap-y-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-x-24 lg:px-gutter lg:py-16"
            aria-labelledby={`form-${index}`}
          >
            {photo ? (
              <Frame
                src={photo}
                alt={branch.alt}
                className={`aspect-[4/3] ${flip ? "lg:order-2" : ""}`}
                sizes="(max-width: 1024px) 100vw, 55vw"
                drift
              />
            ) : null}
            <div>
              {sketch ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sketch.src}
                  alt=""
                  width={sketch.width}
                  height={sketch.height}
                  loading="lazy"
                  decoding="async"
                  className="-mb-1 -ml-3 h-auto w-28 lg:w-34"
                />
              ) : null}
              <h2 id={`form-${index}`} className="t-section text-ink">
                {branch.title}
              </h2>
              {branch.text ? <p className="t-lede mt-4 max-w-lg text-ink/85">{branch.text}</p> : null}
              {statement?.text ? (
                <p className="mt-4 max-w-lg font-sans text-[16px] leading-[1.7] text-muted">{statement.text}</p>
              ) : null}
              {statement?.points.length ? (
                <dl className="mt-7 border-b border-line">
                  {statement.points.map((point) => (
                    <div
                      key={point.title}
                      className="grid gap-1 border-t border-line py-4 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-6"
                    >
                      <dt className="font-serif text-[18px] leading-[1.25] text-ink">{point.title}</dt>
                      <dd className="font-sans text-[16px] leading-[1.7] text-ink/85">{point.text}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {statement?.note ? (
                <p className="mt-6 max-w-lg border-l-2 border-messing pl-3 font-sans text-[15px] leading-[1.6] text-muted">
                  {statement.note}
                </p>
              ) : null}
              <LocaleLink href={href} className="btn-quiet mt-7">
                {copy.open(branch.title)} <span aria-hidden="true">→</span>
              </LocaleLink>
            </div>
          </section>
        );
      })}

      <div className="mt-12">
        <HouseLine houses={hub.houses} title={copy.houses} />
      </div>
      <div className="px-5 pb-16 sm:px-8 lg:px-gutter lg:pb-24">
        <LocaleLink href="/projekte" className="btn-quiet">
          {copy.allProjects}
        </LocaleLink>
      </div>

      <Questions slugs={depth?.questions} theme={depth?.theme ?? "formen"} title={hub.title} locale={hub.locale} limit={5} />

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
