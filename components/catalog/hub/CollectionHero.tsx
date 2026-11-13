import CtaPair from "@/components/CtaPair";
import CmsImage from "@/components/CmsImage";
import { Crumbs } from "@/components/catalog/clusters/parts";
import type { PresentedHub } from "@/lib/collection-present";

export default function CollectionHero({
  hub,
  display = false,
}: {
  hub: PresentedHub;
  /** A hub's own opener: the page name at the size every hub uses. */
  display?: boolean;
}) {
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

      <div className="absolute inset-0 z-10 flex items-end px-5 pb-16 sm:px-8 sm:pb-20 lg:px-gutter lg:pb-24">
        <div className="hero-scrim pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="max-w-3xl text-paper">
          <Crumbs hub={hub} tone="paper" />
          <h1
            id="collection-hero-heading"
            className={
              display
                ? "t-display mt-4 text-paper"
                : "mt-2 font-serif text-[32px] md:text-[42px] xl:text-[60px] leading-[1.05] font-medium tracking-[-0.02em] text-paper sm:mt-2.5"
            }
          >
            {hub.title}
          </h1>
          {hub.hex ? (
            <p className="mt-3 flex items-center gap-3">
              <span
                className="size-4 rounded-full border border-paper/35"
                style={{ backgroundColor: hub.hex }}
                aria-hidden
              />
              <span className="font-sans text-[14px] text-paper/80">{hub.hex}</span>
            </p>
          ) : null}
          <p className={display ? "t-lede mt-5 max-w-lg text-paper/90" : "mt-3 max-w-lg font-sans text-[16px] leading-relaxed font-light text-paper md:text-[18px]"}>
            {hub.lede}
          </p>
          <CtaPair href={hub.ctaHref} label={hub.ctaLabel} locale={hub.locale} tone="image" className="mt-7" />
        </div>
      </div>
    </section>
  );
}
