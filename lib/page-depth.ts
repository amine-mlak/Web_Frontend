/**
 * What a sub-page shows below its own text: the questions people ask about exactly this
 * thing, the guide or magazine article BEER wrote about it, and care notes for a material.
 * Everything named here already exists in the CMS (FAQ entries, articles) or on beer.de
 * (care notes); the page only brings it to where the reader is.
 *
 * - questions: FAQ slugs, shown in this order. The list is filled up from `theme`.
 * - theme: FAQ theme that fills the list and that the "all questions" link opens.
 * - guide: the article the page quotes from (slug, or the start of a long slug).
 * - more: further articles, shown as cards.
 * - care: which care notes belong to the material.
 */
export type CareKey = "naturstein" | "edelstahl" | "keramik" | "massivholz" | "furnier" | "lack";

export type PageDepth = {
  questions?: string[];
  theme?: string;
  guide?: string;
  more?: string[];
  care?: CareKey;
};

const REGION_COMMON = ["wie-laeuft-die-montage-ab", "lieferzeit-der-kueche", "wo-werden-die-kuechen-gefertigt"];

const DEPTH: Record<string, PageDepth> = {
  // Küchen: Formen
  "/kuechen/formen/zeile": {
    questions: [
      "kuechenzeile-kleine-raeume",
      "welche-kuechenform-passt",
      "sechs-meter-zeile-mit-insel-budget",
      "kueche-im-wohnraum",
    ],
    theme: "formen",
    guide: "kuchenplanung-fur-mietobjekte",
    more: ["neue-kueche-planen"],
  },
  "/kuechen/formen/l-form": {
    questions: [
      "l-form-oder-u-form",
      "eckschrank-loesungen",
      "welche-kuechenform-passt",
      "lohnt-sich-eine-kuecheninsel",
    ],
    theme: "formen",
    guide: "der-eckschrank",
    more: ["neue-kueche-planen", "die-ideale-arbeitsplattenhohe"],
  },
  "/kuechen/formen/u-form": {
    questions: ["l-form-oder-u-form", "eckschrank-loesungen", "welche-kuechenform-passt", "mehrere-personen-kochen"],
    theme: "formen",
    guide: "moderne-u-form-kuche",
    more: ["so-entsteht-eine-kuche-mit-wohlfuhlgarantie", "der-eckschrank"],
  },
  "/kuechen/formen/insel": {
    questions: [
      "lohnt-sich-eine-kuecheninsel",
      "wie-viel-platz-braucht-eine-insel",
      "passt-eine-kochinsel",
      "groesse-der-kuecheninsel",
      "kuecheninsel-mit-sitzplaetzen",
    ],
    theme: "inseln",
    guide: "kucheninsel-wie-sie-zur-stilvollen",
    more: ["moderne-kucheninsel-aus-eichenfurnier", "kundenkuche-weiss-eiche"],
  },
  "/kuechen/formen/offen": {
    questions: [
      "offene-kueche-planen",
      "wand-entfernen-fuer-offene-kueche",
      "kueche-im-wohnraum",
      "kochfeldabzug-statt-esse",
      "umluft-oder-abluft",
    ],
    theme: "formen",
    guide: "wohnkuche-im-holzhaus",
    more: ["kochfeldabzug-in-offenen-kuchen", "offene-landhauskuche"],
  },
  "/kuechen/formen/klein": {
    questions: [
      "kleine-kueche-nach-mass",
      "kuechenzeile-kleine-raeume",
      "raumhohe-schraenke",
      "eckschrank-loesungen",
      "stauraum-oben-im-hochschrank",
    ],
    theme: "formen",
    guide: "kuche-unter-dachschrage-planen",
    more: ["mansarden-kuche-nach-mass", "space-tower-hochschrank"],
  },

  // Küchen: Farben
  "/kuechen/farben/weiss": {
    questions: [
      "weisse-kueche-im-alltag",
      "welche-kuechenfarben-sind-moeglich",
      "lackfronten-pflegen",
      "holz-und-farbfronten-kombinieren",
    ],
    theme: "farben",
    guide: "die-weisse-kueche",
    more: ["minimalistische-weisse-schreinerkuche", "weisse-kuche-mit-eiche"],
  },
  "/kuechen/farben/schwarz": {
    questions: [
      "schwarze-kueche-zu-dunkel",
      "moderne-kuechenfarben",
      "welche-kuechenfarben-sind-moeglich",
      "holz-und-farbfronten-kombinieren",
    ],
    theme: "farben",
    guide: "schwarze-industrial-style-kuche",
    more: ["schwarze-inselkuche-mit-edelstahl", "kundenkuche-schwarz-weiss"],
  },
  "/kuechen/farben/grau": {
    questions: [
      "moderne-kuechenfarben",
      "welche-kuechenfarben-sind-moeglich",
      "holz-und-farbfronten-kombinieren",
      "lack-oder-furnier",
    ],
    theme: "farben",
    guide: "kundenkuche-anthrazit-eiche",
    more: ["moderne-kuchenarchitektur-wie-schwarze", "kuchendesign-mit-3-farben"],
  },
  "/kuechen/farben/salbei": {
    questions: [
      "salbeigrune-kueche",
      "welche-kuechenfarben-sind-moeglich",
      "holz-und-farbfronten-kombinieren",
      "moderne-kuechenfarben",
      "lackfronten-pflegen",
    ],
    theme: "farben",
    more: ["kuchendesign-mit-3-farben", "englische-landhauskuche-planen"],
  },

  // Küchen: Inseln
  "/kuechen/inseln/kochinsel": {
    questions: [
      "passt-eine-kochinsel",
      "kochinsel-mit-abzug",
      "kochfeldabzug-statt-esse",
      "wie-gut-ist-ein-muldenluefter",
      "wie-viel-platz-braucht-eine-insel",
    ],
    theme: "inseln",
    guide: "kochfeldabzug-in-offenen-kuchen",
    more: ["weisse-kuche-mit-eiche", "schwarze-industrial-style-kuche"],
  },
  "/kuechen/inseln/essinsel": {
    questions: [
      "kuecheninsel-mit-sitzplaetzen",
      "groesse-der-kuecheninsel",
      "lohnt-sich-eine-kuecheninsel",
      "wie-viel-platz-braucht-eine-insel",
    ],
    theme: "inseln",
    guide: "kucheninsel-wie-sie-zur-stilvollen",
    more: ["kundenkuche-weiss-eiche", "minimalistische-weisse-schreinerkuche"],
  },
  "/kuechen/inseln/arbeitsinsel": {
    questions: [
      "groesse-der-kuecheninsel",
      "mehrere-personen-kochen",
      "wie-viel-platz-braucht-eine-insel",
      "arbeitshoehe-fuer-zwei-personen",
      "lohnt-sich-eine-kuecheninsel",
    ],
    theme: "inseln",
    guide: "moderne-kucheninsel-aus-eichenfurnier",
    more: ["die-ideale-arbeitsplattenhohe", "steckdosenplanung-kuche"],
  },

  // Küchen: Besondere Lösungen
  "/kuechen/besondere/grifflos": {
    questions: [
      "grifflose-kueche-vor-und-nachteile",
      "puristische-grifflose-kueche",
      "griffe-oder-grifflos-preis",
      "handtuecher-in-der-grifflosen-kueche",
    ],
    theme: "stile",
    guide: "grifflose-kuche-planen-griffnutprofil",
    more: ["die-grifflose-kuche", "massgefertigte-einbaukuche-nach-mass"],
  },
  "/kuechen/besondere/nach-mass": {
    questions: [
      "moeglichkeiten-einer-individuellen-kueche",
      "schreinerkueche-oder-kuechenstudio",
      "was-kostet-eine-kueche-nach-mass",
      "kueche-im-altbau",
      "wo-werden-die-kuechen-gefertigt",
    ],
    theme: "besondere",
    guide: "massgefertigte-einbaukuche-nach-mass",
    more: ["kuche-nach-mass-unter-dachschrage", "architekturkuche-planen"],
  },
  "/kuechen/besondere/outdoor": {
    questions: [
      "moeglichkeiten-einer-individuellen-kueche",
      "welche-materialien-gibt-es",
      "edelstahl-arbeitsplatte",
      "wo-ist-die-ausstellung",
    ],
    more: ["miele-grill-event"],
  },
  "/kuechen/besondere/raumhoch": {
    questions: [
      "raumhohe-schraenke",
      "hoehe-der-schrankanlage",
      "abstand-zwischen-kueche-und-decke",
      "stauraum-oben-im-hochschrank",
      "fronten-bis-zum-boden",
    ],
    theme: "besondere",
    guide: "space-tower-hochschrank",
    more: ["massgefertigte-einbaukuche-nach-mass", "versteckte-speisekammer"],
  },

  // Küchen: Stile
  "/kuechen/stile/modern": {
    questions: [
      "moderne-oder-landhauskueche",
      "moderne-kuechenfarben",
      "integrierte-kuechengeraete",
      "grifflose-kueche-vor-und-nachteile",
    ],
    theme: "stile",
    guide: "moderne-designkuche-mit-bora-xbo",
    more: ["moderne-rustikale-kuche", "moderne-kuchenarchitektur-wie-schwarze"],
  },
  "/kuechen/stile/landhaus": {
    questions: [
      "landhauskueche-nach-mass",
      "moderne-oder-landhauskueche",
      "welche-fronten-gibt-es",
      "holz-und-farbfronten-kombinieren",
    ],
    theme: "stile",
    guide: "englische-landhauskuche-planen",
    more: ["offene-landhauskuche", "blaue-landhauskuche"],
  },
  "/kuechen/stile/design": {
    questions: [
      "was-ist-eine-designkueche",
      "integrierte-kuechengeraete",
      "moeglichkeiten-einer-individuellen-kueche",
      "wovon-haengt-der-preis-ab",
    ],
    theme: "stile",
    guide: "designkuche-kosten-preisfaktoren",
    more: ["designkuche-referenz", "kundenkuche-designkuche"],
  },
  "/kuechen/stile/purist": {
    questions: [
      "puristische-grifflose-kueche",
      "grifflose-kueche-vor-und-nachteile",
      "integrierte-kuechengeraete",
      "fronten-bis-zum-boden",
    ],
    theme: "stile",
    guide: "minimalistische-weisse-schreinerkuche",
    more: ["kundenkuche-weiss-eiche", "kundenkuche-schwarz-weiss"],
  },
  "/kuechen/stile/holz": {
    questions: [
      "holzkueche-welcher-stil",
      "holz-und-farbfronten-kombinieren",
      "holzarten-und-holzdekore",
      "schraenke-aus-massivholz",
      "holzfronten-ohne-aeste",
    ],
    theme: "stile",
    guide: "massivholzkuche-nach-mass",
    more: ["kundenkuche-anthrazit-eiche", "wohnkuche-im-holzhaus"],
  },
  "/kuechen/stile/luxus": {
    questions: [
      "was-kostet-eine-kueche-nach-mass",
      "wovon-haengt-der-preis-ab",
      "moeglichkeiten-einer-individuellen-kueche",
      "einfachere-kuechen",
    ],
    theme: "stile",
    guide: "zeitloses-kuchendesign",
    more: ["designkuche-kosten-preisfaktoren", "blaue-landhauskuche"],
  },

  // Material
  "/material/naturstein": {
    questions: [
      "naturstein-oder-keramik",
      "naturstein-im-alltag",
      "preis-naturstein-arbeitsplatte",
      "welche-arbeitsplatte-passt",
    ],
    theme: "arbeitsplatten",
    guide: "kundenkuche-designkuche",
    more: ["regionale-zusammenarbeit-bei-naturstein", "kuchendesign-mit-3-farben"],
    care: "naturstein",
  },
  "/material/keramik": {
    questions: [
      "naturstein-oder-keramik",
      "welche-arbeitsplatte-passt",
      "welche-spuele-passt",
      "arbeitsplatte-selbst-beschaffen",
    ],
    theme: "arbeitsplatten",
    guide: "induktionskochfeld-mit-muldenabzug-keramik",
    care: "keramik",
  },
  "/material/edelstahl": {
    questions: [
      "edelstahl-arbeitsplatte",
      "welche-arbeitsplatte-passt",
      "welche-spuele-passt",
      "naturstein-oder-keramik",
    ],
    theme: "arbeitsplatten",
    guide: "edelstahlkuche-wohnlich-gestalten",
    more: ["moderne-edelstahlkuche", "schwarze-inselkuche-mit-edelstahl"],
    care: "edelstahl",
  },
  "/material/holz-massiv": {
    questions: [
      "schraenke-aus-massivholz",
      "holzarbeitsplatte-pflege",
      "holzarten-und-holzdekore",
      "holzfronten-ohne-aeste",
      "holzkueche-welcher-stil",
    ],
    theme: "material",
    guide: "massivholzkuche-nach-mass",
    more: ["wohnkuche-im-holzhaus", "moderne-rustikale-kuche"],
    care: "massivholz",
  },
  "/material/eiche-furnier": {
    questions: [
      "lack-oder-furnier",
      "holzarten-und-holzdekore",
      "holzfronten-mit-quermaserung",
      "holzfronten-ohne-aeste",
      "holz-und-farbfronten-kombinieren",
    ],
    theme: "material",
    guide: "moderne-kucheninsel-aus-eichenfurnier",
    more: ["kundenkuche-weiss-eiche", "kundenkuche-anthrazit-eiche"],
    care: "furnier",
  },
  "/material/lack-matt": {
    questions: [
      "lackfronten-pflegen",
      "lack-oder-furnier",
      "melamin-oder-lackfronten",
      "welche-kuechenfarben-sind-moeglich",
    ],
    theme: "material",
    guide: "kuchenfronten-nach-mass-holz-lack",
    more: ["die-weisse-kueche", "grifflose-kuche-planen-griffnutprofil"],
    care: "lack",
  },
  "/material/fenix": {
    questions: [
      "welche-fronten-gibt-es",
      "melamin-oder-lackfronten",
      "welche-materialien-gibt-es",
      "grifflose-kueche-vor-und-nachteile",
    ],
    theme: "material",
    more: ["kuchenfronten-nach-mass-holz-lack", "kuchenfronten-aus-eigener-cnc-fertigung"],
  },
  "/material/innen-auszug": {
    questions: [
      "schubkaesten-oder-tueren",
      "apothekerauszug-sinnvoll",
      "eckschrank-loesungen",
      "gewuerze-aufbewahren",
      "stauraum-oben-im-hochschrank",
    ],
    theme: "innenleben",
    guide: "space-tower-hochschrank",
    more: ["besteckeinsatz", "gewuerzaufbewahrung"],
  },
  "/material/fronten": {
    questions: [
      "welche-fronten-gibt-es",
      "lack-oder-furnier",
      "melamin-oder-lackfronten",
      "glasfronten",
      "fronten-bis-zum-boden",
    ],
    guide: "kuchenfronten-nach-mass-holz-lack",
    more: ["kuchenfronten-aus-eigener-cnc-fertigung", "grifflose-kuche-planen-griffnutprofil"],
  },
  "/material/arbeitsplatten": {
    guide: "die-ideale-arbeitsplattenhohe",
    more: ["kundenkuche-designkuche", "edelstahlkuche-wohnlich-gestalten"],
  },
  "/material/innenleben": {
    guide: "versteckte-speisekammer",
    more: ["abfalltrennsysteme", "space-tower-hochschrank"],
  },
  "/material/spuele": {
    questions: ["welche-spuele-passt", "spuele-vor-dem-fenster", "anschluss-der-kuechengeraete"],
    guide: "kuchenarmatur-richtig-auswahlen",
    more: ["induktionskochfeld-mit-muldenabzug-keramik", "abfalltrennsysteme"],
  },

  // Geräte
  "/geraete/backofen": {
    questions: [
      "backofen-neben-kuehlschrank",
      "dampfbackofen",
      "kombigeraete",
      "kuechengeraete-anordnen",
      "integrierte-kuechengeraete",
    ],
    theme: "geraete",
    guide: "backofen",
    more: ["tellerwaermer", "mikrowelle"],
  },
  "/geraete/dampfgarer": {
    questions: ["dampfbackofen", "kombigeraete", "welche-geraete-planen-sie", "kuechengeraete-anordnen"],
    theme: "geraete",
    guide: "dampfgarer",
    more: ["vakuumierschublade", "backofen"],
  },
  "/geraete/geschirrspueler": {
    questions: [
      "anschluss-der-kuechengeraete",
      "integrierte-kuechengeraete",
      "vorhandene-geraete-uebernehmen",
      "eigene-elektrogeraete-einbauen",
      "kuechengeraete-anordnen",
    ],
    theme: "geraete",
    guide: "spuelmaschine",
    more: ["abfalltrennsysteme", "kuchenarmatur-richtig-auswahlen"],
  },
  "/geraete/kaffee": {
    questions: [
      "kaffeemaschine-und-thermomix-unterbringen",
      "integrierte-kuechengeraete",
      "welche-geraete-planen-sie",
      "kuechengeraete-anordnen",
    ],
    theme: "geraete",
    guide: "kaffeevollautomat",
    more: ["steckdosenplanung-kuche", "tellerwaermer"],
  },
  "/geraete/kochfeld": {
    questions: [
      "kochinsel-mit-abzug",
      "umluft-oder-abluft",
      "mehrere-personen-kochen",
      "welche-geraete-planen-sie",
      "kuechengeraete-anordnen",
    ],
    theme: "geraete",
    guide: "kochfeld",
    more: ["induktionskochfeld-mit-muldenabzug-keramik", "dunstabzug"],
  },
  "/geraete/kochfeldabzug": {
    questions: [
      "kochfeldabzug-statt-esse",
      "wie-gut-ist-ein-muldenluefter",
      "umluft-oder-abluft",
      "muldenluefter-stauraum",
      "bora-in-beer-kuechen",
    ],
    theme: "geraete",
    guide: "kochfeldabzug-in-offenen-kuchen",
    more: ["dunstabzug", "moderne-designkuche-mit-bora-xbo"],
  },
  "/geraete/kuehlung": {
    questions: [
      "side-by-side-kuehlschrank",
      "weinklimaschrank-und-gefrierschrank",
      "backofen-neben-kuehlschrank",
      "integrierte-kuechengeraete",
    ],
    theme: "geraete",
    guide: "kuehlschrank",
    more: ["vakuumierschublade", "versteckte-speisekammer"],
  },
  "/geraete/quooker-armatur": {
    questions: [
      "welche-spuele-passt",
      "spuele-vor-dem-fenster",
      "anschluss-der-kuechengeraete",
      "welche-marken-verbauen-sie",
    ],
    theme: "geraete",
    guide: "kuchenarmatur-richtig-auswahlen",
    more: ["induktionskochfeld-mit-muldenabzug-keramik"],
  },
  "/geraete/backen": {
    questions: ["dampfbackofen", "kombigeraete", "backofen-neben-kuehlschrank"],
    guide: "backofen",
    more: ["dampfgarer", "mikrowelle"],
  },
  "/geraete/extra": {
    questions: ["kaffeemaschine-und-thermomix-unterbringen", "kombigeraete", "welche-geraete-planen-sie"],
    guide: "kaffeevollautomat",
    more: ["vakuumierschublade", "tellerwaermer"],
  },
  "/geraete/kaelte": {
    questions: ["side-by-side-kuehlschrank", "weinklimaschrank-und-gefrierschrank", "backofen-neben-kuehlschrank"],
    guide: "kuehlschrank",
    more: ["vakuumierschublade"],
  },
  "/geraete/kochen": {
    questions: [
      "kochfeldabzug-statt-esse",
      "umluft-oder-abluft",
      "wie-gut-ist-ein-muldenluefter",
      "kochinsel-mit-abzug",
    ],
    guide: "kochfeld",
    more: ["dunstabzug", "kochfeldabzug-in-offenen-kuchen"],
  },
  "/geraete/spuelen": {
    questions: ["welche-spuele-passt", "anschluss-der-kuechengeraete", "spuele-vor-dem-fenster"],
    guide: "spuelmaschine",
    more: ["kuchenarmatur-richtig-auswahlen", "abfalltrennsysteme"],
  },

  // Marken
  "/marken/bora": {
    questions: [
      "bora-in-beer-kuechen",
      "kochfeldabzug-statt-esse",
      "wie-gut-ist-ein-muldenluefter",
      "muldenluefter-stauraum",
      "an-eine-marke-gebunden",
    ],
    theme: "marken",
    guide: "designkuche-referenz",
    more: ["moderne-designkuche-mit-bora-xbo", "kochfeldabzug-in-offenen-kuchen"],
  },
  "/marken/miele": {
    questions: [
      "welche-marken-verbauen-sie",
      "an-eine-marke-gebunden",
      "welche-geraete-planen-sie",
      "integrierte-kuechengeraete",
      "eigene-elektrogeraete-einbauen",
    ],
    theme: "marken",
    more: ["miele-grill-event", "spuelmaschine"],
  },
  "/marken/gaggenau": {
    questions: [
      "welche-marken-verbauen-sie",
      "an-eine-marke-gebunden",
      "integrierte-kuechengeraete",
      "kombigeraete",
      "weinklimaschrank-und-gefrierschrank",
    ],
    theme: "marken",
    more: ["backofen", "kuehlschrank"],
  },
  "/marken/siemens": {
    questions: [
      "welche-marken-verbauen-sie",
      "an-eine-marke-gebunden",
      "welche-geraete-planen-sie",
      "vorhandene-geraete-uebernehmen",
      "anschluss-der-kuechengeraete",
    ],
    theme: "marken",
    more: ["kochfeld", "dampfgarer"],
  },
  "/marken/quooker": {
    questions: [
      "welche-marken-verbauen-sie",
      "welche-spuele-passt",
      "anschluss-der-kuechengeraete",
      "an-eine-marke-gebunden",
    ],
    theme: "marken",
    guide: "kuchenarmatur-richtig-auswahlen",
  },

  // Regionen
  "/regionen/muenchen": {
    questions: ["kueche-muenchen-freising", "wo-ist-die-ausstellung", ...REGION_COMMON],
    theme: "regionen",
    more: ["kuechenschreiner-aus-muenchen"],
  },
  "/regionen/freising": {
    questions: ["kueche-muenchen-freising", "wo-ist-die-ausstellung", ...REGION_COMMON],
    theme: "regionen",
  },
  "/regionen/erding": {
    questions: ["einzugsgebiet-erding-landshut", "wo-ist-die-ausstellung", ...REGION_COMMON],
    theme: "regionen",
  },
  "/regionen/landshut": {
    questions: ["einzugsgebiet-erding-landshut", "wo-ist-die-ausstellung", ...REGION_COMMON],
    theme: "regionen",
  },
  "/regionen/regensburg": {
    questions: ["wo-ist-die-ausstellung", "liefergebiet-frankfurt-chiemgau", ...REGION_COMMON],
    theme: "regionen",
    guide: "kuchenreferenzen-regensburg",
  },

  // Möbel
  "/moebel/ankleide": {
    questions: [
      "einbauschraenke-und-ankleide",
      "moebel-ausserhalb-der-kueche",
      "raumhohe-schraenke",
      "schubkaesten-oder-tueren",
    ],
    theme: "moebel",
    guide: "mehr-als-eine-kuche",
    more: ["massgefertigte-wohnmobel-mit-stauraum"],
  },
  "/moebel/badmoebel": {
    questions: [
      "moebel-ausserhalb-der-kueche",
      "welche-materialien-gibt-es",
      "naturstein-oder-keramik",
      "schubkaesten-oder-tueren",
    ],
    theme: "moebel",
    guide: "massgefertigte-wohnmobel-mit-stauraum",
  },
  "/moebel/einbauschraenke": {
    questions: [
      "einbauschraenke-und-ankleide",
      "raumhohe-schraenke",
      "hoehe-der-schrankanlage",
      "moebel-ausserhalb-der-kueche",
    ],
    theme: "moebel",
    guide: "massgefertigte-wohnmobel-mit-stauraum",
    more: ["versteckte-speisekammer"],
  },
  "/moebel/tische-baenke": {
    questions: [
      "tische-und-baenke-nach-mass",
      "sitzfenster-in-der-kueche",
      "kuecheninsel-mit-sitzplaetzen",
      "moebel-ausserhalb-der-kueche",
    ],
    theme: "moebel",
    guide: "mehr-als-eine-kuche",
  },
  "/moebel/wohnmoebel": {
    questions: [
      "moebel-ausserhalb-der-kueche",
      "kueche-im-wohnraum",
      "holzarten-und-holzdekore",
      "einbauschraenke-und-ankleide",
    ],
    theme: "moebel",
    guide: "massgefertigte-wohnmobel-mit-stauraum",
    more: ["mehr-als-eine-kuche"],
  },
};

/** Places without an entry of their own: where BEER works and how the kitchen arrives. */
const REGION_DEFAULT: PageDepth = {
  questions: ["wo-ist-die-ausstellung", "liefergebiet-frankfurt-chiemgau", ...REGION_COMMON],
  theme: "regionen",
};

export function pageDepth(path?: string): PageDepth | null {
  if (!path) {
    return null;
  }
  const key = path.replace(/\/+$/, "");
  return DEPTH[key] ?? (key.startsWith("/regionen/") ? REGION_DEFAULT : null);
}
