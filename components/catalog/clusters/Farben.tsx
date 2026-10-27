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
import type { PresentedTopic, TopicShot } from "@/lib/collection-topics";
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
function ColourProjects({ hub }: { hub: PresentedTopic }) {
  const houses = hub.taggedHouses?.length ? hub.taggedHouses : hub.houses;
  if (houses.length === 0) {
    return null;
  }
  const en = hub.locale === "en";
  const first = houses.slice(0, 12);
  const rest = houses.slice(12);
  return (
    <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-20" aria-labelledby="farben-projekte">
      <h2 id="farben-projekte" className="font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[40px]">
        {en ? `${hub.heroAlt} from our projects` : `${hub.heroAlt} aus unseren Projekten`}
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

/** A photo from a real project, with the project's name under it as a link. */
function Shot({ shot, className, sizes }: { shot: TopicShot; className: string; sizes: string }) {
  return (
    <LocaleLink href={shot.href} className="group block">
      <Frame
        src={shot.src}
        srcSet={shot.srcSet}
        alt={shot.alt}
        className={className}
        imgClassName="transition-transform duration-700 group-hover:scale-[1.02]"
        sizes={sizes}
      />
      <span className="mt-3 block font-sans text-[14px] text-muted transition-colors group-hover:text-ink">
        {shot.title}
        {shot.place ? ` · ${shot.place}` : ""}
      </span>
    </LocaleLink>
  );
}

/** Shares the project photos out over the page: the points get one each or none at all, never some. */
function shareShots(shots: TopicShot[], points: number) {
  const pointsGetPhotos = points > 0 && shots.length >= points;
  const withStatement = !pointsGetPhotos || shots.length > points;
  const statementShot: TopicShot | undefined = withStatement ? shots[0] : undefined;
  const start = withStatement ? 1 : 0;
  const pointShots = pointsGetPhotos ? shots.slice(start, start + points) : [];
  const rest = shots.slice(start + pointShots.length);
  return { statementShot, pointShots, wide: rest[0] as TopicShot | undefined, pair: rest.length >= 3 ? rest.slice(1, 3) : [] };
}

export function FarbenTopic({ hub, slug }: { hub: PresentedTopic; slug: string }) {
  const hex = hub.hex || "#f4f1ea";
  const light = isLight(hex);
  const { statementShot, pointShots, wide, pair } = shareShots(hub.shots ?? [], hub.branches.length);
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

      {/* Statement next to a kitchen in this colour. */}
      <section className="mx-auto grid max-w-[90rem] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-14 lg:py-24">
        <div className={statementShot ? "lg:col-span-5 lg:self-center" : "lg:col-span-8"}>
          <h2 className="font-serif text-[30px] leading-snug font-medium tracking-[-0.02em] text-ink md:text-[38px]">
            {hub.statement}
          </h2>
          {hub.statementNote ? (
            <p className="mt-6 max-w-sm font-sans text-[16px] leading-relaxed text-muted">{hub.statementNote}</p>
          ) : null}
        </div>
        {statementShot ? (
          <div className="lg:col-span-7">
            <Shot shot={statementShot} className="aspect-[4/3]" sizes="(max-width: 1024px) 100vw, 58vw" />
          </div>
        ) : null}
      </section>

      {/* The points, each under a photo of a real kitchen in this colour. */}
      {hub.branches.length ? (
        <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <ul className={`grid gap-12 md:gap-8 ${hub.branches.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {hub.branches.map((branch, index) => (
              <li key={`${branch.title}-${index}`}>
                {pointShots[index] ? (
                  <Shot shot={pointShots[index]} className="aspect-[4/5]" sizes="(max-width: 768px) 100vw, 33vw" />
                ) : null}
                <h3 className="mt-6 font-serif text-[26px] leading-tight font-medium tracking-[-0.02em] text-ink md:text-[30px]">
                  {branch.title}
                </h3>
                <p className="mt-3 max-w-sm font-sans text-[16px] leading-relaxed text-muted">{branch.text}</p>
                {branch.points.length ? (
                  <ul className="mt-3 max-w-sm space-y-1 font-sans text-[15px] leading-relaxed text-ink/80">
                    {branch.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* A wide kitchen photo, then the longer text. */}
      {wide ? (
        <div className="px-5 sm:px-8 lg:px-14">
          <Shot shot={wide} className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]" sizes="100vw" />
        </div>
      ) : null}
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
      {pair.length === 2 ? (
        <div className="grid gap-6 px-5 pb-16 sm:grid-cols-2 sm:px-8 lg:px-14 lg:pb-24">
          {pair.map((shot) => (
            <Shot key={shot.href} shot={shot} className="aspect-[4/5]" sizes="(max-width: 640px) 100vw, 50vw" />
          ))}
        </div>
      ) : null}

      <ColourProjects hub={hub} />
      <section className="border-t border-line px-5 pt-16 sm:px-8 lg:px-14" aria-labelledby="farben-andere">
        <h2 id="farben-andere" className="font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[40px]">
          {hub.locale === "en" ? "Other colours" : "Andere Farben"}
        </h2>
      </section>
      <div className="px-5 pt-10 pb-4 sm:px-8 lg:px-14">
        <SwatchField
          swatches={hub.swatches.filter((swatch) => !swatch.href.endsWith(`/${slug}`))}
          label={hub.locale === "en" ? "Other colours" : "Andere Farben"}
          locale={hub.locale}
        />
      </div>
      <SoftClose hub={hub} />
    </main>
  );
}
