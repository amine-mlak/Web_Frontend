import { ctaHref } from "@/lib/cta";
import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd, StatementBand, type CollectionExtra } from "@/components/catalog/collections/parts";
import { QuoteLine } from "@/components/catalog/clusters/parts";

export default function MarkenCollection({
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
  return (
    <main className="bg-paper">
      <section className="px-5 pt-12 pb-12 sm:px-8 lg:px-gutter lg:pt-20 lg:pb-16" aria-labelledby="marken-hero">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <h1 id="marken-hero" className="t-display text-ink lg:col-span-7">
            {hub.title}
          </h1>
          <div className="lg:col-span-5 lg:pb-5">
            <p className="t-lede max-w-md text-muted">{hub.lede}</p>
            <LocaleLink href={ctaHref(hub.ctaHref, hub.ctaLabel)} className="btn-quiet mt-6 text-ink">
              {hub.ctaLabel}
            </LocaleLink>
          </div>
        </div>
      </section>

      <StatementBand statement={hub.statement} note={hub.statementNote} />

      <section aria-label={hub.title}>
        <ul>
          {hub.branches.map((branch) => (
            <li key={branch.title} className="border-t border-line last:border-b">
              <LocaleLink
                href={branch.href ?? "/beratung"}
                className="group grid items-center gap-6 px-5 py-8 sm:px-8 lg:grid-cols-12 lg:px-gutter lg:py-10"
              >
                <div className="lg:col-span-8">
                  <h2 className="t-section text-ink">
                    {branch.title}
                  </h2>
                  <p className="mt-4 max-w-xl font-sans text-[16px] leading-relaxed text-muted">
                    {branch.text}
                  </p>
                </div>
                <Frame
                  src={branch.image}
                  alt={branch.alt}
                  srcSet={branch.srcSet}
                  className="aspect-[4/3] lg:col-span-4"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </LocaleLink>
            </li>
          ))}
        </ul>
      </section>

      {extras && extras.length > 0 ? (
        <section className="border-b border-line px-5 py-16 sm:px-8 lg:px-gutter lg:py-20">
          {extrasTitle ? (
            <h2 className="t-section text-ink">
              {extrasTitle}
            </h2>
          ) : null}
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
