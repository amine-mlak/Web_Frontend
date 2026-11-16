import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import NextSteps from "@/components/catalog/NextSteps";
import { Breadcrumbs } from "@/components/catalog/clusters/parts";
import { Frame } from "@/components/catalog/Frame";
import PhotoViewer, { type ViewerPhoto } from "@/components/catalog/PhotoViewer";
import TriptychHero from "@/components/catalog/TriptychHero";
import type { KitchenClusterSlug, Project, ProjectFrame } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import type { ProjectBlocks } from "@/lib/project-blocks";
import { cn } from "@/lib/utils";

const COPY = {
  de: {
    eyebrow: "Referenzküche",
    projects: "Projekte",
    file: "Hausakte",
    material: "Material",
    appliance: "Gerät",
    brand: "Marke",
    region: "Region",
    cluster: { farben: "Farbe", stile: "Stil", formen: "Form", inseln: "Insel", besondere: "Besonderheit" },
    others: "Ähnliche Häuser",
    zoom: "Foto groß ansehen",
    viewer: { close: "Schließen", previous: "Vorheriges Foto", next: "Nächstes Foto", of: "von", title: "Fotos dieser Küche" },
  },
  en: {
    eyebrow: "Reference kitchen",
    projects: "Projects",
    file: "House file",
    material: "Material",
    appliance: "Appliance",
    brand: "Brand",
    region: "Region",
    cluster: { farben: "Colour", stile: "Style", formen: "Layout", inseln: "Island", besondere: "Feature" },
    others: "Similar houses",
    zoom: "View photo large",
    viewer: { close: "Close", previous: "Previous photo", next: "Next photo", of: "of", title: "Photos of this kitchen" },
  },
} as const;

/** An alt text that describes the photo, not a file name or an old list of search words. */
function describes(alt: string) {
  const text = alt.trim();
  return (
    text.length >= 25 &&
    text.includes(" ") &&
    !/[_]|\.(jpe?g|png|webp)$/i.test(text) &&
    !/\d{3,}/.test(text) &&
    !/küchen kaufen|küchenstudio|einbauküche$/i.test(text)
  );
}

const SPEC_COLUMNS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

const CLUSTER_ORDER: KitchenClusterSlug[] =["farben", "stile", "formen", "inseln", "besondere"];

// The spec line that shows how a theme looks in this kitchen.
const CLUSTER_SPEC: Partial<Record<KitchenClusterSlug, RegExp>> = {
  farben: /^Fronten$/i,
  stile: /^(Stil|Stilwelt)$/i,
  formen: /^Form$/i,
  inseln: /^(Insel|Form)$/i,
};

type FactLink = { name: string; href: string };
type Fact = { label: string; value?: string; links: FactLink[] };

/**
 * The project's facts, each with links to the themes, materials, appliances, brands and regions it
 * shows: "Form: Eckküche mit Halbinsel" carries the link to L-Form. A link with no matching fact
 * becomes its own fact, named once ("Stil: Landhausküchen").
 */
function projectFacts(project: Project, rows: ProjectBlocks["facts"], copy: (typeof COPY)["de" | "en"]): Fact[] {
  const facts: Fact[] = rows.map((row) => ({ label: row.label, value: row.value, links: [] }));
  const attach = (link: FactLink, kind: string, match: (fact: Fact) => boolean) => {
    const fact = facts.find((item) => item.value && match(item));
    if (fact) {
      fact.links.push(link);
      return;
    }
    const own = facts.find((item) => !item.value && item.label === kind);
    if (own) own.links.push(link);
    else facts.push({ label: kind, links: [link] });
  };
  const mentions = (name: string) => {
    const words = [name, ...name.split(/[\s-]+/).filter((word) => word.length >= 4)].map((word) => word.toLowerCase());
    return (fact: Fact) => words.some((word) => fact.value!.toLowerCase().includes(word));
  };

  for (const topic of [...project.topics].sort((a, b) => CLUSTER_ORDER.indexOf(a.cluster) - CLUSTER_ORDER.indexOf(b.cluster))) {
    const label = CLUSTER_SPEC[topic.cluster];
    attach({ name: topic.name, href: `/kuechen/${topic.cluster}/${topic.slug}` }, copy.cluster[topic.cluster], (fact) =>
      Boolean(label?.test(fact.label)),
    );
  }
  for (const [items, kind, path] of [
    [project.materials, copy.material, "/material"],
    [project.appliances, copy.appliance, "/geraete"],
    [project.brands, copy.brand, "/marken"],
  ] as const) {
    for (const item of items) attach({ name: item.name, href: `${path}/${item.slug}` }, kind, mentions(item.name));
  }
  for (const region of project.regions) {
    attach({ name: region.name, href: `/regionen/${region.slug}` }, copy.region, (fact) => /^Ort$/i.test(fact.label));
  }
  return facts;
}

