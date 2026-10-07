import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd } from "@/components/catalog/collections/parts";

const ROMAN = ["I", "II", "III", "IV", "V"] as const;

export default function KuechenCollection({
  hub,
  children,
}: {
  hub: PresentedHub;
  children?: ReactNode;
}) {
  const open = hub.locale === "en" ? "Enter" : "Eintreten";
  const folio = hub.locale === "en" ? "The kitchen as a house" : "Die Küche als Haus";

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
            <p className="type-eyebrow text-gold">{hub.eyebrow}</p>
            <h1
              id="kuechen-hero"
              className="mt-4 font-serif text-[42px] leading-[0.94] font-medium tracking-[-0.04em] text-ink sm:text-[64px]"
            >
              {hub.title}
              <span className="mt-1 block italic">{hub.emphasis}</span>
            </h1>
            <p className="mt-5 font-sans text-[16px] leading-relaxed font-light text-muted">
              {hub.lede}
            </p>
            <LocaleLink href={hub.ctaHref} className="pill pill-primary mt-8">
              {hub.ctaLabel}
            </LocaleLink>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-karte px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <p className="type-eyebrow text-gold">{folio}</p>
        <p className="mt-6 max-w-3xl font-serif text-[28px] leading-snug font-medium tracking-[-0.03em] text-ink md:text-[40px]">
          {hub.statement}
        </p>
        <p className="mt-6 max-w-lg font-sans text-[15px] leading-relaxed text-muted">
          {hub.statementNote}
        </p>
      </section>

      <section aria-labelledby="kuechen-doors" className="bg-paper">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-14">
          <h2 id="kuechen-doors" className="type-h2">
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
                      imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes={wide ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                    />
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-[13px] text-gold">
                          {ROMAN[index] ?? String(index + 1)}
                        </p>
                        <h3 className="mt-1 font-serif text-[22px] leading-tight font-medium text-ink md:text-[26px]">
                          {branch.title}
                        </h3>
                        <p className="mt-2 font-sans text-[14px] leading-relaxed text-muted">
                          {branch.text}
                        </p>
                      </div>
                      <span className="type-eyebrow mt-1 shrink-0 text-gold">{open}</span>
                    </div>
                  </LocaleLink>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-nacht px-5 py-20 text-center sm:px-8 lg:py-28">
        <p className="font-serif text-[28px] leading-snug font-medium tracking-[-0.03em] text-paper italic md:text-[36px]">
          {hub.quote}
        </p>
        <p className="mt-6 type-eyebrow text-messing">{hub.quoteSource}</p>
        <p className="mx-auto mt-10 max-w-md font-sans text-[15px] font-light text-paper/70">
          {hub.priceLine}
        </p>
      </section>

      <HubEnd hub={hub}>{children}</HubEnd>
    </main>
  );
}
