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
  // The one number on this page that is a fact, said once in a sentence.
  const radius =
    hub.locale === "en"
      ? "We plan and fit kitchens within about 200 kilometres of Munich."
      : "Wir planen und montieren Küchen im Umkreis von etwa 200 Kilometern um München.";

  return (
    <main className="bg-paper">
      <section
        className="relative overflow-hidden px-5 pt-16 pb-20 text-center sm:px-8 lg:px-14 lg:pt-24 lg:pb-28"
        aria-labelledby="regionen-hero"
      >
        <h1
          id="regionen-hero"
          className="t-display mx-auto max-w-4xl text-ink"
        >
          {hub.title}
        </h1>
        <p className="t-lede mx-auto mt-8 max-w-lg text-muted">
          {hub.lede}
        </p>
        <p className="t-lede mx-auto mt-4 max-w-lg text-ink">{radius}</p>
        <LocaleLink href={hub.ctaHref} className="btn-quiet mt-10 text-ink">
          {hub.ctaLabel}
        </LocaleLink>
      </section>

      <div className="border-y border-line bg-karte">
        <div className="mx-auto grid max-w-[90rem] lg:grid-cols-12">
          <Frame
            src={hub.heroImage}
            alt={hub.heroAlt}
            className="min-h-[18rem] lg:col-span-7 lg:min-h-[28rem]"
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
          <div className="flex flex-col justify-center px-5 py-12 sm:px-8 lg:col-span-5 lg:px-12">
            <p className="t-lead text-ink">{hub.statement}</p>
            <p className="mt-6 max-w-md font-sans text-[16px] leading-relaxed text-muted">{hub.statementNote}</p>
          </div>
        </div>
      </div>

      <section aria-labelledby="regionen-places" className="px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <h2 id="regionen-places" className="t-section text-ink">
          {hub.indexEyebrow}
        </h2>
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {hub.branches.map((branch) => (
            <li key={branch.title}>
              <LocaleLink
                href={branch.href ?? "/beratung"}
                className="group grid items-center gap-6 py-8 lg:grid-cols-12 lg:py-10"
              >
                <div className="lg:col-span-5">
                  <h3 className="t-feature text-ink">
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
            <h2 className="t-section text-ink">{extrasTitle}</h2>
          ) : null}
          <ul className="mt-8 columns-1 gap-x-12 sm:columns-2 lg:columns-3">
            {extras.map((item) => (
              <li key={item.href} className="break-inside-avoid border-t border-line">
                <LocaleLink
                  href={item.href}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <span className="t-item text-ink">
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
