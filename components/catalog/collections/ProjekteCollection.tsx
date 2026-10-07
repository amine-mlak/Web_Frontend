import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd, type CollectionExtra } from "@/components/catalog/collections/parts";

export default function ProjekteCollection({
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
  const dossier = hub.locale === "en" ? "House file" : "Hausakte";
  const open = hub.locale === "en" ? "Open the house" : "Haus öffnen";
  const [lead, ...rest] = hub.branches;

  return (
    <main className="bg-paper">
      <section className="px-5 pt-12 pb-10 sm:px-8 lg:px-14 lg:pt-16" aria-labelledby="projekte-hero">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <p className="type-eyebrow text-gold">{hub.eyebrow}</p>
          <p className="font-sans text-[11px] tracking-[0.22em] text-muted uppercase">
            {dossier}
          </p>
        </div>
        <div className="mt-10 grid items-end gap-10 lg:grid-cols-12">
          <h1
            id="projekte-hero"
            className="font-serif text-[48px] leading-[0.9] font-medium tracking-[-0.045em] text-ink sm:text-[76px] lg:col-span-7 lg:text-[88px]"
          >
            {hub.title}
            <span className="mt-2 block italic text-espresso">{hub.emphasis}</span>
          </h1>
          <p className="max-w-md font-sans text-[17px] leading-relaxed font-light text-muted lg:col-span-5">
            {hub.lede}
          </p>
        </div>
        <ul className="mt-12 grid grid-cols-2 border-y border-line sm:grid-cols-4">
          {hub.facts.map((fact) => (
            <li
              key={`${fact.value}-${fact.label}`}
              className="border-line px-4 py-5 not-first:border-l sm:px-5"
            >
              <p className="font-serif text-[22px] leading-none font-medium text-ink">
                {fact.value}
              </p>
              <p className="mt-2 font-sans text-[11px] tracking-[0.18em] text-muted uppercase">
                {fact.label}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {lead ? (
        <section aria-labelledby="projekte-lead">
          <LocaleLink href={lead.href ?? "/beratung"} className="group block">
            <Frame
              src={lead.image}
              alt={lead.alt}
              srcSet={lead.srcSet}
              className="aspect-[16/9] w-full lg:aspect-[21/9]"
              imgClassName="transition-transform duration-700 group-hover:scale-[1.02]"
              priority
              sizes="100vw"
            />
            <div className="grid gap-8 border-b border-line px-5 py-10 sm:px-8 lg:grid-cols-12 lg:px-14 lg:py-14">
              <div className="lg:col-span-3">
                <p className="type-eyebrow text-gold">{lead.kicker}</p>
                {lead.meta ? (
                  <p className="mt-4 font-sans text-[13px] tracking-[0.16em] text-muted uppercase">
                    {lead.meta}
                  </p>
                ) : null}
              </div>
              <div className="lg:col-span-7">
                <h2
                  id="projekte-lead"
                  className="font-serif text-[36px] leading-tight font-medium tracking-[-0.03em] text-ink md:text-[48px]"
                >
                  {lead.title}
                </h2>
                <p className="mt-5 max-w-xl font-sans text-[16px] leading-relaxed text-muted">
                  {lead.text}
                </p>
              </div>
              <p className="self-end font-sans text-[11px] tracking-[0.22em] text-gold uppercase lg:col-span-2 lg:text-right">
                {open}
              </p>
            </div>
          </LocaleLink>
        </section>
      ) : (
        <Frame
          src={hub.heroImage}
          alt={hub.heroAlt}
          className="aspect-[16/9] w-full lg:aspect-[21/9]"
          priority
          sizes="100vw"
        />
      )}

      {rest.length > 0 ? (
        <section aria-labelledby="projekte-files">
          <h2 id="projekte-files" className="sr-only">
            {hub.indexEyebrow}
          </h2>
          <ul>
            {rest.map((branch) => (
              <li key={branch.title} className="border-b border-line">
                <LocaleLink
                  href={branch.href ?? "/beratung"}
                  className="group grid lg:grid-cols-12"
                >
                  <Frame
                    src={branch.image}
                    alt={branch.alt}
                    srcSet={branch.srcSet}
                    className="aspect-[16/10] lg:col-span-6 lg:aspect-[16/9]"
                    imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="flex flex-col justify-center px-5 py-10 sm:px-8 lg:col-span-6 lg:px-14">
                    <p className="font-serif text-[18px] text-gold">{branch.kicker}</p>
                    {branch.meta ? (
                      <p className="mt-3 font-sans text-[12px] tracking-[0.18em] text-muted uppercase">
                        {branch.meta}
                      </p>
                    ) : null}
                    <h3 className="mt-4 font-serif text-[30px] leading-tight font-medium tracking-[-0.03em] text-ink md:text-[36px]">
                      {branch.title}
                    </h3>
                    <p className="mt-4 max-w-md font-sans text-[15px] leading-relaxed text-muted">
                      {branch.text}
                    </p>
                    <span className="mt-8 type-eyebrow text-gold">{open}</span>
                  </div>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid lg:grid-cols-12">
        <div className="flex flex-col justify-center bg-karte px-5 py-16 sm:px-8 lg:col-span-5 lg:px-14">
          <p className="type-eyebrow text-gold">
            {hub.locale === "en" ? "What we show" : "Was wir zeigen"}
          </p>
          <p className="mt-6 font-serif text-[26px] leading-snug font-medium tracking-[-0.03em] text-ink md:text-[32px]">
            {hub.statement}
          </p>
          <p className="mt-6 max-w-sm font-sans text-[15px] leading-relaxed text-muted">
            {hub.statementNote}
          </p>
        </div>
        <blockquote className="flex flex-col justify-center bg-nacht px-5 py-16 sm:px-8 lg:col-span-7 lg:px-16">
          <p className="font-serif text-[24px] leading-snug font-medium italic text-paper md:text-[30px]">
            {hub.quote}
          </p>
          <footer className="mt-6 type-eyebrow text-messing">{hub.quoteSource}</footer>
        </blockquote>
      </section>

      {extras && extras.length > 0 ? (
        <section className="border-b border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-20">
          {extrasTitle ? (
            <h2 className="font-serif text-[28px] font-medium tracking-[-0.03em] text-ink">
              {extrasTitle}
            </h2>
          ) : null}
          <ol className="mt-8 divide-y divide-line border-y border-line">
            {extras.map((item, index) => (
              <li key={item.href}>
                <LocaleLink
                  href={item.href}
                  className="grid items-center gap-4 py-5 sm:grid-cols-12"
                >
                  <span className="font-serif text-[18px] text-gold sm:col-span-1">
                    {String(index + 4).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-[22px] font-medium text-ink sm:col-span-6">
                    {item.title}
                  </span>
                  <span className="font-sans text-[12px] tracking-[0.16em] text-muted uppercase sm:col-span-5 sm:text-right">
                    {item.meta}
                  </span>
                </LocaleLink>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <HubEnd hub={hub}>{children}</HubEnd>
    </main>
  );
}
