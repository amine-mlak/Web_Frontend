import type { Metadata } from "next";
import type {
  Appliance,
  ApplianceKind,
  Brand,
  CmsPageFields,
  Furniture,
  Material,
  MaterialKind,
  Project,
  Region,
  SitePage,
} from "@/lib/catalog";
import type {
  ClusterHouse,
  ClusterSibling,
} from "@/lib/collection-clusters";
import { clusterVisit } from "@/lib/collection-clusters";
import type { CollectionFact, HubCrumb, PresentedBranch } from "@/lib/collection-present";
import type { PresentedTopic } from "@/lib/collection-topics";
import { cmsLarge } from "@/lib/beer-photos";
import { devPhoto, resolveDevImage } from "@/lib/dev-images";
import type { Locale } from "@/lib/i18n";
import { brandedTitle, pageMetadata } from "@/lib/seo";

export type MaterialKindRoute = "fronten" | "arbeitsplatten" | "innenleben" | "spuele";

type Voice = {
  title: string;
  emphasis: string;
  statement: string;
  statementNote: string;
  quote: string;
  quoteSource: string;
  closeTitle: string;
  closeText: string;
  ledgerLine: string;
  lookTitle: string;
  indexEyebrow: string;
  ctaLabel: string;
  film: string[];
  looks: string[];
  facts: CollectionFact[];
  extras: string[][];
};

const VISIT_CTA = "/ausstellung";
const TALK_CTA = "/beratung";

export const MATERIAL_KIND_ROUTES: {
  slug: MaterialKindRoute;
  kind: MaterialKind | null;
  href: string;
}[] = [
  { slug: "fronten", kind: "front", href: "/material/fronten" },
  { slug: "arbeitsplatten", kind: "worktop", href: "/material/arbeitsplatten" },
  { slug: "innenleben", kind: "interior", href: "/material/innenleben" },
  { slug: "spuele", kind: null, href: "/material/spuele" },
];

export const GERAETE_KIND_ROUTES: { slug: ApplianceKind; href: string }[] = [
  { slug: "kochen", href: "/geraete/kochen" },
  { slug: "backen", href: "/geraete/backen" },
  { slug: "kaelte", href: "/geraete/kaelte" },
  { slug: "spuelen", href: "/geraete/spuelen" },
  { slug: "extra", href: "/geraete/extra" },
];

export function isMaterialKindRoute(slug: string): slug is MaterialKindRoute {
  return MATERIAL_KIND_ROUTES.some((item) => item.slug === slug);
}

export function isGeraeteKindRoute(slug: string): slug is ApplianceKind {
  return GERAETE_KIND_ROUTES.some((item) => item.slug === slug);
}

const PARENT: Record<
  "material" | "geraete" | "moebel" | "marken" | "regionen",
  Record<Locale, { href: string; label: string }>
> = {
  material: {
    de: { href: "/material", label: "Material" },
    en: { href: "/material", label: "Material" },
  },
  geraete: {
    de: { href: "/geraete", label: "Geräte" },
    en: { href: "/geraete", label: "Appliances" },
  },
  moebel: {
    de: { href: "/moebel", label: "Möbel" },
    en: { href: "/moebel", label: "Furniture" },
  },
  marken: {
    de: { href: "/marken", label: "Marken" },
    en: { href: "/marken", label: "Brands" },
  },
  regionen: {
    de: { href: "/regionen", label: "Regionen" },
    en: { href: "/regionen", label: "Regions" },
  },
};

const KIND_LABEL: Record<Locale, Record<string, { title: string; text: string }>> = {
  de: {
    fronten: { title: "Fronten", text: "Die Fläche, die den Raum hält." },
    arbeitsplatten: { title: "Platten", text: "Die Fläche, auf der gearbeitet wird." },
    innenleben: { title: "Innenleben", text: "Was den Tag entscheidet, ohne gesehen zu werden." },
    spuele: { title: "Spüle", text: "Mit der Platte gezeichnet, nicht nachgetragen." },
    kochen: { title: "Kochen", text: "Herd, Abzug, Korpus zuerst." },
    backen: { title: "Backen", text: "Ofen und Dampf auf Griffhöhe." },
    kaelte: { title: "Kälte", text: "Nische und Lüftung vor der Tür." },
    spuelen: { title: "Spülen", text: "Vollintegriert, oft neben der Spüle." },
    extra: { title: "Extra", text: "Nur was der Alltag trägt." },
  },
  en: {
    fronten: { title: "Fronts", text: "The face that holds the room." },
    arbeitsplatten: { title: "Tops", text: "The plane you work on." },
    innenleben: { title: "Interiors", text: "What decides the day without being seen." },
    spuele: { title: "Sink", text: "Drawn with the top, not added later." },
    kochen: { title: "Cooking", text: "Hob, extraction, carcass first." },
    backen: { title: "Baking", text: "Oven and steam at hand height." },
    kaelte: { title: "Cold", text: "Niche and air before the door." },
    spuelen: { title: "Washing", text: "Fully integrated, often beside the sink." },
    extra: { title: "Extra", text: "Only what the day will carry." },
  },
};

