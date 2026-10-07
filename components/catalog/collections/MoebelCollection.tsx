import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd } from "@/components/catalog/collections/parts";

export default function MoebelCollection({
  hub,
  children,
}: {
  hub: PresentedHub;
  children?: ReactNode;
}) {
  const joinery = hub.locale === "en" ? "Same workshop" : "Dieselbe Werkstatt";

  return (
    <main className="bg-karte">
      <section className="grid min-h-[88svh] lg:grid-cols-12" aria-labelledby="moebel-hero">
        <div className="flex flex-col justify-end px-5 py-16 sm:px-8 lg:col-span-5 lg:px-12 lg:py-24">
          <p className="type-eyebrow text-gold">{hub.eyebrow}</p>
          <h1
            id="moebel-hero"
            className="mt-6 font-serif text-[48px] leading-[0.92] font-medium tracking-[-0.04em] text-ink sm:text-[68px]"
          >
            {hub.title}
            <span className="mt-2 block italic text-espresso">{hub.emphasis}</span>
          </h1>
          <p className="mt-6 max-w-md font-sans text-[17px] leading-relaxed font-light text-muted">
            {hub.lede}
          </p>
          <LocaleLink href={hub.ctaHref} className="pill pill-primary mt-10 w-fit">
            {hub.ctaLabel}
          </LocaleLink>
        </div>
        <Frame
          src={hub.heroImage}
          alt={hub.heroAlt}
          className="min-h-[22rem] lg:col-span-7 lg:min-h-full"
          imgClassName="object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
      </section>

      <section className="border-y border-line bg-paper px-5 py-14 sm:px-8 lg:px-14">
        <p className="type-eyebrow text-gold">{joinery}</p>
        <p className="mt-5 max-w-3xl font-serif text-[26px] leading-snug font-medium tracking-[-0.03em] text-ink md:text-[34px]">
          {hub.statement}
        </p>
      </section>

      <section aria-labelledby="moebel-lines">
        <h2 id="moebel-lines" className="sr-only">
          {hub.indexEyebrow}
        </h2>
        <ul>
          {hub.branches.map((branch, index) => {
            const reverse = index % 2 === 1;
            return (
              <li
                key={branch.title}
                className={`grid border-b border-line lg:grid-cols-12 ${reverse ? "bg-paper" : "bg-karte"}`}
              >
                  <Frame
                  src={branch.image}
                  alt={branch.alt}
                  srcSet={branch.srcSet}
                  className={`aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[28rem] ${reverse ? "lg:order-2" : ""}`}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div
                  className={`flex flex-col justify-center px-5 py-12 sm:px-8 lg:col-span-5 lg:px-12 ${reverse ? "lg:order-1" : ""}`}
                >
                  <p className="font-serif text-[18px] text-gold">{branch.kicker}</p>
                  <h3 className="mt-3 font-serif text-[32px] leading-tight font-medium tracking-[-0.03em] text-ink">
                    {branch.title}
                  </h3>
                  <p className="mt-4 font-sans text-[16px] leading-relaxed text-muted">
                    {branch.text}
                  </p>
                  {branch.points.length > 0 ? (
                    <ul className="mt-8 border-t border-line">
                      {branch.points.map((point) => (
                        <li
                          key={point}
                          className="border-b border-line py-3 font-sans text-[14px] text-muted"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {branch.href ? (
                    <LocaleLink href={branch.href} className="pill pill-secondary mt-8 w-fit">
                      {hub.locale === "en" ? "This line" : "Diese Linie"}
                    </LocaleLink>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <HubEnd hub={hub}>{children}</HubEnd>
    </main>
  );
}
