import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd } from "@/components/catalog/collections/parts";

export default function MaterialCollection({
  hub,
  children,
}: {
  hub: PresentedHub;
  children?: ReactNode;
}) {
  return (
    <main className="bg-paper">
      <section className="px-5 pt-10 pb-6 sm:px-8 lg:px-14 lg:pt-16" aria-labelledby="material-hero">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1
              id="material-hero"
              className="font-serif text-[48px] leading-[0.92] font-medium tracking-[-0.04em] text-ink sm:text-[80px] lg:text-[96px]"
            >
              {hub.title}
            </h1>
          </div>
          <p className="max-w-md font-sans text-[17px] leading-relaxed font-light text-muted lg:col-span-5 lg:justify-self-end">
            {hub.lede}
          </p>
        </div>
        <Frame
          src={hub.heroImage}
          alt={hub.heroAlt}
          className="mt-12 h-[28vh] min-h-[12rem] w-full lg:h-[34vh]"
          imgClassName="object-cover object-center"
          priority
          sizes="100vw"
        />
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-14 lg:py-24" aria-labelledby="material-board">
        <h2 id="material-board" className="type-h2">
          {hub.indexEyebrow}
        </h2>
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          {hub.branches.map((branch, index) => {
            const span =
              index === 0
                ? "lg:col-span-7 lg:row-span-2"
                : index === 3
                  ? "lg:col-span-12"
                  : "lg:col-span-5";
            return (
              <li key={branch.title} className={span}>
                <LocaleLink href={branch.href ?? "/ausstellung"} className="group block">
                  <div className="border border-line bg-karte p-3 sm:p-4">
                    <Frame
                      src={branch.image}
                      alt={branch.alt}
                      srcSet={branch.srcSet}
                      className={
                        index === 0
                          ? "aspect-[4/5]"
                          : index === 3
                            ? "aspect-[21/8]"
                            : "aspect-[16/10]"
                      }
                      sizes={index === 0 ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 42vw"}
                    />
                    <div className="mt-4 flex items-start justify-between gap-4 px-1 pb-1">
                      <div>
                        <h3 className="font-serif text-[26px] leading-tight font-medium text-ink">
                          {branch.title}
                        </h3>
                        <p className="mt-2 font-sans text-[15px] leading-relaxed text-muted">
                          {branch.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </LocaleLink>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-y border-line bg-karte">
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {hub.looks.slice(0, 4).map((look) => (
            <li
              key={look.caption}
              className="border-line border-b even:border-l lg:border-b-0 lg:border-l-0 lg:not-last:border-r"
            >
              <Frame
                src={look.src}
                alt={look.alt}
                className="aspect-square"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <p className="px-4 py-3 font-sans text-[14px] text-muted">{look.caption}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid lg:grid-cols-12">
        <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:col-span-5 lg:px-14">
          {hub.quote ? (
            <>
              <blockquote className="font-serif text-[26px] leading-snug font-medium tracking-[-0.03em] text-ink md:text-[32px]">
                {hub.quote}
              </blockquote>
              <p className="mt-5 font-sans text-[14px] text-muted">{hub.quoteSource}</p>
            </>
          ) : null}
          <p className={`max-w-sm font-sans text-[15px] leading-relaxed text-muted ${hub.quote ? "mt-8" : ""}`}>
            {hub.statementNote}
          </p>
          <LocaleLink href={hub.ctaHref} className="btn-quiet mt-10 w-fit text-ink">
            {hub.ctaLabel}
          </LocaleLink>
        </div>
        <Frame
          src={hub.statementImage}
          alt={hub.heroAlt}
          className="min-h-[22rem] lg:col-span-7 lg:min-h-[36rem]"
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
      </section>

      <HubEnd hub={hub}>{children}</HubEnd>
    </main>
  );
}