const VOICE: Record<Locale, Record<string, Voice>> = {
  de: {
    fronten: {
      title: "Fronten",
      emphasis: "zum Anfassen.",
      statement:
        "Die Front ist das, was Sie jeden Morgen berühren. Lack, Furnier, Fenix — mustern wir unter Tageslicht, bevor eine Fläche bestellt wird.",
      statementNote: "Matt hält den Alltag. Hochglanz will Polieren. Holzsicht will Licht, kein Kostüm.",
      quote: "Die Front ist das, was Sie jeden Morgen anfassen. Deshalb mustern wir, bevor irgendetwas bestellt wird.",
      quoteSource: "Aus dem Materialgespräch in der Ausstellung",
      closeTitle: "Unter Tageslicht.",
      closeText: "Muster neben Wand und Stein. Die Fläche, die den Raum hält, kauft man nicht vom Bildschirm.",
      ledgerLine: "Die Front entscheidet den Alltag mehr als das Rendering.",
      lookTitle: "Lack, Holz, Fuge.",
      indexEyebrow: "Drei Flächen",
      ctaLabel: "Front mustern",
      film: ["Matt, ruhig", "Holzsicht", "Fenix, weich", "Fuge, knapp"],
      looks: ["Lack, seidenmatt", "Furnier, geölt", "Fenix, Finger", "Kante, ehrlich", "Griff, still", "Licht"],
      facts: [
        { value: "Muster", label: "vor der Bestellung" },
        { value: "Matt", label: "trägt den Tag" },
        { value: "Holz", label: "will Licht" },
        { value: "Fuge", label: "hält die Ruhe" },
      ],
      extras: [
        ["Lack, den man nicht poliert, bis er glänzt.", "Die Fläche bleibt, wenn die Öffnung sitzt."],
        ["Furnier altert mit, nicht gegen den Raum.", "Folie ist kein Holz."],
        ["Fenix, wo Finger stören würden.", "Die Haptik entscheidet vor der Farbe."],
      ],
    },
    arbeitsplatten: {
      title: "Platten",
      emphasis: "zum Arbeiten.",
      statement:
        "Die Arbeitsplatte ist Unikat oder ehrliche Fläche — Stein, Keramik, Stahl, Holz. Die Kante und die Spüle gehören in dieselbe Zeichnung.",
      statementNote: "Fotografiert wird sie selten dort, wo geschnitten wird. Deshalb mustern wir die Kante, nicht nur die Aderung.",
      quote: "Der Stein saß. Die Kante war der Auftrag. Die Front kam danach.",
      quoteSource: "Aus der Werkstatt in Wolfersdorf",
      closeTitle: "Kante zuerst.",
      closeText: "Stein, Keramik, Stahl oder Holz — neben der Front, unter Tageslicht. Dann die Spüle, nicht umgekehrt.",
      ledgerLine: "Die Platte ist Arbeit. Kein Bild.",
      lookTitle: "Kante, Aderung, Spüle.",
      indexEyebrow: "Vier Flächen",
      ctaLabel: "Platte mustern",
      film: ["Stein, Unikat", "Keramik, klar", "Stahl, Arbeit", "Holz, Öl"],
      looks: ["Aderung", "Kante, ehrlich", "Becken, gesetzt", "Fuge zur Front", "Hitze, ehrlich", "Licht"],
      facts: [
        { value: "Stein", label: "als Unikat" },
        { value: "Kante", label: "mit der Spüle" },
        { value: "Holz", label: "will Öl" },
        { value: "Muster", label: "neben der Front" },
      ],
      extras: [
        ["Naturstein bleibt Unikat. Säure und Öl gehören zur Pflege.", "Die Aderung kauft man nicht vom Bild."],
        ["Keramik will eine ehrliche Kante und ein Becken, das sitzt.", "Stahl zeigt Arbeitsspuren. Das ist die Platte."],
        ["Massivholz will Öl und Schnitt.", "Zwei Hölzer im selben Blick werden unruhig."],
      ],
    },
    innenleben: {
      title: "Innenleben",
      emphasis: "vor der Front.",
      statement:
        "Vollauszüge, Ecken, Vorrat. Was man nicht sieht, entscheidet den Tag öfter als die Farbe. Jeder Auszug muss erreichbar sein — sonst ist Stauraum tot.",
      statementNote: "Das Innenleben zeichnen wir vor der Front. Die Fläche folgt, wenn die Hand den Alltag trägt.",
      quote: "Die Front war ruhig. Der Auszug hat entschieden, ob die Ruhe hält.",
      quoteSource: "Aus einer Planung in Wolfersdorf",
      closeTitle: "Zuerst die Hand.",
      closeText: "Schwere Auszüge in der Ausstellung öffnen. Dann die Front — nicht umgekehrt.",
      ledgerLine: "Stauraum, den man nicht erreicht, ist Volumen.",
      lookTitle: "Auszug, Ecke, Griff.",
      indexEyebrow: "Der Alltag",
      ctaLabel: "Innenleben klären",
      film: ["Vollauszug", "Ecke, erreichbar", "Vorrat, klar", "Öffnung, ehrlich"],
      looks: ["Auszug, voll", "Ecke, Auszug", "Trennwand, still", "Griff innen", "Licht im Korpus", "Fuge"],
      facts: [
        { value: "Auszug", label: "vor der Front" },
        { value: "Ecke", label: "keine Totzone" },
        { value: "Vorrat", label: "für den Tag" },
        { value: "Erreichbar", label: "oder ungezeichnet" },
      ],
      extras: [
        ["Vollauszüge, bevor die Fläche feststeht.", "Was man täglich sucht, sitzt vorn."],
        ["Ecken mit Auszug, nicht mit Totwinkel.", "Eine schöne Front über totem Stauraum ist Theater."],
        ["Innere Ordnung hält die ruhige Fläche.", "Licht im Korpus, wenn die Nische dunkel ist."],
      ],
    },
    spuele: {
      title: "Spüle",
      emphasis: "mit der Platte.",
      statement:
        "Unterbau, Steinbecken, Quooker. Die Spüle gehört in die Zeichnung der Platte — nicht als Nachtrag in den Unterschrank.",
      statementNote: "Der Tank braucht Volumen. Die Armatur braucht die Kante. Beides sitzt vor der Bestellung des Steins.",
      quote: "Der Quooker kam nicht nachträglich. Der Tank war der ganze Unterschrank.",
      quoteSource: "Aus einer Planung mit Steinplatte",
      closeTitle: "Becken und Tank zuerst.",
      closeText: "Platte, Becken, Armatur, Ablauf. Mustern wir zusammen — nicht als drei Bestellungen.",
      ledgerLine: "Eine Spüle nach der Platte ist ein Loch.",
      lookTitle: "Becken, Kante, Tank.",
      indexEyebrow: "Ein Detail",
      ctaLabel: "Spüle zeichnen",
      film: ["Unterbau", "Steinbecken", "Tank darunter", "Armatur in der Kante"],
      looks: ["Becken, gesetzt", "Fuge, Stein", "Armatur, still", "Tank, Volumen", "Ablauf, gezeichnet", "Kante"],
      facts: [
        { value: "Platte", label: "und Becken zusammen" },
        { value: "Tank", label: "braucht Volumen" },
        { value: "Armatur", label: "in der Kante" },
        { value: "Kein", label: "Nachtrag" },
      ],
      extras: [
        ["Unterbau im Stein, nicht aufgesetzt als Reue.", "Die Fuge ist Maß, nicht Silikon als Ausrede."],
        ["Quooker als Tank, nicht als Logo auf der Armatur.", "Der Unterschrank ändert die Aufteilung."],
        ["Ablauf und Überlauf in der Zeichnung.", "Nachträglich ist er teuer und falsch."],
      ],
    },
    kochen: {
      title: "Kochen",
      emphasis: "im Korpus.",
      statement:
        "Induktion, Gas, Kochfeldabzug. Für Inseln und offene Räume oft ehrlicher als die Esse. Korpus und Kabel zuerst, das Feld danach.",
      statementNote: "Eine Esse im offenen Wohnen nimmt den Blick. Dunst in der Platte will Leistung, die wir ehrlich nennen.",
      quote: "Die Esse hätten wir gesehen. Deshalb sitzt der Abzug in der Platte.",
      quoteSource: "Aus einem offenen Neubau in München",
      closeTitle: "Luft und Blick.",
      closeText: "Ob Abzug oder Esse, sagt der Raum. Wir zeichnen den, der den Blick und die Luft trägt.",
      ledgerLine: "Kochen ist Korpus. Nicht nur das Feld.",
      lookTitle: "Feld, Abzug, Kabel.",
      indexEyebrow: "Die Aufgabe",
      ctaLabel: "Kochen klären",
      film: ["Feld in der Platte", "Abzug gezeichnet", "Korpus darunter", "Blick frei"],
      looks: ["Kochfeld, frei", "Mulde, Luft", "Esse, wenn sie sitzt", "Kabel, still", "Platte, hitzeehrlich", "Fuge"],
      facts: [
        { value: "Korpus", label: "vor dem Feld" },
        { value: "Abzug", label: "in der Zeichnung" },
        { value: "Blick", label: "vor der Esse" },
        { value: "Leistung", label: "ehrlich genannt" },
      ],
      extras: [
        ["Induktion, Gas oder unsichtbar — die Platte muss mit.", "Kein Feld als Nachtrag in eine fertige Fuge."],
        ["Muldenlüfter, wenn die Esse den Raum stört.", "Luftleistung ohne Theater."],
        ["Inseln brauchen Anschluss und Weg.", "Sonst bleibt das Kochen an der Zeile."],
      ],
    },
    backen: {
      title: "Backen",
      emphasis: "auf Griffhöhe.",
      statement:
        "Ofen, Dampf, Wärmeschublade. Im Hochschrank, wo der Rücken sie erreicht — oder unter der Platte, wenn der Raum das will. Wasseranschluss mitgedacht.",
      statementNote: "Ein Gerät, das man täglich öffnet, gehört auf die Höhe der Hand. Nicht hinter eine Showfront.",
      quote: "Der Ofen auf Griffhöhe war die ganze Entscheidung. Die Front blieb ruhig.",
      quoteSource: "Aus der Geräteplanung",
      closeTitle: "Die Hand zuerst.",
      closeText: "Rücken, Nische, Wasser. Dann Ofen und Dampf — nicht die Wand voller Geräte.",
      ledgerLine: "Backen sitzt, wo Sie es öffnen.",
      lookTitle: "Nische, Griff, Dampf.",
      indexEyebrow: "Hochschrank",
      ctaLabel: "Backen klären",
      film: ["Ofen auf Höhe", "Dampf daneben", "Wasser gezeichnet", "Front ruhig"],
      looks: ["Nische, maßgenau", "Griffhöhe", "Dampf, Anschluss", "Wärme, nur wenn sie arbeitet", "Fuge", "Licht"],
      facts: [
        { value: "Höhe", label: "der Hand" },
        { value: "Dampf", label: "mit Wasser" },
        { value: "Nische", label: "zuerst" },
        { value: "Weniger", label: "Geräte in der Wand" },
      ],
      extras: [
        ["Ofen, den man bückt, zeichnen wir selten.", "Die Nische sitzt vor dem Gerät."],
        ["Dampfgarer braucht Wasser, nicht nur eine Steckdose.", "Ablauf mitgedacht."],
        ["Wärmeschublade nur, wenn sie den Tag trägt.", "Sonst bleibt die Nische ehrlicher leer."],
      ],
    },
    kaelte: {
      title: "Kälte",
      emphasis: "mit Luft.",
      statement:
        "Vollintegriert oder als Schrank. Lüftung und Nische zuerst, die Tür später. Eine Kühlung ohne Luft ist ein Gerät, das stört.",
      statementNote: "Die Front kann die Kühlung tragen. Die Physik nicht verstecken.",
      quote: "Die Nische war zu knapp. Die Kühlung kam als Schrank — ehrlicher als eine tote Front.",
      quoteSource: "Aus einem Aufmaß in Freising",
      closeTitle: "Luft vor der Tür.",
      closeText: "Nische, Abluft, Anschlag. Dann die Front — vollintegriert nur, wenn die Luft bleibt.",
      ledgerLine: "Kälte ohne Luft ist Lärm hinter der Front.",
      lookTitle: "Nische, Luft, Tür.",
      indexEyebrow: "Die Physik",
      ctaLabel: "Kälte klären",
      film: ["Nische zuerst", "Luftwege", "Tür zuletzt", "Front, wenn sie trägt"],
      looks: ["Nische, tief", "Gitter, still", "Tür, Anschlag", "Front, integriert", "Schrank, ehrlich", "Fuge"],
      facts: [
        { value: "Nische", label: "und Lüftung" },
        { value: "Tür", label: "zuletzt" },
        { value: "Front", label: "nur mit Luft" },
        { value: "Schrank", label: "wenn die Nische lügt" },
      ],
      extras: [
        ["Maß der Nische vor dem Gerät.", "Zu knapp ist nicht vollintegriert."],
        ["Abluft, die man nicht hört, muss man zeichnen.", "Gitter sind Architektur, nicht Reue."],
        ["Die Tür kommt, wenn Anschlag und Front sitzen.", "Ein Logo auf der Kühlung braucht der Raum selten."],
      ],
    },
    spuelen: {
      title: "Spülen",
      emphasis: "neben der Spüle.",
      statement:
        "Vollintegriert, oft neben der Spüle. Knock-to-open, wenn die Front grifflos bleibt. Anschluss im Aufmaß, nicht als Bohrung hinterher.",
      statementNote: "Ein Geschirrspüler, den man stündlich öffnet, lügt nicht. Die Öffnung muss zum Gewicht passen.",
      quote: "Tipp-on am Geschirrspüler hat nicht gehalten. Die Mulde war die ehrlichere Ruhe.",
      quoteSource: "Aus einer grifflosen Planung",
      closeTitle: "Öffnung und Anschluss.",
      closeText: "Neben der Spüle, mit Wasser, mit einer Öffnung, die den Tag hält.",
      ledgerLine: "Spülen sitzt neben der Arbeit. Nicht in der Showwand.",
      lookTitle: "Nische, Mulde, Wasser.",
      indexEyebrow: "Der Alltag",
      ctaLabel: "Spülen klären",
      film: ["Neben der Spüle", "Vollintegriert", "Öffnung ehrlich", "Wasser gezeichnet"],
      looks: ["Front, bündig", "Mulde oder Tipp", "Anschluss, still", "Schall, ehrlich", "Fuge", "Griffhöhe"],
      facts: [
        { value: "Lage", label: "neben der Spüle" },
        { value: "Front", label: "vollintegriert" },
        { value: "Öffnung", label: "zum Gewicht" },
        { value: "Wasser", label: "im Aufmaß" },
      ],
      extras: [
        ["Kurzer Weg zwischen Becken und Gerät.", "Eine Showwand voller Spüler ist kein Alltag."],
        ["Grifflos nur mit ehrlicher Öffnung.", "Schwere Türen mögen eine Mulde."],
        ["Zulauf und Ablauf vor der Platte.", "Nachträglich bleibt ein Fleck in der Fuge."],
      ],
    },
    extra: {
      title: "Extra",
      emphasis: "nur mit Alltag.",
      statement:
        "Kaffee, Quooker, Vakuum. Nur was der Tag trägt — mit Wasser und Ablauf gezeichnet. Ein Extra ohne Anschluss ist ein Logo in der Nische.",
      statementNote: "Augenhöhe für den Kaffee. Tankvolumen für den Quooker. Beides sitzt im Korpus, nicht auf der Wunschliste.",
      quote: "Der Kaffee auf Augenhöhe war der Wunsch. Der Ablauf war der Auftrag.",
      quoteSource: "Aus einer Nischenplanung",
      closeTitle: "Anschluss oder nicht.",
      closeText: "Was Sie täglich nutzen, zeichnen wir. Was Theater ist, bleibt ungezeichnet.",
      ledgerLine: "Extra ist Aufgabe. Nicht die Wand.",
      lookTitle: "Nische, Wasser, Höhe.",
      indexEyebrow: "Was trägt",
      ctaLabel: "Extra klären",
      film: ["Augenhöhe", "Wasser gezeichnet", "Tank darunter", "Kein Logo-Zwang"],
      looks: ["Nische, klar", "Ablauf, still", "Tank, Volumen", "Front, ruhig", "Licht", "Griff"],
      facts: [
        { value: "Alltag", label: "vor dem Extra" },
        { value: "Wasser", label: "und Ablauf" },
        { value: "Höhe", label: "der Augen" },
        { value: "Kein", label: "Paketzwang" },
      ],
      extras: [
        ["Kaffee, den man täglich holt, sitzt auf Augenhöhe.", "Ohne Ablauf bleibt er ein Stecker."],
        ["Quooker ändert den Unterschrank.", "Der Tank ist das Extra, nicht die Armatur."],
        ["Vakuum nur, wenn es den Tag füllt.", "Sonst bleibt die Nische für Stauraum."],
      ],
    },
    "lack-matt": {
      title: "Lack matt",
      emphasis: "ohne Polieren.",
      statement:
        "Ruhige Farbe, sichtbare Haptik. Matt bei BEER heißt: den Alltag aushalten, nicht glänzen, bis die Fläche Theater wird.",
      statementNote: "Der Unterton gegen Stein und Wand. Finger sieht man ehrlicher als auf Hochglanz — und weniger, wenn die Fläche sitzt.",
      quote: "Wir wollten kein Hochglanz. Matt hat den Raum gehalten, ohne zu spiegeln.",
      quoteSource: "Aus einem Neubau in Erding",
      closeTitle: "Den Ton mustern.",
      closeText: "Lack neben Wand und Stein, unter Tageslicht. Matt, das man nicht hält, kauft man neu.",
      ledgerLine: "Matt ist Haltung. Nicht Unfertigkeit.",
      lookTitle: "Ton, Fuge, Licht.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Lack mustern",
      film: ["Matt, ruhig", "Unterton", "Gegen Stein", "Fuge knapp"],
      looks: ["Fläche, seidenmatt", "Kante, lackiert", "Fuge, präzise", "Griff, still", "Licht, weich", "Finger, ehrlich"],
      facts: [
        { value: "Matt", label: "nicht Hochglanz" },
        { value: "Unterton", label: "gegen Stein" },
        { value: "Alltag", label: "ohne Polieren" },
        { value: "Muster", label: "unter Tageslicht" },
      ],
      extras: [
        ["Die Fläche bleibt ruhig, wenn nichts spiegelt.", "Hochglanz will Pflege, die der Tag selten gibt."],
        ["Farbe am Muster, nicht am Bildschirm.", "Licht ändert den Lack zwischen Morgen und Abend."],
        ["Öffnung und Fuge halten die Ruhe.", "Ein Griff als Nachtrag bricht sie."],
      ],
    },
    "eiche-furnier": {
      title: "Eiche",
      emphasis: "als Fläche.",
      statement:
        "Holzsicht, geölt oder lackiert. Eiche bei BEER altert mit dem Haus — nicht gegen eine Folie, die Holz heißt.",
      statementNote: "Schliff und Öl entscheiden Finger und Licht. Stein dagegen, nicht ein zweites Holz auf der Platte.",
      quote: "Die Front sollte altern dürfen. Deshalb Öl, nicht eine Folie, die Holz heißt.",
      quoteSource: "Aus der Werkstatt in Wolfersdorf",
      closeTitle: "Maserung unter Licht.",
      closeText: "Furnier neben Stein und Wand. Dann Öl oder Lack — ehrlich benannt.",
      ledgerLine: "Eiche ist Material. Kein Holz-Look.",
      lookTitle: "Maserung, Öl, Stein.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Eiche mustern",
      film: ["Maserung", "Öl, ehrlich", "Stein dagegen", "Licht aus dem Haus"],
      looks: ["Furnier, echt", "Öl, offen", "Lack, ruhig", "Kante, Holz", "Stein, Aderung", "Fuge"],
      facts: [
        { value: "Furnier", label: "oder ehrlich massiv" },
        { value: "Öl", label: "oder Lack" },
        { value: "Stein", label: "gegen die Fläche" },
        { value: "Alter", label: "ist erlaubt" },
      ],
      extras: [
        ["Maserung, die Licht will, keinen Hochglanz.", "Folie bleibt Kostüm."],
        ["Schliff entscheidet den Finger.", "Zu grob wird Landhaus-Theater."],
        ["Stein oder Keramik gegen die Eiche.", "Zwei Hölzer im Blick werden unruhig."],
      ],
    },
    fenix: {
      title: "Fenix",
      emphasis: "wo Finger stören.",
      statement:
        "Matte, weiche Fläche. Finger weniger sichtbar als auf Hochglanz — deshalb dort, wo die Hand den ganzen Tag liegt.",
      statementNote: "Keine Wunderfläche. Eine ehrliche Wahl, wenn Lack Abdrücke zeigen würde und Holz den Ton nicht tragen soll.",
      quote: "An der Insel lag die Hand. Fenix hat die Fläche gehalten, ohne zu glänzen.",
      quoteSource: "Aus einer Inselplanung",
      closeTitle: "Dort, wo die Hand liegt.",
      closeText: "Muster anfassen. Fenix nur, wo Finger den Lack stören würden — nicht als Modewort.",
      ledgerLine: "Fenix ist Haptik. Kein Label.",
      lookTitle: "Weich, matt, Fuge.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Fenix mustern",
      film: ["Weich", "Matt", "Finger still", "Fuge knapp"],
      looks: ["Fläche, weich", "Kante, dünn", "Fuge, präzise", "Griff, keiner", "Licht, matt", "Hand"],
      facts: [
        { value: "Matt", label: "und weich" },
        { value: "Finger", label: "weniger sichtbar" },
        { value: "Insel", label: "wo die Hand liegt" },
        { value: "Muster", label: "anfaßen" },
      ],
      extras: [
        ["Dort, wo Lack jeden Abdruck zeigt.", "Nicht als Ersatz für Material, das fehlt."],
        ["Die Fläche bleibt ruhig unter der Hand.", "Hochglanz wäre hier Theater."],
        ["Kante und Fuge müssen sitzen.", "Sonst ist Fenix nur ein Name."],
      ],
    },
    naturstein: {
      title: "Naturstein",
      emphasis: "als Unikat.",
      statement:
        "Aderung, Haptik, Unikat. Säure und Öl gehören zur ehrlichen Pflege. Den Stein mustern wir, bevor die Platte geschnitten wird.",
      statementNote: "Kein Bild aus dem Katalog. Die Platte, die kommt, ist diese Platte.",
      quote: "Das Teuerste war der Stein, der saß. Nicht der Griff, den man sieht.",
      quoteSource: "Aus einem Haus westlich von München",
      closeTitle: "Diese Platte.",
      closeText: "Aderung unter Tageslicht, neben der Front. Dann Schnitt, Kante, Becken.",
      ledgerLine: "Stein kauft man nicht vom Foto.",
      lookTitle: "Aderung, Kante, Becken.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Stein mustern",
      film: ["Aderung", "Kante ehrlich", "Becken gesetzt", "Pflege klar"],
      looks: ["Aderung, nah", "Kante, stark", "Becken, Unterbau", "Fuge zur Front", "Öl, ehrlich", "Licht"],
      facts: [
        { value: "Unikat", label: "diese Platte" },
        { value: "Kante", label: "mit dem Becken" },
        { value: "Pflege", label: "Säure und Öl" },
        { value: "Muster", label: "vor dem Schnitt" },
      ],
      extras: [
        ["Die Aderung entscheidet, nicht der Name des Steins.", "Ein Bild lügt über das nächste Stück."],
        ["Unterbau und Überstand in einer Zeichnung.", "Nachträglich ein Becken ist ein Risiko."],
        ["Pflege gehört ins Gespräch, nicht in die Fußnote.", "Marmor, Granit, Quarzit — ehrlich benannt."],
      ],
    },
    keramik: {
      title: "Keramik",
      emphasis: "mit Kante.",
      statement:
        "Unempfindlich, oft durchgefärbt. Die Kante und die Spüle müssen sitzen — sonst ist Keramik nur eine Fläche ohne Arbeit.",
      statementNote: "Hitze, Schnitt, Alltag. Die Fuge zur Front bleibt Maß.",
      quote: "Wir wollten Stein ohne Angst. Die Kante aus Keramik war die ehrlichere Arbeit.",
      quoteSource: "Aus einer Familienküche in Freising",
      closeTitle: "Kante und Becken.",
      closeText: "Muster der Stärke, der Kante, des Beckens. Keramik folgt der Zeichnung, nicht umgekehrt.",
      ledgerLine: "Keramik trägt, wenn die Kante trägt.",
      lookTitle: "Stärke, Kante, Becken.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Keramik mustern",
      film: ["Durchgefärbt", "Kante klar", "Becken gesetzt", "Alltag hart"],
      looks: ["Fläche, ruhig", "Kante, scharf", "Becken, plan", "Fuge", "Hitze", "Licht"],
      facts: [
        { value: "Alltag", label: "unempfindlich" },
        { value: "Kante", label: "entscheidet" },
        { value: "Becken", label: "in der Zeichnung" },
        { value: "Fuge", label: "zur Front" },
      ],
      extras: [
        ["Schnitt und Hitze gehören dazu.", "Keine Angstfläche, die man nicht benutzt."],
        ["Die Kante ist Architektur.", "Zu dünn wird sie unruhig, zu dick ein Block."],
        ["Unterbau oder aufliegend — ehrlich geplant.", "Silikon als Rettung ist keine Kante."],
      ],
    },
    edelstahl: {
      title: "Edelstahl",
      emphasis: "mit Arbeitsspuren.",
      statement:
        "Massiv oder als Becken eingeschweißt. Arbeitsspuren sind Teil der Platte — nicht ein Fehler, den man wegpoliert.",
      statementNote: "Professionell ohne Kantinen-Theater. Die Fläche arbeitet mit, nicht gegen den Tag.",
      quote: "Die Spuren kamen in der ersten Woche. Danach war es unsere Platte.",
      quoteSource: "Aus einer Kochinsel in München",
      closeTitle: "Spuren erlaubt.",
      closeText: "Stahl mustern, der arbeiten darf. Hochglanz-Stahl, den man fürchtet, zeichnen wir selten.",
      ledgerLine: "Stahl zeigt den Tag. Das ist ehrlich.",
      lookTitle: "Schweiß, Becken, Spur.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Stahl klären",
      film: ["Massiv oder Blech", "Becken eingeschweißt", "Spuren erlaubt", "Kein Kantinen-Blick"],
      looks: ["Fläche, gebürstet", "Naht, still", "Becken, eins", "Kante, Stahl", "Spur, Alltag", "Licht"],
      facts: [
        { value: "Arbeit", label: "ist sichtbar" },
        { value: "Becken", label: "eingeschweißt" },
        { value: "Pflege", label: "ohne Angst" },
        { value: "Blick", label: "kein Betrieb" },
      ],
      extras: [
        ["Spuren gehören zur Platte.", "Polieren bis zur Spiegelung ist Kostüm."],
        ["Ein Becken, eine Fläche, eine Zeichnung.", "Aufgesetzt bleibt es ein Gerät."],
        ["Inseln und Zeilen, die kochen.", "Nicht jede Wohnküche will Stahl — das sagen wir."],
      ],
    },
    "holz-massiv": {
      title: "Holz",
      emphasis: "will Öl.",
      statement:
        "Warm, will Öl. Schnittspuren gehören dazu. Eine massive Platte ist Alltag, kein Möbel, das man schont.",
      statementNote: "Gegen eine Holzfront oft zu viel. Stein oder Keramik hält die Ruhe, wenn die Front schon spricht.",
      quote: "Die Platte sollte Schnitt vertragen. Deshalb massiv, und Öl, das man kennt.",
      quoteSource: "Aus einem Landhaus östlich von Freising",
      closeTitle: "Öl und Schnitt.",
      closeText: "Holz mustern, das arbeiten darf. Eine Platte, die man fürchtet, bleibt ungezeichnet.",
      ledgerLine: "Massivholz ist Pflege. Und Wärme.",
      lookTitle: "Faser, Öl, Schnitt.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Holzplatte mustern",
      film: ["Massiv", "Öl", "Schnitt erlaubt", "Wärme"],
      looks: ["Faser, offen", "Öl, matt", "Kante, dick", "Fuge", "Schnitt, ehrlich", "Licht"],
      facts: [
        { value: "Öl", label: "gehört dazu" },
        { value: "Schnitt", label: "ist erlaubt" },
        { value: "Wärme", label: "gegen Stein" },
        { value: "Front", label: "nicht dasselbe Holz" },
      ],
      extras: [
        ["Keine Folie, die Holz spielt.", "Massiv oder ehrlich nein."],
        ["Pflege im Gespräch, nicht in der Broschüre.", "Wasser an der Spüle braucht eine ehrliche Zone."],
        ["Gegen Holzfront oft Stein.", "Zwei Hölzer im selben Blick werden laut."],
      ],
    },
    "innen-auszug": {
      title: "Vollauszüge",
      emphasis: "bis hinten.",
      statement:
        "Das Innenleben entscheidet den Alltag mehr als die Front. Vollauszüge, bevor die Fläche feststeht — sonst bleibt der hintere Zentimeter tot.",
      statementNote: "Ecken mit Auszug, nicht mit Totwinkel. Was man täglich sucht, sitzt vorn.",
      quote: "Die Front war schön. Der hintere Topf war der Auftrag — deshalb der Vollauszug.",
      quoteSource: "Aus einer Zeile in Landshut",
      closeTitle: "Hinten erreichen.",
      closeText: "Auszüge in der Ausstellung öffnen. Schwer, voll, still. Dann die Front.",
      ledgerLine: "Ein Auszug, der nicht voll auszieht, ist ein Fach.",
      lookTitle: "Lauf, Last, Stille.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Auszüge klären",
      film: ["Voll ausgezogen", "Ecke erreichbar", "Last still", "Front danach"],
      looks: ["Lauf, präzise", "Reling, still", "Ecke, Auszug", "Trennung, klar", "Licht im Korpus", "Griff innen"],
      facts: [
        { value: "Voll", label: "bis zur Rückwand" },
        { value: "Ecke", label: "kein Totwinkel" },
        { value: "Last", label: "ohne Geräusch" },
        { value: "Front", label: "danach" },
      ],
      extras: [
        ["Was hinten steht, muss nach vorn kommen.", "Ein Fach ist kein Auszug."],
        ["Ecken zeichnen wir mit Auszug oder gar nicht als Stauraum.", "Schöne Türen über totem Raum sind Theater."],
        ["Innere Ordnung hält die ruhige Fläche.", "Beschlag, den man hört, ist falsch gewählt."],
      ],
    },
    kochfeld: {
      title: "Kochfeld",
      emphasis: "mit der Platte.",
      statement:
        "Induktion, Gas, Kombi oder unsichtbar. Die Platte und der Korpus müssen mit — kein Feld als Nachtrag in eine fertige Fuge.",
      statementNote: "Ausschnitt, Kabel, Tiefe. Das Feld folgt dem Aufmaß, nicht dem Prospekt.",
      quote: "Das Feld war klar. Der Korpus darunter war der ganze Plan.",
      quoteSource: "Aus einer Insel in München",
      closeTitle: "Korpus zuerst.",
      closeText: "Platte, Ausschnitt, Anschluss. Dann das Feld, das zur Aufgabe passt — nicht zum Logo.",
      ledgerLine: "Ein Kochfeld ohne Korpus ist ein Bild.",
      lookTitle: "Ausschnitt, Kabel, Fläche.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Feld klären",
      film: ["Ausschnitt", "Korpus darunter", "Kabel still", "Fläche frei"],
      looks: ["Feld, bündig", "Fuge, Platte", "Knopf oder Fläche", "Kabel, geführt", "Luft, wenn nötig", "Kante"],
      facts: [
        { value: "Platte", label: "muss mit" },
        { value: "Korpus", label: "zuerst" },
        { value: "Anschluss", label: "gezeichnet" },
        { value: "Logo", label: "danach" },
      ],
      extras: [
        ["Induktion, Gas oder unsichtbar — ehrlich zur Aufgabe.", "Kein Feld, das die Platte sprengt."],
        ["Ausschnitt und Dichtung in der Zeichnung.", "Nachträglich ist ein Risiko im Stein."],
        ["Inseln brauchen Weg und Luft.", "An der Zeile oft die ehrlichere Fläche."],
      ],
    },
    kochfeldabzug: {
      title: "Abzug",
      emphasis: "in der Platte.",
      statement:
        "Muldenlüfter statt Esse. Für Inseln und offene Räume, mit ehrlicher Aussage zur Leistung. Luft und Korpus gehören in denselben Plan.",
      statementNote: "Eine Esse nimmt den Blick. Ein Abzug ohne Leistung nimmt die Luft. Beides sagen wir.",
      quote: "Die Esse hätten wir gesehen. Deshalb sitzt der Abzug in der Platte — und der Kanal war der Auftrag.",
      quoteSource: "Aus einem offenen Haus in München",
      closeTitle: "Luft ehrlich.",
      closeText: "Kanal, Motor, Austritt. Dann das Feld. Eine Zahl aus dem Prospekt reicht nicht.",
      ledgerLine: "Abzug ist Luftbau. Nicht ein Schlitz.",
      lookTitle: "Schlitz, Kanal, Motor.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Abzug klären",
      film: ["Schlitz in der Platte", "Kanal im Korpus", "Austritt gezeichnet", "Blick frei"],
      looks: ["Mulde, still", "Gitter, plan", "Korpus, tief", "Kanal, geführt", "Esse, wenn sie sitzt", "Licht"],
      facts: [
        { value: "Blick", label: "bleibt frei" },
        { value: "Kanal", label: "im Korpus" },
        { value: "Leistung", label: "ehrlich" },
        { value: "Esse", label: "nur wenn sie trägt" },
      ],
      extras: [
        ["Offene Räume brauchen einen Plan für Luft.", "Ein Schlitz allein ist kein Abzug."],
        ["Motor und Austritt vor dem Feld.", "Nachträglich bleibt ein Kompromiss im Schrank."],
        ["Bora oder ein anderer — nach Aufgabe, nicht Vertrag.", "Die Küche bleibt BEER."],
      ],
    },
    backofen: {
      title: "Backofen",
      emphasis: "wo die Hand ist.",
      statement:
        "Im Hochschrank auf Griffhöhe oder unter der Platte — je nach Rücken und Raum. Die Nische sitzt vor dem Gerät.",
      statementNote: "Ein Ofen, den man täglich bückt, zeichnen wir selten. Die Front bleibt ruhig.",
      quote: "Der Ofen auf Griffhöhe war die ganze Entscheidung. Die Front blieb ruhig.",
      quoteSource: "Aus der Geräteplanung",
      closeTitle: "Nische und Rücken.",
      closeText: "Höhe, Anschlag, Dampf daneben. Dann der Ofen, der die Nische füllt — nicht die Wand.",
      ledgerLine: "Der Ofen sitzt für den Rücken. Nicht für das Bild.",
      lookTitle: "Nische, Höhe, Tür.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Ofen klären",
      film: ["Griffhöhe", "Nische maßgenau", "Tür Anschlag", "Front ruhig"],
      looks: ["Nische, hoch", "Tür, still", "Fuge, Gerät", "Griff, verborgen", "Licht", "Dampf daneben"],
      facts: [
        { value: "Höhe", label: "der Hand" },
        { value: "Nische", label: "zuerst" },
        { value: "Rücken", label: "entscheidet" },
        { value: "Wand", label: "nicht voller Öfen" },
      ],
      extras: [
        ["Unter der Platte nur, wenn der Raum das will.", "Sonst Hochschrank."],
        ["Anschlag und Lüftung in der Zeichnung.", "Ein Gerät ohne Nische ist ein Wunsch."],
        ["Marke nach Aufgabe.", "Miele, Gaggenau, Siemens — frei."],
      ],
    },
    dampfgarer: {
      title: "Dampf",
      emphasis: "mit Wasser.",
      statement:
        "Dampf neben dem Ofen, Wasseranschluss mitgedacht. Ohne Zulauf und Ablauf bleibt er ein Stecker in einer schönen Nische.",
      statementNote: "Der Alltag dampft, wenn Wasser sitzt. Nachträglich ist teuer.",
      quote: "Der Dampf war der Wunsch. Der Ablauf unter der Nische war der Plan.",
      quoteSource: "Aus einem Hochschrank in Erding",
      closeTitle: "Wasser zuerst.",
      closeText: "Zulauf, Ablauf, Nische. Dann Dampf neben dem Ofen — oder ehrlich ohne.",
      ledgerLine: "Dampf ohne Wasser ist ein Gerät an der Leine.",
      lookTitle: "Nische, Schlauch, Ofen.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Dampf klären",
      film: ["Neben dem Ofen", "Zulauf", "Ablauf", "Nische klar"],
      looks: ["Nische, paarig", "Schlauch, geführt", "Tür, Dampf", "Fuge", "Griffhöhe", "Licht"],
      facts: [
        { value: "Wasser", label: "im Aufmaß" },
        { value: "Ablauf", label: "unter der Nische" },
        { value: "Ofen", label: "daneben" },
        { value: "Nachtrag", label: "selten ehrlich" },
      ],
      extras: [
        ["Ein Paar mit dem Ofen, nicht ein Extra in der Ecke.", "Dieselbe Höhe, dieselbe Hand."],
        ["Schläuche im Korpus, bevor die Front schließt.", "Kein Gerät auf der Suche nach Wasser."],
        ["Nur wenn der Alltag dampft.", "Sonst bleibt die Nische Stauraum."],
      ],
    },
    kuehlung: {
      title: "Kühlung",
      emphasis: "mit Nische.",
      statement:
        "Vollintegriert oder als Schrank. Lüftung und Nische zuerst. Die Tür kommt zuletzt — und nur, wenn die Luft bleibt.",
      statementNote: "Eine schöne Front über einem heißen Gerät ist Lärm.",
      quote: "Die Nische war zu knapp. Die Kühlung kam als Schrank — ehrlicher als eine tote Front.",
      quoteSource: "Aus einem Aufmaß in Freising",
      closeTitle: "Luft messen.",
      closeText: "Nische, Abluft, Anschlag. Vollintegriert nur, wenn die Physik mitspielt.",
      ledgerLine: "Kühlung ist Luft. Die Front ist danach.",
      lookTitle: "Nische, Gitter, Tür.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Kühlung klären",
      film: ["Nische", "Luftwege", "Tür zuletzt", "Front wenn sie trägt"],
      looks: ["Korpus, tief", "Gitter, plan", "Tür, integriert", "Schrank, ehrlich", "Fuge", "Anschlag"],
      facts: [
        { value: "Nische", label: "gemessen" },
        { value: "Luft", label: "gezeichnet" },
        { value: "Tür", label: "zuletzt" },
        { value: "Schrank", label: "wenn nötig" },
      ],
      extras: [
        ["Zu knapp ist nicht integrierbar.", "Wir sagen das vor der Bestellung."],
        ["Gitter sind Teil der Architektur.", "Versteckt bis zur Überhitzung ist falsch."],
        ["Französisch, Side-by-side, klassisch — nach Vorrat.", "Nicht nach der Breite des Prospekts."],
      ],
    },
    geschirrspueler: {
      title: "Spüler",
      emphasis: "in der Zeile.",
      statement:
        "Vollintegriert, oft neben der Spüle. Knock-to-open wenn die Front grifflos ist. Wasser im Aufmaß.",
      statementNote: "Ein Gerät, das stündlich aufgeht, braucht eine Öffnung, die das Gewicht hält.",
      quote: "Tipp-on am Geschirrspüler hat nicht gehalten. Die Mulde war die ehrlichere Ruhe.",
      quoteSource: "Aus einer grifflosen Planung",
      closeTitle: "Neben der Spüle.",
      closeText: "Lage, Öffnung, Anschluss. Dann die Front, die das Gerät trägt.",
      ledgerLine: "Der Spüler gehört zur Arbeit. Nicht zur Showwand.",
      lookTitle: "Lage, Mulde, Wasser.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Spüler klären",
      film: ["Neben der Spüle", "Front bündig", "Öffnung ehrlich", "Anschluss still"],
      looks: ["Zeile, Arbeit", "Front, integriert", "Mulde", "Anschluss", "Schall", "Fuge"],
      facts: [
        { value: "Lage", label: "Arbeitsszone" },
        { value: "Front", label: "bündig" },
        { value: "Öffnung", label: "trägt das Gewicht" },
        { value: "Wasser", label: "vorher" },
      ],
      extras: [
        ["Kurzer Weg vom Becken.", "Nicht am Ende einer langen Zeile ohne Grund."],
        ["Grifflos mit Mulde oder ehrlichem Tipp.", "Schwere Türen lügen nicht."],
        ["Zulauf vor der Platte.", "Nachträglich bleibt die Fuge offen."],
      ],
    },
    kaffee: {
      title: "Kaffee",
      emphasis: "auf Augenhöhe.",
      statement:
        "In der Nische, mit Wasser und Ablauf. Ein Vollautomat ohne Anschluss ist ein Stecker hinter einer schönen Tür.",
      statementNote: "Augenhöhe, weil Sie ihn täglich holen. Die Nische sitzt im Hochschrank, nicht als Nachtrag.",
      quote: "Der Kaffee auf Augenhöhe war der Wunsch. Der Ablauf war der Auftrag.",
      quoteSource: "Aus einer Nischenplanung",
      closeTitle: "Ablauf oder nicht.",
      closeText: "Nische, Wasser, Höhe. Dann das Gerät — oder ehrlich die Kanne auf der Platte.",
      ledgerLine: "Kaffee ohne Ablauf bleibt ein Gast in der Nische.",
      lookTitle: "Höhe, Schlauch, Tür.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Kaffee klären",
      film: ["Augenhöhe", "Wasser", "Ablauf", "Tür still"],
      looks: ["Nische, hoch", "Schlauch, geführt", "Tür, Gerät", "Tasse, Licht", "Fuge", "Griff"],
      facts: [
        { value: "Höhe", label: "der Augen" },
        { value: "Wasser", label: "und Ablauf" },
        { value: "Alltag", label: "täglich" },
        { value: "Nische", label: "im Hochschrank" },
      ],
      extras: [
        ["Nur wenn er den Morgen trägt.", "Sonst bleibt die Nische Stauraum."],
        ["Schläuche vor der Front.", "Ein Gerät auf der Suche nach Wasser ist Planung zu spät."],
        ["Marke nach Tasse, nicht nach Wand.", "Frei gewählt."],
      ],
    },
    "quooker-armatur": {
      title: "Quooker",
      emphasis: "als Tank.",
      statement:
        "Kochendes, stilles, sprudelndes Wasser an einer Armatur. Der Tank sitzt im Unterschrank — das zeichnen wir mit der Spüle, nicht als Nachtrag.",
      statementNote: "Volumen, Wärme, Ablauf. Die Armatur ist das Gesicht. Der Tank ist der Auftrag.",
      quote: "Der Quooker kam nicht nachträglich. Der Tank war der ganze Unterschrank.",
      quoteSource: "Aus einer Planung mit Steinplatte",
      closeTitle: "Tank mitzeichnen.",
      closeText: "Spüle, Becken, Unterschrank. Dann die Armatur. Ein Logo auf dem Hahn reicht nicht.",
      ledgerLine: "Quooker ist ein Tank. Nicht nur eine Armatur.",
      lookTitle: "Hahn, Tank, Becken.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Quooker zeichnen",
      film: ["Armatur in der Kante", "Tank darunter", "Becken gesetzt", "Kein Nachtrag"],
      looks: ["Hahn, still", "Kante, Stein", "Tank, Volumen", "Schlauch, geführt", "Unterschrank, geteilt", "Licht"],
      facts: [
        { value: "Tank", label: "im Unterschrank" },
        { value: "Spüle", label: "in derselben Zeichnung" },
        { value: "Volumen", label: "geändert" },
        { value: "Nachtrag", label: "selten möglich" },
      ],
      extras: [
        ["Die Aufteilung unter der Spüle ändert sich.", "Ein Feld für Vorrat fällt weg."],
        ["Steinbecken und Hahn in einer Fuge.", "Aufgesetzt bleibt er ein Gast."],
        ["Marke frei, Aufgabe klar.", "Die Küche bleibt BEER."],
      ],
    },
    einbauschraenke: {
      title: "Einbau",
      emphasis: "in der Nische.",
      statement:
        "Nischen, Schrägen, raumhohe Füllungen — oft im selben Aufmaß wie die Küche. Derselbe Millimeter, dieselbe Fuge.",
      statementNote: "Ein Schrank aus einem anderen Leben neben der Küche bricht die Linie. Deshalb dieselbe Werkstatt.",
      quote: "Ein Schrank in der Nische neben der Küche darf nicht aus einem anderen Leben stammen. Er gehört zur Fuge.",
      quoteSource: "Aus einem Einbau in Wolfersdorf",
      closeTitle: "Dieselbe Fuge.",
      closeText: "Nische, Schräge, Höhe. Bringen Sie den Raum mit. Den Schrank zeichnen wir zur Küche.",
      ledgerLine: "Einbau ist Anschluss. Nicht Anhang.",
      lookTitle: "Nische, Füllung, Fuge.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Einbau klären",
      film: ["Nische", "Raumhoch", "Fuge zur Küche", "Kein zweites Werk"],
      looks: ["Füllung, passgenau", "Schräge, gezeichnet", "Front, dieselbe Sprache", "Griff, still", "Licht", "Fuge"],
      facts: [
        { value: "Aufmaß", label: "mit der Küche" },
        { value: "Nische", label: "nicht Raster" },
        { value: "Fuge", label: "dieselbe Sprache" },
        { value: "Werkstatt", label: "Wolfersdorf" },
      ],
      extras: [
        ["Versatz, Schräge, alte Wand.", "Das Raster lügt dort."],
        ["Keine Blende als Ausrede.", "Füllung als Möbel."],
        ["Lack und Holz aus derselben Hand.", "Kein zweites Sortiment."],
      ],
    },
    ankleide: {
      title: "Ankleide",
      emphasis: "nach Maß.",
      statement:
        "Begehbare Kleiderschränke aus derselben Manufaktur. Maß vor System — Licht, Griffwege, dieselbe Ruhe wie in der Küche.",
      statementNote: "Kein Rasterschrank hinter einer schönen Tür. Die Nische ist die Zeichnung.",
      quote: "Die Ankleide sollte sich anfühlen wie die Küche: dieselbe Fuge, dasselbe Licht.",
      quoteSource: "Aus einem Haus in München",
      closeTitle: "Maß vor System.",
      closeText: "Grundriss der Kammer, Licht, was hängt und liegt. Dann zeichnen wir — oder wir lassen das System.",
      ledgerLine: "Eine Ankleide aus dem Raster ist ein Kleiderschrank mit Gang.",
      lookTitle: "Licht, Griff, Nische.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Ankleide klären",
      film: ["Maß", "Lichtwege", "Griffwege", "Dieselbe Manufaktur"],
      looks: ["Front, ruhig", "Licht, indirekt", "Griff, still", "Boden, klar", "Höhe, genutzt", "Fuge"],
      facts: [
        { value: "Maß", label: "vor System" },
        { value: "Licht", label: "in der Zeichnung" },
        { value: "Wege", label: "zum Griff" },
        { value: "Küche", label: "dieselbe Sprache" },
      ],
      extras: [
        ["Die Kammer bringt die Wand mit.", "Kein Programm, das sie ignoriert."],
        ["Licht, bevor die Front schließt.", "Dunkle Gänge sind kein Luxus."],
        ["Dieselbe Werkstatt, weniger Angebot.", "Präziser Anschluss."],
      ],
    },
    "tische-baenke": {
      title: "Tische",
      emphasis: "nach dem Raum.",
      statement:
        "Esstisch in der Sprache der Küche: Holz, Kante, Länge nach dem Raum. Keine Katalogplatte unter einer Manufakturzeile.",
      statementNote: "Die Kante spricht mit der Arbeitsplatte. Die Länge mit den Wegen.",
      quote: "Der Tisch sollte dieselbe Kante haben wie die Insel. Sonst war er ein Gast.",
      quoteSource: "Aus einer Wohnküche in Freising",
      closeTitle: "Länge und Kante.",
      closeText: "Wie viele sitzen, welcher Weg bleibt, welches Holz. Dann der Tisch — oder die Sitzkante an der Insel.",
      ledgerLine: "Ein Tisch aus dem Katalog bricht die Küche.",
      lookTitle: "Kante, Holz, Länge.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Tisch klären",
      film: ["Länge nach dem Raum", "Kante wie die Küche", "Holz, ehrlich", "Wege frei"],
      looks: ["Platte, Holz", "Kante, verwandt", "Bein, still", "Bank, maß", "Fuge zum Boden", "Licht"],
      facts: [
        { value: "Länge", label: "nach dem Raum" },
        { value: "Kante", label: "zur Küche" },
        { value: "Holz", label: "dasselbe Leben" },
        { value: "Weg", label: "bleibt" },
      ],
      extras: [
        ["Nicht die Insel ersetzen, wenn ein Tisch ehrlicher ist.", "Beides braucht Maß."],
        ["Kante in der Sprache der Platte.", "Ein anderer Radius bricht den Blick."],
        ["Bänke nach der Nische, nicht nach dem Satz.", "Knie und Rücken zuerst."],
      ],
    },
    wohnmoebel: {
      title: "Wohnen",
      emphasis: "zum Haus.",
      statement:
        "Sideboard, Regal, Einbauten — wenn sie zum Haus gehören, nicht zum Katalog. Weniger Angebot, präziser Anschluss an die Küche.",
      statementNote: "Wir zeichnen Wohnmöbel, wenn sie den Raum beruhigen. Nicht um das Sortiment zu strecken.",
      quote: "Das Sideboard sollte die Küche weiterführen, nicht das Wohnzimmer eröffnen.",
      quoteSource: "Aus einem offenen Grundriss in München",
      closeTitle: "Nur was gehört.",
      closeText: "Bilder vom Wohnen neben der Küche. Dann zeichnen wir den Anschluss — oder wir lassen das Möbel.",
      ledgerLine: "Wohnmöbel bei BEER sind Anschluss. Kein zweites Programm.",
      lookTitle: "Linie, Stauraum, Ruhe.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Wohnen klären",
      film: ["Anschluss an die Küche", "Wenig Angebot", "Haus zuerst", "Kein Katalog"],
      looks: ["Front, weitergeführt", "Regal, still", "Sideboard, niedrig", "Licht", "Fuge", "Holz"],
      facts: [
        { value: "Haus", label: "zuerst" },
        { value: "Küche", label: "dieselbe Fuge" },
        { value: "Wenig", label: "Angebot" },
        { value: "Kein", label: "Katalogwand" },
      ],
      extras: [
        ["Nur was den Blick aus der Küche trägt.", "Ein zweites Leben im Wohnen stört."],
        ["Maß an der Wand, nicht System 32 als Ausrede.", "Dieselbe Werkstatt."],
        ["Weniger Stücke, genauer gesetzt.", "Kein Möbelhaus im Anhang."],
      ],
    },
    bora: {
      title: "Bora",
      emphasis: "für den Blick.",
      statement:
        "Kochfeldabzug in der Platte. Blick frei, Technik unter dem Korpus. Wir planen Bora mit Tiefe, Kabelführung und oft anderer Unterschrank-Aufteilung — nicht nachträglich in eine fertige Zeile.",
      statementNote: "Die Küche bleibt BEER. Das Gerät ist die Aufgabe, den Blick zu halten.",
      quote: "Die Esse hätten wir gesehen. Deshalb sitzt der Abzug in der Platte.",
      quoteSource: "Aus einem offenen Neubau in München",
      closeTitle: "Korpus mit Bora.",
      closeText: "Kanal, Motor, Feld. Dann die Marke, wenn sie zur Luft und zum Blick passt.",
      ledgerLine: "Bora ist Luft unter der Platte. Kein Logo darauf.",
      lookTitle: "Schlitz, Kanal, Blick.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Bora klären",
      film: ["Blick frei", "Abzug in der Platte", "Korpus geändert", "Keine Esse"],
      looks: ["Mulde, plan", "Feld, bündig", "Kanal, geführt", "Unterschrank, neu", "Licht", "Wohnen daneben"],
      facts: [
        { value: "Blick", label: "ohne Esse" },
        { value: "Korpus", label: "neu aufgeteilt" },
        { value: "Luft", label: "ehrlich" },
        { value: "Küche", label: "bleibt BEER" },
      ],
      extras: [
        ["Nicht nachträglich in eine fertige Zeile.", "Die Aufteilung ändert sich vorher."],
        ["Leistung ohne Theater.", "Offene Räume brauchen den Plan, nicht nur den Schlitz."],
        ["Frei gewählt, nicht Vertragsküche.", "Neben anderen Marken, wo die Aufgabe sitzt."],
      ],
    },
    miele: {
      title: "Miele",
      emphasis: "für den Tag.",
      statement:
        "Backen, Spülen, Kälte — Geräte, die in Nischen und Hochschränken bleiben. Miele dort, wo Zuverlässigkeit und Service den Alltag tragen. Die Küche bleibt BEER.",
      statementNote: "Kein Paket, das die Planung ersetzt. Nische zuerst, Gerät danach.",
      quote: "Miele dort, wo man es täglich öffnet. Nicht als Wand voller Logos.",
      quoteSource: "Aus der Geräteplanung",
      closeTitle: "Nische, dann Miele.",
      closeText: "Was der Alltag öffnet, sitzt auf Griffhöhe. Die Marke folgt der Aufgabe.",
      ledgerLine: "Miele ist Alltag. Nicht die Küche.",
      lookTitle: "Nische, Griff, Service.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Miele zuordnen",
      film: ["Hochschrank", "Griffhöhe", "Nische zuerst", "Küche BEER"],
      looks: ["Front, integriert", "Nische, paarig", "Griff, verborgen", "Fuge", "Licht", "Service, still"],
      facts: [
        { value: "Alltag", label: "und Service" },
        { value: "Nische", label: "zuerst" },
        { value: "Frei", label: "gewählt" },
        { value: "Küche", label: "BEER" },
      ],
      extras: [
        ["Wo Zuverlässigkeit den Tag trägt.", "Nicht als Pflichtpaket."],
        ["Ofen, Spüler, Kälte — nach Nische.", "Keine Wand als Showroom."],
        ["Neben Bora oder Gaggenau, wenn die Aufgabe wechselt.", "Kein Entweder-oder-Vertrag."],
      ],
    },
    gaggenau: {
      title: "Gaggenau",
      emphasis: "als Architektur.",
      statement:
        "Technik als Architektur: Klappen, Edelstahl, sichtbare Bedienung wenn sie zum Raum passt. Hinter Front, wenn der Raum ruhiger bleiben soll.",
      statementNote: "Wir setzen Gaggenau, wenn die Küche das Gerät zeigen darf — oder verbergen, wenn der Blick das Haus braucht.",
      quote: "Die Klappe war das Gerät. Der Raum durfte es sehen.",
      quoteSource: "Aus einem Haus in München",
      closeTitle: "Zeigen oder ruhen.",
      closeText: "Ob Gaggenau Architektur sein darf, sagt das Haus. Mustern wir in der Nische, nicht im Prospekt.",
      ledgerLine: "Gaggenau ist sichtbar oder still. Beides ist eine Entscheidung.",
      lookTitle: "Klappe, Stahl, Nische.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Gaggenau klären",
      film: ["Sichtbar wenn es sitzt", "Hinter Front wenn Ruhe", "Nische Architektur", "Kein Zwang"],
      looks: ["Klappe, Stahl", "Bedienung, ehrlich", "Front, ruhig", "Nische, maß", "Licht", "Fuge"],
      facts: [
        { value: "Raum", label: "darf sehen" },
        { value: "Oder", label: "verbergen" },
        { value: "Nische", label: "ist Architektur" },
        { value: "Frei", label: "gewählt" },
      ],
      extras: [
        ["Technik, die man zeigen will, braucht den Blick.", "Im falschen Haus wird sie laut."],
        ["Hinter Front bleibt die Linie.", "Dieselbe Marke, andere Haltung."],
        ["Kein Zwang zur Edelstahlwand.", "Die Küche bleibt Maß aus Wolfersdorf."],
      ],
    },
    quooker: {
      title: "Quooker",
      emphasis: "mit dem Becken.",
      statement:
        "Kochendes, stilles, sprudelndes Wasser an einer Armatur. Der Tank sitzt im Unterschrank. Das zeichnen wir mit der Spüle, nicht als Nachtrag.",
      statementNote: "Die Küche fertigen wir. Das Gerät wählen wir mit Ihnen — frei.",
      quote: "Der Tank war der ganze Unterschrank. Die Armatur kam danach.",
      quoteSource: "Aus einer Steinplatte mit Unterbau",
      closeTitle: "Mit der Spüle.",
      closeText: "Becken, Tank, Hahn. Eine Bestellung. Nicht drei Nachträge.",
      ledgerLine: "Quooker ändert den Schrank. Deshalb vorher.",
      lookTitle: "Hahn, Tank, Stein.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Quooker zeichnen",
      film: ["Hahn in der Kante", "Tank im Schrank", "Becken gesetzt", "Frei gewählt"],
      looks: ["Armatur, still", "Stein, Fuge", "Tank, Wärme", "Schlauch", "Unterschrank", "Licht"],
      facts: [
        { value: "Tank", label: "ändert den Schrank" },
        { value: "Spüle", label: "dieselbe Zeichnung" },
        { value: "Frei", label: "keine Vertragsküche" },
        { value: "Nachtrag", label: "selten" },
      ],
      extras: [
        ["Volumen unter der Spüle zuerst.", "Vorrat weicht dem Tank."],
        ["Stein oder Keramik mit dem Hahn.", "Aufgesetzt bleibt ein Gast."],
        ["Aufgabe klar, Marke frei.", "Korpus bleibt BEER."],
      ],
    },
    siemens: {
      title: "Siemens",
      emphasis: "wo es passt.",
      statement:
        "Solide Einbaugeräte, wenn Budget und Nische das verlangen. Keine Vertragsküche. Siemens wo es zur Aufgabe passt — neben Miele oder Bora, nicht gegen die Planung.",
      statementNote: "Der Preisrahmen im Erstgespräch. Das Gerät folgt der Nische, nicht einem Paket.",
      quote: "Siemens wo die Nische und der Rahmen es tragen. Die Küche bleibt Maß.",
      quoteSource: "Aus einer ehrlichen Geräteplanung",
      closeTitle: "Aufgabe, nicht Paket.",
      closeText: "Nische, Budget, Alltag. Dann Siemens — oder eine andere Marke, frei.",
      ledgerLine: "Siemens ist eine Option. Kein Zwang.",
      lookTitle: "Nische, Rahmen, Gerät.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Siemens zuordnen",
      film: ["Nische zuerst", "Rahmen ehrlich", "Kein Paket", "Küche BEER"],
      looks: ["Front, integriert", "Nische, klar", "Gerät, still", "Fuge", "Hochschrank", "Licht"],
      facts: [
        { value: "Nische", label: "und Rahmen" },
        { value: "Kein", label: "Vertragspaket" },
        { value: "Neben", label: "anderen Marken" },
        { value: "Küche", label: "Maß" },
      ],
      extras: [
        ["Wo Budget und Aufgabe sich treffen.", "Ohne die Planung zu ersetzen."],
        ["Frei neben Miele oder Bora.", "Kein Entweder-oder aus einem Vertrag."],
        ["Erstgespräch nennt den Rahmen.", "Geräte danach."],
      ],
    },
  },
  en: {},
};

