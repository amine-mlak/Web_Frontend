import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd, type CollectionExtra } from "@/components/catalog/collections/parts";

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
      <section className="px-5 pt-16 pb-12 sm:px-8 lg:px-20 lg:pt-24" aria-labelledby="marken-hero">
        <h1
          id="marken-hero"
          className="max-w-[18ch] font-serif text-[56px] leading-[0.88] font-medium tracking-[-0.05em] text-ink sm:text-[96px] lg:text-[120px]"
        >
          {hub.title}
        </h1>
        <div className="mt-12 grid gap-10 border-t border-line pt-10 lg:grid-cols-12">
          <p className="min-w-0 font-sans text-[18px] leading-relaxed font-light text-muted lg:col-span-6">
            {hub.lede}
          </p>
          <div className="min-w-0 lg:col-span-5 lg:col-start-8">
            <p className="font-serif text-[22px] leading-snug font-medium text-ink">
              {hub.statement}
            </p>
            <p className="mt-5 font-sans text-[14px] leading-relaxed text-muted">
              {hub.statementNote}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="marken-index">
        <h2 id="marken-index" className="sr-only">
          {hub.indexEyebrow}
        </h2>
        <ul className="mt-6">
          {hub.branches.map((branch) => (
            <li key={branch.title} className="border-t border-line last:border-b">
              <LocaleLink
                href={branch.href ?? "/beratung"}
                className="group grid items-center gap-6 px-5 py-8 sm:px-8 lg:grid-cols-12 lg:px-20 lg:py-10"
              >
                <div className="lg:col-span-8">
                  <h3 className="font-serif text-[40px] leading-[0.95] font-medium tracking-[-0.04em] text-ink sm:text-[56px] lg:text-[64px]">
                    {branch.title}
                  </h3>
                  <p className="mt-4 max-w-xl font-sans text-[15px] leading-relaxed text-muted">
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
        <section className="border-b border-line px-5 py-16 sm:px-8 lg:px-20 lg:py-20">
          {extrasTitle ? (
            <h2 className="font-serif text-[28px] font-medium tracking-[-0.03em] text-ink">
              {extrasTitle}
            </h2>
          ) : null}
          <ul className="mt-10 grid gap-x-12 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((item) => (
              <li key={item.href} className="border-t border-line">
                <LocaleLink
                  href={item.href}
                  className="block py-4 font-serif text-[26px] leading-tight font-medium tracking-[-0.03em] text-ink transition-colors hover:text-gold"
                >
                  {item.title}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {hub.quote ? (
        <section className="bg-nacht px-5 py-16 text-center sm:px-8 lg:py-20">
          <p className="mx-auto max-w-3xl font-serif text-[24px] leading-snug font-medium text-paper md:text-[30px]">
            {hub.quote}
          </p>
          <p className="mt-6 font-sans text-[14px] text-paper/70">{hub.quoteSource}</p>
        </section>
      ) : null}

      <div className="bg-paper">
        <HubEnd hub={hub}>{children}</HubEnd>
      </div>
    </main>
  );
}
