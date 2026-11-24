import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd, StatementBand } from "@/components/catalog/collections/parts";
import { QuoteLine } from "@/components/catalog/clusters/parts";

/**
 * The projects overview, kept short. The newest house opens the page as a full photo that drifts
 * while the page scrolls, with its name on it. Four more houses stand in a row below. Every
 * other house waits in the archive, which opens on request.
 */
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
      <section data-site-hero="" className="relative isolate -mt-14 min-h-[88svh] bg-nacht" aria-labelledby="projekte-hero">
        <Frame
          src={lead?.image || hub.heroImage}
          alt={lead?.alt || hub.heroAlt}
          srcSet={lead?.srcSet}
          className="absolute inset-0"
          priority
          sizes="100vw"
          drift
        />
        <div className="hero-scrim absolute inset-0" aria-hidden />
        <div className="relative z-10 flex min-h-[88svh] items-end px-5 pb-12 sm:px-8 lg:px-gutter lg:pb-16">
          <div className="grid w-full items-end gap-x-12 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 id="projekte-hero" className="t-display text-paper">
                {hub.title}
              </h1>
              {hub.lede ? <p className="t-lede mt-5 max-w-lg text-paper/90">{hub.lede}</p> : null}
            </div>
            {/* The house on the photo, and the way to it. */}
            {lead?.href ? (
              <LocaleLink
                href={lead.href}
                className="group block text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper lg:col-span-5 lg:justify-self-end lg:text-right"
              >
                {lead.meta ? <span className="block font-sans text-[14px] text-paper/80">{lead.meta}</span> : null}
                <span className="mt-1 block font-serif text-[22px] leading-[1.25] underline decoration-paper/0 decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-paper/60 lg:text-[24px]">
                  {lead.title} <span aria-hidden="true">→</span>
                </span>
              </LocaleLink>
            ) : null}
          </div>
        </div>
      </section>

      {rest.length > 0 ? (
        <section className="px-5 pt-12 pb-4 sm:px-8 lg:px-gutter lg:pt-20" aria-label={hub.indexEyebrow}>
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((branch) => (
              <li key={branch.title}>
                <LocaleLink href={branch.href ?? "/beratung"} className="group block">
                  <Frame
                    src={branch.image}
                    alt={branch.alt}
                    srcSet={branch.srcSet}
                    className="aspect-[4/3] sm:aspect-[4/5]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <h2 className="t-item mt-5 text-ink underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink/40">
                    {branch.title}
                  </h2>
                  {branch.meta ? <p className="mt-2 font-sans text-[14px] text-muted">{branch.meta}</p> : null}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Every other house: closed at first, opened by one button (ProjectArchive). */}
      {children}

      <StatementBand statement={hub.statement} note={hub.statementNote} tone="karte" rule={false} />
      <QuoteLine quote={hub.quote} source={hub.quoteSource} tone="nacht" />

      <HubEnd hub={hub} />
    </main>
  );
}
