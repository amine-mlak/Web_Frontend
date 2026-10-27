import { Fragment } from "react";
import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";
import {
  ClusterLinks,
  Crumbs,
  HouseLine,
  QuoteLine,
  SoftClose,
} from "@/components/catalog/clusters/parts";
import type { ClusterHouse, ClusterSwatch, PresentedCluster } from "@/lib/collection-clusters";
import type { PresentedTopic, TopicFeature } from "@/lib/collection-topics";
import TopicReading from "@/components/catalog/clusters/TopicReading";

function isLight(hex: string) {
  const raw = hex.replace("#", "");
  const value = raw.length === 3 ? raw.split("").map((char) => `${char}${char}`).join("") : raw;
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.62;
}

function housesTitle(locale: PresentedCluster["locale"]) {
  return locale === "en" ? "Colour in the house" : "Farbe im Haus";
}

function projectCount(count: number, locale: PresentedCluster["locale"]) {
  if (locale === "en") return `${count} ${count === 1 ? "project" : "projects"}`;
  return `${count} ${count === 1 ? "Projekt" : "Projekte"}`;
}

/** One panel per colour: a real kitchen in that colour above, the colour itself below. */
function SwatchField({
  swatches,
  label,
  locale,
  tall,
}: {
  swatches: ClusterSwatch[];
  label: string;
  locale: PresentedCluster["locale"];
  tall?: boolean;
}) {
  if (swatches.length === 0) {
    return null;
  }

  return (
    <ul
      className={`grid sm:grid-cols-2 ${swatches.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
      aria-label={label}
    >
      {swatches.map((swatch) => {
        const light = isLight(swatch.hex);
        return (
          <li key={swatch.href}>
            <LocaleLink href={swatch.href} className="group flex h-full flex-col">
              {swatch.image ? (
                <Frame
                  src={swatch.image}
                  alt={swatch.title}
                  className={tall ? "aspect-[4/5] lg:aspect-[3/4]" : "aspect-[4/3]"}
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : null}
              <div
                className={`flex flex-1 flex-col justify-end px-6 ${tall ? "py-8" : "py-6"} ${light ? "border-x border-b border-line" : ""}`}
                style={{ backgroundColor: swatch.hex }}
              >
                <span
                  className={`block font-serif leading-none font-medium tracking-[-0.03em] ${tall ? "text-[32px]" : "text-[26px]"} ${
                    light ? "text-ink" : "text-paper"
                  }`}
                >
                  {swatch.title}
                </span>
                {swatch.count ? (
                  <span className={`mt-3 font-sans text-[14px] ${light ? "text-ink/70" : "text-paper/75"}`}>
                    {projectCount(swatch.count, locale)}
                  </span>
                ) : null}
              </div>
            </LocaleLink>
          </li>
        );
      })}
    </ul>
  );
}

function HouseCard({ house }: { house: ClusterHouse }) {
  return (
    <li>
      <LocaleLink href={house.href} className="group block">
        <Frame
          src={house.image}
          alt={house.title}
          className="aspect-[4/3]"
          imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <p className="mt-4 font-serif text-[22px] leading-snug font-medium text-ink">{house.title}</p>
        {house.meta ? <p className="mt-1 font-sans text-[14px] text-muted">{house.meta}</p> : null}
      </LocaleLink>
    </li>
  );
}

const GRID = "grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3";

/** All projects in this colour: twelve first, the rest one click away on the same page. */
function ColourProjects({ hub, more }: { hub: PresentedTopic; more?: boolean }) {
  const houses = hub.taggedHouses ?? hub.houses;
  if (houses.length === 0) {
    return null;
  }
  const en = hub.locale === "en";
  const first = houses.slice(0, 12);
  const rest = houses.slice(12);
  // "Weiße Küchen" → "Weitere weiße Küchen" after the kitchens shown one by one above.
  const name = hub.heroAlt.charAt(0).toLowerCase() + hub.heroAlt.slice(1);
  const heading = more
    ? en
      ? `More ${name}`
      : `Weitere ${name}`
    : en
      ? `${hub.heroAlt} from our projects`
      : `${hub.heroAlt} aus unseren Projekten`;
  return (
    <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-20" aria-labelledby="farben-projekte">
      <h2 id="farben-projekte" className="font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[40px]">
        {heading}
      </h2>
      <ul className={`mt-10 ${GRID}`}>
        {first.map((house) => (
          <HouseCard key={house.href} house={house} />
        ))}
      </ul>
      {rest.length ? (
        <details className="group/more mt-12">
          <summary className="btn-quiet cursor-pointer list-none text-ink group-open/more:hidden [&::-webkit-details-marker]:hidden">
            {en ? `Show all ${houses.length} projects` : `Alle ${houses.length} Projekte zeigen`}
          </summary>
          <ul className={GRID}>
            {rest.map((house) => (
              <HouseCard key={house.href} house={house} />
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

export function FarbenCluster({ hub }: { hub: PresentedCluster }) {
  return (
    <main className="bg-paper">
      <header className="grid items-end gap-8 px-5 pt-10 pb-8 sm:px-8 lg:grid-cols-12 lg:px-14 lg:pt-16">
        <div className="lg:col-span-7">
          <p className="type-eyebrow text-gold">{hub.eyebrow}</p>
          <h1 className="mt-4 font-serif text-[56px] leading-[0.9] font-medium tracking-[-0.045em] text-ink sm:text-[88px]">
            {hub.title}
            {hub.emphasis ? <span className="mt-1 block">{hub.emphasis}</span> : null}
          </h1>
        </div>
        <p className="max-w-md font-sans text-[17px] leading-relaxed font-light text-muted lg:col-span-5">
          {hub.lede}
        </p>
      </header>

      <SwatchField swatches={hub.swatches} label={hub.indexEyebrow} locale={hub.locale} tall />

      <section className="grid lg:grid-cols-12">
        <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:col-span-5 lg:px-14">
          <h2 className="font-serif text-[28px] leading-snug font-medium tracking-[-0.03em] text-ink md:text-[34px]">
            {hub.statement}
          </h2>
          <p className="mt-6 max-w-sm font-sans text-[15px] leading-relaxed text-muted">
            {hub.statementNote}
          </p>
        </div>
        <Frame
          src={hub.heroImage}
          alt={hub.heroAlt}
          className="min-h-[22rem] lg:col-span-7 lg:min-h-[36rem]"
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
      </section>

      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <HouseLine houses={hub.houses} title={housesTitle(hub.locale)} />
      <ClusterLinks hub={hub} />
      <SoftClose hub={hub} />
    </main>
  );
}

const HOVER = "transition-transform duration-700 group-hover:scale-[1.02]";

/** The words of one kitchen: place and year, name, its text, and the pages it connects to. */
function FeatureText({ feature, locale, wide }: { feature: TopicFeature; locale: PresentedCluster["locale"]; wide?: boolean }) {
  const en = locale === "en";
  return (
    <div className={wide ? "grid gap-6 lg:grid-cols-12 lg:gap-16" : ""}>
      <div className={wide ? "lg:col-span-5" : ""}>
        {feature.meta ? <p className="font-sans text-[14px] text-muted">{feature.meta}</p> : null}
        <h2 className="mt-3 font-serif text-[34px] leading-[1.08] font-medium tracking-[-0.03em] text-ink md:text-[44px]">
          <LocaleLink href={feature.href} className="transition-opacity hover:opacity-70">
            {feature.title}
          </LocaleLink>
        </h2>
      </div>
      <div className={wide ? "lg:col-span-6 lg:col-start-7" : ""}>
        {feature.intro ? (
          <p className={`${wide ? "" : "mt-5"} max-w-md font-sans text-[17px] leading-relaxed text-muted`}>{feature.intro}</p>
        ) : null}
        <LocaleLink href={feature.href} className="btn-quiet mt-7 text-ink">
          {en ? "View the project" : "Projekt ansehen"}
        </LocaleLink>
        {feature.links.length ? (
          <p className="mt-8 max-w-md font-sans text-[14px] leading-relaxed text-muted">
            {en ? "In this kitchen: " : "In dieser Küche: "}
            {feature.links.map((link, index) => (
              <Fragment key={link.href}>
                {index ? " · " : ""}
                <LocaleLink href={link.href} className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
                  {link.label}
                </LocaleLink>
              </Fragment>
            ))}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * One kitchen in this colour, like a page of an exposé. Four arrangements take turns, so each
 * kitchen looks different: photo and text side by side, text with a photo and a detail, a wide
 * photo with the text below, two photos with the text under them.
 */
function Feature({ feature, variant, locale }: { feature: TopicFeature; variant: number; locale: PresentedCluster["locale"] }) {
  const photo = (className: string, sizes: string) => (
    <LocaleLink href={feature.href} className="group block" tabIndex={-1} aria-hidden="true">
      <Frame src={feature.image} srcSet={feature.srcSet} alt="" className={className} imgClassName={HOVER} sizes={sizes} />
    </LocaleLink>
  );
  const detail = (className: string, sizes: string) =>
    feature.detail ? (
      <Frame src={feature.detail.src} srcSet={feature.detail.srcSet} alt={feature.detail.alt} className={className} sizes={sizes} />
    ) : null;

  if (variant === 1) {
    return (
      <section className="grid gap-10 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-14 lg:py-24">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <FeatureText feature={feature} locale={locale} />
        </div>
        <div className="relative order-1 lg:order-2 lg:col-span-7 lg:pb-16">
          {photo("aspect-[4/3]", "(max-width: 1024px) 100vw, 58vw")}
          {feature.detail ? (
            <div className="absolute bottom-0 -left-6 hidden w-[36%] border-8 border-paper lg:block">
              {detail("aspect-[4/5]", "20vw")}
            </div>
          ) : null}
        </div>
      </section>
    );
  }
  if (variant === 2) {
    return (
      <section className="py-14 lg:py-24">
        <div className="px-5 sm:px-8 lg:px-14">{photo("aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]", "100vw")}</div>
        <div className="mt-10 px-5 sm:px-8 lg:px-14">
          <FeatureText feature={feature} locale={locale} wide />
        </div>
      </section>
    );
  }
  if (variant === 3 && feature.detail) {
    return (
      <section className="px-5 py-14 sm:px-8 lg:px-14 lg:py-24">
        <div className="grid gap-6 sm:grid-cols-2">
          {photo("aspect-[4/5]", "(max-width: 640px) 100vw, 50vw")}
          {detail("aspect-[4/5]", "(max-width: 640px) 100vw, 50vw")}
        </div>
        <div className="mx-auto mt-10 max-w-2xl">
          <FeatureText feature={feature} locale={locale} />
        </div>
      </section>
    );
  }
  return (
    <section className="grid gap-10 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-14 lg:py-24">
      <div className="lg:col-span-7">{photo("aspect-[4/3]", "(max-width: 1024px) 100vw, 58vw")}</div>
      <div className="lg:col-span-5">
        <FeatureText feature={feature} locale={locale} />
      </div>
    </section>
  );
}

export function FarbenTopic({ hub, slug }: { hub: PresentedTopic; slug: string }) {
  const hex = hub.hex || "#f4f1ea";
  const light = isLight(hex);
  const features = hub.features ?? [];
  const reading = (hub.lesetext ?? "")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <main className="bg-paper">
      <section style={{ backgroundColor: hex }} aria-labelledby="farben-topic">
        <div className="grid items-end lg:grid-cols-12">
          <div className="px-5 py-14 sm:px-8 lg:col-span-5 lg:px-14 lg:py-20">
            <Crumbs hub={hub} tone={light ? "ink" : "paper"} />
            <h1
              id="farben-topic"
              className={`mt-10 font-serif text-[48px] leading-[0.92] font-medium tracking-[-0.04em] sm:text-[68px] ${
                light ? "text-ink" : "text-paper"
              }`}
            >
              {hub.title}
              {hub.emphasis ? ` ${hub.emphasis}` : ""}
            </h1>
            <p
              className={`mt-5 max-w-md font-serif text-[22px] leading-snug ${
                light ? "text-ink/75" : "text-paper/80"
              }`}
            >
              {/* The CMS intro first; the line in the code is only a fallback. */}
              {hub.lede || hub.toneLine}
            </p>
          </div>
          <Frame
            src={hub.heroImage}
            alt={hub.heroAlt}
            className="aspect-[4/5] lg:col-span-7 lg:aspect-auto lg:min-h-[78vh]"
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        </div>
      </section>

      {/* Kitchens in this colour, one by one, each shown differently. */}
      {features.map((feature, index) => (
        <Feature key={feature.href} feature={feature} variant={index % 4} locale={hub.locale} />
      ))}

      <ColourProjects hub={hub} more={features.length > 0} />
      <section className="border-t border-line px-5 pt-16 sm:px-8 lg:px-14" aria-labelledby="farben-andere">
        <h2 id="farben-andere" className="font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[40px]">
          {hub.locale === "en" ? "Other colours" : "Andere Farben"}
        </h2>
      </section>
      <div className="px-5 pt-10 pb-16 sm:px-8 lg:px-14">
        <SwatchField
          swatches={hub.swatches.filter((swatch) => !swatch.href.endsWith(`/${slug}`))}
          label={hub.locale === "en" ? "Other colours" : "Andere Farben"}
          locale={hub.locale}
        />
      </div>

      {/* The fixed texts at the end: the statement with its points, then the longer text. */}
      <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-24" aria-labelledby="farben-wissen">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="farben-wissen" className="font-serif text-[30px] leading-snug font-medium tracking-[-0.02em] text-ink md:text-[36px]">
              {hub.statement}
            </h2>
            {hub.statementNote ? (
              <p className="mt-6 max-w-sm font-sans text-[16px] leading-relaxed text-muted">{hub.statementNote}</p>
            ) : null}
          </div>
          {hub.branches.length ? (
            <ul className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
              {hub.branches.map((branch, index) => (
                <li key={`${branch.title}-${index}`} className="border-t border-line pt-5">
                  <h3 className="font-serif text-[24px] leading-tight font-medium text-ink">{branch.title}</h3>
                  <p className="mt-3 font-sans text-[15px] leading-relaxed text-muted">{branch.text}</p>
                  {branch.points.length ? (
                    <ul className="mt-2 space-y-1 font-sans text-[15px] leading-relaxed text-ink/80">
                      {branch.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
      {reading.length ? (
        <section className="mx-auto grid max-w-[90rem] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-14 lg:py-24" aria-labelledby="farben-lesen">
          <h2
            id="farben-lesen"
            className="font-serif text-[34px] leading-[1.08] font-medium tracking-[-0.03em] text-ink md:text-[44px] lg:col-span-4"
          >
            {hub.ueberschrift || hub.heroAlt}
          </h2>
          <div className="max-w-2xl space-y-6 lg:col-span-7 lg:col-start-6">
            {reading.map((paragraph, index) => (
              <p key={index} className="font-sans text-[17px] leading-[1.7] text-ink/85">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ) : (
        <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      )}
      <SoftClose hub={hub} />
    </main>
  );
}