function fillEnglishVoices() {
  const de = VOICE.de;
  const en: Record<string, Voice> = {};
  const titles: Record<string, [string, string]> = {
    fronten: ["Fronts", "to the hand."],
    arbeitsplatten: ["Worktops", "for work."],
    innenleben: ["Interiors", "before the front."],
    spuele: ["Sink", "with the top."],
    kochen: ["Cooking", "in the carcass."],
    backen: ["Baking", "at hand height."],
    kaelte: ["Cold", "with air."],
    spuelen: ["Washing", "beside the sink."],
    extra: ["Extra", "only with the day."],
    "lack-matt": ["Matt lacquer", "without polishing."],
    "eiche-furnier": ["Oak", "as a face."],
    fenix: ["Fenix", "where fingers shout."],
    naturstein: ["Stone", "as a one-off."],
    keramik: ["Ceramic", "with an edge."],
    edelstahl: ["Steel", "with working marks."],
    "holz-massiv": ["Wood", "that wants oil."],
    "innen-auszug": ["Drawers", "all the way."],
    kochfeld: ["Hob", "with the top."],
    kochfeldabzug: ["Extraction", "in the top."],
    backofen: ["Oven", "where the hand is."],
    dampfgarer: ["Steam", "with water."],
    kuehlung: ["Cold store", "with a niche."],
    geschirrspueler: ["Dishwasher", "in the run."],
    kaffee: ["Coffee", "at eye height."],
    "quooker-armatur": ["Quooker", "as a tank."],
    einbauschraenke: ["Fitted", "in the niche."],
    ankleide: ["Dressing", "to measure."],
    "tische-baenke": ["Tables", "to the room."],
    wohnmoebel: ["Living", "to the house."],
    bora: ["Bora", "for the view."],
    miele: ["Miele", "for the day."],
    gaggenau: ["Gaggenau", "as architecture."],
    quooker: ["Quooker", "with the sink."],
    siemens: ["Siemens", "where it fits."],
  };

  for (const [slug, voice] of Object.entries(de)) {
    const pair = titles[slug];
    en[slug] = {
      ...voice,
      title: pair?.[0] ?? voice.title,
      emphasis: pair?.[1] ?? voice.emphasis,
      statement: voice.statement,
      statementNote: voice.statementNote,
      quote: voice.quote,
      quoteSource: voice.quoteSource,
      closeTitle: voice.closeTitle,
      closeText: voice.closeText,
      ledgerLine: voice.ledgerLine,
      lookTitle: voice.lookTitle,
      indexEyebrow: voice.indexEyebrow,
      ctaLabel: voice.ctaLabel,
      film: voice.film,
      looks: voice.looks,
      facts: voice.facts,
      extras: voice.extras,
    };
  }

  // Honest EN restatements for the main kind pages and a few items.
  en.fronten = {
    ...en.fronten,
    statement:
      "The front is what you touch every morning. Lacquer, veneer, Fenix — sampled in daylight before a face is ordered.",
    statementNote: "Matt holds the day. Gloss wants polishing. Visible wood wants light, not costume.",
    closeTitle: "In daylight.",
    closeText: "Samples next to wall and stone. The face that holds the room is not bought from a screen.",
    ledgerLine: "The front decides the day more than the rendering.",
    ctaLabel: "Sample a front",
    facts: [
      { value: "Sample", label: "before the order" },
      { value: "Matt", label: "carries the day" },
      { value: "Wood", label: "wants light" },
      { value: "Joint", label: "holds the calm" },
    ],
  };
  en.kochen = {
    ...en.kochen,
    statement:
      "Induction, gas, downdraft. For islands and open rooms often honester than a hood. Carcass and cable first, the hob after.",
    closeTitle: "Air and view.",
    ctaLabel: "Settle cooking",
    ledgerLine: "Cooking is carcass. Not only the hob.",
  };
  VOICE.en = en;
}

