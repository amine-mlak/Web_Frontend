import { cmsSrc } from "@/lib/beer-photos";
import type { ProjectFrame } from "@/lib/catalog";

/** CMS uploads grouped by filename context (same house / same look). */
type Shot = { src: string; alt: string };

function frame(src: string, alt: string): ProjectFrame {
  const path = src.startsWith("/") ? src : `/cms-uploads/${src}`;
  return { src: cmsSrc(path, 1600), alt };
}

function gallery(shots: Shot[]): ProjectFrame[] {
  return shots.map((shot) => frame(shot.src, shot.alt));
}

/** Fillers when a theme pool is short — real CMS kitchens, order rotated by slug. */
const RANDOM_FILL = [
  "/cms-uploads/Beer_foto_craft_5653_af4e19880f.jpg",
  "/cms-uploads/Beer_foto_craft_5602_9d522071bc.jpg",
  "/cms-uploads/Beer_foto_craft_5618_b5927f7048.jpg",
  "/cms-uploads/Beer_foto_craft_5590_a4e9d89bca.jpg",
  "/cms-uploads/Beer_foto_craft_5638_b5d1028062.jpg",
  "/cms-uploads/jk_communications_kueche_kammerer_253_700cd156b9.jpg",
  "/cms-uploads/jk_communications_kueche_kammerer_243_c470f9bcc4.jpg",
  "/cms-uploads/jk_communications_kueche_kammerer_230_c28a5af9f1.jpg",
  "/cms-uploads/beer_pfoerring_cschranner_6477_47c56fd43a.jpg",
  "/cms-uploads/beer_pfoerring_cschranner_6469_46cf9be2a6.jpg",
  "/cms-uploads/beer_pfoerring_cschranner_6507_619b00b4b5.jpg",
  "/cms-uploads/Moderne_Wohnkueche_1_d17a2bd175.jpg",
  "/cms-uploads/Moderne_Wohnkueche_4_ffa04a07ea.jpg",
  "/cms-uploads/offene_kuechen_bbd02157cf.jpg",
];

function withFill(
  primary: Shot[],
  slug: string,
  target = 8,
  fillAlt = "Referenzküche",
): ProjectFrame[] {
  const seen = new Set(primary.map((shot) => shot.src));
  const seed = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const shots = [...primary];
  let i = 0;
  while (shots.length < target && i < RANDOM_FILL.length * 2) {
    const src = RANDOM_FILL[(seed + i) % RANDOM_FILL.length];
    i += 1;
    if (seen.has(src)) continue;
    seen.add(src);
    shots.push({ src, alt: fillAlt });
  }
  return gallery(shots.slice(0, target));
}

/**
 * Galleries keyed by project slug. Prefer same-house CMS series
 * (Salbei, Puristisch, Glas und Stein, Kammerer, Pförring), then
 * filename themes (eiche, schwarz, grau, weiss, insel).
 */