/**
 * How a photo stands beside its text. An upright photo keeps its height and stands free with
 * air around it; landscape photos run to the edge, by turns wide and wider, so no two
 * neighbours share one split.
 */
const PAIRS = {
  wide: {
    row: "items-center",
    photo: "aspect-[4/3] lg:col-span-7",
    photoFlip: "lg:order-2",
    text: "lg:col-span-5 lg:py-16",
    textSide: "lg:pr-edge lg:pl-14",
    textFlip: "lg:order-1 lg:pr-14 lg:pl-edge",
    sizes: "(max-width: 1024px) 100vw, 58vw",
  },
  wider: {
    row: "items-end",
    photo: "aspect-[4/3] lg:col-span-8 lg:aspect-[3/2]",
    photoFlip: "lg:order-2",
    text: "lg:col-span-4 lg:pt-16 lg:pb-14",
    textSide: "lg:pr-edge lg:pl-12",
    textFlip: "lg:order-1 lg:pr-12 lg:pl-edge",
    sizes: "(max-width: 1024px) 100vw, 67vw",
  },
  tall: {
    row: "items-center lg:py-24",
    photo: "mx-5 aspect-[4/5] sm:mx-8 lg:col-span-4 lg:col-start-2 lg:row-start-1 lg:mx-0",
    photoFlip: "lg:col-start-8",
    text: "lg:col-span-5 lg:col-start-7 lg:row-start-1 lg:px-0 lg:py-0",
    textSide: "",
    textFlip: "lg:col-start-2",
    sizes: "(max-width: 1024px) 100vw, 34vw",
  },
} as const;

type RestCell = { frame: ProjectFrame; cell: string; ratio: string; sizes: string };

/**
 * The photos without text, two in a row. An upright photo stays upright beside a landscape one,
 * two landscape photos swap the wide side from row to row, a last single photo runs full width.
 */
function restCells(frames: ProjectFrame[]): RestCell[] {
  const half = "(max-width: 1024px) 100vw, 50vw";
  const upright = { ratio: "aspect-[4/5]", sizes: half };
  const landscape = { ratio: "aspect-[4/3]", sizes: half };
  const cells: RestCell[] = [];
  for (let at = 0, row = 0; at < frames.length; at += 2, row += 1) {
    const [first, second] = [frames[at], frames[at + 1]];
    if (!second) {
      cells.push(
        first.portrait
          ? { frame: first, cell: "lg:col-span-4 lg:col-start-5", ...upright }
          : { frame: first, cell: "lg:col-span-12", ratio: "aspect-[4/3] lg:aspect-[2/1]", sizes: "100vw" },
      );
    } else if (first.portrait && second.portrait) {
      cells.push({ frame: first, cell: "lg:col-span-5 lg:col-start-2", ...upright });
      cells.push({ frame: second, cell: "lg:col-span-5", ...upright });
    } else if (first.portrait || second.portrait) {
      for (const frame of [first, second]) {
        cells.push(
          frame.portrait
            ? { frame, cell: "lg:col-span-5", ...upright }
            : { frame, cell: "lg:col-span-7 lg:self-end", ...landscape },
        );
      }
    } else {
      cells.push({ frame: first, cell: row % 2 === 0 ? "lg:col-span-7" : "lg:col-span-5", ...landscape });
      cells.push({ frame: second, cell: row % 2 === 0 ? "lg:col-span-5" : "lg:col-span-7", ...landscape });
    }
  }
  return cells;
}

