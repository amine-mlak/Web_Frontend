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
  const [lead, ...rest] = hub.branches;

  return (
    <main className="bg-paper">
      <section className="px-5 pt-12 pb-10 sm:px-8 lg:px-14 lg:pt-16" aria-labelledby="projekte-hero">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <h1
            id="projekte-hero"
            className="font-serif text-[48px] leading-[0.9] font-medium tracking-[-0.045em] text-ink sm:text-[76px] lg:col-span-7 lg:text-[88px]"
          >
            {hub.title}
          </h1>
          <p className="max-w-md font-sans text-[17px] leading-relaxed font-light text-muted lg:col-span-5">
            {hub.lede}
          </p>
        </div>
      </section>

      {lead ? (
        <section aria-labelledby="projekte-lead">
          <LocaleLink href={lead.href ?? "/beratung"} className="group block">
            <Frame
              src={lead.image}
              alt={lead.alt}
              srcSet={lead.srcSet}
              className="aspect-[16/9] w-full lg:aspect-[21/9]"
              priority
              sizes="100vw"
            />
            <div className="grid gap-8 border-b border-line px-5 py-10 sm:px-8 lg:grid-cols-12 lg:px-14 lg:py-14">
              {lead.meta ? (
                <p className="font-sans text-[14px] text-muted lg:col-span-3">{lead.meta}</p>
              ) : null}
              <div className="lg:col-span-9">
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
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="flex flex-col justify-center px-5 py-10 sm:px-8 lg:col-span-6 lg:px-14">
                    {branch.meta ? <p className="mb-3 font-sans text-[14px] text-muted">{branch.meta}</p> : null}
                    <h3 className="font-serif text-[30px] leading-tight font-medium tracking-[-0.03em] text-ink md:text-[36px]">
                      {branch.title}
                    </h3>
                    <p className="mt-4 max-w-md font-sans text-[15px] leading-relaxed text-muted">
                      {branch.text}
                    </p>
                  </div>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid lg:grid-cols-12">
        <div className="flex flex-col justify-center bg-karte px-5 py-16 sm:px-8 lg:col-span-5 lg:px-14">
          <p className="font-serif text-[26px] leading-snug font-medium tracking-[-0.03em] text-ink md:text-[32px]">
            {hub.statement}
          </p>
          <p className="mt-6 max-w-sm font-sans text-[15px] leading-relaxed text-muted">
            {hub.statementNote}
          </p>
        </div>
        {hub.quote ? (
          <blockquote className="flex flex-col justify-center bg-nacht px-5 py-16 sm:px-8 lg:col-span-7 lg:px-16">
            <p className="font-serif text-[24px] leading-snug font-medium text-paper md:text-[30px]">
              {hub.quote}
            </p>
            <footer className="mt-6 font-sans text-[14px] text-paper/70">{hub.quoteSource}</footer>
          </blockquote>
        ) : null}
      </section>

      {extras && extras.length > 0 ? (
        <section className="border-b border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-20" aria-labelledby="projekte-more">
          {extrasTitle ? (
            <h2
              id="projekte-more"
              className="font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[40px]"
            >
              {extrasTitle}
            </h2>
          ) : null}
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((item) => (
              <li key={item.href}>
                <LocaleLink href={item.href} className="group block">
                  {item.image ? (
                    <Frame
                      src={item.image}
                      alt={item.title}
                      className="aspect-[4/5]"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  ) : null}
                  <p className="mt-4 font-serif text-[22px] leading-snug font-medium text-ink">
                    {item.title}
                  </p>
                  {item.meta ? (
                    <p className="mt-2 font-sans text-[14px] text-muted">{item.meta}</p>
                  ) : null}
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
