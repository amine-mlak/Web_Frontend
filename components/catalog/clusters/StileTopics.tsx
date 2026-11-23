import LocaleLink from "@/components/LocaleLink";
import KitchenShowcase from "@/components/catalog/KitchenShowcase";
import { Frame } from "@/components/catalog/collections/parts";
import { Crumbs, SoftClose } from "@/components/catalog/clusters/parts";
import { cmsSrc } from "@/lib/beer-photos";
import type { PresentedTopic } from "@/lib/collection-topics";
import TopicReading from "@/components/catalog/clusters/TopicReading";
import { PageGuide, PageQuestions } from "@/components/catalog/PageDepth";

function plate(file: string) {
  return cmsSrc(`/cms-uploads/${file}`, 1800);
}

const PLATES: Record<string, readonly [string, string, string]> = {
  modern: [
    plate("stile_modern_f2719204d7.jpg"),
    plate("kuechen_muenchen_moderne_kuechen_bdea3d344f.jpg"),
    plate("moderne_kueche_schreinerkueche_f599513827.jpg"),
  ],
  landhaus: [
    plate("stile_landhaus_f9af4a334a.jpg"),
    plate("kuechen_ideen_landhauskueche_b60beac428.jpg"),
    plate("cottage_kuechen_landhaus_611c8a5790.jpg"),
  ],
  design: [
    plate("stile_design_1d3d4e9c34.jpg"),
    plate("kuechenstudio_designer_kuechen_ffe4738165.jpg"),
    plate("designer_kuechen_kuechenstudio_7ad535eda2.jpg"),
  ],
  holz: [
    plate("stile_holz_87d73d35f9.jpg"),
    plate("holzkueche_kuechen_ideen_10721ba09d.jpg"),
    plate("wohnkueche_holzkueche_f785db62dd.jpg"),
  ],
  purist: [
    plate("stile_purist_07193b6650.jpg"),
    plate("Puristische_Kueche_1_558845279f.jpg"),
    plate("Puristische_Kueche_6_d4a08bb4f3.jpg"),
  ],
  luxus: [
    plate("kuechen_weiss_holz_luxus_kuechen_dba2f3c9dc.jpg"),
    plate("Design_in_Glas_und_Stein_2_6669eaa7d7.jpg"),
    plate("stile_design_1d3d4e9c34.jpg"),
  ],
};

/**
 * The title photo and the two photos after the statement: the ones chosen in the CMS blocks; before
 * that, photos of a kitchen tagged with this style, and the fixed plates only without one.
 */
export function platesFor(slug: string, hub: PresentedTopic) {
  const kitchen = [hub.heroImage, hub.statementImage, hub.statementImageB] as const;
  return hub.fromBlocks || (hub.taggedKitchens ?? 0) > 0 ? kitchen : (PLATES[slug] ?? kitchen);
}

function OtherStances({ hub }: { hub: PresentedTopic }) {
  if (hub.siblings.length === 0) {
    return null;
  }

  return (
    <nav className="border-t border-line px-5 py-12 sm:px-8 lg:px-gutter" aria-label={hub.siblingTitle}>
      <p className="type-eyebrow text-muted">{hub.siblingEyebrow}</p>
      <ul className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
        {hub.siblings.map((item) => (
          <li key={item.href}>
            <LocaleLink
              href={item.href}
              className="t-item leading-none text-ink transition-opacity hover:opacity-50"
            >
              {item.title}
            </LocaleLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function housesTitle(locale: PresentedTopic["locale"]) {
  return locale === "en" ? "More kitchens in this style" : "Weitere Küchen in diesem Stil";
}

function Facts({ hub }: { hub: PresentedTopic }) {
  return (
    <ul className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
      {hub.facts.map((fact) => (
        <li key={`${fact.value}-${fact.label}`} className="border-line px-5 py-8 sm:px-8 lg:border-l lg:px-8 lg:first:border-l-0">
          <p className="font-serif text-[24px] leading-none font-medium text-ink md:text-[28px] xl:text-[32px]">{fact.value}</p>
          <p className="type-eyebrow mt-3 text-muted">{fact.label}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * One layout for every style page (Modern, Landhaus, Design, Holz, Puristisch, Luxus), in the order of
 * the CMS blocks: title with photo, facts, core statement with numbered points, two photos, reading
 * text, kitchens, guide, questions, other styles, closing band.
 */
function Stile({
  hub,
  photos,
  slug,
}: {
  hub: PresentedTopic;
  photos: readonly string[];
  slug: string;
}) {
  return (
    <main className="bg-paper">
      <section className="grid lg:min-h-[calc(100svh-3.5rem)] lg:grid-cols-12">
        <div className="flex flex-col justify-end px-5 py-14 sm:px-8 lg:col-span-5 lg:px-gutter lg:py-20">
          <Crumbs hub={hub} tone="ink" />
          <h1 className="t-title mt-10 text-ink">
            {hub.title}
            {hub.emphasis ? <em className="mt-2 block font-medium italic">{hub.emphasis}</em> : null}
          </h1>
          <p className="t-lede mt-8 max-w-sm text-muted">{hub.lede}</p>
        </div>
        <Frame
          src={photos[0]}
          alt={hub.heroAlt}
          className="min-h-[70vh] lg:col-span-7 lg:min-h-full"
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
      </section>
      <Facts hub={hub} />
      <section className="grid gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-gutter lg:py-24">
        <div className="lg:col-span-5">
          <p className="t-lead text-ink">{hub.statement}</p>
          {hub.statementNote ? (
            <p className="mt-6 max-w-md font-sans text-[16px] leading-relaxed text-muted">{hub.statementNote}</p>
          ) : null}
        </div>
        <ol className="lg:col-span-6 lg:col-start-7">
          {hub.branches.map((branch) => (
            <li key={branch.title} className="border-t border-line py-6 last:border-b">
              <h2 className="t-feature text-ink">{branch.title}</h2>
              <p className="mt-2 max-w-md font-sans text-[16px] leading-relaxed text-muted">{branch.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <div className="grid lg:grid-cols-12">
        <Frame src={photos[1]} alt="" className="aspect-[16/10] lg:col-span-7" sizes="(max-width: 1024px) 100vw, 58vw" />
        <Frame
          src={photos[2]}
          alt=""
          className="aspect-[16/10] lg:col-span-5 lg:aspect-auto"
          sizes="(max-width: 1024px) 100vw, 42vw"
        />
      </div>
      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <KitchenShowcase hub={hub} title={hub.showcaseTitle || housesTitle(hub.locale)} />
      <PageGuide hub={hub} />
      <PageQuestions hub={hub} />
      <OtherStances hub={hub} />
      <SoftClose hub={hub} />
    </main>
  );
}

export function StileTopic({ hub, slug }: { hub: PresentedTopic; slug: string }) {
  return <Stile hub={hub} photos={platesFor(slug, hub)} slug={slug} />;
}
