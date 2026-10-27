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

  return (
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

      <div className="absolute inset-0 z-10 flex items-end px-5 pb-16 sm:px-8 sm:pb-20 lg:px-14 lg:pb-24">
        <div className="hero-scrim pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="max-w-3xl text-paper">
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
            {hub.title}
            {hub.emphasis ? ` ${hub.emphasis}` : ""}
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
            className="btn-quiet mt-7 text-paper"
          >
            {hub.ctaLabel}
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}
