import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd, StatementBand, type CollectionExtra } from "@/components/catalog/collections/parts";
import { QuoteLine } from "@/components/catalog/clusters/parts";

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
      <section className="px-5 pt-12 pb-10 sm:px-8 lg:px-gutter lg:pt-16" aria-labelledby="projekte-hero">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <h1
            id="projekte-hero"
            className="t-display text-ink lg:col-span-7"
          >
            {hub.title}
          </h1>
          <p className="t-lede max-w-md text-muted lg:col-span-5 lg:pb-5">
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
            <div className="grid gap-8 border-b border-line px-5 py-10 sm:px-8 lg:grid-cols-12 lg:px-gutter lg:py-14">
              {lead.meta ? (
                <p className="font-sans text-[14px] text-muted lg:col-span-3">{lead.meta}</p>
              ) : null}
              <div className="lg:col-span-9">
                <h2
                  id="projekte-lead"
                  className="t-section text-ink"
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
        <section aria-label={hub.indexEyebrow}>
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
                  <div className="flex flex-col justify-center px-5 py-10 sm:px-8 lg:col-span-6 lg:pr-edge lg:pl-14">
                    {branch.meta ? <p className="mb-3 font-sans text-[14px] text-muted">{branch.meta}</p> : null}
                    <h2 className="t-feature text-ink">
                      {branch.title}
                    </h2>
                    <p className="mt-4 max-w-md font-sans text-[16px] leading-relaxed text-muted">
                      {branch.text}
                    </p>
                  </div>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <StatementBand statement={hub.statement} note={hub.statementNote} tone="karte" rule={false} />
      <QuoteLine quote={hub.quote} source={hub.quoteSource} tone="nacht" />

      {extras && extras.length > 0 ? (
        <section className="border-b border-line px-5 py-16 sm:px-8 lg:px-gutter lg:py-20" aria-labelledby="projekte-more">
          {extrasTitle ? (
            <h2
              id="projekte-more"
              className="t-section text-ink"
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
                  <h3 className="t-item mt-4 text-ink">{item.title}</h3>
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