export const PROJECT_GALLERIES: Record<string, ProjectFrame[]> = {
  "wolfersdorf-eiche-stein": withFill(
    [
      {
        src: "/cms-uploads/Design_in_Glas_und_Stein_1_6d06911332.jpg",
        alt: "Glas und Stein",
      },
      {
        src: "/cms-uploads/Design_in_Glas_und_Stein_2_6669eaa7d7.jpg",
        alt: "Arbeitsplatte Stein",
      },
      {
        src: "/cms-uploads/Design_in_Glas_und_Stein_3_72962b4022.jpg",
        alt: "Offene Wohnküche",
      },
      {
        src: "/cms-uploads/Design_in_Glas_und_Stein_5_18196cd707.jpg",
        alt: "Detail Stein",
      },
      {
        src: "/cms-uploads/offene_kuechen_kuechen_eiche_72890f6269.jpg",
        alt: "Eiche, offene Zeile",
      },
      {
        src: "/cms-uploads/keramikarbeitsplatte_eiche_massiv_geoelt_10382_01_a62ee85482.JPG",
        alt: "Eiche massiv, geölt",
      },
      {
        src: "/cms-uploads/bayerische_kuechen_kuechen_eiche_modern_eeb1018ee6.jpg",
        alt: "Eiche modern",
      },
      {
        src: "/cms-uploads/kuechen_weiss_holz_kuechen_eiche_eb302be294.jpg",
        alt: "Holz und Eiche",
      },
    ],
    "wolfersdorf-eiche-stein",
    9,
    "Wohnküche Eiche und Stein",
  ),

  "muenchen-schwarz-eiche": withFill(
    [
      {
        src: "/cms-uploads/kuecheninsel_kueche_schwarz_ef461fa44b.jpg",
        alt: "Schwarze Insel",
      },
      {
        src: "/cms-uploads/schwarze_wohnkueche_af2b661c00.jpg",
        alt: "Schwarze Wohnküche",
      },
      {
        src: "/cms-uploads/einbaukueche_nach_mass_kuechen_schwarz_fa0fef1061.jpg",
        alt: "Schwarz nach Maß",
      },
      {
        src: "/cms-uploads/grifflose_kuechen_schwarze_kuechen_e77ded7be2.jpg",
        alt: "Grifflos schwarz",
      },
      {
        src: "/cms-uploads/offene_kuechen_schwarze_kuechen_aa43816e5c.jpg",
        alt: "Offen schwarz",
      },
      {
        src: "/cms-uploads/kuechen_schwarz_gute_kuechen_13d4e5da9c.jpg",
        alt: "Schwarze Flächen",
      },
      {
        src: "/cms-uploads/jk_communications_kueche_kammerer_224_d71f8dd064.jpg",
        alt: "Kundenhaus Kammerer",
      },
      {
        src: "/cms-uploads/jk_communications_kueche_kammerer_216_6147acb64c.jpg",
        alt: "Detail Kammerer",
      },
    ],
    "muenchen-schwarz-eiche",
    9,
    "Schwarze Designküche",
  ),

  "erding-modern-grau": withFill(
    [
      {
        src: "/cms-uploads/kuechen_grau_kuechen_ideen_a1658222e2.jpg",
        alt: "Graue Zeile",
      },
      {
        src: "/cms-uploads/kuechen_grau_modern_4d323e601c.jpg",
        alt: "Grau modern",
      },
      {
        src: "/cms-uploads/offene_kuechen_grau_holz_83a940ea72.jpg",
        alt: "Grau und Holz",
      },
      {
        src: "/cms-uploads/kuechen_profi_graue_kuechen_cd17942903.jpg",
        alt: "Graue Fronten",
      },
      {
        src: "/cms-uploads/offene_kuechen_kueche_grau_898402ddbd.jpg",
        alt: "Offene graue Küche",
      },
      {
        src: "/cms-uploads/kuechenstudio_graue_kueche_b0a13333d7.jpg",
        alt: "Studio, grau",
      },
      {
        src: "/cms-uploads/10448_beer_pfoerring_cschranner_6502_23bcf05d01.jpg",
        alt: "Kundenhaus Pförring",
      },
      {
        src: "/cms-uploads/beer_pfoerring_cschranner_6474_6cb193d22f.jpg",
        alt: "Detail Pförring",
      },
    ],
    "erding-modern-grau",
    9,
    "Graue Zeile",
  ),

  "pfaffenhofen-insel-pur": withFill(
    [
      {
        src: "/cms-uploads/Puristische_Kueche_1_558845279f.jpg",
        alt: "Puristische Küche",
      },
      {
        src: "/cms-uploads/Puristische_Kueche_2_795faf3e65.jpg",
        alt: "Insel, ruhig",
      },
      {
        src: "/cms-uploads/Puristische_Kueche_3_cc4e6527eb.jpg",
        alt: "Wenige Linien",
      },
      {
        src: "/cms-uploads/Puristische_Kueche_4_c4661eee8e.jpg",
        alt: "Arbeitsfläche",
      },
      {
        src: "/cms-uploads/Puristische_Kueche_6_d4a08bb4f3.jpg",
        alt: "Blick über die Insel",
      },
      {
        src: "/cms-uploads/Puristische_Kueche_8_2370050964.jpg",
        alt: "Detail Front",
      },
      {
        src: "/cms-uploads/Puristische_Kueche_10_c32ba3ff91.jpg",
        alt: "Raum und Insel",
      },
      {
        src: "/cms-uploads/stile_insel_4a93069817.jpg",
        alt: "Inselküche",
      },
      {
        src: "/cms-uploads/kuechen_kochinsel_kuechen_insel_b317264875.jpg",
        alt: "Kochinsel",
      },
    ],
    "pfaffenhofen-insel-pur",
    9,
    "Puristische Insel",
  ),

  "landshut-kleine-zeile": withFill(
    [
      {
        src: "/cms-uploads/kueche_weiss_kuechenzeile_53973ef1a4.jpg",
        alt: "Weiße Zeile",
      },
      {
        src: "/cms-uploads/kueche_modern_weiss_kuechenzeile_287210ad98.jpg",
        alt: "Kompakte Zeile",
      },
      {
        src: "/cms-uploads/einbaukueche_nach_mass_kuechen_weiss_d9c8e25199.jpg",
        alt: "Weiß nach Maß",
      },
      {
        src: "/cms-uploads/grifflose_kuechen_kuechen_weiss_f93c876b17.jpg",
        alt: "Grifflos weiß",
      },
      {
        src: "/cms-uploads/kuechen_weiss_gute_kuechen_aa950b4b57.jpg",
        alt: "Weiße Flächen",
      },
      {
        src: "/cms-uploads/kuechen_muenchen_kuechen_weiss_6c1c2727f2.jpg",
        alt: "Weiß, München",
      },
      {
        src: "/cms-uploads/kuechen_weiss_kuechen_holz_ed437f22da.jpg",
        alt: "Weiß und Holz",
      },
      {
        src: "/cms-uploads/Beer_foto_craft_5616_5420c646aa.jpg",
        alt: "Manufakturfoto",
      },
    ],
    "landshut-kleine-zeile",
    9,
    "Kleine Küche nach Maß",
  ),

  "freising-salbei": withFill(
    [
      {
        src: "/cms-uploads/Salbei_and_Stein_Landhauskueche_13_22f92aa877.jpg",
        alt: "Salbei und Stein",
      },
      {
        src: "/cms-uploads/Salbei_and_Stein_Landhauskueche_12_1707fd7b5c.jpg",
        alt: "Rahmenfront Salbei",
      },
      {
        src: "/cms-uploads/Salbei_and_Stein_Landhauskueche_1_f7cfb75946.jpg",
        alt: "Altbau, Farbe",
      },
      {
        src: "/cms-uploads/Salbei_and_Stein_Landhauskueche_2_6cdb66ff6c.jpg",
        alt: "Hohe Fenster",
      },
      {
        src: "/cms-uploads/Salbei_and_Stein_Landhauskueche_3_b1784956db.jpg",
        alt: "Steinplatte",
      },
      {
        src: "/cms-uploads/Salbei_and_Stein_Landhauskueche_4_d0e1e3286d.jpg",
        alt: "Detail Front",
      },
      {
        src: "/cms-uploads/Salbei_and_Stein_Landhauskueche_5_0c32e1ad41.jpg",
        alt: "Wohnküche Salbei",
      },
      {
        src: "/cms-uploads/Salbei_and_Stein_Landhauskueche_6_f744ecee0b.jpg",
        alt: "Blick in den Raum",
      },
      {
        src: "/cms-uploads/Salbei_and_Stein_Landhauskueche_9_ef7c56c6c8.jpg",
        alt: "Arbeitszone",
      },
    ],
    "freising-salbei",
    9,
    "Salbeigrüne Küche",
  ),
};

