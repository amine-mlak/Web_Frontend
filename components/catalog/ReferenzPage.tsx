import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import NextSteps from "@/components/catalog/NextSteps";
import { Breadcrumbs } from "@/components/catalog/clusters/parts";
import { Frame } from "@/components/catalog/collections/parts";
import type { Project } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";

const COPY = {
  de: {
    eyebrow: "Referenzküche",
    projects: "Projekte",
    file: "Hausakte",
    equipment: "Ausstattung",
    materials: "Material",
    appliances: "Geräte",
    brands: "Marken",
    region: "Ort",
    topics: "Themen",
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
    equipment: "Specification",
    materials: "Material",
    appliances: "Appliances",
    brands: "Brands",
    region: "Place",
    topics: "Themes",
    others: "Similar houses",
    close: "Your house is none of these.",
    closeText: "The file shows what was built. What is made for you follows the survey.",
    cta: "Plan something similar",
  },
} as const;

/** The file name, so the same photo matches at any size or host. */
function photoKey(src: string) {
  return src.split("?")[0].split("/").pop() ?? src;
}

function paragraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
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
  const groups = [
    {
      label: copy.materials,
      links: project.materials.map((item) => ({
        href: `/material/${item.slug}`,
        label: item.name,
      })),
    },
    {
      label: copy.appliances,
      links: project.appliances.map((item) => ({
        href: `/geraete/${item.slug}`,
        label: item.name,
      })),
    },
    {
      label: copy.brands,
      links: project.brands.map((item) => ({
        href: `/marken/${item.slug}`,
        label: item.name,
      })),
    },
    {
      label: copy.region,
      links: project.regions.map((item) => ({
        href: `/regionen/${item.slug}`,
        label: item.name,
      })),
    },
    {
      label: copy.topics,
      links: project.topics.map((item) => ({
        href: `/kuechen/${item.cluster}/${item.slug}`,
        label: item.name,
      })),
    },
  ].filter((group) => group.links.length > 0);

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

        <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-14 lg:py-24">
          <div className="lg:col-span-5">
            {project.specs.length > 0 ? (
              <dl className="border-t border-line">
                {project.specs.map((spec) => (
                  <div
                    key={`${spec.label}-${spec.value}`}
                    className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 border-b border-line py-4"
                  >
                    <dt className="type-eyebrow text-muted">{spec.label}</dt>
                    <dd className="font-serif text-[18px] leading-snug text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
          <div className="lg:col-span-7">
            {project.intro ? (
              <p className="font-serif text-[28px] leading-[1.2] font-medium tracking-[-0.03em] text-ink md:text-[36px]">
                {project.intro}
              </p>
            ) : null}
            {body.length > 0 ? (
              <div className="mt-8 max-w-xl space-y-5">
                {body.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)} className="type-body text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {gallery.length > 0 ? (
          <ul className="grid gap-3 px-5 pb-8 sm:px-8 lg:grid-cols-12 lg:px-14">
            {gallery.map((frame, index) => (
              <li
                key={`${frame.src}-${index}`}
                className={index % 3 === 0 ? "lg:col-span-7" : "lg:col-span-5"}
              >
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden bg-nacht">
                    <CmsImage
                      src={frame.src}
                      alt={frame.alt || project.title}
                      srcSet={frame.srcSet}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  {frame.alt ? (
                    <figcaption className="mt-3 font-sans text-[11px] tracking-[0.18em] text-muted uppercase">
                      {frame.alt}
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            ))}
          </ul>
        ) : null}

        {groups.length > 0 ? (
          <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14" aria-label={copy.equipment}>
            <p className="type-eyebrow text-gold">{copy.equipment}</p>
            <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <div key={group.label}>
                  <h2 className="font-sans text-[11px] tracking-[0.18em] text-muted uppercase">
                    {group.label}
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <LocaleLink
                          href={link.href}
                          className="font-serif text-[22px] leading-snug text-ink transition-opacity hover:opacity-60"
                        >
                          {link.label}
                        </LocaleLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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
                    imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
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
