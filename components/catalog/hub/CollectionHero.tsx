import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import type { PresentedHub } from "@/lib/collection-present";

export default function CollectionHero({ hub }: { hub: PresentedHub }) {
  const crumbs =
    hub.crumbs && hub.crumbs.length > 0
      ? hub.crumbs
      : hub.parentHref && hub.parentLabel
        ? [{ href: hub.parentHref, label: hub.parentLabel }]
        : [];
  const filmstripLabel = hub.locale === "en" ? "Looks" : "Ansichten";

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

        <div className="absolute inset-0 z-10 flex items-end px-4 pb-16 sm:px-8 sm:pb-20 lg:px-14 lg:pb-28">
          <div className="w-fit max-w-full bg-transparent px-3 py-3 text-paper backdrop-blur-[12px] sm:px-4 sm:py-3.5">
            {crumbs.length > 0 || hub.eyebrow ? (
              <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-paper uppercase">
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
            ) : null}
            <h1
              id="collection-hero-heading"
              className="mt-2 font-serif text-[36px] leading-[1.05] font-medium tracking-[-0.02em] text-paper sm:mt-2.5 sm:text-[44px] lg:text-[52px]"
            >
              {hub.title}{" "}
              <em className="font-medium italic">{hub.emphasis}</em>
            </h1>
            {hub.hex ? (
              <p className="mt-3 flex items-center gap-3">
                <span
                  className="size-4 rounded-full border border-paper/35"
                  style={{ backgroundColor: hub.hex }}
                  aria-hidden
                />
                <span className="font-sans text-[11px] tracking-[0.22em] text-paper/80 uppercase">
                  {hub.hex}
                </span>
              </p>
            ) : null}
            <p className="mt-3 max-w-lg font-sans text-[16px] leading-relaxed font-light text-paper md:text-[18px]">
              {hub.lede}
            </p>
            <LocaleLink
              href={hub.ctaHref}
              className="mt-5 inline-flex items-center rounded-full bg-paper px-5 py-2.5 font-sans text-[15px] text-ink transition-colors hover:bg-white"
            >
              {hub.ctaLabel}
            </LocaleLink>
          </div>
        </div>
      </section>

      <section aria-label={filmstripLabel} className="bg-nacht">
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
      </section>
    </>
  );
}
