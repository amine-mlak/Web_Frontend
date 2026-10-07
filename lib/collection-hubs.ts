import type { Metadata } from "next";
import { APPLIANCE_PHOTOS } from "@/lib/appliance-media";
import type { Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/locale";

export type CollectionBranch = {
  href?: string;
  title: string;
  text: string;
  image: string;
  srcSet?: string;
  alt: string;
  meta?: string;
  brands?: string[];
};

export type CollectionHubCopy = {
  eyebrow: string;
  title: string;
  emphasis: string;
  lede: string;
  statement: string;
  statementNote: string;
  heroImage: string;
  heroAlt: string;
  indexEyebrow: string;
  quote: string;
  quoteSource: string;
  ctaLabel: string;
  ctaHref: string;
  closeTitle: string;
  closeText: string;
  branches: CollectionBranch[];
};

export type CollectionHubId =
  | "kuechen"
  | "material"
  | "geraete"
  | "moebel"
  | "projekte"
  | "regionen"
  | "marken"
  | "ratgeber"
  | "planen"
  | "ueber";

const de: Record<CollectionHubId, CollectionHubCopy> = {
  kuechen: {
    eyebrow: "Manufakturküchen",
    title: "Küchen",
    emphasis: "als Unikat.",
    lede: "Nicht aus dem Programm. Aus der Werkstatt — für Häuser, die eine Küche tragen sollen, kein Möbelstück aus dem Raster.",
    statement:
      "Wer bei BEER bestellt, bestellt eine der teuersten Küchen, die man in Deutschland bauen lässt. Wenige Aufträge im Jahr, jedes Stück auf Maß, in Wolfersdorf gefertigt.",
    statementNote: "Der Preis folgt dem Aufmaß, dem Stein, der Zeit in der Werkstatt — nicht einem Katalog.",
    heroImage: "/kitchens/stile-design.jpg",
    heroAlt: "Schwarze Designküche mit Eiche",
    indexEyebrow: "Fünf Zugänge",
    quote:
      "Eine Küche in diesem Haus muss in zehn Jahren noch selbstverständlich wirken. Nicht nach dem Jahr, in dem sie bestellt wurde.",
    quoteSource: "Aus der Planung in der Ausstellung Freising",
    ctaLabel: "Küche besprechen",
    ctaHref: "/beratung",
    closeTitle: "Zuerst der Raum.",
    closeText:
      "Bilder helfen. Ein Plan muss nicht sein. Im Gespräch sortieren wir Form, Material und Alltag — bevor gezeichnet wird.",
    branches: [
      {
        href: "/kuechen/formen",
        title: "Küchenformen",
        text: "Zeile, L, U, Insel. Die Form folgt dem Grundriss, nicht dem Wunsch nach einer Insel um jeden Preis.",
        image: "/kitchens/stile-modern.jpg",
        alt: "Klare Küchenzeile",
      },
      {
        href: "/kuechen/stile",
        title: "Küchenstile",
        text: "Modern, Landhaus, Design, Holz, puristisch. Haltung, die zum Haus passt — ohne Kostüm.",
        image: "/kitchens/stile-landhaus.jpg",
        alt: "Landhausküche mit Stein",
      },
      {
        href: "/kuechen/farben",
        title: "Küchenfarben",
        text: "Weiß, Schwarz, Salbei, Grau. Farbe am Muster, unter Tageslicht, nicht am Bildschirm.",
        image: "/kitchens/stile-holz.jpg",
        alt: "Helle Küche mit Holz",
      },
      {
        href: "/kuechen/inseln",
        title: "Kücheninseln",
        text: "Nur wenn der Raum Laufwege lässt. Kochinsel, Arbeitsinsel, Sitzkante — Technik unter der Platte mitgedacht.",
        image: "/kitchens/stile-insel.jpg",
        alt: "Küche mit Insel",
      },
      {
        href: "/kuechen/besondere",
        title: "Besondere Küchen",
        text: "Klein, raumhoch, grifflos, nach Maß. Dort, wo Standardzeilen enden, beginnt die Manufaktur.",
        image: "/kitchens/stile-purist.jpg",
        alt: "Puristische raumhohe Küche",
      },
    ],
  },
  material: {
    eyebrow: "Haptik",
    title: "Material",
    emphasis: "zum Anfassen.",
    lede: "Front, Platte, Innenleben — das, was man täglich berührt. Mustern wir vor der Bestellung, nicht nach dem Rendering.",
    statement:
      "In einer Küche dieser Klasse entscheidet die Oberfläche den Alltag. Lack, das man nicht poliert, bis er glänzt. Stein, der Unikat bleibt. Auszüge, die stiller sind als die Front.",
    statementNote: "Ausstellung Wolfersdorf: Muster, Kanten, Licht. Kein Folienmuster aus dem Ordner.",
    heroImage: "/kitchens/stile-holz.jpg",
    heroAlt: "Holz und Naturstein in einer Küche",
    indexEyebrow: "Vier Schichten",
    quote:
      "Die Front ist das, was Sie jeden Morgen anfassen. Deshalb mustern wir, bevor irgendetwas bestellt wird.",
    quoteSource: "Aus dem Materialgespräch in der Ausstellung",
    ctaLabel: "Material mustern",
    ctaHref: "/ausstellung",
    closeTitle: "Unter Tageslicht.",
    closeText:
      "Stein, Lack und Holz ändern sich mit dem Wetter. Deshalb liegen die Muster in Wolfersdorf, nicht nur auf dem Bildschirm.",
    branches: [
      {
        href: "/material/fronten",
        title: "Fronten",
        text: "Lack, Furnier, Fenix. Matt, seidenmatt, Holzsicht. Die Fläche, die den Raum hält.",
        image: "/kitchens/stile-modern.jpg",
        alt: "Ruhige Küchenfronten",
      },
      {
        href: "/material/arbeitsplatten",
        title: "Arbeitsplatten",
        text: "Naturstein, Keramik, Edelstahl, Holz. Die Fläche, auf der gearbeitet wird — nicht nur fotografiert.",
        image: "/kitchens/stile-landhaus.jpg",
        alt: "Naturstein-Arbeitsplatte",
      },
      {
        href: "/material/innenleben",
        title: "Innenleben",
        text: "Vollauszüge, Ecken, Vorrat. Was man nicht sieht, entscheidet den Tag öfter als die Farbe.",
        image: "/kitchens/stile-purist.jpg",
        alt: "Präzises Innenleben",
      },
      {
        href: "/material/spuele",
        title: "Spüle & Armatur",
        text: "Unterbau, Stein, Quooker. Mit der Platte gezeichnet, nicht als Nachtrag in den Unterschrank geschoben.",
        image: "/kitchens/stile-insel.jpg",
        alt: "Spüle in der Arbeitsplatte",
      },
    ],
  },
  geraete: {
    eyebrow: "Technik",
    title: "Geräte",
    emphasis: "als Architektur.",
    lede: "Nicht die ganze Wand voller Geräte. Die, die der Alltag braucht — sauber in Nische und Hochschrank, oft unsichtbar.",
    statement:
      "In unseren Küchen folgt die Technik dem Raum. Kochfeldabzug, wenn die Esse den Blick stört. Geräte auf Griffhöhe, wenn der Rücken das verlangt. Marken frei gewählt, nicht nach Zwang.",
    statementNote: "Bora, Miele, Gaggenau, Quooker, Siemens — frei gewählt, in der Manufaktur eingebaut.",
    heroImage: APPLIANCE_PHOTOS.hero,
    heroAlt: "Küche mit Edelstahlkühlschrank und Kochfeld",
    indexEyebrow: "Fünf Bereiche",
    quote:
      "Ein Gerät, das man jeden Tag öffnet, gehört auf die Höhe der Hand. Nicht hinter eine Showfront, die niemand benutzt.",
    quoteSource: "Aus der Geräteplanung",
    ctaLabel: "Technik klären",
    ctaHref: "/beratung",
    closeTitle: "Erst die Nische.",
    closeText:
      "Lüftung, Wasser, Kabelführung. Bevor ein Gerät eine Überschrift wird, sitzt es im Aufmaß.",
    branches: [
      {
        href: "/geraete/kochen",
        title: "Kochen",
        text: "Induktion, Gas, Kochfeldabzug. Für Inseln und offene Räume oft ehrlicher als die Esse.",
        image: APPLIANCE_PHOTOS.kochen,
        alt: "Induktionskochfeld Siemens in der Arbeitsplatte",
        brands: ["bora", "siemens"],
      },
      {
        href: "/geraete/backen",
        title: "Backen & Dämpfen",
        text: "Ofen, Dampf, Wärmeschublade. Im Hochschrank, wo man sie erreicht — oder unter der Platte, wenn der Raum das will.",
        image: APPLIANCE_PHOTOS.backen,
        alt: "Einbaubackofen im Hochschrank",
        brands: ["miele", "gaggenau"],
      },
      {
        href: "/geraete/kaelte",
        title: "Kälte",
        text: "Vollintegriert oder als Schrank. Lüftung und Nische zuerst, die Tür später.",
        image: APPLIANCE_PHOTOS.kaelte,
        alt: "Edelstahl-Kühlschrank als Schrank",
        brands: ["miele", "siemens"],
      },
      {
        href: "/geraete/spuelen",
        title: "Spülen",
        text: "Vollintegriert, oft neben der Spüle. Knock-to-open, wenn die Front grifflos bleibt.",
        image: APPLIANCE_PHOTOS.spuelen,
        alt: "Vollintegrierter Geschirrspüler hinter der Front",
        brands: ["miele", "siemens"],
      },
      {
        href: "/geraete/extra",
        title: "Extra",
        text: "Kaffee, Quooker, Vakuum. Nur was der Alltag trägt — mit Wasser und Ablauf gezeichnet.",
        image: APPLIANCE_PHOTOS.extra,
        alt: "Espressomaschine in der Nische",
        brands: ["quooker", "miele"],
      },
    ],
  },
  moebel: {
    eyebrow: "Einbauten",
    title: "Möbel",
    emphasis: "nach Maß.",
    lede: "Dieselbe Werkstatt, dieselbe Sprache. Nicht jedes Möbel — die, die zur Küche und zum Haus gehören.",
    statement:
      "Wenn die Küche ein Unikat ist, endet sie selten an der letzten Zeile. Einbauten, Ankleide, Tisch: Maß vor System, Holz und Lack aus derselben Hand.",
    statementNote: "Weniger Angebot, präziser Anschluss. Kein zweites Sortiment aus einem anderen Werk.",
    heroImage: "/kitchens/stile-holz.jpg",
    heroAlt: "Eingebaute Möbel aus Holz",
    indexEyebrow: "Vier Linien",
    quote:
      "Ein Schrank in der Nische neben der Küche darf nicht aus einem anderen Leben stammen. Er gehört zur Fuge.",
    quoteSource: "Aus einem Einbau in Wolfersdorf",
    ctaLabel: "Einbau besprechen",
    ctaHref: "/beratung",
    closeTitle: "Anschluss, nicht Anhang.",
    closeText:
      "Wir zeichnen Einbauten, wenn sie das Haus beruhigen. Nicht, um das Angebot zu strecken.",
    branches: [
      {
        href: "/moebel/einbauschraenke",
        title: "Einbauschränke",
        text: "Nischen, Schrägen, raumhohe Füllungen — oft im selben Aufmaß wie die Küche.",
        image: "/kitchens/stile-modern.jpg",
        alt: "Raumhoher Einbauschrank",
      },
      {
        href: "/moebel/ankleide",
        title: "Ankleiden",
        text: "Begehbare Kleiderschränke aus derselben Manufaktur. Maß vor Raster.",
        image: "/kitchens/stile-purist.jpg",
        alt: "Ankleide nach Maß",
      },
      {
        href: "/moebel/tische-baenke",
        title: "Tische & Bänke",
        text: "Esstisch in der Sprache der Küche: Holz, Kante, Länge nach dem Raum.",
        image: "/kitchens/stile-holz.jpg",
        alt: "Tisch nach Maß",
      },
      {
        href: "/moebel/wohnmoebel",
        title: "Wohnmöbel",
        text: "Sideboard, Regal, Einbauten — wenn sie zum Haus gehören, nicht zum Katalog.",
        image: "/kitchens/stile-design.jpg",
        alt: "Wohnmöbel zur Küche",
      },
    ],
  },
  projekte: {
    eyebrow: "Referenzen",
    title: "Projekte",
    emphasis: "in Häusern.",
    lede: "Keine Showküche aus der Halle. Küchen, die stehen — mit Ort, Jahr, Stein und Gerät.",
    statement:
      "Jedes Projekt ist ein Unikat. Deshalb zeigen wir wenige, und die vollständig: Material, Form, die Entscheidung gegen eine Insel, wenn der Raum sie nicht trug.",
    statementNote: "Ausstellung zum Anfassen. Die gebauten Küchen zum Verstehen.",
    heroImage: "/kitchens/stile-holz.jpg",
    heroAlt: "Wohnküche in Eiche und Stein",
    indexEyebrow: "Gebaut",
    quote:
      "Wir haben eine Insel gezeichnet und wieder gestrichen. Die Zeile mit Höhe war ehrlicher.",
    quoteSource: "Aus einem Neubau in Erding",
    ctaLabel: "Ähnliches planen",
    ctaHref: "/beratung",
    closeTitle: "Ihr Haus ist kein Lookbook.",
    closeText:
      "Referenzen helfen beim Sehen. Entschieden wird am Aufmaß — vor Ort, nicht an fremden Quadratmetern.",
    branches: [],
  },
  regionen: {
    eyebrow: "Einzugsgebiet",
    title: "Regionen",
    emphasis: "um München.",
    lede: "Ausstellung in Wolfersdorf bei Freising. Aufmaß und Montage bei Ihnen — im Radius, den die Manufaktur ehrlich bedienen kann.",
    statement:
      "Eine Küche dieser Art fährt nicht durch die Republik. Sie entsteht hier und wird gesetzt, wo der Weg zur Werkstatt und zum Service noch Sinn hat.",
    statementNote: "Rund 200 Kilometer um München. Weiteres klären wir im Gespräch — ohne Verkaufsdruck auf die Distanz.",
    heroImage: "/kitchens/stile-modern.jpg",
    heroAlt: "Küche im Einzugsgebiet München",
    indexEyebrow: "Orte",
    quote:
      "Der erste Termin ist oft in Wolfersdorf. Das Aufmaß später in der Küche, die noch nicht die unsere ist.",
    quoteSource: "Aus der Beratung für München",
    ctaLabel: "Termin in der Region",
    ctaHref: "/beratung",
    closeTitle: "Zuerst Wolfersdorf.",
    closeText:
      "Muster, Materialien, ein Gespräch ohne Zeichnung. Danach fahren wir zu Ihnen — wenn der Radius passt.",
    branches: [
      {
        href: "/regionen/muenchen",
        title: "München",
        text: "Beratung in der Ausstellung, Aufmaß und Montage in der Stadt.",
        image: "/kitchens/stile-design.jpg",
        alt: "Küche in München",
      },
      {
        href: "/regionen/freising",
        title: "Freising",
        text: "Die Ausstellung liegt hier. Kurzer Weg, oft der erste Termin.",
        image: "/kitchens/stile-landhaus.jpg",
        alt: "Küche bei Freising",
      },
      {
        href: "/regionen/erding",
        title: "Erding",
        text: "Östlich von München. Bestand und Neubau, Aufmaß vor Ort.",
        image: "/kitchens/stile-modern.jpg",
        alt: "Küche in Erding",
      },
      {
        href: "/regionen/pfaffenhofen",
        title: "Pfaffenhofen",
        text: "Nördlich, bis ins Landkreisgebiet. Manufakturküchen ohne Filiale vor Ort.",
        image: "/kitchens/stile-purist.jpg",
        alt: "Küche in Pfaffenhofen",
      },
    ],
  },
  marken: {
    eyebrow: "Partner",
    title: "Marken",
    emphasis: "nach Aufgabe.",
    lede: "Die Küche fertigen wir selbst. Die Geräte wählen wir mit Ihnen — frei, ohne Vertragsküche, ohne Zwang zur Wand voller Logos.",
    statement:
      "Bora, wenn der Blick frei bleiben soll. Gaggenau, wenn Technik Architektur sein darf. Miele, wo der Alltag trägt. Der Korpus bleibt BEER.",
    statementNote: "Keine Hausmarke. Kein Paketpreis, der die Planung ersetzt.",
    heroImage: "/kitchens/stile-insel.jpg",
    heroAlt: "Kochfeldabzug in der Platte",
    indexEyebrow: "Geräte, die wir einbauen",
    quote:
      "Die Küche ist keine Bühne für Marken. Ein Gerät sitzt, wo die Aufgabe sitzt.",
    quoteSource: "Aus der Planung mit freier Gerätewahl",
    ctaLabel: "Geräte zuordnen",
    ctaHref: "/beratung",
    closeTitle: "Frei gewählt.",
    closeText:
      "Welche Marke zu Nische, Budget und Alltag passt, klären wir nach dem Raum — nicht nach einem Partnervertrag.",
    branches: [],
  },
  ratgeber: {
    eyebrow: "Wissen",
    title: "Ratgeber",
    emphasis: "vor dem Gespräch.",
    lede: "Wenig Texte, klare Fragen. Keine Ratgeber-Maschine. Was eine Küche dieser Klasse kostet, wie Planung läuft, wann Technik den Raum stört.",
    statement:
      "Eine Manufakturküche lässt sich nicht in einem Artikel kaufen. Die Texte hier sortieren, bevor wir uns sehen — damit das Gespräch bei Ihrem Haus beginnt, nicht bei Grundlagen.",
    statementNote: "Der Rest gehört vors Muster und vors Aufmaß.",
    heroImage: "/kitchens/stile-insel.jpg",
    heroAlt: "Gespräch über die Küchenplanung",
    indexEyebrow: "Worum es geht",
    quote:
      "Im Erstgespräch nennen wir einen Rahmen, bevor gezeichnet wird. Eine Katalogzahl gäbe es nur, wenn es ein Raster gäbe.",
    quoteSource: "Aus dem Text über Kosten",
    ctaLabel: "Fragen mitbringen",
    ctaHref: "/beratung",
    closeTitle: "Lesen, dann kommen.",
    closeText:
      "Drei, vier Fragen reichen. Den Preisrahmen, den Ablauf, die Insel — den Rest sehen wir am Raum.",
    branches: [
      {
        href: "/ratgeber/was-kostet-eine-kueche",
        title: "Kosten",
        text: "Wovon der Betrag abhängt. Keine Zahl aus dem Prospekt.",
        image: "/kitchens/stile-holz.jpg",
        alt: "Material als Preisfaktor",
      },
      {
        href: "/ratgeber/kueche-planen-ablauf",
        title: "Planung",
        text: "Beratung, Aufmaß, Fertigung, Montage. Verbindlich nach Freigabe.",
        image: "/kitchens/stile-insel.jpg",
        alt: "Weg zur Küche",
      },
      {
        href: "/ratgeber/kochfeldabzug-oder-esse",
        title: "Geräte & Technik",
        text: "Abzug in der Platte oder Esse. Ehrliche Leistung, offene Räume.",
        image: "/kitchens/stile-design.jpg",
        alt: "Kochfeldabzug",
      },
      {
        href: "/faq",
        title: "Fragen",
        text: "Was viele zuerst klären: Termin, Muster, erster Schritt.",
        image: "/kitchens/stile-purist.jpg",
        alt: "Gespräch in der Ausstellung",
      },
    ],
  },
  planen: {
    eyebrow: "Der Weg",
    title: "Küche planen",
    emphasis: "ohne Raster.",
    lede: "Vom ersten Gespräch in Wolfersdorf bis zur Übergabe. Wenige Schritte, keine Filialchoreografie.",
    statement:
      "Gezeichnet wird, was der Raum trägt. Visualisierung ist Annäherung. Verbindlich wird die Planung nach Aufmaß — und nach einem Preis, der zur Manufaktur passt, nicht zum Programm.",
    statementNote: "Erstgespräch kostenlos. Die Küche selbst gehört zu den aufwendigsten, die man hierzulande bauen kann.",
    heroImage: "/kitchens/stile-insel.jpg",
    heroAlt: "Planung an der Kücheninsel",
    indexEyebrow: "So gehen wir vor",
    quote:
      "Sie müssen nicht wissen, was Sie wollen. Sie müssen nur wissen, was Ihnen gefällt — den Rest sortieren wir gemeinsam.",
    quoteSource: "Aus dem ersten Gespräch in der Ausstellung Freising",
    ctaLabel: "Beratung beginnen",
    ctaHref: "/beratung",
    closeTitle: "Ein Termin reicht zum Anfang.",
    closeText:
      "Ausstellung oder bei Ihnen. Bilder mitbringen, Pinterest erlaubt. Zeichnen tun wir später.",
    branches: [
      {
        href: "/ausstellung",
        title: "Ausstellung Freising",
        text: "Wolfersdorf. Materialien, Muster, gebaute Details — zum Anfassen, mit Termin.",
        image: "/kitchens/stile-landhaus.jpg",
        alt: "Ausstellung der Manufaktur",
      },
      {
        href: "/beratung",
        title: "Beratung & Termin",
        text: "Welche Küche zum Alltag passt, klären wir in kurzen Schritten. Danach der Termin vor Ort.",
        image: "/kitchens/stile-modern.jpg",
        alt: "Beratung",
      },
      {
        href: "/katalog",
        title: "Unterlagen",
        text: "Kein dicker Katalog als Versprechen. Was Sie brauchen, schicken wir — oder Sie holen es in der Ausstellung.",
        image: "/kitchens/stile-holz.jpg",
        alt: "Unterlagen zur Planung",
      },
      {
        href: "/faq",
        title: "Vorher klären",
        text: "Termin zu früh? Pinterest? Was der erste Schritt kostet. Die kurzen Antworten.",
        image: "/kitchens/stile-purist.jpg",
        alt: "Fragen vor dem Gespräch",
      },
    ],
  },
  ueber: {
    eyebrow: "Manufaktur",
    title: "Über BEER",
    emphasis: "eine Haltung.",
    lede: "Küchen aus der Werkstatt, nicht aus dem Zentrallager. Wolfersdorf bei Freising. Wenige Küchen, dafür solche, die bleiben.",
    statement:
      "BEER baut keine Filialkette und keinen Markenzwang. Wir bauen Küchen, die zu den kostspieligsten im Land zählen — weil Maß, Stein und Zeit in der Manufaktur nicht verhandelbar sind.",
    statementNote: "Einzugsgebiet um München. Fertigung in einer Hand. Montage durch uns.",
    heroImage: "/kitchens/stile-purist.jpg",
    heroAlt: "Puristische Manufakturküche",
    indexEyebrow: "Woran wir uns halten",
    quote:
      "Wir bauen wenige Küchen, dafür solche, die bleiben. Keine Filialkette, kein Markenzwang.",
    quoteSource: "BEER Küchenmanufaktur, Wolfersdorf",
    ctaLabel: "Manufaktur besuchen",
    ctaHref: "/ausstellung",
    closeTitle: "Kommen Sie vorbei.",
    closeText:
      "Die Ausstellung ist der Ort, an dem Haltung anfassbar wird. Ein Termin macht daraus ein Gespräch.",
    branches: [
      {
        title: "Werkstatt",
        text: "Jedes Element als Einzelstück. Aufmaß, Fertigung, Montage in einer Verantwortung — nicht in einem Netz aus Zulieferern, das niemand mehr zuordnet.",
        image: "/kitchens/stile-holz.jpg",
        alt: "Holz und Maß in der Fertigung",
      },
      {
        title: "Wenige Aufträge",
        text: "Kapazität ist Teil der Qualität. Wer bei uns eine Küche bestellt, steht nicht in einer Warteschlange neben zweihundert gleichen Zeilen.",
        image: "/kitchens/stile-design.jpg",
        alt: "Unikat statt Serie",
      },
      {
        href: "/projekte",
        title: "Häuser, nicht Hallen",
        text: "Referenzen in München, Freising, Erding. Was wir zeigen, steht. Was wir nicht zeigen, gehört den Bewohnern.",
        image: "/kitchens/stile-landhaus.jpg",
        alt: "Küche in einem Haus",
      },
      {
        href: "/presse",
        title: "Aktuelles",
        text: "Termine, Presse, was in der Manufaktur ansteht. Kein Nachrichtenstrom — wenige Meldungen, wenn es etwas zu sagen gibt.",
        image: "/kitchens/stile-insel.jpg",
        alt: "Aktuelles aus der Manufaktur",
      },
      {
        href: "/regionen",
        title: "Radius",
        text: "Ausstellung Wolfersdorf. Montage im Umland Münchens. Weiter fort nur, wenn der Weg zur Manufaktur noch trägt.",
        image: "/kitchens/stile-modern.jpg",
        alt: "Einzugsgebiet",
      },
    ],
  },
};

const en: Record<CollectionHubId, CollectionHubCopy> = {
  kuechen: {
    eyebrow: "Made in the workshop",
    title: "Kitchens",
    emphasis: "as one-offs.",
    lede: "Not from a programme. From the workshop — for houses that should carry a kitchen, not a grid of cabinets.",
    statement:
      "A kitchen from BEER is among the most expensive you can have built in Germany. Few commissions a year, every piece to measure, made in Wolfersdorf.",
    statementNote: "The price follows the survey, the stone, the hours in the shop — not a catalogue.",
    heroImage: "/kitchens/stile-design.jpg",
    heroAlt: "Black design kitchen with oak",
    indexEyebrow: "Five ways in",
    quote:
      "A kitchen in this house has to feel inevitable in ten years. Not like the year it was ordered.",
    quoteSource: "From planning in the Freising showroom",
    ctaLabel: "Talk about a kitchen",
    ctaHref: "/beratung",
    closeTitle: "The room first.",
    closeText:
      "Pictures help. A plan is not required. In conversation we sort layout, material and everyday life — before anyone draws.",
    branches: [
      {
        href: "/kuechen/formen",
        title: "Layouts",
        text: "Galley, L, U, island. The layout follows the plan, not the wish for an island at any cost.",
        image: "/kitchens/stile-modern.jpg",
        alt: "Clear kitchen run",
      },
      {
        href: "/kuechen/stile",
        title: "Styles",
        text: "Modern, country, design, wood, purist. A stance that fits the house — without costume.",
        image: "/kitchens/stile-landhaus.jpg",
        alt: "Country kitchen with stone",
      },
      {
        href: "/kuechen/farben",
        title: "Colours",
        text: "White, black, sage, grey. Colour on a sample, in daylight, not on a screen.",
        image: "/kitchens/stile-holz.jpg",
        alt: "Light kitchen with wood",
      },
      {
        href: "/kuechen/inseln",
        title: "Islands",
        text: "Only if the room leaves paths around it. Cooking island, work island, seating — with the kit under the top thought through.",
        image: "/kitchens/stile-insel.jpg",
        alt: "Kitchen with island",
      },
      {
        href: "/kuechen/besondere",
        title: "Particular kitchens",
        text: "Small, full-height, handleless, to measure. Where standard runs end, the workshop begins.",
        image: "/kitchens/stile-purist.jpg",
        alt: "Purist full-height kitchen",
      },
    ],
  },
  material: {
    eyebrow: "Touch",
    title: "Material",
    emphasis: "in the hand.",
    lede: "Front, worktop, interior — what you touch every day. We sample before the order, not after the rendering.",
    statement:
      "In a kitchen of this class the surface decides the day. Lacquer you do not polish until it shines. Stone that stays a one-off. Drawers quieter than the front.",
    statementNote: "Wolfersdorf showroom: samples, edges, light. Not a foil chip from a binder.",
    heroImage: "/kitchens/stile-holz.jpg",
    heroAlt: "Wood and natural stone in a kitchen",
    indexEyebrow: "Four layers",
    quote:
      "The front is what you touch every morning. That is why we sample before anything is ordered.",
    quoteSource: "From the material conversation in the showroom",
    ctaLabel: "Sample materials",
    ctaHref: "/ausstellung",
    closeTitle: "In daylight.",
    closeText:
      "Stone, lacquer and wood change with the weather. The samples sit in Wolfersdorf, not only on a screen.",
    branches: [
      {
        href: "/material/fronten",
        title: "Fronts",
        text: "Lacquer, veneer, Fenix. Matt, silk, visible wood. The plane that holds the room.",
        image: "/kitchens/stile-modern.jpg",
        alt: "Quiet kitchen fronts",
      },
      {
        href: "/material/arbeitsplatten",
        title: "Worktops",
        text: "Natural stone, ceramic, steel, wood. The plane you work on — not only photograph.",
        image: "/kitchens/stile-landhaus.jpg",
        alt: "Natural stone worktop",
      },
      {
        href: "/material/innenleben",
        title: "Interiors",
        text: "Full-extension drawers, corners, stores. What you do not see decides the day more often than the colour.",
        image: "/kitchens/stile-purist.jpg",
        alt: "Precise interiors",
      },
      {
        href: "/material/spuele",
        title: "Sink & tap",
        text: "Undermount, stone, Quooker. Drawn with the top, not pushed into the cupboard afterwards.",
        image: "/kitchens/stile-insel.jpg",
        alt: "Sink in the worktop",
      },
    ],
  },
  geraete: {
    eyebrow: "Technique",
    title: "Appliances",
    emphasis: "as architecture.",
    lede: "Not a wall of machines. The ones everyday life needs — built into recess and tall housing, often unseen.",
    statement:
      "In our kitchens the kit follows the room. Downdraft when a hood blocks the view. Appliances at hand height when the back asks for it. Brands chosen freely, not by contract.",
    statementNote: "Bora, Miele, Gaggenau, Quooker, Siemens — chosen freely, built in by the workshop.",
    heroImage: APPLIANCE_PHOTOS.hero,
    heroAlt: "Kitchen with stainless refrigerator and hob",
    indexEyebrow: "Five areas",
    quote:
      "A machine you open every day belongs at the height of the hand. Not behind a show front nobody uses.",
    quoteSource: "From appliance planning",
    ctaLabel: "Settle the kit",
    ctaHref: "/beratung",
    closeTitle: "The recess first.",
    closeText:
      "Ventilation, water, cable. Before an appliance becomes a headline, it sits in the survey.",
    branches: [
      {
        href: "/geraete/kochen",
        title: "Cooking",
        text: "Induction, gas, downdraft. For islands and open rooms often more honest than a hood.",
        image: APPLIANCE_PHOTOS.kochen,
        alt: "Siemens induction hob in the worktop",
        brands: ["bora", "siemens"],
      },
      {
        href: "/geraete/backen",
        title: "Baking & steam",
        text: "Oven, steam, warming drawer. In a tall housing you can reach — or under the top if the room wants that.",
        image: APPLIANCE_PHOTOS.backen,
        alt: "Built-in oven in a tall housing",
        brands: ["miele", "gaggenau"],
      },
      {
        href: "/geraete/kaelte",
        title: "Cold",
        text: "Fully integrated or as a cabinet. Ventilation and recess first, the door later.",
        image: APPLIANCE_PHOTOS.kaelte,
        alt: "Stainless refrigerator as a cabinet",
        brands: ["miele", "siemens"],
      },
      {
        href: "/geraete/spuelen",
        title: "Washing up",
        text: "Fully integrated, often next to the sink. Knock-to-open if the front stays handleless.",
        image: APPLIANCE_PHOTOS.spuelen,
        alt: "Fully integrated dishwasher behind the front",
        brands: ["miele", "siemens"],
      },
      {
        href: "/geraete/extra",
        title: "Extra",
        text: "Coffee, Quooker, vacuum. Only what everyday life carries — drawn with water and waste.",
        image: APPLIANCE_PHOTOS.extra,
        alt: "Espresso machine in a recess",
        brands: ["quooker", "miele"],
      },
    ],
  },
  moebel: {
    eyebrow: "Joinery",
    title: "Furniture",
    emphasis: "to measure.",
    lede: "The same workshop, the same language. Not every piece of furniture — the ones that belong to the kitchen and the house.",
    statement:
      "If the kitchen is a one-off, it rarely ends at the last run. Built-ins, dressing room, table: measure before system, wood and lacquer from the same hand.",
    statementNote: "A shorter offer, a cleaner joint. Not a second range from another factory.",
    heroImage: "/kitchens/stile-holz.jpg",
    heroAlt: "Built-in furniture in wood",
    indexEyebrow: "Four lines",
    quote:
      "A cupboard in the recess next to the kitchen must not come from another life. It belongs to the joint.",
    quoteSource: "From a built-in in Wolfersdorf",
    ctaLabel: "Talk about joinery",
    ctaHref: "/beratung",
    closeTitle: "A joint, not an add-on.",
    closeText:
      "We draw built-ins when they calm the house. Not to stretch the offer.",
    branches: [
      {
        href: "/moebel/einbauschraenke",
        title: "Built-in cupboards",
        text: "Recesses, slopes, full-height fills — often in the same survey as the kitchen.",
        image: "/kitchens/stile-modern.jpg",
        alt: "Full-height built-in",
      },
      {
        href: "/moebel/ankleide",
        title: "Dressing rooms",
        text: "Walk-in wardrobes from the same workshop. Measure before a system.",
        image: "/kitchens/stile-purist.jpg",
        alt: "Dressing room to measure",
      },
      {
        href: "/moebel/tische-baenke",
        title: "Tables & benches",
        text: "A dining table in the kitchen’s language: wood, edge, length from the room.",
        image: "/kitchens/stile-holz.jpg",
        alt: "Table to measure",
      },
      {
        href: "/moebel/wohnmoebel",
        title: "Living furniture",
        text: "Sideboard, shelf, built-ins — when they belong to the house, not a catalogue.",
        image: "/kitchens/stile-design.jpg",
        alt: "Living furniture with the kitchen",
      },
    ],
  },
  projekte: {
    eyebrow: "References",
    title: "Projects",
    emphasis: "in houses.",
    lede: "Not a hall of show kitchens. Kitchens that stand — with place, year, stone and appliance.",
    statement:
      "Every project is a one-off. That is why we show few, and those in full: material, layout, the decision against an island when the room would not carry it.",
    statementNote: "The showroom is for touching. The built kitchens are for understanding.",
    heroImage: "/kitchens/stile-holz.jpg",
    heroAlt: "Living kitchen in oak and stone",
    indexEyebrow: "Built",
    quote:
      "We drew an island and struck it out again. The run with height was more honest.",
    quoteSource: "From a new build in Erding",
    ctaLabel: "Plan something close",
    ctaHref: "/beratung",
    closeTitle: "Your house is not a lookbook.",
    closeText:
      "References help you see. The decision is made on the survey — on site, not on someone else’s square metres.",
    branches: [],
  },
  regionen: {
    eyebrow: "Catchment",
    title: "Regions",
    emphasis: "around Munich.",
    lede: "Showroom in Wolfersdorf near Freising. Survey and fitting at your house — in a radius the workshop can honestly serve.",
    statement:
      "A kitchen of this kind does not tour the country. It is made here and set where the road back to the workshop and to service still makes sense.",
    statementNote: "About 200 kilometres around Munich. Further afield we settle in conversation — without sales pressure on the distance.",
    heroImage: "/kitchens/stile-modern.jpg",
    heroAlt: "Kitchen in the Munich catchment",
    indexEyebrow: "Places",
    quote:
      "The first appointment is often in Wolfersdorf. The survey later in the kitchen that is not yet ours.",
    quoteSource: "From consultation for Munich",
    ctaLabel: "Book in the region",
    ctaHref: "/beratung",
    closeTitle: "Wolfersdorf first.",
    closeText:
      "Samples, materials, a conversation without a drawing. After that we come to you — if the radius fits.",
    branches: [
      {
        href: "/regionen/muenchen",
        title: "Munich",
        text: "Consultation in the showroom, survey and fitting in the city.",
        image: "/kitchens/stile-design.jpg",
        alt: "Kitchen in Munich",
      },
      {
        href: "/regionen/freising",
        title: "Freising",
        text: "The showroom is here. A short journey, often the first appointment.",
        image: "/kitchens/stile-landhaus.jpg",
        alt: "Kitchen near Freising",
      },
      {
        href: "/regionen/erding",
        title: "Erding",
        text: "East of Munich. Existing houses and new builds, survey on site.",
        image: "/kitchens/stile-modern.jpg",
        alt: "Kitchen in Erding",
      },
      {
        href: "/regionen/pfaffenhofen",
        title: "Pfaffenhofen",
        text: "North, into the district. Workshop kitchens without a local branch.",
        image: "/kitchens/stile-purist.jpg",
        alt: "Kitchen in Pfaffenhofen",
      },
    ],
  },
  marken: {
    eyebrow: "Partners",
    title: "Brands",
    emphasis: "by task.",
    lede: "We make the kitchen ourselves. We choose the appliances with you — freely, with no contract kitchen, no wall of logos.",
    statement:
      "Bora when the view should stay clear. Gaggenau when the kit may be architecture. Miele where everyday life has to hold. The carcass stays BEER.",
    statementNote: "No house brand. No package price that replaces planning.",
    heroImage: "/kitchens/stile-insel.jpg",
    heroAlt: "Downdraft in the worktop",
    indexEyebrow: "Appliances we fit",
    quote:
      "The kitchen is not a stage for brands. An appliance sits where the task sits.",
    quoteSource: "From planning with a free choice of kit",
    ctaLabel: "Place the appliances",
    ctaHref: "/beratung",
    closeTitle: "Chosen freely.",
    closeText:
      "Which brand fits recess, budget and everyday life we settle after the room — not after a partner contract.",
    branches: [],
  },
  ratgeber: {
    eyebrow: "Notes",
    title: "Guides",
    emphasis: "before we meet.",
    lede: "Few texts, clear questions. Not a content mill. What a kitchen of this class costs, how planning runs, when kit disturbs the room.",
    statement:
      "You cannot buy a workshop kitchen from an article. The notes here sort things before we meet — so the conversation starts with your house, not with the basics.",
    statementNote: "The rest belongs in front of samples and the survey.",
    heroImage: "/kitchens/stile-insel.jpg",
    heroAlt: "Conversation about kitchen planning",
    indexEyebrow: "What it is about",
    quote:
      "In the first conversation we name a frame before anyone draws. A catalogue figure would exist only if a grid existed.",
    quoteSource: "From the text on cost",
    ctaLabel: "Bring questions",
    ctaHref: "/beratung",
    closeTitle: "Read, then come.",
    closeText:
      "Three or four questions are enough. The price frame, the process, the island — the rest we see on the room.",
    branches: [
      {
        href: "/ratgeber/was-kostet-eine-kueche",
        title: "Cost",
        text: "What the sum depends on. No figure from a brochure.",
        image: "/kitchens/stile-holz.jpg",
        alt: "Material as a price factor",
      },
      {
        href: "/ratgeber/kueche-planen-ablauf",
        title: "Planning",
        text: "Consultation, survey, making, fitting. Binding after approval.",
        image: "/kitchens/stile-insel.jpg",
        alt: "Path to the kitchen",
      },
      {
        href: "/ratgeber/kochfeldabzug-oder-esse",
        title: "Appliances",
        text: "Downdraft or hood. Honest performance, open rooms.",
        image: "/kitchens/stile-design.jpg",
        alt: "Hob downdraft",
      },
      {
        href: "/faq",
        title: "Questions",
        text: "What people clear first: appointment, samples, the first step.",
        image: "/kitchens/stile-purist.jpg",
        alt: "Conversation in the showroom",
      },
    ],
  },
  planen: {
    eyebrow: "The path",
    title: "Plan a kitchen",
    emphasis: "without a grid.",
    lede: "From the first conversation in Wolfersdorf to handover. Few steps, no branch-store choreography.",
    statement:
      "We draw what the room will carry. Visualisation is an approach. Planning becomes binding after the survey — and after a price that fits the workshop, not a programme.",
    statementNote: "The first conversation is free. The kitchen itself is among the most demanding you can have built in this country.",
    heroImage: "/kitchens/stile-insel.jpg",
    heroAlt: "Planning at the kitchen island",
    indexEyebrow: "How we proceed",
    quote:
      "You don't have to know what you want. You only have to know what you like — we'll sort the rest together.",
    quoteSource: "From the first conversation in the Freising showroom",
    ctaLabel: "Start a consultation",
    ctaHref: "/beratung",
    closeTitle: "One appointment is enough to begin.",
    closeText:
      "Showroom or at your house. Bring pictures; Pinterest is allowed. Drawing comes later.",
    branches: [
      {
        href: "/ausstellung",
        title: "Freising showroom",
        text: "Wolfersdorf. Materials, samples, built details — to handle, by appointment.",
        image: "/kitchens/stile-landhaus.jpg",
        alt: "Workshop showroom",
      },
      {
        href: "/beratung",
        title: "Advice & appointment",
        text: "Which kitchen fits everyday life we sort in short steps. Then the appointment on site.",
        image: "/kitchens/stile-modern.jpg",
        alt: "Consultation",
      },
      {
        href: "/katalog",
        title: "Papers",
        text: "No thick catalogue as a promise. What you need we send — or you collect it in the showroom.",
        image: "/kitchens/stile-holz.jpg",
        alt: "Planning papers",
      },
      {
        href: "/faq",
        title: "Clear first",
        text: "Appointment too early? Pinterest? What the first step costs. The short answers.",
        image: "/kitchens/stile-purist.jpg",
        alt: "Questions before the conversation",
      },
    ],
  },
  ueber: {
    eyebrow: "Workshop",
    title: "About BEER",
    emphasis: "a stance.",
    lede: "Kitchens from the workshop, not a central warehouse. Wolfersdorf near Freising. Few kitchens, and those built to last.",
    statement:
      "BEER is not a chain and not a brand contract. We build kitchens that count among the costliest in the country — because measure, stone and time in the workshop are not negotiable.",
    statementNote: "Catchment around Munich. Making in one hand. Fitting by us.",
    heroImage: "/kitchens/stile-purist.jpg",
    heroAlt: "Purist workshop kitchen",
    indexEyebrow: "What we hold to",
    quote:
      "We build few kitchens, and those that stay. No chain of branches, no forced brands.",
    quoteSource: "BEER Küchenmanufaktur, Wolfersdorf",
    ctaLabel: "Visit the workshop",
    ctaHref: "/ausstellung",
    closeTitle: "Come by.",
    closeText:
      "The showroom is where stance becomes something you can touch. An appointment turns that into a conversation.",
    branches: [
      {
        title: "The shop",
        text: "Every element as a one-off. Survey, making, fitting in one responsibility — not a net of suppliers nobody can still name.",
        image: "/kitchens/stile-holz.jpg",
        alt: "Wood and measure in the workshop",
      },
      {
        title: "Few commissions",
        text: "Capacity is part of the quality. Anyone who orders a kitchen here is not in a queue beside two hundred identical runs.",
        image: "/kitchens/stile-design.jpg",
        alt: "One-off rather than a series",
      },
      {
        href: "/projekte",
        title: "Houses, not halls",
        text: "References in Munich, Freising, Erding. What we show stands. What we do not show belongs to the people who live there.",
        image: "/kitchens/stile-landhaus.jpg",
        alt: "Kitchen in a house",
      },
      {
        href: "/presse",
        title: "News",
        text: "Dates, press, what is happening in the workshop. Not a newsfeed — few notes, when there is something to say.",
        image: "/kitchens/stile-insel.jpg",
        alt: "News from the workshop",
      },
      {
        href: "/regionen",
        title: "Radius",
        text: "Showroom Wolfersdorf. Fitting in the Munich hinterland. Further only if the road back to the workshop still holds.",
        image: "/kitchens/stile-modern.jpg",
        alt: "Catchment",
      },
    ],
  },
};

const packs: Record<Locale, Record<CollectionHubId, CollectionHubCopy>> = {
  de,
  en,
};

export function collectionHub(
  id: CollectionHubId,
  locale: Locale,
): CollectionHubCopy {
  return packs[locale][id];
}

export async function collectionHubMetadata(
  id: CollectionHubId,
): Promise<Metadata> {
  const content = collectionHub(id, await getRequestLocale());
  return {
    title: `${content.title} | BEER Küchenmanufaktur`,
    description: content.lede,
  };
}