fillEnglishVoices();

function voiceFor(slug: string, locale: Locale): Voice | undefined {
  return VOICE[locale][slug] ?? VOICE.de[slug];
}

function housesFrom(projects: Project[], photo: (n: number, w?: number) => string): ClusterHouse[] {
  return projects.slice(0, 4).map((project, index) => ({
    href: `/projekte/${project.slug}`,
    title: project.title,
    meta: [project.place, project.year].filter(Boolean).join(" · "),
    image: resolveDevImage(project.image, photo(80 + index, 1200)),
  }));
}

function pointBranches(voice: Voice | undefined, photo: (n: number, w?: number) => string): PresentedBranch[] {
  const extras = voice?.extras ?? [];
  const looks = voice?.looks ?? [];
  const labels = voice?.film ?? [];
  return extras.map((points, index) => ({
    title: labels[index] ?? `${String(index + 1).padStart(2, "0")}`,
    text: points[0] ?? "",
    image: photo(16 + index * 3),
    imageB: photo(17 + index * 3, 1200),
    imageC: photo(18 + index * 3, 1200),
    alt: labels[index] ?? voice?.title ?? "",
    kicker: String(index + 1).padStart(2, "0"),
    points,
    caption: looks[index] ?? labels[index] ?? "",
  }));
}

