import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";
import { Crumbs, QuoteLine, SoftClose } from "@/components/catalog/clusters/parts";
import { cmsSrc } from "@/lib/beer-photos";
import type { PresentedTopic } from "@/lib/collection-topics";
import TopicReading from "@/components/catalog/clusters/TopicReading";

function plate(file: string) {
  return cmsSrc(`/cms-uploads/${file}`, 1800);
}

const PLATES: Record<string, readonly [string, string, string]> = {
  modern: [
    plate("stile_modern_f2719204d7.jpg"),
    plate("kuechen_muenchen_moderne_kuechen_bdea3d344f.jpg"),
    plate("moderne_kueche_schreinerkueche_f599513827.jpg"),
  ],
  landhaus: [
    plate("stile_landhaus_f9af4a334a.jpg"),
    plate("kuechen_ideen_landhauskueche_b60beac428.jpg"),
    plate("cottage_kuechen_landhaus_611c8a5790.jpg"),
  ],
  design: [
    plate("stile_design_1d3d4e9c34.jpg"),
    plate("kuechenstudio_designer_kuechen_ffe4738165.jpg"),
    plate("designer_kuechen_kuechenstudio_7ad535eda2.jpg"),
  ],
  holz: [
    plate("stile_holz_87d73d35f9.jpg"),
    plate("holzkueche_kuechen_ideen_10721ba09d.jpg"),
    plate("wohnkueche_holzkueche_f785db62dd.jpg"),
  ],
  purist: [
    plate("stile_purist_07193b6650.jpg"),
    plate("Puristische_Kueche_1_558845279f.jpg"),
    plate("Puristische_Kueche_6_d4a08bb4f3.jpg"),
  ],
  luxus: [
    plate("kuechen_weiss_holz_luxus_kuechen_dba2f3c9dc.jpg"),
    plate("Design_in_Glas_und_Stein_2_6669eaa7d7.jpg"),
    plate("stile_design_1d3d4e9c34.jpg"),
  ],
};

/** Photos of a kitchen tagged with this style when there is one; the fixed plates only without. */
function platesFor(slug: string, hub: PresentedTopic) {
  const kitchen = [hub.heroImage, hub.statementImage, hub.statementImageB] as const;
  return (hub.taggedKitchens ?? 0) > 0 ? kitchen : (PLATES[slug] ?? kitchen);
}

