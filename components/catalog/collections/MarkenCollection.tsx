import CtaPair from "@/components/CtaPair";
import type { ReactNode } from "react";
import CmsImage from "@/components/CmsImage";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd, PhotoBy, type CollectionExtra } from "@/components/catalog/collections/parts";
import { QuoteLine } from "@/components/catalog/clusters/parts";
import { MARKEN_OPENER_BRAND, brandPhoto } from "@/lib/brand-photos";
import { fetchBrandLogos } from "@/lib/strapi";
import { cn } from "@/lib/utils";

/**
 * The brands overview: the title, one photo from a brand that grows to the full width while it
 * scrolls in, then the brands as large photo tiles (two in the first row, three in the second),
 * each with name, logo and text. The photos are the brands' own.
 */
export default async function MarkenCollection({
  hub,
  extras,
  extrasTitle,
  children,
}: {
  hub: PresentedHub;
  extras?: CollectionExtra[];
  extrasTitle?: string;
  children?: ReactNode;
}) {
  const logos = await fetchBrandLogos();
  const en = hub.locale === "en";
  const view = en ? "View" : "ansehen";
  const opener = brandPhoto(MARKEN_OPENER_BRAND, hub.locale);
  const openerName = logos.find((brand) => brand.slug === MARKEN_OPENER_BRAND)?.name ?? "";

  const tiles = hub.branches.map((branch) => {
    const slug = branch.href?.split("/").pop() ?? "";
    // The opening photo is not shown a second time in the tile of its brand.
    const maker = brandPhoto(slug, hub.locale, opener?.file);
    return {
      ...branch,
      maker: Boolean(maker),
      image: maker?.src ?? branch.image,
      srcSet: maker ? maker.srcSet : branch.srcSet,
      alt: maker?.alt ?? branch.alt,
      logo: logos.find((brand) => brand.slug === slug),
    };
  });

  return (
    <main className="bg-paper">
      <section className="px-5 pt-12 pb-10 sm:px-8 lg:px-gutter lg:pt-20 lg:pb-14" aria-labelledby="marken-hero">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <h1 id="marken-hero" className="t-display text-ink lg:col-span-5">
            {hub.title}
          </h1>
          <div className="lg:col-span-6 lg:col-start-7 lg:pb-3">
            <p className="t-lede text-ink">{hub.lede}</p>
            {hub.statement ? (
              <p className="mt-3 max-w-xl font-sans text-[16px] leading-relaxed text-muted">{hub.statement}</p>
            ) : null}
            <CtaPair href={hub.ctaHref} label={hub.ctaLabel} locale={hub.locale} className="mt-7" />
          </div>
        </div>
      </section>

      {opener ? (
        <section
          className="photo-grow relative h-[72svh] min-h-[420px] overflow-hidden bg-nacht lg:h-[80svh] lg:max-h-[760px]"
          aria-label={hub.statementNote || hub.title}
        >
          <Frame
            src={opener.src}
            srcSet={opener.srcSet}
            alt={opener.alt}
            className="absolute inset-0"
            priority
            sizes="100vw"
          />
          {hub.statementNote ? (
            <>
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgb(0 0 0 / 0.6) 0%, rgb(0 0 0 / 0.22) 44%, rgb(0 0 0 / 0) 72%)",
                }}
              />
              <p className="t-section absolute inset-x-0 bottom-12 mx-auto w-4/5 max-w-3xl text-center text-paper lg:bottom-16 lg:w-2/3">
                {hub.statementNote}
              </p>
            </>
          ) : null}
          {openerName ? <PhotoBy name={openerName} locale={hub.locale} /> : null}
        </section>
      ) : null}

      <section className="px-5 pt-14 pb-6 sm:px-8 lg:px-gutter lg:pt-24 lg:pb-10" aria-label={hub.title}>
        <ul className="grid gap-x-6 gap-y-12 lg:grid-cols-12 lg:gap-y-16">
          {tiles.map((tile, index) => (
            <li
              key={tile.title}
              data-rise
              style={{ transitionDelay: `${(index < 2 ? index : index - 2) * 120}ms` }}
              className={cn(index === 0 ? "lg:col-span-7" : index === 1 ? "lg:col-span-5" : "lg:col-span-4")}
            >
              <LocaleLink href={tile.href ?? "/beratung"} className="group block">
                <div className="relative">
                  <Frame
                    src={tile.image}
                    alt={tile.alt}
                    srcSet={tile.srcSet}
                    className={cn(
                      "h-[62vw]",
                      index < 2 ? "lg:h-[clamp(280px,33vw,470px)]" : "lg:h-[clamp(230px,23vw,330px)]",
                    )}
                    sizes={index < 2 ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 33vw"}
                  />
                  {tile.maker ? <PhotoBy name={tile.title} locale={hub.locale} /> : null}
                </div>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <h2 className="t-feature text-ink">{tile.title}</h2>
                  {tile.logo ? (
                    <span className="relative block h-5 w-28 shrink-0">
                      <CmsImage
                        src={tile.logo.logo}
                        alt=""
                        fill
                        sizes="112px"
                        className="object-contain object-right"
                      />
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 max-w-xl font-sans text-[16px] leading-relaxed text-muted">{tile.text}</p>
                <span className="mt-4 inline-block font-sans text-[15px] text-gold transition-colors group-hover:text-ink">
                  {view} <span aria-hidden>→</span>
                </span>
              </LocaleLink>
            </li>
          ))}
        </ul>
      </section>

      {extras && extras.length > 0 ? (
        <section className="border-b border-line px-5 py-16 sm:px-8 lg:px-gutter lg:py-20">
          {extrasTitle ? <h2 className="t-section text-ink">{extrasTitle}</h2> : null}
          <ul className="mt-10 grid gap-x-12 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((item) => (
              <li key={item.href} className="border-t border-line">
                <LocaleLink
                  href={item.href}
                  className="t-item block py-4 text-ink transition-colors hover:text-gold"
                >
                  {item.title}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <QuoteLine quote={hub.quote} source={hub.quoteSource} tone="nacht" />

      <div className="bg-paper">
        <HubEnd hub={hub}>{children}</HubEnd>
      </div>
    </main>
  );
}