function itemBranches(
  items: { href: string; title: string; text: string; image?: string }[],
  photo: (n: number, w?: number) => string,
  extras: string[][],
): PresentedBranch[] {
  return items.map((item, index) => ({
    href: item.href,
    title: item.title,
    text: item.text,
    image: resolveDevImage(item.image, photo(16 + index * 3)),
    imageB: photo(17 + index * 3, 1200),
    imageC: photo(18 + index * 3, 1200),
    alt: item.title,
    kicker: String(index + 1).padStart(2, "0"),
    points: extras[index] ?? [],
    caption: item.title,
  }));
}

function cmsMatches(cms: CmsPageFields | undefined, locale: Locale) {
  if (!cms?.contentLocale || cms.contentLocale === locale) {
    return cms;
  }
  return undefined;
}

function withCms(voice: Voice, cms?: CmsPageFields): Voice {
  if (!cms) {
    return voice;
  }
  return {
    ...voice,
    title: cms.seitentitel || voice.title,
    emphasis: cms.betonung || voice.emphasis,
    statement: cms.aussage || voice.statement,
    statementNote: cms.hinweis || voice.statementNote,
    quote: cms.zitat || voice.quote,
    quoteSource: cms.zitatQuelle || voice.quoteSource,
    closeTitle: cms.schlussTitel || voice.closeTitle,
    closeText: cms.schlussText || voice.closeText,
    facts: cms.stichworte?.length
      ? cms.stichworte.map((item) => ({ value: item.wert, label: item.zeile }))
      : voice.facts,
  };
}

