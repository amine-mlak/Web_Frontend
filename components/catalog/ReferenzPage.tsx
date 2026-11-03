import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import NextSteps from "@/components/catalog/NextSteps";
import { Breadcrumbs } from "@/components/catalog/clusters/parts";
import { Frame } from "@/components/catalog/collections/parts";
import type { KitchenClusterSlug, Project } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import { cn, photoKey } from "@/lib/utils";

const COPY = {
  de: {
    eyebrow: "Referenzküche",
    projects: "Projekte",
    file: "Hausakte",
    equipment: "In dieser Küche",
    equipmentLead: "Was diese Küche ausmacht. Jedes Bild führt zu weiteren Küchen dieser Art.",
    here: "Hier",
    material: "Material",
    appliance: "Gerät",
    brand: "Marke",
    region: "Region",
    cluster: { farben: "Farbe", stile: "Stil", formen: "Form", inseln: "Insel", besondere: "Besonderheit" },
    others: "Ähnliche Häuser",
    close: "Ihr Haus ist keines davon.",
    closeText:
      "Die Akte zeigt, was gebaut wurde. Was bei Ihnen entsteht, folgt dem Aufmaß.",
    cta: "Ähnliches planen",
  },
  en: {
    eyebrow: "Reference kitchen",
    projects: "Projects",
    file: "House file",
    equipment: "In this kitchen",
    equipmentLead: "What defines this kitchen. Each picture leads to more kitchens of the kind.",
    here: "Here",
    material: "Material",
    appliance: "Appliance",
    brand: "Brand",
    region: "Region",
    cluster: { farben: "Colour", stile: "Style", formen: "Layout", inseln: "Island", besondere: "Feature" },
    others: "Similar houses",
    close: "Your house is none of these.",
    closeText: "The file shows what was built. What is made for you follows the survey.",
    cta: "Plan something similar",
  },
} as const;

function paragraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

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

