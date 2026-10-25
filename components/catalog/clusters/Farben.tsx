import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";
import {
  ClusterLinks,
  Crumbs,
  HouseLine,
  QuoteLine,
  RuledPoints,
  SoftClose,
} from "@/components/catalog/clusters/parts";
import type { ClusterSwatch, PresentedCluster } from "@/lib/collection-clusters";
import type { PresentedTopic } from "@/lib/collection-topics";
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

function SwatchField({
  swatches,
  label,
  tall,
}: {
  swatches: ClusterSwatch[];
  label: string;
  tall?: boolean;
}) {
  if (swatches.length === 0) {
    return null;
  }

  return (
    <ul
      className={`grid sm:grid-cols-2 lg:grid-cols-4 ${tall ? "min-h-[calc(100svh-11rem)]" : ""}`}
      aria-label={label}
    >
      {swatches.map((swatch) => {
        const light = isLight(swatch.hex);
        return (
          <li key={swatch.href}>
            <LocaleLink href={swatch.href} className="group block h-full">
              <figure
                className={`relative flex h-full flex-col justify-end px-6 py-8 ${
                  tall ? "min-h-[22rem] lg:min-h-full" : "min-h-[14rem]"
                } ${light ? "border border-line" : ""}`}
                style={{ backgroundColor: swatch.hex }}
              >
                <figcaption>
                  <span
                    className={`font-sans text-[11px] tracking-[0.2em] uppercase ${
                      light ? "text-ink/70" : "text-paper/70"
                    }`}
                  >
                    {swatch.hex}
                  </span>
                  <span
                    className={`mt-3 block font-serif text-[32px] leading-none font-medium tracking-[-0.03em] ${
                      light ? "text-ink" : "text-paper"
                    }`}
                  >
                    {swatch.title}
                  </span>
                </figcaption>
              </figure>
            </LocaleLink>
          </li>
        );
      })}
    </ul>
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
            <span className="mt-1 block italic">{hub.emphasis}</span>
          </h1>
        </div>
        <p className="max-w-md font-sans text-[17px] leading-relaxed font-light text-muted lg:col-span-5">
          {hub.lede}
        </p>
      </header>

      <SwatchField swatches={hub.swatches} label={hub.indexEyebrow} tall />

      <section className="grid lg:grid-cols-12">
        <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:col-span-5 lg:px-14">
          <p className="font-serif text-[28px] leading-snug font-medium tracking-[-0.03em] text-ink md:text-[34px]">
            {hub.statement}
          </p>
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

export function FarbenTopic({ hub, slug }: { hub: PresentedTopic; slug: string }) {
  const hex = hub.hex || "#f4f1ea";
  const light = isLight(hex);

  return (
    <main className="bg-paper">
      <section style={{ backgroundColor: hex }} aria-labelledby="farben-topic">
        <div className="grid items-end lg:grid-cols-12">
          <div className="px-5 py-14 sm:px-8 lg:col-span-5 lg:px-14 lg:py-20">
            <Crumbs hub={hub} tone={light ? "ink" : "paper"} />
            <p
              className={`mt-8 font-sans text-[11px] tracking-[0.22em] uppercase ${
                light ? "text-ink/50" : "text-paper/60"
              }`}
            >
              {hex}
            </p>
            <h1
              id="farben-topic"
              className={`mt-4 font-serif text-[48px] leading-[0.92] font-medium tracking-[-0.04em] sm:text-[68px] ${
                light ? "text-ink" : "text-paper"
              }`}
            >
              {hub.title} <em className="italic">{hub.emphasis}</em>
            </h1>
            <p
              className={`mt-5 max-w-md font-serif text-[22px] leading-snug italic ${
                light ? "text-ink/75" : "text-paper/80"
              }`}
            >
              {hub.toneLine || hub.lede}
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

      <section className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-14">
        <p className="font-serif text-[26px] leading-snug font-medium text-ink lg:col-span-5">
          {hub.statement}
        </p>
        <div className="lg:col-span-7">
          <RuledPoints branches={hub.branches} />
        </div>
      </section>

      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <HouseLine houses={hub.houses} title={housesTitle(hub.locale)} />
      <SoftClose hub={hub} />
    </main>
  );
}
