import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd, type CollectionExtra } from "@/components/catalog/collections/parts";

export default function RegionenCollection({
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
  const atlas = hub.locale === "en" ? "Gazetteer" : "Ortsverzeichnis";
  const centre = hub.locale === "en" ? "Centre" : "Mitte";
  const radiusFact = hub.facts.find((fact) => /km/i.test(fact.value)) ?? hub.facts[2];

  return (
    <main className="bg-paper">
      <section
        className="relative overflow-hidden px-5 pt-16 pb-20 text-center sm:px-8 lg:px-14 lg:pt-24 lg:pb-28"
        aria-labelledby="regionen-hero"
      >
        <p className="type-eyebrow text-gold">{hub.eyebrow}</p>
        <h1
          id="regionen-hero"
          className="mx-auto mt-8 max-w-4xl font-serif text-[48px] leading-[0.92] font-medium tracking-[-0.045em] text-ink sm:text-[80px] lg:text-[96px]"
        >
          {hub.title}
          <span className="mt-3 block italic text-espresso">{hub.emphasis}</span>
        </h1>
        <p className="mx-auto mt-8 max-w-lg font-sans text-[17px] leading-relaxed font-light text-muted">
          {hub.lede}
        </p>
        <div className="mx-auto mt-16 flex size-[13.5rem] items-center justify-center rounded-full border border-line sm:size-[16rem]">
          <div className="flex size-[10.5rem] items-center justify-center rounded-full border border-gold/35 sm:size-[12.5rem]">
            <div>
              <p className="font-serif text-[40px] leading-none font-medium tracking-[-0.04em] text-ink sm:text-[48px]">
                {radiusFact?.value ?? "200 km"}
              </p>
              <p className="mt-3 font-sans text-[11px] tracking-[0.22em] text-gold uppercase">
                {radiusFact?.label ?? centre}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-8 font-sans text-[12px] tracking-[0.2em] text-muted uppercase">
          {centre}: {hub.placeLine}
        </p>
        <LocaleLink href={hub.ctaHref} className="pill pill-primary mt-10">
          {hub.ctaLabel}
        </LocaleLink>
      </section>

      <section className="border-y border-line bg-karte">
        <div className="mx-auto grid max-w-[90rem] lg:grid-cols-12">
          <Frame
            src={hub.heroImage}
            alt={hub.heroAlt}
            className="min-h-[18rem] lg:col-span-7 lg:min-h-[28rem]"
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
          <div className="flex flex-col justify-center px-5 py-12 sm:px-8 lg:col-span-5 lg:px-12">
            <p className="type-eyebrow text-gold">{atlas}</p>
            <p className="mt-5 font-serif text-[24px] leading-snug font-medium tracking-[-0.03em] text-ink md:text-[30px]">
              {hub.statement}
            </p>
            <p className="mt-5 font-sans text-[15px] leading-relaxed text-muted">
              {hub.statementNote}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="regionen-places" className="px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <div className="flex items-end justify-between gap-6">
          <h2 id="regionen-places" className="type-h2">
            {hub.indexEyebrow}
          </h2>
          <p className="hidden font-sans text-[12px] tracking-[0.18em] text-muted uppercase sm:block">
            {atlas}
          </p>
        </div>
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {hub.branches.map((branch) => (
            <li key={branch.title}>
              <LocaleLink
                href={branch.href ?? "/beratung"}
                className="group grid items-center gap-6 py-8 lg:grid-cols-12 lg:py-10"
              >
                <p className="font-serif text-[28px] text-gold lg:col-span-1">
                  {branch.kicker}
                </p>
                <div className="lg:col-span-4">
                  <h3 className="font-serif text-[32px] leading-tight font-medium tracking-[-0.03em] text-ink md:text-[40px]">
                    {branch.title}
                  </h3>
                </div>
                <p className="font-sans text-[15px] leading-relaxed text-muted lg:col-span-4">
                  {branch.text}
                </p>
                <Frame
                  src={branch.image}
                  alt={branch.alt}
                  srcSet={branch.srcSet}
                  className="aspect-[16/10] lg:col-span-3"
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </LocaleLink>
            </li>
          ))}
        </ul>
      </section>

      {extras && extras.length > 0 ? (
        <section className="border-b border-line bg-karte px-5 py-16 sm:px-8 lg:px-14">
          {extrasTitle ? (
            <h2 className="type-eyebrow text-gold">{extrasTitle}</h2>
          ) : null}
          <ul className="mt-8 columns-1 gap-x-12 sm:columns-2 lg:columns-3">
            {extras.map((item) => (
              <li key={item.href} className="break-inside-avoid border-t border-line">
                <LocaleLink
                  href={item.href}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <span className="font-serif text-[20px] font-medium text-ink">
                    {item.title}
                  </span>
                  <span aria-hidden className="text-gold">
                    →
                  </span>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <HubEnd hub={hub}>{children}</HubEnd>
    </main>
  );
}