export default function ReferenzPage({
  project,
  blocks,
  others,
  locale,
}: {
  project: Project;
  /** The page's blocks (lib/project-blocks.ts): every photo sits where the editor put it. */
  blocks: ProjectBlocks;
  others: Project[];
  locale: Locale;
}) {
  const copy = COPY[locale === "en" ? "en" : "de"];
  const meta = [project.place, project.year].filter(Boolean).join(" · ");
  const heroPhoto = blocks.hero.photo;
  // Two detail photos beside the title photo make the three-photo opener.
  const opener =
    heroPhoto && blocks.hero.detailLeft && blocks.hero.detailRight
      ? { close: blocks.hero.detailLeft, detail: blocks.hero.detailRight }
      : null;
  const closePhoto = blocks.close.photo ?? null;
  // The intro and each section, each beside its photo.
  const story = [
    ...(blocks.intro ? [{ lead: true, ...blocks.intro }] : []),
    ...blocks.sections.map((section) => ({ lead: false, ...section })),
  ].map(({ photo, ...item }) => ({ ...item, frame: photo }));
  const moreText = blocks.textOnly;
  const rest = blocks.morePhotos;
  const facts = projectFacts(project, blocks.facts, copy);
  // Landscape photos take turns between the two edge layouts; upright ones always stand free.
  const pairs = story.map((item, index) => {
    const before = story.slice(0, index).filter((other) => !other.frame.portrait).length;
    return { ...item, layout: PAIRS[item.frame.portrait ? "tall" : before % 2 === 0 ? "wide" : "wider"] };
  });
  // Every photo of the page in reading order, for the full-screen viewer.
  const altOf = (alt: string | undefined) => (alt && describes(alt) ? alt : project.title);
  const photos: ViewerPhoto[] = [
    ...(heroPhoto ? [{ ...heroPhoto, alt: project.title }] : []),
    ...(opener ? [opener.close, opener.detail] : []),
    ...story.flatMap((item) => (item.photo2 ? [item.frame, item.photo2] : [item.frame])),
    ...rest,
    ...(closePhoto ? [closePhoto] : []),
  ].map((frame) => ({
    src: frame.src,
    srcSet: frame.srcSet,
    alt: altOf(frame.alt),
    caption: frame.alt && describes(frame.alt) ? frame.alt : undefined,
  }));
  const zoom = (src: string) => {
    const index = photos.findIndex((photo) => photo.src === src);
    return index < 0 ? undefined : { index, label: copy.zoom };
  };

  return (
    <main className="bg-paper">
      <PhotoViewer photos={photos} labels={copy.viewer}>
      <article>
        <header className="px-5 pt-10 sm:px-8 lg:px-gutter lg:pt-16">
          <Breadcrumbs items={[{ href: "/projekte", label: copy.projects }]} current={project.title} locale={locale} tone="ink" />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <p className="type-eyebrow text-gold">{copy.eyebrow}</p>
            <p className="font-sans text-[11px] tracking-[0.22em] text-muted uppercase">
              {copy.file}
            </p>
          </div>
          {opener ? null : (
            <>
              <h1 className="t-title mt-8 max-w-4xl text-ink">
                {project.title}
              </h1>
              {meta ? (
                <p className="mt-5 font-sans text-[12px] tracking-[0.18em] text-muted uppercase">{meta}</p>
              ) : null}
            </>
          )}
        </header>

        {opener && heroPhoto ? (
          <TriptychHero
            room={{ src: heroPhoto.src, srcSet: heroPhoto.srcSet, alt: project.title, zoom: zoom(heroPhoto.src) }}
            close={{ src: opener.close.src, srcSet: opener.close.srcSet, alt: opener.close.alt ?? "" }}
            detail={{
              src: opener.detail.src,
              srcSet: opener.detail.srcSet,
              alt: opener.detail.alt ?? "",
              zoom: zoom(opener.detail.src),
            }}
            title={project.title}
            meta={meta}
          />
        ) : heroPhoto ? (
          <Frame
            src={heroPhoto.src}
            alt={project.title}
            srcSet={heroPhoto.srcSet}
            className="mt-10 aspect-[16/9] w-full lg:mt-14 lg:aspect-[2/1]"
            priority
            sizes="100vw"
            zoom={zoom(heroPhoto.src)}
          />
        ) : null}

        {/* The facts read as the caption of the title photo. */}
        {facts.length > 0 ? (
          <dl
            className={cn(
              "grid grid-cols-2 gap-x-6 border-b border-line px-5 sm:grid-cols-3 sm:px-8 lg:px-gutter",
              SPEC_COLUMNS[Math.min(facts.length, 5)],
            )}
          >
            {facts.map((fact) => (
              <div
                key={`${fact.label}-${fact.value ?? fact.links[0]?.href}`}
                className="border-t border-line py-5 lg:border-t-0 lg:py-7 lg:[&:nth-child(n+6)]:border-t"
              >
                <dt className="font-sans text-[13px] text-muted">{fact.label}</dt>
                <dd className="mt-1.5">
                  {fact.value ? <span className="block font-serif text-[18px] leading-snug text-ink">{fact.value}</span> : null}
                  {fact.links.length > 0 ? (
                    <span className={cn("flex flex-wrap gap-x-3", fact.value && "mt-2")}>
                      {fact.links.map((link) => (
                        <LocaleLink
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "underline decoration-line underline-offset-4 transition-colors hover:decoration-ink",
                            fact.value
                              ? "font-sans text-[14px] text-muted hover:text-ink"
                              : "font-serif text-[18px] leading-snug text-ink",
                          )}
                        >
                          {link.name}
                        </LocaleLink>
                      ))}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {story.length > 0 ? (
          <div className="space-y-3 py-3 lg:space-y-0 lg:py-0">
            {pairs.map((item, index) => (
              <section key={item.frame.src} className={cn("grid lg:grid-cols-12", item.layout.row)}>
                <Frame
                  src={item.frame.src}
                  srcSet={item.frame.srcSet}
                  alt={altOf(item.frame.alt)}
                  className={cn(item.layout.photo, index % 2 === 1 && item.layout.photoFlip)}
                  sizes={item.layout.sizes}
                  drift={!item.frame.portrait}
                  zoom={zoom(item.frame.src)}
                />
                <div
                  data-rise=""
                  className={cn("px-5 py-10 sm:px-8", item.layout.text, index % 2 === 1 ? item.layout.textFlip : item.layout.textSide)}
                >
                  {item.heading ? <h2 className="t-item mb-4 max-w-md text-ink">{item.heading}</h2> : null}
                  <p
                    className={
                      item.lead
                        ? "t-lead max-w-lg text-ink"
                        : "max-w-md font-sans text-[16px] leading-[1.75] text-ink/80"
                    }
                  >
                    {item.text}
                  </p>
                  {/* "Text mit zwei Fotos": the second photo stands small under the text. */}
                  {item.photo2 ? (
                    <Frame
                      src={item.photo2.src}
                      srcSet={item.photo2.srcSet}
                      alt={altOf(item.photo2.alt)}
                      className={cn("mt-8 w-full max-w-xs", item.photo2.portrait ? "aspect-[4/5]" : "aspect-[4/3]")}
                      sizes="(max-width: 1024px) 80vw, 20vw"
                      zoom={zoom(item.photo2.src)}
                    />
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        ) : null}

        {moreText.length > 0 ? (
          <div className="mx-auto max-w-2xl space-y-5 px-5 py-16 sm:px-8">
            {moreText.map((item) => (
              <p
                key={item.text.slice(0, 48)}
                className={item.lead ? "t-lead text-ink" : "type-body text-muted"}
              >
                {item.text}
              </p>
            ))}
          </div>
        ) : null}

        {rest.length > 0 ? (
          <ul className="grid gap-3 px-5 pt-3 pb-8 sm:px-8 lg:grid-cols-12 lg:px-gutter lg:pt-14">
            {restCells(rest).map(({ frame, cell, ratio, sizes }, index) => (
              <li key={`${frame.src}-${index}`} className={cell}>
                <figure>
                  <Frame
                    src={frame.src}
                    alt={altOf(frame.alt)}
                    srcSet={frame.srcSet}
                    className={ratio}
                    sizes={sizes}
                    zoom={zoom(frame.src)}
                  />
                  {describes(frame.alt) ? (
                    <figcaption className="mt-3 max-w-xl font-sans text-[14px] leading-relaxed text-muted">
                      {frame.alt}
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            ))}
          </ul>
        ) : null}
      </article>
      </PhotoViewer>

      {others.length > 0 ? (
        <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-gutter lg:py-20" aria-labelledby="referenz-others">
          <h2
            id="referenz-others"
            className="t-section text-ink"
          >
            {copy.others}
          </h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <li key={item.slug}>
                <LocaleLink href={`/projekte/${item.slug}`} className="group block">
                  <Frame
                    src={item.image}
                    alt={item.title}
                    srcSet={item.srcSet}
                    className="aspect-[4/5]"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <p className="t-item mt-4 text-ink">
                    {item.title}
                  </p>
                  <p className="mt-2 font-sans text-[11px] tracking-[0.18em] text-muted uppercase">
                    {[item.place, item.year].filter(Boolean).join(" · ")}
                  </p>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid bg-nacht lg:grid-cols-12">
        {closePhoto ? (
          <figure className="relative min-h-[18rem] overflow-hidden lg:order-2 lg:col-span-5 lg:min-h-[30rem]">
            <CmsImage
              src={closePhoto.src}
              srcSet={closePhoto.srcSet}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </figure>
        ) : null}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:col-span-7 lg:py-24 lg:pr-16 lg:pl-edge">
          <h2 className="t-section text-paper">
            {blocks.close.title}
          </h2>
          <p className="mt-6 max-w-md font-sans text-[16px] leading-relaxed font-light text-paper/80">
            {blocks.close.text}
          </p>
          <NextSteps
            primary={{ href: blocks.close.buttonHref, label: blocks.close.buttonText }}
            locale={locale}
            tone="dark"
            className="mt-10"
          />
        </div>
      </section>
    </main>
  );
}
