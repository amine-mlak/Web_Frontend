import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd, StatementBand } from "@/components/catalog/collections/parts";

export default function MoebelCollection({
  hub,
  children,
}: {
  hub: PresentedHub;
  children?: ReactNode;
}) {
  return (
    <main className="bg-karte">
      <section className="grid min-h-[88svh] lg:grid-cols-12" aria-labelledby="moebel-hero">
        <div className="flex flex-col justify-end px-5 py-16 sm:px-8 lg:col-span-5 lg:py-24 lg:pr-12 lg:pl-edge">
          <h1
            id="moebel-hero"
            className="t-display text-ink"
          >
            {hub.title}
          </h1>
          <p className="t-lede mt-6 max-w-md text-muted">
            {hub.lede}
          </p>
          <LocaleLink href={hub.ctaHref} className="btn-quiet mt-10 w-fit text-ink">
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

      <StatementBand statement={hub.statement} note={hub.statementNote} />

      <section aria-label={hub.indexEyebrow}>
        <ul className="border-t border-line">
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
                  className={`flex flex-col justify-center px-5 py-12 sm:px-8 lg:col-span-5 ${reverse ? "lg:order-1 lg:pr-12 lg:pl-edge" : "lg:pr-edge lg:pl-12"}`}
                >
                  <h2 className="t-section text-ink">
                    {branch.title}
                  </h2>
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
                    <LocaleLink href={branch.href} className="btn-quiet mt-8 w-fit text-ink">
                      {hub.locale === "en" ? `Open ${branch.title}` : `${branch.title} ansehen`}
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