/** Soft copy from beer.de tone when CMS body is still thin. */
export const PROJECT_BODY_EXTRA: Record<string, string> = {
  "wolfersdorf-eiche-stein":
    "Jede Küche bei BEER ist ein Unikat — maßgefertigt, damit Raum und Stauraum zusammenpassen. Regionalität heißt hier: geplant, gebaut und montiert im Umkreis von München, mit Materialien, die halten sollen.",
  "muenchen-schwarz-eiche":
    "Küchenträume werden wahr, wenn Farbe und Holz im Gleichgewicht bleiben. BEER begleitet vom Erstgespräch bis zur Montage — persönlich, ohne Standardkatalog.",
  "erding-modern-grau":
    "Individuelle Anpassung statt Fertigzeile: was der Grundriss zulässt, zeichnen wir ehrlich. Weniger Show, mehr Funktion — designed and made in Bayern.",
  "pfaffenhofen-insel-pur":
    "Wenig Linien, viel Ruhe. Die Insel ist Arbeitsplatz. Wir arbeiten eng mit Ihnen zusammen, bis die Vision auf dem Aufmaß steht — dann fertigen Schreiner und Monteure.",
  "landshut-kleine-zeile":
    "Vier Meter können mehr, wenn Innenleben vor Front kommt. Standard hätte Ecken verloren. Nach Maß heißt: jede Nische zählt.",
  "freising-salbei":
    "Farbe gegen hohe Fenster, Rahmen ohne Kostüm. Nachhaltigkeit ist für uns keine Mode: Lack statt Folie, Konstruktionen, die Generationen überdauern sollen.",
};

/** The old example projects whose gallery is assembled here in code (mixed kitchens). */
export function isCodeGallery(slug: string) {
  return slug in PROJECT_GALLERIES;
}

export function projectGalleryFor(
  slug: string,
  existing: ProjectFrame[],
): ProjectFrame[] {
  if (existing.length > 0) {
    return existing;
  }
  return PROJECT_GALLERIES[slug] ?? withFill([], slug, 8, "Referenzküche");
}

export function enrichProjectBody(slug: string, body: string): string {
  const trimmed = body.trim();
  const extra = PROJECT_BODY_EXTRA[slug];
  if (!extra) {
    return trimmed;
  }
  if (trimmed.length >= 320) {
    return trimmed;
  }
  if (!trimmed) {
    return extra;
  }
  return `${trimmed}\n\n${extra}`;
}
