import { cmsSrc } from "@/lib/beer-photos";

type MakerFile = {
  file: string;
  width: number;
  alt: Record<"de" | "en", string>;
};

export type BrandPhoto = {
  src: string;
  srcSet?: string;
  alt: string;
  file: string;
};

/**
 * Photos from the brands themselves, as files of the CMS media library, by brand slug. The Marken
 * overview and the brand pages show them. A brand without one keeps the photo of its CMS entry.
 */
const BRAND_PHOTOS: Record<string, MakerFile[]> = {
  bora: [
    {
      file: "BORA_Professional_PKAS_PKFI_PKG_Kuechenblock_34b6fa2f17.jpg",
      width: 4000,
      alt: {
        de: "BORA-Kochfeldabzug zwischen zwei Kochfeldern in einem dunklen Küchenblock mit Bedienknebeln an der Front",
        en: "BORA cooktop extractor between two hobs in a dark kitchen block with control knobs on the front",
      },
    },
    {
      file: "BORA_Professional_PKAS_PKFI_PKG_Schwein_cac5864f16.jpg",
      width: 4000,
      alt: {
        de: "BORA-Kochfeldabzug zwischen Gaskochfeld und einem Bräter mit Braten",
        en: "BORA cooktop extractor between a gas hob and a roasting pan",
      },
    },
  ],
  miele: [
    {
      file: "2017_072_04_bfb034e133.jpg",
      width: 2835,
      alt: {
        de: "Einbaubackofen von Miele in dunkelgrauer Schrankwand, davor zwei Hefezöpfe auf schwarzen Tabletts",
        en: "Built-in Miele oven in a dark grey wall of tall units, two braided loaves on black trays in front",
      },
    },
  ],
  gaggenau: [
    {
      file: "marke_gaggenau_geoeffneter_kuehlschrank_holzfront_fenster_blick_see_cca6304265.jpg",
      width: 2500,
      alt: {
        de: "Geöffneter Gaggenau-Kühlschrank mit beleuchtetem Innenraum in einer Holzfront, daneben ein Fenster mit Blick auf einen See",
        en: "Open Gaggenau fridge with a lit interior in a wood front, beside a window looking onto a lake",
      },
    },
    {
      file: "gaggenau_dampfbackofen_400_e79a93090e.jpg",
      width: 1200,
      alt: {
        de: "Gaggenau-Dampfbackofen aus Edelstahl mit Wärmeschublade in einer dunklen Schrankwand",
        en: "Gaggenau steam oven in stainless steel with a warming drawer in a dark wall of tall units",
      },
    },
  ],
  quooker: [
    {
      file: "marke_quooker_armatur_edelstahl_spuele_kuecheninsel_heller_holzplatte_17f8118711.jpg",
      width: 1680,
      alt: {
        de: "Quooker-Armatur aus Edelstahl an der Spüle einer Kücheninsel mit heller Holzplatte",
        en: "Stainless steel Quooker tap at the sink of a kitchen island with a pale wooden top",
      },
    },
  ],
  siemens: [
    {
      file: "siemens_backofen_siemens_dampfgarer_b9790200fe.jpg",
      width: 1200,
      alt: {
        de: "Grifflose Hochschrankwand in Weiß mit zwei Siemens-Backöfen, daneben eine Theke mit Holzarbeitsplatte",
        en: "Handleless white wall of tall units with two Siemens ovens, beside a counter with a wooden worktop",
      },
    },
  ],
};

/** The brand whose photo opens the Marken overview. */
export const MARKEN_OPENER_BRAND = "gaggenau";

const WIDTHS = [1280, 1600, 1920, 2560];

/**
 * The brand's own photo. `skip` names a file the page already shows, so a brand with two photos
 * gives the other one.
 */
export function brandPhoto(slug: string, locale: string, skip?: string): BrandPhoto | undefined {
  const photos = BRAND_PHOTOS[slug] ?? [];
  const photo = photos.find((item) => item.file !== skip) ?? photos[0];
  if (!photo) {
    return undefined;
  }
  const path = `/cms-uploads/${photo.file}`;
  const widths = WIDTHS.filter((width) => width <= photo.width);
  return {
    src: cmsSrc(path, Math.min(1600, photo.width)),
    srcSet: widths.length ? widths.map((width) => `${cmsSrc(path, width)} ${width}w`).join(", ") : undefined,
    alt: photo.alt[locale === "en" ? "en" : "de"],
    file: photo.file,
  };
}