function withPunkte(
  branches: PresentedBranch[],
  punkte: CmsPageFields["punkte"],
) {
  if (!punkte?.length) {
    return branches;
  }
  return branches.map((branch, index) => {
    const punkt = punkte[index];
    const points = (punkt?.text || "")
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (!punkt || points.length === 0) {
      return branch;
    }
    return {
      ...branch,
      title: punkt.titel || branch.title,
      text: points[0] || branch.text,
      points,
    };
  });
}

function toCms(voice: Voice, titles: string[]) {
  return {
    seitentitel: voice.title,
    betonung: voice.emphasis,
    aussage: voice.statement,
    hinweis: voice.statementNote,
    zitat: voice.quote,
    zitatQuelle: voice.quoteSource,
    schlussTitel: voice.closeTitle,
    schlussText: voice.closeText,
    stichworte: voice.facts.map((fact) => ({ wert: fact.value, zeile: fact.label })),
    punkte: voice.extras
      .map((points, index) => ({
        titel: titles[index] || String(index + 1).padStart(2, "0"),
        text: points.join("\n"),
      }))
      .filter((item) => item.titel && item.text),
  };
}

export function catalogEntryCms(slug: string) {
  const voice = voiceFor(slug, "de");
  return voice ? toCms(voice, voice.film) : null;
}

