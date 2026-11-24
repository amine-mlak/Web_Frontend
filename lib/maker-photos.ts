import { cmsSrc } from "@/lib/beer-photos";

/** A photo from a maker we fit, as a file of the CMS media library. */
export type MakerPhoto = {
  file: string;
  /** Width of the original in pixels: no larger version is asked for. */
  width: number;
  /** Slug of the brand in the CMS. */
  brand: string;
  alt: Record<"de" | "en", string>;
  /** Where the subject sits when the frame crops the photo (CSS object-position). */
  position?: string;
};

const WIDTHS = [1280, 1600, 1920, 2560];

export function makerImage(photo: MakerPhoto, locale: string) {
  const src = `/cms-uploads/${photo.file}`;
  return {
    src: cmsSrc(src, 1600),
    srcSet: WIDTHS.filter((width) => width <= photo.width)
      .map((width) => `${cmsSrc(src, width)} ${width}w`)
      .join(", "),
    alt: photo.alt[locale === "en" ? "en" : "de"],
  };
}

/**
 * One maker photo for each page under /geraete: the five group pages and the appliance pages.
 * A page without an entry shows no maker band (Geschirrspüler: no photo yet).
 */
export const MAKER_PAGE_PHOTOS: Record<string, MakerPhoto> = {
  kochen: {
    file: "BORA_Professional_PKAS_PKFI_PKG_Kuechenblock_34b6fa2f17.jpg",
    width: 4000,
    brand: "bora",
    alt: {
      de: "Küchenblock mit BORA-Kochfeldern, Abzug in der Mitte und Bedienknebeln an der Front",
      en: "Kitchen block with BORA hobs, the extractor in the middle and control knobs on the front",
    },
  },
  kochfeld: {
    file: "BORA_Professional_PKAS_2x_PKFI_evergreen_f40281ab5f.jpg",
    width: 4000,
    brand: "bora",
    alt: {
      de: "Zwei dampfende Töpfe auf BORA-Kochfeldern, der Dampf zieht zum Abzug in der Mitte",
      en: "Two steaming pots on BORA hobs, the steam is drawn to the extractor in the middle",
    },
  },
  kochfeldabzug: {
    file: "BORA_Classic_CKA_2x_CKFI_mit_CKAEG_16dd5ad1c5.jpg",
    width: 4000,
    brand: "bora",
    alt: {
      de: "BORA-Kochfeldabzug zieht den Dampf eines Bräters nach unten ab",
      en: "BORA cooktop extractor drawing the steam of a roasting pot downwards",
    },
  },
  backen: {
    file: "marke_gaggenau_drei_einbaugeraete_dunkle_holzwand_kuecheninsel_ausblick_bf34b83bf0.jpg",
    width: 4000,
    brand: "gaggenau",
    alt: {
      de: "Drei Gaggenau-Einbaugeräte in einer dunklen Holzwand, davor eine Kücheninsel mit Blick ins Grüne",
      en: "Three built-in Gaggenau appliances in a dark wood wall, a kitchen island with a view in front",
    },
    position: "30% 50%",
  },
  backofen: {
    file: "2017_072_06_74bdac2100.jpg",
    width: 2835,
    brand: "miele",
    alt: {
      de: "Miele-Backofen mit schwarzer Glasfront, silbernem Griff und Display in einer dunklen Hochschrankwand",
      en: "Miele oven with a black glass front, silver handle and display in a dark wall of tall units",
    },
    position: "25% 50%",
  },
  dampfgarer: {
    file: "marke_gaggenau_backofen_kaffeevollautomat_dampfbackofen_nebeneinander_dunkler_holzfront_53205295f6.jpg",
    width: 4000,
    brand: "gaggenau",
    alt: {
      de: "Backofen, Kaffeevollautomat und Dampfbackofen von Gaggenau nebeneinander in einer dunklen Holzfront",
      en: "Gaggenau oven, coffee machine and combi-steam oven side by side in a dark wood front",
    },
    position: "70% 50%",
  },
  kaelte: {
    file: "marke_gaggenau_geoeffneter_kuehlschrank_wohnkueche_glasfront_abend_d9a613e5cf.jpg",
    width: 2500,
    brand: "gaggenau",
    alt: {
      de: "Geöffneter Gaggenau-Kühlschrank in einer Wohnküche mit Glasfront am Abend",
      en: "Open Gaggenau fridge in a living kitchen with a glass front in the evening",
    },
    position: "60% 50%",
  },
  kuehlung: {
    file: "marke_gaggenau_kuehlschrank_innenraum_beleuchtet_tueren_offen_6562c7aad7.jpg",
    width: 2500,
    brand: "gaggenau",
    alt: {
      de: "Beleuchteter Innenraum eines Gaggenau-Kühlschranks mit zwei geöffneten Türen und gefüllten Fächern",
      en: "Lit interior of a Gaggenau fridge with two open doors and filled shelves",
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
    file: "marke_gaggenau_kaffeevollautomat_edelstahl_zwei_espressotassen_dunkler_hochschrank_7ff47434e2.jpg",
    width: 4000,
    brand: "gaggenau",
    alt: {
      de: "Einbau-Kaffeevollautomat von Gaggenau aus Edelstahl mit zwei Espressotassen in einem dunklen Hochschrank",
      en: "Built-in Gaggenau coffee machine in stainless steel with two espresso cups in a dark tall unit",
    },
  },
  "quooker-armatur": {
    file: "marke_quooker_armatur_kupfer_spuele_rosefarbene_kueche_sonnenlicht_0b1189e064.jpg",
    width: 1680,
    brand: "quooker",
    alt: {
      de: "Quooker-Armatur in Kupfer an der Spüle einer roséfarbenen Küche im Sonnenlicht",
      en: "Copper Quooker tap at the sink of a rose-coloured kitchen in sunlight",
    },
    position: "50% 80%",
  },
  kaffee: {
    file: "marke_gaggenau_kaffeevollautomat_heller_holzfront_latte_macchiato_b341aabf77.jpg",
    width: 2835,
    brand: "gaggenau",
    alt: {
      de: "Einbau-Kaffeevollautomat von Gaggenau in einer hellen Holzfront mit einem Glas Latte macchiato",
      en: "Built-in Gaggenau coffee machine in a pale wood front with a glass of latte macchiato",
    },
    position: "35% 50%",
  },
};
