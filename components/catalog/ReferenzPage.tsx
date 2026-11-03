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
function projectFacts(project: Project, copy: (typeof COPY)["de" | "en"]): Fact[] {
  const facts: Fact[] = project.specs.map((spec) => ({ label: spec.label, value: spec.value, links: [] }));
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
  const facts = projectFacts(project, copy);

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
        {facts.length > 0 ? (
          <dl
            className={cn(
              "grid grid-cols-2 gap-x-6 border-b border-line px-5 sm:grid-cols-3 sm:px-8 lg:px-14",
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
                  {fact.value ? <span className="block font-serif text-[19px] leading-snug text-ink">{fact.value}</span> : null}
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
                              : "font-serif text-[19px] leading-snug text-ink",
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
