import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd, StatementBand } from "@/components/catalog/collections/parts";
import { QuoteLine } from "@/components/catalog/clusters/parts";

export default function ProjekteCollection({
  hub,
  children,
}: {
  hub: PresentedHub;
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

      {/* The archive of every house comes in as children, before the showroom. */}
      <HubEnd hub={hub}>{children}</HubEnd>
    </main>
  );
}
