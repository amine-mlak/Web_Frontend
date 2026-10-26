import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";
import {
  ClusterLinks,
  HouseLine,
  QuoteLine,
  SoftClose,
} from "@/components/catalog/clusters/parts";
import type { PresentedCluster } from "@/lib/collection-clusters";
import type { PresentedBranch } from "@/lib/collection-present";
import { photoKey } from "@/lib/utils";

function housesTitle(locale: PresentedCluster["locale"]) {
  return locale === "en" ? "Houses with a stance" : "Häuser mit Haltung";
}

function span(index: number) {
  if (index === 0) return "lg:col-span-8";
  if (index === 1) return "lg:col-span-4";
  return "lg:col-span-4";
}

function Plate({
  branch,
  priority,
  tall,
}: {
  branch: PresentedBranch;
  priority?: boolean;
  tall?: boolean;
}) {
  return (
    <LocaleLink href={branch.href ?? "/kuechen/stile"} className="group relative block h-full">
      <Frame
        src={branch.image}
        alt={branch.alt}
        srcSet={branch.srcSet}
        className={tall ? "aspect-[3/4] min-h-[70vh] lg:aspect-auto lg:h-full" : "aspect-[3/4]"}
        imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
        priority={priority}
        sizes={tall ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"}
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-nacht/75 to-transparent p-5 sm:p-7">
        <span className="font-sans text-[11px] tracking-[0.2em] text-messing uppercase">
          {branch.kicker}
        </span>
        <span className="mt-2 block font-serif text-[28px] leading-tight font-medium text-paper md:text-[34px]">
          {branch.title}
        </span>
      </span>
    </LocaleLink>
  );
}

export function StileCluster({ hub }: { hub: PresentedCluster }) {
  const [first, second, ...rest] = hub.branches;
  // The first plate already shows the first style; the hero does not repeat it.
  const hero =
    first?.image && photoKey(first.image) === photoKey(hub.heroImage) ? hub.statementImage : hub.heroImage;

  return (
    <main className="bg-paper">
      <section
        data-site-hero=""
        className="relative isolate -mt-14 min-h-[88svh] bg-nacht"
        aria-labelledby="stile-hero"
      >
        <Frame
          src={hero}
          alt={hub.heroAlt}
          className="absolute inset-0"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nacht/80 via-nacht/10 to-nacht/35" aria-hidden />
        <div className="relative z-10 flex min-h-[88svh] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-16">
          <div className="max-w-2xl">
            <p className="font-sans text-[11px] tracking-[0.22em] text-paper/80 uppercase">
              {hub.eyebrow}
            </p>
            <h1
              id="stile-hero"
              className="mt-4 font-serif text-[56px] leading-[0.9] font-medium tracking-[-0.045em] text-paper sm:text-[84px]"
            >
              {hub.title}
              <span className="mt-1 block italic">{hub.emphasis}</span>
            </h1>
            <p className="mt-5 max-w-lg font-sans text-[17px] leading-relaxed font-light text-paper/85">
              {hub.lede}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-karte px-5 py-14 sm:px-8 lg:px-14">
        <p className="max-w-3xl font-serif text-[26px] leading-snug font-medium tracking-[-0.03em] text-ink md:text-[34px]">
          {hub.statement}
        </p>
      </section>

      <section aria-labelledby="stile-plates" className="px-3 py-3 sm:px-4">
        <h2 id="stile-plates" className="sr-only">
          {hub.indexEyebrow}
        </h2>
        <ul className="grid gap-3 lg:grid-cols-12">
          {first ? (
            <li className={span(0)}>
              <Plate branch={first} priority tall />
            </li>
          ) : null}
          {second ? (
            <li className={span(1)}>
              <Plate branch={second} tall />
            </li>
          ) : null}
          {rest.map((branch) => (
            <li key={branch.href ?? branch.title} className={span(2)}>
              <Plate branch={branch} />
            </li>
          ))}
        </ul>
      </section>

      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <HouseLine houses={hub.houses} title={housesTitle(hub.locale)} />
      <ClusterLinks hub={hub} />
      <SoftClose hub={hub} />
    </main>
  );
}