export function regionEntryCms(name: string) {
  const voice = regionVoice(name, "de");
  return toCms(voice, voice.film);
}

function assemble(args: {
  locale: Locale;
  voice: Voice;
  lede: string;
  heroImage: string;
  heroAlt: string;
  parentHref: string;
  parentLabel: string;
  crumbs?: HubCrumb[];
  eyebrow?: string;
  ctaHref?: string;
  photo: (n: number, w?: number) => string;
  branches: PresentedBranch[];
  siblings: ClusterSibling[];
  houses: ClusterHouse[];
  siblingEyebrow: string;
  siblingTitle: string;
  ueberschrift?: string;
  lesetext?: string;
  cms?: CmsPageFields;
}): PresentedTopic {
  const { locale, photo } = args;
  const voice = withCms(args.voice, cmsMatches(args.cms, locale));
  const branches = withPunkte(args.branches, cmsMatches(args.cms, locale)?.punkte);
  const visit = clusterVisit(locale);
  const hub: PresentedTopic = {
    locale,
    eyebrow: args.eyebrow ?? (locale === "en" ? "Kitchen" : "Küche"),
    title: voice.title,
    emphasis: voice.emphasis,
    lede: args.lede,
    statement: voice.statement,
    statementNote: voice.statementNote,
    heroImage: cmsLarge(args.heroImage, 3840),
    heroAlt: args.heroAlt,
    indexEyebrow: voice.indexEyebrow,
    quote: voice.quote,
    quoteSource: voice.quoteSource,
    ctaLabel: voice.ctaLabel,
    ctaHref: args.ctaHref ?? TALK_CTA,
    closeTitle: voice.closeTitle,
    closeText: voice.closeText,
    parentHref: args.parentHref,
    parentLabel: args.parentLabel,
    crumbs: args.crumbs ?? [{ href: args.parentHref, label: args.parentLabel }],
    statementImage: photo(1, 2560),
    statementImageB: photo(2, 1920),
    closeImage: photo(3, 2560),
    ledgerImage: photo(4, 1920),
    visitImage: photo(5, 1920),
    filmstrip: [0, 1, 2, 3].map((slot) => ({
      src: photo(6 + slot, 1920),
      alt: voice.film[slot] ?? voice.title,
      caption: voice.film[slot] ?? voice.title,
    })),
    facts: voice.facts,
    ledgerLine: voice.ledgerLine,
    looks: voice.looks.map((caption, slot) => ({
      src: photo(10 + slot, 1600),
      alt: caption,
      caption,
    })),
    branches,
    visitPlace: visit.place,
    visitLine: visit.line,
    visitNote: visit.note,
    priceLine:
      locale === "en"
        ? "The first conversation is free. The kitchen is not."
        : "Das Erstgespräch ist kostenlos. Die Küche nicht.",
    placeLine:
      locale === "en"
        ? "Wolfersdorf · Freising · Munich"
        : "Wolfersdorf · Freising · München",
    siblings: args.siblings,
    houses: args.houses,
    swatches: [],
    lookTitle: voice.lookTitle,
    siblingEyebrow: args.siblingEyebrow,
    siblingTitle: args.siblingTitle,
    ueberschrift: args.ueberschrift,
    lesetext: args.lesetext,
  };
  return hub;
}

function regionVoice(name: string, locale: Locale): Voice {
  if (locale === "en") {
    return {
      title: name,
      emphasis: "within reach.",
      statement: `A kitchen of this class is drawn for a house in ${name}. Survey on site, made in Wolfersdorf, fitted by us — if the road still makes sense.`,
      statementNote:
        "The showroom sits near Freising. The first talk is often there. The measure later in the kitchen that is not yet ours.",
      quote:
        "The first appointment is often in Wolfersdorf. The survey later in the kitchen that is not yet ours.",
      quoteSource: `From advice for ${name}`,
      closeTitle: "Wolfersdorf first.",
      closeText: `Samples, materials, a talk without a drawing. Then we come to ${name} — if the radius fits.`,
      ledgerLine: `A kitchen for ${name} still belongs to the workshop.`,
      lookTitle: "Road, survey, fit.",
      indexEyebrow: "The radius",
      ctaLabel: `Talk for ${name}`,
      film: ["Showroom", "Survey on site", "Made here", "Fitted by us"],
      looks: ["House, local", "Measure, room", "Stone, sampled", "Fit, on site", "Road, honest", "Workshop"],
      facts: [
        { value: "Showroom", label: "Wolfersdorf" },
        { value: "Survey", label: `in ${name}` },
        { value: "Workshop", label: "here" },
        { value: "Fit", label: "by us" },
      ],
      extras: [
        [`Advice in the showroom, the house in ${name}.`, "No branch office as a substitute."],
        ["The survey is in the room that will take the kitchen.", "Not from a plan alone."],
        ["Further than the radius we say so.", "No pressure to stretch the road."],
      ],
    };
  }
  return {
    title: name,
    emphasis: "im Radius.",
    statement: `Eine Küche dieser Klasse wird für ein Haus in ${name} gezeichnet. Aufmaß vor Ort, gefertigt in Wolfersdorf, gesetzt durch uns — wenn der Weg noch Sinn hat.`,
    statementNote:
      "Die Ausstellung liegt bei Freising. Der erste Termin ist oft dort. Das Aufmaß später in der Küche, die noch nicht die unsere ist.",
    quote:
      "Der erste Termin ist oft in Wolfersdorf. Das Aufmaß später in der Küche, die noch nicht die unsere ist.",
    quoteSource: `Aus der Beratung für ${name}`,
    closeTitle: "Zuerst Wolfersdorf.",
    closeText: `Muster, Materialien, ein Gespräch ohne Zeichnung. Danach kommen wir nach ${name} — wenn der Radius passt.`,
    ledgerLine: `Eine Küche für ${name} gehört trotzdem in die Werkstatt.`,
    lookTitle: "Weg, Aufmaß, Montage.",
    indexEyebrow: "Der Radius",
    ctaLabel: `Termin für ${name}`,
    film: ["Ausstellung", "Aufmaß vor Ort", "Fertigung hier", "Montage durch uns"],
    looks: ["Haus vor Ort", "Maß im Raum", "Stein, gemustert", "Montage", "Weg, ehrlich", "Werkstatt"],
    facts: [
      { value: "Ausstellung", label: "Wolfersdorf" },
      { value: "Aufmaß", label: `in ${name}` },
      { value: "Werkstatt", label: "hier" },
      { value: "Montage", label: "durch uns" },
    ],
    extras: [
      [`Beratung in der Ausstellung, das Haus in ${name}.`, "Keine Filiale als Ersatz."],
      ["Das Aufmaß ist in dem Raum, der die Küche tragen soll.", "Nicht allein vom Plan."],
      ["Weiter als der Radius, sagen wir das.", "Kein Druck, den Weg zu strecken."],
    ],
  };
}

export function presentMaterialKind(
  slug: MaterialKindRoute,
  locale: Locale,
  materials: Material[],
  projects: Project[],
  page?: SitePage | null,
): PresentedTopic {
  const meta = MATERIAL_KIND_ROUTES.find((item) => item.slug === slug)!;
  const parent = PARENT.material[locale];
  const voice = voiceFor(slug, locale)!;
  const start = 72 + MATERIAL_KIND_ROUTES.findIndex((item) => item.slug === slug) * 8;
  const photo = (n: number, width?: number) => devPhoto(start + n, width);
  const related = meta.kind
    ? materials.filter((item) => item.kind === meta.kind)
    : [];
  const sinkItems =
    slug === "spuele"
      ? [
          {
            href: "/material/naturstein",
            title: locale === "en" ? "Sink in stone" : "Becken in Stein",
            text:
              locale === "en"
                ? "Undermount drawn with the slab."
                : "Unterbau, mit der Platte gezeichnet.",
            image: materials.find((item) => item.slug === "naturstein")?.image,
          },
          {
            href: "/geraete/quooker-armatur",
            title: locale === "en" ? "Tap and tank" : "Armatur und Tank",
            text:
              locale === "en"
                ? "The tank changes the cupboard."
                : "Der Tank ändert den Unterschrank.",
          },
          {
            href: "/marken/quooker",
            title: "Quooker",
            text:
              locale === "en"
                ? "Free choice, drawn with the sink."
                : "Frei gewählt, mit der Spüle gezeichnet.",
          },
        ]
      : related.map((item) => ({
          href: `/material/${item.slug}`,
          title: voiceFor(item.slug, locale)?.title ?? item.name,
          text: voiceFor(item.slug, locale)?.statementNote ?? item.intro,
          image: item.image,
        }));
  const kindHouses = meta.kind
    ? projects.filter((project) =>
        project.materials.some((material) => material.kind === meta.kind),
      )
    : projects.filter((project) =>
        project.brands.some((brand) => brand.slug === "quooker"),
      );
  const siblings = MATERIAL_KIND_ROUTES.filter((item) => item.slug !== slug).map(
    (item, index) => ({
      href: item.href,
      title: KIND_LABEL[locale][item.slug].title,
      text: KIND_LABEL[locale][item.slug].text,
      image: photo(70 + index, 1100),
    }),
  );

  return assemble({
    locale,
    voice,
    lede: voice.statementNote,
    heroImage: cmsLarge(resolveDevImage(related[0]?.image, photo(0, 3840)), 3840),
    heroAlt: voice.title,
    parentHref: parent.href,
    parentLabel: parent.label,
    crumbs: [parent],
    eyebrow: locale === "en" ? "Layer" : "Schicht",
    ctaHref: VISIT_CTA,
    photo,
    branches: itemBranches(sinkItems, photo, voice.extras),
    siblings,
    houses: housesFrom(kindHouses, photo),
    siblingEyebrow: locale === "en" ? "Further layers" : "Weitere Schichten",
    siblingTitle:
      locale === "en" ? "Other planes of the kitchen." : "Andere Ebenen der Küche.",
    cms: page ?? undefined,
  });
}