function firstSentence(text: string) {
  return (text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text).trim();
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

type Feature = { kind: string; name: string; href: string; image?: string; srcSet?: string; line: string };

/** One card per theme, material, appliance, brand and region of the project, each with a picture. */
function projectFeatures(project: Project, copy: (typeof COPY)["de" | "en"]): Feature[] {
  const here = (value: string) => `${copy.here}: ${value}`;
  const specWhere = (match: (label: string, value: string) => boolean) =>
    project.specs.find((spec) => match(spec.label, spec.value))?.value;
  const naming = (name: string) => {
    const words = [name, ...name.split(/[\s-]+/).filter((word) => word.length >= 4)].map((word) => word.toLowerCase());
    return specWhere((_, value) => words.some((word) => value.toLowerCase().includes(word)));
  };
  const line = (spec: string | undefined, intro: string) => (spec ? here(spec) : firstSentence(intro));

  const topics = [...project.topics]
    .sort((a, b) => CLUSTER_ORDER.indexOf(a.cluster) - CLUSTER_ORDER.indexOf(b.cluster))
    .map((topic) => {
      const label = CLUSTER_SPEC[topic.cluster];
      return {
        kind: copy.cluster[topic.cluster],
        name: topic.name,
        href: `/kuechen/${topic.cluster}/${topic.slug}`,
        image: topic.image,
        line: line(label ? specWhere((specLabel) => label.test(specLabel)) : undefined, topic.intro),
      };
    });
  const named = <T extends { slug: string; name: string; image?: string; srcSet?: string; intro: string }>(
    items: T[],
    kind: string,
    path: string,
  ) =>
    items.map((item) => ({
      kind,
      name: item.name,
      href: `${path}/${item.slug}`,
      image: item.image,
      srcSet: item.srcSet,
      line: line(naming(item.name), item.intro),
    }));
  return [
    ...topics,
    ...named(project.materials, copy.material, "/material"),
    ...named(project.appliances, copy.appliance, "/geraete"),
    ...named(project.brands, copy.brand, "/marken"),
    ...project.regions.map((region) => ({
      kind: copy.region,
      name: region.name,
      href: `/regionen/${region.slug}`,
      image: region.image,
      line: line(project.place || undefined, region.intro),
    })),
  ];
}

export default function ReferenzPage({
  project,
  others,
  locale,
}: {
  project: Project;
  others: Project[];
  locale: Locale;
}) {
  const copy = COPY[locale === "en" ? "en" : "de"];
  const meta = [project.place, project.year].filter(Boolean).join(" · ");
  const body = paragraphs(project.body);
  // The hero photo is not repeated in the gallery, and no photo appears twice.
  const seen = new Set(project.image ? [photoKey(project.image)] : []);
  const gallery = project.gallery.filter((frame) => {
    const key = photoKey(frame.src);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  // The last frame moves to the closing band instead of being shown twice.
  const closePhoto = gallery.length > 3 ? gallery.pop()! : null;
  // The intro and each paragraph stand beside a gallery photo, in gallery order; the rest follow below.
  const texts = [...(project.intro ? [{ lead: true, text: project.intro }] : []), ...body.map((text) => ({ lead: false, text }))];
  const story = texts.slice(0, gallery.length).map((item, index) => ({ ...item, frame: gallery[index] }));
  const moreText = texts.slice(story.length);
  const rest = gallery.slice(story.length);
  const features = projectFeatures(project, copy).filter((feature) => feature.image);

  return (
    <main className="bg-paper">
      <article>
        <header className="px-5 pt-10 sm:px-8 lg:px-14 lg:pt-16">
          <Breadcrumbs items={[{ href: "/projekte", label: copy.projects }]} current={project.title} locale={locale} />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <p className="type-eyebrow text-gold">{copy.eyebrow}</p>
            <p className="font-sans text-[11px] tracking-[0.22em] text-muted uppercase">
              {copy.file}
            </p>
          </div>
          <h1 className="mt-8 max-w-4xl font-serif text-[44px] leading-[0.92] font-medium tracking-[-0.04em] text-ink sm:text-[68px] lg:text-[80px]">
            {project.title}
          </h1>
          {meta ? (
            <p className="mt-5 font-sans text-[12px] tracking-[0.18em] text-muted uppercase">
              {meta}
            </p>
          ) : null}
        </header>

        {project.image ? (
          <Frame
            src={project.image}
            alt={project.title}
            srcSet={project.srcSet}
            className="mt-10 aspect-[16/9] w-full lg:mt-14 lg:aspect-[2/1]"
            priority
            sizes="100vw"
          />
        ) : null}

        {/* The facts read as the caption of the title photo. */}
        {project.specs.length > 0 ? (
          <dl
            className={cn(
              "grid grid-cols-2 gap-x-6 border-b border-line px-5 sm:grid-cols-3 sm:px-8 lg:px-14",
              SPEC_COLUMNS[Math.min(project.specs.length, 5)],
            )}
          >
            {project.specs.map((spec) => (
              <div key={`${spec.label}-${spec.value}`} className="border-t border-line py-5 lg:border-t-0 lg:py-7">
                <dt className="font-sans text-[13px] text-muted">{spec.label}</dt>
                <dd className="mt-1.5 font-serif text-[19px] leading-snug text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {story.length > 0 ? (
          <div className="space-y-3 py-3 lg:space-y-0 lg:py-0">
            {story.map((item, index) => (
              <section key={item.frame.src} className="grid items-center lg:grid-cols-12">
                <Frame
                  src={item.frame.src}
                  srcSet={item.frame.srcSet}
                  alt={describes(item.frame.alt) ? item.frame.alt : project.title}
                  className={cn("aspect-[4/3] lg:col-span-7", index % 2 === 1 && "lg:order-2")}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div className={cn("px-5 py-10 sm:px-8 lg:col-span-5 lg:px-14 lg:py-16", index % 2 === 1 && "lg:order-1")}>
                  <p
                    className={
                      item.lead
                        ? "max-w-lg font-serif text-[28px] leading-[1.2] font-medium tracking-[-0.03em] text-ink md:text-[34px]"
                        : "max-w-md font-sans text-[17px] leading-[1.75] text-ink/80"
                    }
                  >
                    {item.text}
                  </p>
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
                className={item.lead ? "font-serif text-[28px] leading-[1.2] font-medium text-ink md:text-[34px]" : "type-body text-muted"}
              >
                {item.text}
              </p>
            ))}
          </div>
        ) : null}

        {rest.length > 0 ? (
          <ul className="grid gap-3 px-5 pt-3 pb-8 sm:px-8 lg:grid-cols-12 lg:px-14 lg:pt-14">
            {rest.map((frame, index) => (
              <li
                key={`${frame.src}-${index}`}
                className={index % 3 === 0 ? "lg:col-span-7" : "lg:col-span-5"}
              >
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden bg-nacht">
                    <CmsImage
                      src={frame.src}
                      alt={describes(frame.alt) ? frame.alt : project.title}
                      srcSet={frame.srcSet}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
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

        {features.length > 0 ? (
          <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-24" aria-labelledby="referenz-features">
            <h2
              id="referenz-features"
              className="font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[40px]"
            >
              {copy.equipment}
            </h2>
            <p className="mt-3 max-w-xl font-sans text-[16px] leading-relaxed text-muted">{copy.equipmentLead}</p>
            <ul
              className={cn(
                "mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 sm:gap-y-12",
                features.length === 1 && "max-w-md sm:grid-cols-1",
                features.length === 4 && "lg:grid-cols-4",
                features.length !== 4 && features.length > 2 && "lg:grid-cols-3",
              )}
            >
              {features.map((feature) => (
                <li key={feature.href}>
                  {/* Photo beside the text on phones, so four cards don't become four screens. */}
                  <LocaleLink href={feature.href} className="group grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-5 sm:block">
                    <Frame
                      src={feature.image!}
                      srcSet={feature.srcSet}
                      alt={feature.name}
                      className="aspect-[4/5]"
                      sizes="(max-width: 640px) 120px, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div>
                      <p className="font-sans text-[13px] text-muted sm:mt-5">{feature.kind}</p>
                      <p className="mt-1 font-serif text-[22px] leading-snug font-medium tracking-[-0.02em] text-ink underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-ink sm:text-[26px]">
                        {feature.name}
                      </p>
                      {feature.line ? (
                        <p className="mt-2 max-w-sm font-sans text-[15px] leading-relaxed text-muted">{feature.line}</p>
                      ) : null}
                    </div>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>

      {others.length > 0 ? (
        <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-20" aria-labelledby="referenz-others">
          <h2
            id="referenz-others"
            className="font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[40px]"
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
                  <p className="mt-4 font-serif text-[22px] leading-snug font-medium text-ink">
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
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:col-span-7 lg:px-16 lg:py-24">
          <h2 className="font-serif text-[36px] leading-[1.08] font-medium tracking-[-0.03em] text-paper md:text-[48px]">
            {copy.close}
          </h2>
          <p className="mt-6 max-w-md font-sans text-[17px] leading-relaxed font-light text-paper/80">
            {copy.closeText}
          </p>
          <NextSteps primary={{ href: "/beratung", label: copy.cta }} locale={locale} tone="dark" className="mt-10" />
        </div>
      </section>
    </main>
  );
}