function OtherStances({ hub }: { hub: PresentedTopic }) {
  if (hub.siblings.length === 0) {
    return null;
  }

  return (
    <nav className="border-t border-line px-5 py-12 sm:px-8 lg:px-14" aria-label={hub.siblingTitle}>
      <p className="type-eyebrow text-muted">{hub.siblingEyebrow}</p>
      <ul className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
        {hub.siblings.map((item) => (
          <li key={item.href}>
            <LocaleLink
              href={item.href}
              className="font-serif text-[26px] leading-none text-ink transition-opacity hover:opacity-50"
            >
              {item.title}
            </LocaleLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function OneHouse({ hub }: { hub: PresentedTopic }) {
  const house = hub.houses[0];
  if (!house) {
    return null;
  }
  const label = hub.locale === "en" ? "A house with this stance" : "Ein Haus mit dieser Haltung";

  return (
    <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14">
      <p className="type-eyebrow text-gold">{label}</p>
      <LocaleLink href={house.href} className="group mt-6 grid items-end gap-6 lg:grid-cols-12">
        <Frame
          src={house.image}
          alt={house.title}
          className="aspect-[16/9] lg:col-span-8"
          imgClassName="transition-transform duration-700 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        <span className="lg:col-span-4 lg:pb-2">
          <span className="block font-serif text-[32px] leading-tight font-medium text-ink">
            {house.title}
          </span>
          {house.meta ? (
            <span className="mt-3 block font-sans text-[11px] tracking-[0.18em] text-muted uppercase">
              {house.meta}
            </span>
          ) : null}
        </span>
      </LocaleLink>
    </section>
  );
}

function Facts({ hub, invert }: { hub: PresentedTopic; invert?: boolean }) {
  return (
    <ul className={`grid grid-cols-2 lg:grid-cols-4 ${invert ? "" : "border-y border-line"}`}>
      {hub.facts.map((fact) => (
        <li
          key={`${fact.value}-${fact.label}`}
          className={invert ? "px-1 py-4" : "border-line px-5 py-8 sm:px-8 lg:border-l lg:px-8 lg:first:border-l-0"}
        >
          <p className={`font-serif text-[28px] leading-none font-medium md:text-[34px] ${invert ? "text-paper" : "text-ink"}`}>
            {fact.value}
          </p>
          <p className={`type-eyebrow mt-3 ${invert ? "text-messing" : "text-muted"}`}>{fact.label}</p>
        </li>
      ))}
    </ul>
  );
}

function Modern({
  hub,
  photos,
  slug,
}: {
  hub: PresentedTopic;
  photos: readonly string[];
  slug: string;
}) {
  return (
    <main className="bg-paper">
      <section className="grid lg:min-h-[calc(100svh-3.5rem)] lg:grid-cols-12">
        <div className="flex flex-col justify-end px-5 py-14 sm:px-8 lg:col-span-5 lg:px-14 lg:py-20">
          <Crumbs hub={hub} />
          <h1 className="mt-10 font-serif text-[64px] leading-[0.86] font-medium tracking-[-0.05em] text-ink sm:text-[88px]">
            {hub.title}
            <em className="mt-2 block font-medium italic">{hub.emphasis}</em>
          </h1>
          <p className="mt-8 max-w-sm font-sans text-[17px] leading-relaxed font-light text-muted">
            {hub.lede}
          </p>
        </div>
        <Frame
          src={photos[0]}
          alt={hub.heroAlt}
          className="min-h-[70vh] lg:col-span-7 lg:min-h-full"
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
      </section>
      <Facts hub={hub} />
      <p className="max-w-4xl px-5 py-16 font-serif text-[28px] leading-snug font-medium tracking-[-0.03em] text-ink sm:px-8 md:text-[40px] lg:px-14 lg:py-24">
        {hub.statement}
      </p>
      <ol className="border-t border-line">
        {hub.branches.map((branch, index) => (
          <li
            key={branch.title}
            className="grid items-center gap-8 border-b border-line px-5 py-10 sm:px-8 lg:grid-cols-12 lg:px-14"
          >
            <p className="font-serif text-[40px] text-gold lg:col-span-2">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="font-serif text-[32px] leading-tight font-medium text-ink lg:col-span-4">
              {branch.title}
            </h2>
            <p className="max-w-md font-sans text-[16px] leading-relaxed text-muted lg:col-span-6">
              {branch.text}
            </p>
          </li>
        ))}
      </ol>
      <div className="grid lg:grid-cols-12">
        <Frame
          src={photos[1]}
          alt=""
          className="aspect-[16/10] lg:col-span-7"
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <Frame
          src={photos[2]}
          alt=""
          className="aspect-[16/10] lg:col-span-5 lg:aspect-auto"
          sizes="(max-width: 1024px) 100vw, 42vw"
        />
      </div>
      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <OtherStances hub={hub} />
      <OneHouse hub={hub} />
      <SoftClose hub={hub} />
    </main>
  );
}

function Landhaus({
  hub,
  photos,
  slug,
}: {
  hub: PresentedTopic;
  photos: readonly string[];
  slug: string;
}) {
  return (
    <main className="bg-karte">
      <section className="px-4 pt-8 sm:px-6 lg:px-10">
        <div className="px-2 lg:px-4">
          <Crumbs hub={hub} />
        </div>
        <div className="relative mt-6">
          <Frame
            src={photos[0]}
            alt={hub.heroAlt}
            className="h-[calc(100svh-8.5rem)] min-h-[28rem]"
            imgClassName="object-[center_40%]"
            priority
            sizes="100vw"
          />
          <div className="absolute bottom-4 left-4 z-10 max-w-xl bg-paper px-6 py-7 shadow-[0_24px_60px_rgba(20,20,20,0.08)] sm:bottom-8 sm:left-8 sm:px-10 sm:py-10">
            <h1 className="font-serif text-[48px] leading-[0.9] font-medium tracking-[-0.04em] text-ink sm:text-[68px]">
              {hub.title}
              <em className="mt-1 block italic">{hub.emphasis}</em>
            </h1>
            <p className="mt-5 max-w-md font-sans text-[16px] leading-relaxed text-muted">{hub.lede}</p>
          </div>
        </div>
      </section>
      <div className="mt-16 bg-paper">
        <Facts hub={hub} />
      </div>
      <section className="grid items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-14 lg:py-24">
        <p className="font-serif text-[30px] leading-snug font-medium tracking-[-0.03em] text-ink italic lg:col-span-5 md:text-[38px]">
          {hub.statement}
        </p>
        <div className="lg:col-span-6 lg:col-start-7">
          {hub.branches.map((branch) => (
            <article key={branch.title} className="border-t border-line py-6 last:border-b">
              <h2 className="font-serif text-[24px] font-medium text-ink">{branch.title}</h2>
              <p className="mt-2 max-w-md font-sans text-[15px] leading-relaxed text-muted">{branch.text}</p>
            </article>
          ))}
        </div>
      </section>
      <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2 sm:px-6 lg:px-10">
        <Frame src={photos[1]} alt="" className="aspect-[4/5]" sizes="(max-width: 640px) 100vw, 50vw" />
        <Frame src={photos[2]} alt="" className="aspect-[4/5]" sizes="(max-width: 640px) 100vw, 50vw" />
      </div>
      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <OtherStances hub={hub} />
      <OneHouse hub={hub} />
      <SoftClose hub={hub} />
    </main>
  );
}

function Design({
  hub,
  photos,
  slug,
}: {
  hub: PresentedTopic;
  photos: readonly string[];
  slug: string;
}) {
  return (
    <main className="bg-paper">
      <header className="px-5 pt-12 sm:px-8 lg:px-14">
        <Crumbs hub={hub} />
        <h1 className="mt-8 max-w-5xl font-serif text-[64px] leading-[0.84] font-medium tracking-[-0.055em] text-ink sm:text-[104px]">
          {hub.title}
          <em className="block italic">{hub.emphasis}</em>
        </h1>
      </header>
      <div className="mt-8 grid items-end lg:grid-cols-12">
        <p className="px-5 pb-8 font-sans text-[17px] leading-relaxed font-light text-muted sm:px-8 lg:col-span-4 lg:px-14">
          {hub.lede}
        </p>
        <Frame
          src={photos[0]}
          alt={hub.heroAlt}
          className="aspect-[4/5] lg:col-span-8 lg:-mr-0"
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>
      <section className="bg-nacht px-5 py-16 text-paper sm:px-8 lg:px-14 lg:py-24">
        <p className="max-w-3xl font-serif text-[30px] leading-snug font-medium italic md:text-[40px]">
          {hub.statement}
        </p>
        <ol className="mt-14 grid gap-12 lg:grid-cols-3">
          {hub.branches.map((branch, index) => (
            <li key={branch.title}>
              <p className="font-sans text-[11px] tracking-[0.22em] text-messing uppercase">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-4 font-serif text-[28px] leading-tight font-medium">{branch.title}</h2>
              <p className="mt-3 font-sans text-[15px] leading-relaxed font-light text-paper/75">
                {branch.text}
              </p>
            </li>
          ))}
        </ol>
      </section>
      <div className="grid sm:grid-cols-5">
        <Frame src={photos[1]} alt="" className="aspect-[4/5] sm:col-span-3" sizes="60vw" />
        <Frame src={photos[2]} alt="" className="aspect-[4/5] sm:col-span-2" sizes="40vw" />
      </div>
      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <OtherStances hub={hub} />
      <OneHouse hub={hub} />
      <SoftClose hub={hub} />
    </main>
  );
}

function Holz({
  hub,
  photos,
  slug,
}: {
  hub: PresentedTopic;
  photos: readonly string[];
  slug: string;
}) {
  return (
    <main className="bg-paper">
      <header className="px-5 pt-10 sm:px-8 lg:px-14 lg:pt-16">
        <Crumbs hub={hub} />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-serif text-[64px] leading-[0.86] font-medium tracking-[-0.05em] text-ink sm:text-[96px]">
            {hub.title}
            <em className="mt-1 block italic">{hub.emphasis}</em>
          </h1>
          <p className="max-w-xs font-sans text-[16px] leading-relaxed text-muted">{hub.lede}</p>
        </div>
      </header>
      <Frame
        src={photos[0]}
        alt={hub.heroAlt}
        className="mt-10 aspect-[16/9] w-full"
        imgClassName="object-[center_45%]"
        priority
        sizes="100vw"
      />
      <section className="grid lg:grid-cols-12">
        <Frame
          src={photos[1]}
          alt=""
          className="min-h-[24rem] lg:col-span-5 lg:min-h-[40rem]"
          sizes="(max-width: 1024px) 100vw, 42vw"
        />
        <div className="flex flex-col justify-center px-5 py-14 sm:px-8 lg:col-span-7 lg:px-16">
          <p className="font-serif text-[30px] leading-snug font-medium tracking-[-0.03em] text-ink md:text-[38px]">
            {hub.statement}
          </p>
          {hub.statementNote ? (
            <p className="mt-6 max-w-md font-sans text-[16px] leading-relaxed text-muted">
              {hub.statementNote}
            </p>
          ) : null}
          <ul className="mt-10 border-t border-line">
            {hub.branches.map((branch, index) => (
              <li key={branch.title} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-b border-line py-5">
                <span className="type-eyebrow pt-1 text-gold">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-serif text-[22px] font-medium text-ink">{branch.title}</span>
                  <span className="mt-1 block font-sans text-[15px] leading-relaxed text-muted">{branch.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Facts hub={hub} />
      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <OtherStances hub={hub} />
      <OneHouse hub={hub} />
      <SoftClose hub={hub} />
    </main>
  );
}

function Purist({
  hub,
  photos,
  slug,
}: {
  hub: PresentedTopic;
  photos: readonly string[];
  slug: string;
}) {
  return (
    <main className="bg-paper">
      <header className="mx-auto max-w-3xl px-5 pt-20 text-center sm:pt-28">
        <Crumbs hub={hub} />
        <h1 className="mt-10 font-serif text-[64px] leading-[0.88] font-medium tracking-[-0.05em] text-ink sm:text-[92px]">
          {hub.title}
          <em className="mt-2 block italic">{hub.emphasis}</em>
        </h1>
        <p className="mx-auto mt-8 max-w-md font-sans text-[17px] leading-relaxed font-light text-muted">
          {hub.lede}
        </p>
      </header>
      <Frame
        src={photos[0]}
        alt={hub.heroAlt}
        className="mx-auto mt-16 aspect-[16/10] max-w-5xl"
        priority
        sizes="(max-width: 1024px) 100vw, 64rem"
      />
      <p className="mx-auto mt-16 max-w-2xl px-5 text-center font-serif text-[28px] leading-snug font-medium italic text-ink md:text-[36px]">
        {hub.statement}
      </p>
      <ol className="mx-auto mt-16 max-w-xl px-5">
        {hub.branches.map((branch, index) => (
          <li key={branch.title} className="border-t border-line py-8 text-center last:border-b">
            <p className="type-eyebrow text-gold">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-3 font-serif text-[26px] font-medium text-ink">{branch.title}</h2>
            <p className="mt-2 font-sans text-[15px] leading-relaxed text-muted">{branch.text}</p>
          </li>
        ))}
      </ol>
      <div className="mx-auto mt-16 grid max-w-5xl gap-4 px-5 sm:grid-cols-2">
        <Frame src={photos[1]} alt="" className="aspect-[4/5]" sizes="50vw" />
        <Frame src={photos[2]} alt="" className="aspect-[4/5]" sizes="50vw" />
      </div>
      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <OtherStances hub={hub} />
      <OneHouse hub={hub} />
      <SoftClose hub={hub} />
    </main>
  );
}

function Luxus({
  hub,
  photos,
  slug,
}: {
  hub: PresentedTopic;
  photos: readonly string[];
  slug: string;
}) {
  return (
    <main className="bg-paper">
      <header className="px-5 pt-12 sm:px-8 lg:px-14 lg:pt-20">
        <Crumbs hub={hub} />
        <h1 className="mt-8 max-w-4xl font-serif text-[64px] leading-[0.86] font-medium tracking-[-0.05em] text-ink sm:text-[96px]">
          {hub.title}
          <em className="mt-2 block italic">{hub.emphasis}</em>
        </h1>
        <p className="mt-6 max-w-lg font-sans text-[17px] leading-relaxed font-light text-muted">{hub.lede}</p>
      </header>
      <section className="mt-12 bg-nacht px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
        <Frame
          src={photos[0]}
          alt={hub.heroAlt}
          className="mx-auto aspect-[16/9] max-w-6xl"
          priority
          sizes="(max-width: 1024px) 100vw, 72rem"
        />
        {hub.quote ? (
          <>
            <p className="mx-auto mt-12 max-w-3xl text-center font-serif text-[28px] leading-snug font-medium text-paper md:text-[36px]">
              {hub.quote}
            </p>
            <p className="mt-5 text-center font-sans text-[11px] tracking-[0.2em] text-messing uppercase">
              {hub.quoteSource}
            </p>
          </>
        ) : null}
        <div className="mx-auto mt-12 max-w-6xl border-t border-paper/15">
          <Facts hub={hub} invert />
        </div>
      </section>
      <section className="grid gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-14 lg:py-24">
        <div className="lg:col-span-5">
          <p className="font-serif text-[28px] leading-snug font-medium text-ink">{hub.statement}</p>
          {hub.statementNote ? (
            <p className="mt-6 font-sans text-[15px] leading-relaxed text-muted">{hub.statementNote}</p>
          ) : null}
        </div>
        <ol className="lg:col-span-6 lg:col-start-7">
          {hub.branches.map((branch, index) => (
            <li key={branch.title} className="border-t border-line py-6">
              <p className="type-eyebrow text-gold">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-serif text-[26px] font-medium text-ink">{branch.title}</h2>
              <p className="mt-2 max-w-md font-sans text-[15px] leading-relaxed text-muted">{branch.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <div className="grid sm:grid-cols-2">
        <Frame src={photos[1]} alt="" className="aspect-[4/5]" sizes="50vw" />
        <Frame src={photos[2]} alt="" className="aspect-[4/5]" sizes="50vw" />
      </div>
      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <OtherStances hub={hub} />
      <OneHouse hub={hub} />
      <SoftClose hub={hub} />
    </main>
  );
}

const ESSAY = {
  modern: Modern,
  landhaus: Landhaus,
  design: Design,
  holz: Holz,
  purist: Purist,
  luxus: Luxus,
} as const;

export function StileTopic({ hub, slug }: { hub: PresentedTopic; slug: string }) {
  const photos = platesFor(slug, hub);
  const Essay = ESSAY[slug as keyof typeof ESSAY] ?? Modern;
  return <Essay hub={hub} photos={photos} slug={slug} />;
}
