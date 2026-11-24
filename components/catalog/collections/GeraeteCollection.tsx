import CtaPair from "@/components/CtaPair";
import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import OpeningPhotos from "@/components/catalog/OpeningPhotos";
import type { PresentedHub } from "@/lib/collection-present";
import type { ApplianceBrandLogo } from "@/lib/appliance-media";
import { fetchAppliances } from "@/lib/catalog-api";
import { GERAETE_KIND_ROUTES } from "@/lib/collection-entries";
import { fetchBrandLogos } from "@/lib/strapi";
import { cmsSrc } from "@/lib/beer-photos";
import { HubEnd } from "@/components/catalog/collections/parts";
import { QuoteLine } from "@/components/catalog/clusters/parts";
import { cn } from "@/lib/utils";

function BrandMark({
  brand,
  className,
}: {
  brand: ApplianceBrandLogo;
  className?: string;
}) {
  return (
    <span className={cn("relative block h-6 w-[7.5rem]", className)}>
      <CmsImage
        src={brand.logo}
        alt={brand.name}
        fill
        sizes="140px"
        className={cn(
          "object-contain object-left",
          brand.invert && "brightness-0 invert",
        )}
      />
    </span>
  );
}

/**
 * Photos from the makers themselves for the opening strips, as files of the CMS media library.
 * A group without one keeps the kitchen we built.
 */
const MAKER_PHOTOS: Record<
  string,
  {
    file: string;
    width: number;
    brand: string;
    alt: Record<"de" | "en", string>;
  }
> = {
  kochen: {
    file: "BORA_Professional_PKAS_PKFI_PKG_Schwein_cac5864f16.jpg",
    width: 4000,
    brand: "bora",
    alt: {
      de: "BORA-Kochfeldabzug zwischen Gaskochfeld und einem Bräter mit Braten",
      en: "BORA cooktop extractor between a gas hob and a roasting pan",
    },
  },
  backen: {
    file: "2017_072_04_bfb034e133.jpg",
    width: 2835,
    brand: "miele",
    alt: {
      de: "Einbaubackofen von Miele in dunkelgrauer Schrankwand, davor zwei Hefezöpfe auf schwarzen Tabletts",
      en: "Built-in Miele oven in a dark grey wall of tall units, two braided loaves on black trays in front",
    },
  },
  kaelte: {
    file: "marke_gaggenau_geoeffneter_kuehlschrank_holzfront_fenster_blick_see_cca6304265.jpg",
    width: 2500,
    brand: "gaggenau",
    alt: {
      de: "Geöffneter Gaggenau-Kühlschrank mit beleuchtetem Innenraum in einer Holzfront, daneben ein Fenster mit Blick auf einen See",
      en: "Open Gaggenau fridge with a lit interior in a wood front, beside a window looking onto a lake",
    },
  },
  spuelen: {
    file: "marke_quooker_armatur_edelstahl_spuele_kuecheninsel_heller_holzplatte_17f8118711.jpg",
    width: 1680,
    brand: "quooker",
    alt: {
      de: "Quooker-Armatur aus Edelstahl an der Spüle einer Kücheninsel mit heller Holzplatte",
      en: "Stainless steel Quooker tap at the sink of a kitchen island with a pale wooden top",
    },
  },
  extra: {
    file: "marke_gaggenau_einbau_kaffeevollautomat_edelstahl_latte_macchiato_dunkler_wand_c8290afeaa.jpg",
    width: 2835,
    brand: "gaggenau",
    alt: {
      de: "Einbau-Kaffeevollautomat von Gaggenau aus Edelstahl mit einem Glas Latte macchiato in einer dunklen Wand",
      en: "Built-in Gaggenau coffee machine in stainless steel with a glass of latte macchiato in a dark wall",
    },
  },
};
const MAKER_WIDTHS = [1280, 1600, 1920, 2560];

/** The logos run across the page as one band without an end: four identical rows, moved by half. */
const BAND_ROWS = [0, 1, 2, 3];

