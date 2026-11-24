import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd, StatementBand } from "@/components/catalog/collections/parts";
import { QuoteLine } from "@/components/catalog/clusters/parts";

const COPY = {
  de: { open: "Projekt ansehen" },
  en: { open: "See the project" },
} as const;

/**
 * The projects overview, kept short. The newest house opens the page as a full photo that drifts
 * while the page scrolls, with its name on it. Four more houses follow as chapters, a large
 * photo beside the house's name and what was built. Every other house waits in the archive,
 * which opens on request.
 */
export default function ProjekteCollection({
  hub,
  children,
}: {
  hub: PresentedHub;
  children?: ReactNode;
}) {
  const copy = COPY[hub.locale === "en" ? "en" : "de"];
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

      <div className="pt-6 lg:pt-10">
        {rest.map((branch, index) => {
          const flip = index % 2 === 1;
          const href = branch.href ?? "/beratung";
          return (
            <section
              key={branch.title}
              // The photo takes the wider column on either side.
              className={`grid items-center gap-x-12 gap-y-7 px-5 py-9 sm:px-8 lg:gap-x-24 lg:px-gutter lg:py-12 ${
                flip ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]" : "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
              }`}
              aria-labelledby={`projekt-${index}`}
            >
              <LocaleLink href={href} tabIndex={-1} aria-hidden className={`block ${flip ? "lg:order-2" : ""}`}>
                <Frame
                  src={branch.image}
                  alt=""
                  srcSet={branch.srcSet}
                  className="aspect-[4/3] lg:aspect-[3/2]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  drift
                />
              </LocaleLink>
              <div>
                {branch.meta ? <p className="mb-3 font-sans text-[14px] text-muted">{branch.meta}</p> : null}
                <h2 id={`projekt-${index}`} className="t-section text-ink">
                  {branch.title}
                </h2>
                {branch.text ? <p className="t-lede mt-4 max-w-lg text-ink/85">{branch.text}</p> : null}
                <LocaleLink href={href} className="btn-quiet mt-7">
                  {copy.open} <span aria-hidden="true">→</span>
                </LocaleLink>
              </div>
            </section>
          );
        })}
      </div>

      {/* Every other house: closed at first, opened by one button (ProjectArchive). */}
      {children}

      <StatementBand statement={hub.statement} note={hub.statementNote} tone="karte" rule={false} />
      <QuoteLine quote={hub.quote} source={hub.quoteSource} tone="nacht" />

      <HubEnd hub={hub} />
    </main>
  );
}
