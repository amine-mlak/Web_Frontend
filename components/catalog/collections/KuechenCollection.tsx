import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd, StatementBand } from "@/components/catalog/collections/parts";
import { QuoteLine } from "@/components/catalog/clusters/parts";

export default function KuechenCollection({
  hub,
  children,
}: {
  hub: PresentedHub;
  children?: ReactNode;
}) {
  return (
    <main className="bg-paper">
      <section
        data-site-hero=""
        className="relative isolate -mt-14 min-h-[100svh] bg-nacht"
        aria-labelledby="kuechen-hero"
      >
        <Frame
          src={hub.heroImage}
          alt={hub.heroAlt}
          className="absolute inset-0"
          imgClassName="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-nacht/80 via-transparent to-nacht/50"
          aria-hidden
        />
        <div className="relative z-10 flex min-h-[100svh] items-end px-5 pb-10 sm:px-8 lg:px-14 lg:pb-16">
          <div className="max-w-xl bg-paper px-7 py-8 sm:px-10 sm:py-10">
            <h1
              id="kuechen-hero"
              className="t-display text-ink"
            >
              {hub.title}
            </h1>
            <p className="t-lede mt-5 text-muted">
              {hub.lede}
            </p>
            <LocaleLink href={hub.ctaHref} className="btn-quiet mt-8 text-ink">
              {hub.ctaLabel}
            </LocaleLink>
          </div>
        </div>
      </section>

      <StatementBand statement={hub.statement} note={hub.statementNote} tone="karte" rule={false} />

      <section aria-labelledby="kuechen-doors" className="bg-paper">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-14">
          <h2 id="kuechen-doors" className="t-section text-ink">
            {hub.indexEyebrow}
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
            {hub.branches.map((branch, index) => {
              const wide = index === 0;
              return (
                <li
                  key={branch.title}
                  className={wide ? "lg:col-span-6 lg:row-span-2" : "lg:col-span-3"}
                >
                  <LocaleLink href={branch.href ?? "/beratung"} className="group block">
                    <Frame
                      src={branch.image}
                      alt={branch.alt}
                      srcSet={branch.srcSet}
                      className={wide ? "aspect-[4/5] lg:aspect-[3/4]" : "aspect-[3/4]"}
                      sizes={wide ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                    />
                    <div className="mt-4">
                      <h3 className="t-item text-ink">
                        {branch.title}
                      </h3>
                      <p className="mt-2 font-sans text-[14px] leading-relaxed text-muted">
                        {branch.text}
                      </p>
                    </div>
                  </LocaleLink>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* A quote only when the CMS has a real one with its source. */}
      <QuoteLine quote={hub.quote} source={hub.quoteSource} tone="nacht" />

      <HubEnd hub={hub}>{children}</HubEnd>
    </main>
  );
}