export function presentApplianceKind(
  slug: ApplianceKind,
  locale: Locale,
  appliances: Appliance[],
  projects: Project[],
  page?: SitePage | null,
): PresentedTopic {
  const parent = PARENT.geraete[locale];
  const voice = voiceFor(slug, locale)!;
  const start = 118 + GERAETE_KIND_ROUTES.findIndex((item) => item.slug === slug) * 8;
  const photo = (n: number, width?: number) => devPhoto(start + n, width);
  const related = appliances.filter((item) => item.kind === slug);
  const siblings = GERAETE_KIND_ROUTES.filter((item) => item.slug !== slug).map(
    (item, index) => ({
      href: item.href,
      title: KIND_LABEL[locale][item.slug].title,
      text: KIND_LABEL[locale][item.slug].text,
      image: photo(70 + index, 1100),
    }),
  );

  return assemble({
    locale,
    voice,
    lede: voice.statementNote,
    heroImage: cmsLarge(resolveDevImage(related[0]?.image, photo(0, 3840)), 3840),
    heroAlt: voice.title,
    parentHref: parent.href,
    parentLabel: parent.label,
    crumbs: [parent],
    eyebrow: locale === "en" ? "Task" : "Aufgabe",
    photo,
    branches: itemBranches(
      related.map((item) => ({
        href: `/geraete/${item.slug}`,
        title: voiceFor(item.slug, locale)?.title ?? item.name,
        text: item.intro,
        image: item.image,
      })),
      photo,
      voice.extras,
    ),
    siblings,
    houses: housesFrom(
      projects.filter((project) =>
        project.appliances.some((item) => item.kind === slug),
      ),
      photo,
    ),
    siblingEyebrow: locale === "en" ? "Further tasks" : "Weitere Aufgaben",
    siblingTitle:
      locale === "en" ? "Other kit in the kitchen." : "Andere Technik in der Küche.",
    cms: page ?? undefined,
  });
}

export function presentMaterialItem(
  item: Material,
  locale: Locale,
  materials: Material[],
  projects: Project[],
): PresentedTopic {
  const parent = PARENT.material[locale];
  const kindRoute = MATERIAL_KIND_ROUTES.find((entry) => entry.kind === item.kind);
  const voice = voiceFor(item.slug, locale)!;
  const photo = (n: number, width?: number) =>
    devPhoto(100 + item.order + n, width);
  const siblings = materials
    .filter((entry) => entry.kind === item.kind && entry.slug !== item.slug)
    .map((entry, index) => ({
      href: `/material/${entry.slug}`,
      title: voiceFor(entry.slug, locale)?.title ?? entry.name,
      text: entry.intro,
      image: resolveDevImage(entry.image, photo(70 + index, 1100)),
    }));

  return assemble({
    locale,
    voice,
    lede: item.intro,
    heroImage: cmsLarge(resolveDevImage(item.image, photo(0, 3840)), 3840),
    heroAlt: item.name,
    parentHref: kindRoute?.href ?? parent.href,
    parentLabel: kindRoute
      ? KIND_LABEL[locale][kindRoute.slug].title
      : parent.label,
    crumbs: [
      parent,
      kindRoute
        ? { href: kindRoute.href, label: KIND_LABEL[locale][kindRoute.slug].title }
        : parent,
    ],
    ctaHref: VISIT_CTA,
    photo,
    branches: pointBranches(voice, photo),
    siblings,
    houses: housesFrom(projects.filter((project) =>
      project.materials.some((material) => material.slug === item.slug),
    ), photo),
    siblingEyebrow:
      locale === "en" ? "Further surfaces" : "Weitere Flächen",
    siblingTitle:
      locale === "en" ? "Other material beside it." : "Anderes Material daneben.",
    ueberschrift: item.ueberschrift,
    lesetext: item.lesetext,
    cms: item,
  });
}

export function presentApplianceItem(
  item: Appliance,
  locale: Locale,
  appliances: Appliance[],
  projects: Project[],
): PresentedTopic {
  const parent = PARENT.geraete[locale];
  const kindRoute = GERAETE_KIND_ROUTES.find((entry) => entry.slug === item.kind);
  const voice = voiceFor(item.slug, locale)!;
  const photo = (n: number, width?: number) =>
    devPhoto(140 + item.order + n, width);
  const siblings = appliances
    .filter((entry) => entry.kind === item.kind && entry.slug !== item.slug)
    .map((entry, index) => ({
      href: `/geraete/${entry.slug}`,
      title: voiceFor(entry.slug, locale)?.title ?? entry.name,
      text: entry.intro,
      image: resolveDevImage(entry.image, photo(70 + index, 1100)),
    }));

  return assemble({
    locale,
    voice,
    lede: item.intro,
    heroImage: cmsLarge(resolveDevImage(item.image, photo(0, 3840)), 3840),
    heroAlt: item.name,
    parentHref: kindRoute?.href ?? parent.href,
    parentLabel: kindRoute
      ? KIND_LABEL[locale][kindRoute.slug].title
      : parent.label,
    crumbs: [
      parent,
      kindRoute
        ? { href: kindRoute.href, label: KIND_LABEL[locale][kindRoute.slug].title }
        : parent,
    ],
    photo,
    branches: pointBranches(voice, photo),
    siblings,
    houses: housesFrom(
      projects.filter((project) =>
        project.appliances.some((appliance) => appliance.slug === item.slug),
      ),
      photo,
    ),
    siblingEyebrow: locale === "en" ? "Further kit" : "Weitere Geräte",
    siblingTitle:
      locale === "en" ? "Other appliances in this task." : "Andere Geräte dieser Aufgabe.",
    ueberschrift: item.ueberschrift,
    lesetext: item.lesetext,
    cms: item,
  });
}

export function presentFurnitureItem(
  item: Furniture,
  locale: Locale,
  furniture: Furniture[],
  projects: Project[],
): PresentedTopic {
  const parent = PARENT.moebel[locale];
  const voice = voiceFor(item.slug, locale)!;
  const photo = (n: number, width?: number) =>
    devPhoto(168 + item.order + n, width);
  const siblings = furniture
    .filter((entry) => entry.slug !== item.slug)
    .map((entry, index) => ({
      href: `/moebel/${entry.slug}`,
      title: voiceFor(entry.slug, locale)?.title ?? entry.name,
      text: entry.intro,
      image: resolveDevImage(entry.image, photo(70 + index, 1100)),
    }));

  return assemble({
    locale,
    voice,
    lede: item.intro,
    heroImage: cmsLarge(resolveDevImage(item.image, photo(0, 3840)), 3840),
    heroAlt: item.name,
    parentHref: parent.href,
    parentLabel: parent.label,
    photo,
    branches: pointBranches(voice, photo),
    siblings,
    houses: housesFrom(projects.slice(0, 4), photo),
    siblingEyebrow: locale === "en" ? "Further furniture" : "Weitere Möbel",
    siblingTitle:
      locale === "en" ? "Other pieces from the workshop." : "Andere Stücke aus der Werkstatt.",
    ueberschrift: item.ueberschrift,
    lesetext: item.lesetext,
    cms: item,
  });
}

export function presentBrandItem(
  item: Brand,
  locale: Locale,
  brands: Brand[],
  projects: Project[],
): PresentedTopic {
  const parent = PARENT.marken[locale];
  const voice = voiceFor(item.slug, locale)!;
  const photo = (n: number, width?: number) =>
    devPhoto(186 + item.order + n, width);
  const siblings = brands
    .filter((entry) => entry.slug !== item.slug)
    .map((entry, index) => ({
      href: `/marken/${entry.slug}`,
      title: voiceFor(entry.slug, locale)?.title ?? entry.name,
      text: entry.intro,
      image: resolveDevImage(entry.image, photo(70 + index, 1100)),
    }));

  return assemble({
    locale,
    voice,
    lede: item.intro,
    heroImage: cmsLarge(resolveDevImage(item.image, photo(0, 3840)), 3840),
    heroAlt: item.name,
    parentHref: parent.href,
    parentLabel: parent.label,
    photo,
    branches: pointBranches(voice, photo),
    siblings,
    houses: housesFrom(
      projects.filter((project) =>
        project.brands.some((brand) => brand.slug === item.slug),
      ),
      photo,
    ),
    siblingEyebrow: locale === "en" ? "Further brands" : "Weitere Marken",
    siblingTitle:
      locale === "en" ? "Chosen to the task, not a contract." : "Nach Aufgabe, nicht nach Vertrag.",
    ueberschrift: item.ueberschrift,
    lesetext: item.lesetext,
    cms: item,
  });
}

export function presentRegionItem(
  item: Region,
  locale: Locale,
  regions: Region[],
  projects: Project[],
): PresentedTopic {
  const parent = PARENT.regionen[locale];
  const voice = regionVoice(item.name, locale);
  const photo = (n: number, width?: number) =>
    devPhoto(204 + item.order + n, width);
  const siblings = regions
    .filter((entry) => entry.slug !== item.slug)
    .slice(0, 4)
    .map((entry, index) => ({
      href: `/regionen/${entry.slug}`,
      title: entry.name,
      text: entry.intro,
      image: resolveDevImage(entry.image, photo(70 + index, 1100)),
    }));

  return assemble({
    locale,
    voice,
    lede: item.intro,
    heroImage: cmsLarge(resolveDevImage(item.image, photo(0, 3840)), 3840),
    heroAlt:
      locale === "en" ? `Kitchens in ${item.name}` : `Küchen in ${item.name}`,
    parentHref: parent.href,
    parentLabel: parent.label,
    photo,
    branches: pointBranches(voice, photo),
    siblings,
    houses: housesFrom(
      projects.filter((project) =>
        project.regions.some((region) => region.slug === item.slug),
      ),
      photo,
    ),
    siblingEyebrow: locale === "en" ? "Further places" : "Weitere Orte",
    siblingTitle:
      locale === "en" ? "Other houses in the radius." : "Andere Häuser im Radius.",
    ueberschrift: item.ueberschrift,
    lesetext: item.lesetext,
    cms: item,
  });
}

export function entryMetadata(
  title: string,
  description: string,
  path: string,
  image?: string,
): Promise<Metadata> {
  return pageMetadata({
    title: brandedTitle(title),
    description,
    path,
    image,
  });
}

export function materialKindMetadata(
  slug: MaterialKindRoute,
  locale: Locale,
): Promise<Metadata> {
  const voice = voiceFor(slug, locale)!;
  return entryMetadata(
    locale === "en" ? voice.title : KIND_LABEL.de[slug].title,
    voice.statement,
    `/material/${slug}`,
  );
}

export function applianceKindMetadata(
  slug: ApplianceKind,
  locale: Locale,
): Promise<Metadata> {
  const voice = voiceFor(slug, locale)!;
  return entryMetadata(voice.title, voice.statement, `/geraete/${slug}`);
}

