import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import type { PresentedHub } from "@/lib/collection-present";

export default function CollectionHero({ hub }: { hub: PresentedHub }) {
  const overviewHref = "#manufaktur-index";
  const topicCount = String(Math.max(hub.branches.length, 1)).padStart(2, "0");
  const topicWord = hub.locale === "en" ? "Topics" : "Themen";
  const readTopics = hub.locale === "en" ? "To the overview" : "Zur Übersicht";
  const crumbs =
    hub.crumbs && hub.crumbs.length > 0
      ? hub.crumbs
      : hub.parentHref && hub.parentLabel
        ? [{ href: hub.parentHref, label: hub.parentLabel }]
        : [];
  const devNote =
    hub.locale === "en"
      ? "Development photography — workshop images follow"
      : "Entwicklungsfotografie — Werkstattbilder folgen";

  return (
    <>
      <section
        data-site-hero=""
        className="relative isolate -mt-14 min-h-[100svh] overflow-hidden bg-nacht"
        aria-labelledby="collection-hero-heading"
      >
        <CmsImage
          src={hub.heroImage}
          alt={hub.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-nacht/85 via-nacht/35 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-nacht via-nacht/20 to-nacht/40"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-5 pt-24 pb-10 sm:px-8 lg:px-14 lg:pt-28 lg:pb-14">
          <div className="flex items-center justify-end gap-6 border-b border-paper/20 pb-4">
            <p className="font-sans text-[11px] tracking-[0.22em] text-paper/70 uppercase">
              {topicCount} {topicWord}
            </p>
          </div>

          <div className="max-w-4xl py-10 lg:py-16">
            <p className="font-sans text-[11px] font-medium tracking-[0.28em] text-messing uppercase">
              {crumbs.map((crumb, index) => (
                <span key={`${crumb.href}-${crumb.label}`}>
                  {index > 0 ? (
                    <span className="mx-2 text-paper/40" aria-hidden="true">
                      /
                    </span>
                  ) : null}
                  <LocaleLink
                    href={crumb.href}
                    className="transition-opacity hover:opacity-70"
                  >
                    {crumb.label}
                  </LocaleLink>
                </span>
              ))}
              {hub.eyebrow ? (
                <>
                  {crumbs.length > 0 ? (
                    <span className="mx-2 text-paper/40" aria-hidden="true">
                      /
                    </span>
                  ) : null}
                  {hub.eyebrow}
                </>
              ) : null}
            </p>
            <h1
              id="collection-hero-heading"
              className="mt-5 font-serif text-[48px] leading-[0.92] font-medium tracking-[-0.035em] text-paper sm:text-[72px] lg:text-[96px]"
            >
              {hub.title}
              <br />
              <em className="font-medium italic">{hub.emphasis}</em>
            </h1>
            {hub.hex ? (
              <p className="mt-6 flex items-center gap-3">
                <span
                  className="size-5 rounded-full border border-paper/35"
                  style={{ backgroundColor: hub.hex }}
                  aria-hidden
                />
                <span className="font-sans text-[11px] tracking-[0.22em] text-paper/70 uppercase">
                  {hub.hex}
                </span>
              </p>
            ) : null}
            <p className="mt-8 max-w-xl font-sans text-[17px] leading-relaxed font-light text-paper/85 md:text-[20px]">
              {hub.lede}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <LocaleLink href={hub.ctaHref} className="pill pill-light">
                {hub.ctaLabel}
              </LocaleLink>
              <a href={overviewHref} className="pill pill-ghost-dark">
                {readTopics}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section aria-label={devNote} className="bg-nacht">
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {hub.filmstrip.map((look, index) => (
            <li key={look.src} className="relative min-w-0">
              <figure className="relative aspect-[4/5] overflow-hidden bg-nacht sm:aspect-[3/4]">
                <CmsImage
                  src={look.src}
                  alt={look.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-nacht/70 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 py-4 sm:px-5">
                  <span className="font-sans text-[10px] tracking-[0.18em] text-paper/80 uppercase">
                    {look.caption}
                  </span>
                  <span className="font-serif text-[18px] leading-none text-messing">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="border-t border-paper/10 px-5 py-3 font-sans text-[10px] tracking-[0.18em] text-paper/45 uppercase sm:px-8 lg:px-14">
          {devNote}
        </p>
      </section>
    </>
  );
}