export default async function GeraeteCollection({
  hub,
  children,
}: {
  hub: PresentedHub;
  children?: ReactNode;
}) {
  const [brands, appliances] = await Promise.all([
    fetchBrandLogos(),
    fetchAppliances(),
  ]);
  const en = hub.locale === "en";
  const partners = en ? "Partners we fit" : "Marken, die wir einbauen";
  const choice = en ? "What you can choose" : "Was zur Wahl steht";
  const more = en ? "Learn more" : "Mehr erfahren";
  const kitchen = en ? "See the kitchen" : "Zur Küche";
  const photoBy = en ? "Photo" : "Foto";
  const toBrand = en ? "About the brand" : "Zur Marke";
  const sorted = [...appliances].sort((a, b) => a.order - b.order);
  const inGroup = (href: string | undefined) => {
    const route = GERAETE_KIND_ROUTES.find((item) => item.href === href);
    return route
      ? sorted.filter((appliance) => appliance.kind === route.slug)
      : [];
  };

  // Each group opens on a photo from a maker we fit, or on a kitchen we built, with the way on.
  const photos = hub.branches.map((branch, index) => {
    const id = branch.href?.split("/").pop() || String(index);
    const maker = MAKER_PHOTOS[id];
    const makerBrand = maker
      ? brands.find((brand) => brand.slug === maker.brand)
      : undefined;
    const widths = maker
      ? MAKER_WIDTHS.filter((width) => width <= maker.width)
      : [];
    const image = maker
      ? {
          src: cmsSrc(`/cms-uploads/${maker.file}`, 1600),
          srcSet: widths
            .map(
              (width) =>
                `${cmsSrc(`/cms-uploads/${maker.file}`, width)} ${width}w`,
            )
            .join(", "),
          alt: maker.alt[en ? "en" : "de"],
        }
      : { src: branch.image, srcSet: branch.srcSet, alt: branch.alt };
    return {
      id,
      title: branch.title,
      image,
      panel: (
        <>
          <h2 className="t-section text-paper">
            <LocaleLink href={branch.href ?? "/beratung"}>
              {branch.title}
            </LocaleLink>
          </h2>
          <p className="mt-3 max-w-md font-sans text-[17px] leading-relaxed font-light text-paper/90">
            {branch.text}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {inGroup(branch.href).map((appliance) => (
              <li key={appliance.slug}>
                <LocaleLink
                  href={`/geraete/${appliance.slug}`}
                  className="inline-block rounded-full border border-paper/60 bg-ink/20 px-4 py-1.5 font-sans text-[15px] backdrop-blur-sm transition-colors hover:bg-paper hover:text-ink"
                >
                  {appliance.name}
                </LocaleLink>
              </li>
            ))}
          </ul>
          {maker ? (
            <p className="mt-5 max-w-xl font-sans text-[14px] leading-relaxed text-paper/70">
              {photoBy}: {makerBrand?.name ?? maker.brand}.{" "}
              {makerBrand ? (
                <LocaleLink
                  href={`/marken/${makerBrand.slug}`}
                  className="text-paper underline decoration-messing underline-offset-4"
                >
                  {toBrand}: {makerBrand.name}
                </LocaleLink>
              ) : null}
            </p>
          ) : branch.source ? (
            <p className="mt-5 max-w-xl font-sans text-[14px] leading-relaxed text-paper/70">
              {branch.alt}
              {branch.source.place ? ` · ${branch.source.place}` : ""}.{" "}
              <LocaleLink
                href={branch.source.href}
                className="text-paper underline decoration-messing underline-offset-4"
              >
                {kitchen}: {branch.source.project}
              </LocaleLink>
            </p>
          ) : null}
        </>
      ),
    };
  });

  return (
    <main className="bg-paper text-ink">
      {/* The photos come first and leave room for the title in the first screen. */}
      <OpeningPhotos photos={photos} label={hub.indexEyebrow} />

      <section
        className="px-5 pt-8 pb-10 sm:px-8 lg:px-gutter lg:pt-10 lg:pb-14"
        aria-labelledby="geraete-hero"
      >
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
          <h1 id="geraete-hero" className="t-display lg:col-span-6">
            {hub.title}
          </h1>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="t-lede text-muted">{hub.lede}</p>
            <p className="mt-4 font-sans text-[14px] leading-relaxed text-muted">
              {hub.statementNote}
            </p>
            <CtaPair
              href={hub.ctaHref}
              label={hub.ctaLabel}
              locale={hub.locale}
              className="mt-7"
            />
          </div>
        </div>
      </section>

      {sorted.length > 0 ? (
        <section
          className="px-5 py-16 sm:px-8 lg:px-gutter lg:py-24"
          aria-labelledby="geraete-wahl"
        >
          <h2 id="geraete-wahl" className="t-section">
            {choice}
          </h2>
          <ul className="mt-10 grid gap-x-16 border-t border-line md:grid-cols-2 lg:mt-14">
            {sorted.map((appliance) => (
              <li key={appliance.slug} className="border-b border-line py-8">
                <h3 className="t-item">
                  <LocaleLink href={`/geraete/${appliance.slug}`}>
                    {appliance.ueberschrift || appliance.name}
                  </LocaleLink>
                </h3>
                <p className="mt-3 max-w-xl font-sans text-[16px] leading-relaxed text-ink">
                  {appliance.aussage || appliance.intro}
                </p>
                {appliance.hinweis ? (
                  <p className="mt-2 max-w-xl font-sans text-[16px] leading-relaxed text-muted">
                    {appliance.hinweis}
                  </p>
                ) : null}
                <LocaleLink
                  href={`/geraete/${appliance.slug}`}
                  className="btn-quiet mt-5"
                >
                  {more}: {appliance.name}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {brands.length > 0 ? (
        <section
          className="bg-nacht py-10 text-paper lg:py-12"
          aria-labelledby="geraete-partners"
        >
          <h2
            id="geraete-partners"
            className="t-item px-5 sm:px-8 lg:px-gutter"
          >
            {partners}
          </h2>
          <div className="brand-band mt-8 overflow-hidden">
            <ul className="brand-track flex w-max items-center">
              {BAND_ROWS.flatMap((row) =>
                brands.map((brand) => (
                  <li
                    key={`${row}-${brand.slug}`}
                    aria-hidden={row > 0 || undefined}
                    className="shrink-0 pr-16 lg:pr-28"
                  >
                    <LocaleLink
                      href={`/marken/${brand.slug}`}
                      tabIndex={row > 0 ? -1 : undefined}
                      className="block opacity-90 transition-opacity hover:opacity-100"
                    >
                      <BrandMark brand={brand} className="h-7 w-[8.5rem]" />
                    </LocaleLink>
                  </li>
                )),
              )}
            </ul>
          </div>
        </section>
      ) : null}

      <QuoteLine quote={hub.quote} source={hub.quoteSource} />

      <HubEnd hub={hub}>{children}</HubEnd>
    </main>
  );
}
