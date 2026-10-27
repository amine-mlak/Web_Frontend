import type { Metadata } from "next";
import {
  cmsValue,
  type KitchenClusterSlug,
  type KitchenTopic,
  type Project,
} from "@/lib/catalog";
import {
  clusterHeading,
  clusterPhotoOffset,
  clusterVisit,
  kitchensParent,
  topicCopy,
  topicPoints,
  type ClusterHouse,
  type PresentedCluster,
} from "@/lib/collection-clusters";
import type { CollectionFact, PresentedBranch } from "@/lib/collection-present";
import { TOPIC_NOTES } from "@/lib/kitchen-details";
import { devPhoto, resolveDevImage } from "@/lib/dev-images";
import { coverOf, kitchenPhotos, uniquePagePhotos } from "@/lib/kitchen-photos";
import { getRequestLocale } from "@/lib/locale";
import type { Locale } from "@/lib/i18n";
import { brandedTitle, pageMetadata } from "@/lib/seo";
import { topicReading } from "@/lib/topic-reading";

export type PresentedTopic = PresentedCluster & {
  lookTitle: string;
  toneLine?: string;
  siblingEyebrow: string;
  siblingTitle: string;
  /** Real projects tagged with this topic; their photos fill the page. */
  taggedKitchens?: number;
  /** Every project tagged with this topic, newest first as loaded (colour pages list them all). */
  taggedHouses?: ClusterHouse[];
};

type TopicVoice = {
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
  toneLine?: string;
};

const LABEL_EN: Record<string, string> = {
  Raum: "Room",
  Arbeit: "Work",
  Grenze: "Limit",
  Planung: "Planning",
  Haltung: "Stance",
  Rolle: "Role",
  Maß: "Measure",
  Stauraum: "Store",
  Fläche: "Face",
  Ton: "Tone",
  Alltag: "Everyday",
  Material: "Material",
  Haus: "House",
  Ruhe: "Calm",
  Fuge: "Joint",
  Licht: "Light",
  Holz: "Wood",
  Oberfläche: "Surface",
  Platte: "Top",
  Front: "Front",
  Öffnung: "Opening",
  Gerät: "Kit",
  Muster: "Sample",
  Gegengewicht: "Counterweight",
  Griff: "Handle",
  Träger: "Carrier",
  Wand: "Wall",
  Technik: "Services",
  Wege: "Paths",
  Dunst: "Extraction",
  Höhe: "Height",
  Kante: "Edge",
  Gewicht: "Weight",
  Füllung: "Fill",
  Aufmaß: "Survey",
  Erreichbarkeit: "Reach",
};

const SIBLING_HEAD: Record<
  Locale,
  Record<KitchenClusterSlug, { eyebrow: string; title: string }>
> = {
  de: {
    formen: { eyebrow: "Weitere Formen", title: "Andere Formen in diesem Haus." },
    stile: { eyebrow: "Weitere Stile", title: "Andere Haltungen im Haus." },
    farben: { eyebrow: "Weitere Töne", title: "Farbe, die daneben liegt." },
    inseln: { eyebrow: "Weitere Inseln", title: "Andere Rollen in der Mitte." },
    besondere: { eyebrow: "Weitere Maße", title: "Wo das Raster weiter endet." },
  },
  en: {
    formen: { eyebrow: "Further layouts", title: "Other layouts in this house." },
    stile: { eyebrow: "Further styles", title: "Other stances in the house." },
    farben: { eyebrow: "Further tones", title: "Colour that sits beside it." },
    inseln: { eyebrow: "Further islands", title: "Other roles in the middle." },
    besondere: { eyebrow: "Further measures", title: "Where the grid still ends." },
  },
};

const VOICE: Record<Locale, Record<string, TopicVoice>> = {
  de: {
    zeile: {
      title: "Zeile",
      emphasis: "an einer Wand.",
      statement:
        "Eine Zeile in dieser Klasse ist keine Notlösung. Sie ist die ehrlichste Architektur, wenn der Raum eine Wand gibt und keine Mitte.",
      statementNote:
        "Spüle, Herd und Fläche in einer Linie. Wege ohne Kreuzung. Höhe, wo Breite fehlt.",
      quote:
        "Wir haben die Insel gestrichen. Die Zeile mit Höhe hat den Raum gehalten.",
      quoteSource: "Aus einem Bestand in Landshut",
      closeTitle: "Eine Wand genügt.",
      closeText:
        "Bringen Sie den schmalen Raum mit — als Bild, als Maß. Ob Zeile oder etwas anderes, sagt das Aufmaß.",
      ledgerLine: "Die Zeile ist Form, nicht Verzicht.",
      lookTitle: "Linie, Höhe, Licht.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Zeile besprechen",
      film: ["Eine Wand", "Linie klar", "Höhe statt Breite", "Licht von vorne"],
      looks: ["Front, ruhig", "Platte, durchgehend", "Auszug, voll", "Nische, genutzt", "Griff, still", "Fuge"],
      facts: [
        { value: "Eine Wand", label: "der Arbeitsplatz" },
        { value: "Wege", label: "ohne Kreuzung" },
        { value: "Höhe", label: "wo Breite fehlt" },
        { value: "Aufmaß", label: "vor der Insel-Idee" },
      ],
      extras: [
        ["Schmaler Grundriss, Galerie, Apartment.", "Stauraum geht nach oben, nicht in die Tiefe des Raums."],
        ["Arbeitsdreieck in der Linie, nicht im Quadrat.", "Licht sitzt vor der Front, nicht nur darüber."],
        ["Wenig Fläche neben dem Kochfeld — das zeichnen wir ehrlich.", "Eine gedrängte U-Form ist kein Gewinn."],
      ],
    },
    "l-form": {
      title: "L-Form",
      emphasis: "zwei Schenkel.",
      statement:
        "Zwei Läufe, ein offener Winkel. Die L-Form trägt die Wohnküche, wenn die Ecke Arbeit bleibt und nicht zur Abstellkammer wird.",
      statementNote:
        "Offener als die U-Form, mehr Fläche als die Zeile. Der freie Schenkel hält den Blick ins Wohnen.",
      quote:
        "Die Ecke war das Problem. Als Arbeitszone gezeichnet, hat das L den Raum geöffnet.",
      quoteSource: "Aus einer Wohnküche in Freising",
      closeTitle: "Die Ecke muss arbeiten.",
      closeText:
        "Bilder vom Wohnen und vom Winkel. Im Gespräch klären wir, ob zwei Schenkel tragen — oder eine Zeile ehrlicher ist.",
      ledgerLine: "Das L ist offen, wenn die Ecke Arbeit bleibt.",
      lookTitle: "Winkel, Wege, Blick.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "L-Form klären",
      film: ["Zwei Schenkel", "Ecke als Arbeit", "Blick ins Wohnen", "Wege frei"],
      looks: ["Schenkel, klar", "Ecke, erreichbar", "Platte, durchgehend", "Auszug in der Ecke", "Licht von zwei Seiten", "Fuge"],
      facts: [
        { value: "Zwei", label: "Läufe, ein Winkel" },
        { value: "Ecke", label: "bleibt Arbeitszone" },
        { value: "Blick", label: "ins Wohnen" },
        { value: "Wege", label: "ohne Enge" },
      ],
      extras: [
        ["Wohnküche, freie Ecke, oft der erste ehrliche Plan.", "Der kurze Schenkel darf nicht zum Abstellraum werden."],
        ["Zwei Arbeitskanten. Die Ecke mit Auszug, nicht mit Totwinkel.", "Mehr Fläche als die Zeile, ohne drei Seiten zu schließen."],
        ["Offener als ein U, das den Raum zuschnürt.", "Der Weg um den Winkel muss bleiben."],
      ],
    },
    "u-form": {
      title: "U-Form",
      emphasis: "nur mit Breite.",
      statement:
        "Drei Seiten Stauraum sind ein Gewinn, wenn in der Mitte ein Weg bleibt. Sonst ist die U-Form ein enger Hof, kein Arbeitsplatz.",
      statementNote:
        "Kurze Wege zwischen Spüle und Herd. Breite und Tiefe zuerst. Eine Insel in der Mitte nur, wenn der Hof sie trägt.",
      quote:
        "Das U war der Wunsch. Die Breite hat entschieden, dass es ein L wird.",
      quoteSource: "Aus einem Aufmaß in Erding",
      closeTitle: "Zuerst die Breite.",
      closeText:
        "Ein Plan hilft hier mehr als ein Bild. Wir messen, ob drei Seiten tragen — bevor jemand eine U-Form bestellt.",
      ledgerLine: "Ein U ohne Weg ist ein Hof ohne Arbeit.",
      lookTitle: "Drei Seiten, ein Weg.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "U-Form klären",
      film: ["Drei Seiten", "Weg in der Mitte", "Kurze Wege", "Stauraum geschlossen"],
      looks: ["Schenkel, tief", "Mitte, frei", "Ecken, erreichbar", "Platte, umlaufend", "Licht, nicht höhlenartig", "Fuge"],
      facts: [
        { value: "Drei Seiten", label: "Stauraum" },
        { value: "Mitte", label: "muss Weg bleiben" },
        { value: "Breite", label: "entscheidet" },
        { value: "Wege", label: "Spüle zu Herd" },
      ],
      extras: [
        ["Braucht Breite und Tiefe, nicht nur den Wunsch nach Stauraum.", "Ein schmaler Hof macht die Form eng."],
        ["Geschlossener Arbeitsplatz, kurze Wege.", "Ecken mit Auszügen, sonst sind drei Seiten tot."],
        ["Ohne Weg in der Mitte wird gekocht im Gedränge.", "Manchmal ist das L die ehrlichere U-Form."],
      ],
    },
    offen: {
      title: "Offen",
      emphasis: "ins Wohnen.",
      statement:
        "Eine offene Küche dieser Klasse ist Möbel im Raum, keine Gerätewand hinter einer Theke. Blick, Dunst und Stauraum gehören in dieselbe Zeichnung.",
      statementNote:
        "Der Abzug darf die Sicht nicht verderben. Was offen steht, muss den Alltag aushalten — und den Blick vom Sofa.",
      quote:
        "Die Esse hätten wir gesehen. Deshalb sitzt der Abzug in der Platte.",
      quoteSource: "Aus einem offenen Neubau in München",
      closeTitle: "Der Blick gehört dazu.",
      closeText:
        "Bilder aus dem Wohnen, nicht nur aus der Küche. Dann zeichnen wir, was offen bleiben darf.",
      ledgerLine: "Offen heißt: der Raum sieht alles.",
      lookTitle: "Blick, Dunst, Möbel.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Offene Küche klären",
      film: ["Möbel im Raum", "Blick frei", "Dunst gezeichnet", "Wohnen daneben"],
      looks: ["Front zum Wohnen", "Abzug, unsichtbar", "Stauraum, geschlossen", "Licht aus dem Haus", "Kante als Möbel", "Fuge"],
      facts: [
        { value: "Blick", label: "vom Wohnen" },
        { value: "Dunst", label: "in der Zeichnung" },
        { value: "Möbel", label: "nicht Gerätewand" },
        { value: "Ordnung", label: "die man sieht" },
      ],
      extras: [
        ["Keine Tür, die den Alltag verbirgt.", "Was offen steht, gehört zum Haus, nicht zur Küchenzeile."],
        ["Abzug, Luft und Stauraum in einem Plan.", "Sichtachsen zuerst, Geräte danach."],
        ["Eine Gerätewand im Wohnen ist kein Möbel.", "Fronten, die den Blick aushalten."],
      ],
    },
    insel: {
      title: "Insel",
      emphasis: "nur mit Wegen.",
      statement:
        "Eine Insel in der Formwelt ist kein Möbel in der Mitte. Sie ist Wege, Kante und Anschluss — oder sie bleibt ungezeichnet.",
      statementNote:
        "Arbeitsfläche und Treffpunkt brauchen eine Kante. Nicht jeder Grundriss trägt sie. Manche Zeile ist ehrlicher.",
      quote:
        "Die Insel kam erst, als die Wege stimmten. Vorher war sie ein Wunsch, kein Raum.",
      quoteSource: "Aus einem Aufmaß in München",
      closeTitle: "Wege zuerst.",
      closeText:
        "Ob die Form eine Insel trägt, sagt das Aufmaß. Bringen Sie den Raum mit. Wir zeichnen sie — oder streichen sie.",
      ledgerLine: "Eine Insel ohne Wege ist ein Block im Raum.",
      lookTitle: "Platte, Kante, Wege.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Insel klären",
      film: ["Mitte des Raums", "Wege darum", "Kante zum Stehen", "Anschluss darunter"],
      looks: ["Platte, klar", "Überstand", "Beine frei", "Abzug gezeichnet", "Auszug unter der Fläche", "Fuge"],
      facts: [
        { value: "Wege", label: "rundherum" },
        { value: "Kante", label: "zum Stehen" },
        { value: "Technik", label: "unter der Platte" },
        { value: "Nicht jeder", label: "Grundriss trägt sie" },
      ],
      extras: [
        ["Rundherum gehen, nicht nur davor stehen.", "Ein Block in der Mitte erstickt den Raum."],
        ["Arbeit und Treffpunkt an einer Kante.", "Beide Rollen brauchen Maß, nicht nur ein Bild."],
        ["Manche Zeile mit Höhe ist die ehrlichere Mitte.", "Wir streichen Inseln, die der Raum nicht trägt."],
      ],
    },
    klein: {
      title: "Klein",
      emphasis: "im Millimeter.",
      statement:
        "Wo Rastermaße enden, beginnt die Zeile nach Maß. Nische, Apartment, Restfläche — Zentimeter entscheiden mehr als die Front.",
      statementNote:
        "Innenleben vor Ansicht. Jeder Auszug muss erreichbar sein. Höhe fängt, was die Breite nicht gibt.",
      quote:
        "Die ganze Küche war 2,40. Die Füllung an der Wand war der Auftrag.",
      quoteSource: "Aus einem Apartment in München",
      closeTitle: "Zentimeter zuerst.",
      closeText:
        "Ein Foto der Nische genügt. Wir messen, was das Raster nicht kann — und zeichnen nur, was erreichbar bleibt.",
      ledgerLine: "Kleine Küchen sind Maßarbeit, kein Kompromisskatalog.",
      lookTitle: "Nische, Auszug, Höhe.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Kleine Küche klären",
      film: ["Nische", "Höhe genutzt", "Auszug erreichbar", "Kein Raster"],
      looks: ["Millimeter an der Wand", "Innenleben zuerst", "Höhe statt Breite", "Licht in der Nische", "Öffnung, ehrlich", "Fuge"],
      facts: [
        { value: "Nische", label: "nicht Raster" },
        { value: "Höhe", label: "statt Breite" },
        { value: "Auszug", label: "muss erreichbar sein" },
        { value: "Maß", label: "an der alten Wand" },
      ],
      extras: [
        ["Apartment, Restfläche, Durchgangsküche.", "Das Raster endet am ersten Versatz der Wand."],
        ["Zentimeter in der Tiefe, bevor die Front feststeht.", "Was man nicht erreicht, ist toter Stauraum."],
        ["Jeder Auszug eine Entscheidung, nicht ein Füllstück.", "Obere Fächer nur, wenn sie nutzbar bleiben."],
      ],
    },
    modern: {
      title: "Modern",
      emphasis: "präzise, nicht kalt.",
      statement:
        "Modern bei BEER ist keine Jahresfarbe. Ruhige Flächen, klare Fugen, wenig Dekor — und Wärme aus Holz oder Stein, damit die Präzision den Alltag trägt.",
      statementNote:
        "Griffe, Licht und Auszüge entscheiden, ob die Ruhe hält. Kalt wird es nur, wenn das Material fehlt.",
      quote:
        "Die Front sollte in zehn Jahren noch selbstverständlich sein. Nicht nach dem Jahr, in dem sie lackiert wurde.",
      quoteSource: "Aus der Planung in der Ausstellung Wolfersdorf",
      closeTitle: "Das Haus, nicht das Jahr.",
      closeText:
        "Bilder aus dem Haus. Dann mustern wir Fläche, Fuge und den Stein, der die Moderne warm hält.",
      ledgerLine: "Modern heißt präzise. Nicht kalt.",
      lookTitle: "Fläche, Fuge, Wärme.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Haltung mustern",
      film: ["Ruhige Front", "Klare Fuge", "Holz gegen Stein", "Licht aus dem Haus"],
      looks: ["Lack, matt", "Fuge, präzise", "Griff, still", "Stein, Unikat", "Auszug, voll", "Licht"],
      facts: [
        { value: "Fläche", label: "wenig Dekor" },
        { value: "Fuge", label: "hält die Ruhe" },
        { value: "Wärme", label: "aus Holz oder Stein" },
        { value: "Alltag", label: "entscheidet die Haltung" },
      ],
      extras: [
        ["Keine Jahresfront. Kein Kostüm aus dem Lookbook.", "Die Linie bleibt, wenn Griffe und Licht stimmen."],
        ["Präzise Kanten, nicht kalter Glanz.", "Stein oder Holz gegen die ruhige Fläche."],
        ["Auszüge, die den Tag tragen, nicht nur die Ansicht.", "Licht von zwei Seiten, sonst wird matt schwer."],
      ],
    },
    landhaus: {
      title: "Landhaus",
      emphasis: "ohne Kostüm.",
      statement:
        "Landhaus bei BEER ist Holz und Rahmen, nicht Dekor. Das Haus gibt den Ton — der Altbau, der Dielenboden, der Stein — nicht ein Katalogstil.",
      statementNote:
        "Eine ruhige Platte hält die Rahmen zusammen. Kostüm bleibt im Prospekt.",
      quote:
        "Die Rahmen kamen vom Haus, nicht vom Landhaus-Programm.",
      quoteSource: "Aus einem Bestand östlich von Freising",
      closeTitle: "Das Haus gibt den Ton.",
      closeText:
        "Bilder vom Bestand, vom Boden, vom Licht. Dann mustern wir Holz und Rahmen — ohne Kostüm.",
      ledgerLine: "Landhaus heißt Material. Nicht Tracht.",
      lookTitle: "Holz, Rahmen, Stein.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Holz mustern",
      film: ["Rahmen, echt", "Holz, warm", "Stein dagegen", "Licht aus dem Haus"],
      looks: ["Rahmen, profiliert", "Maserung", "Platte, ruhig", "Griff, passend", "Fuge am Rahmen", "Öl, nicht Folie"],
      facts: [
        { value: "Holz", label: "und Rahmen" },
        { value: "Haus", label: "gibt den Ton" },
        { value: "Stein", label: "hält die Ruhe" },
        { value: "Kein", label: "Katalog-Landhaus" },
      ],
      extras: [
        ["Eiche, Rahmen, Wärme — ohne Zierleisten als Ausrede.", "Folie ist kein Landhaus."],
        ["Altbau oder neues Haus mit ehrlichem Holz.", "Der Stil folgt dem Raum, nicht dem Jahr."],
        ["Eine ruhige Platte bindet die Rahmen.", "Zu viel Profil wird Kostüm."],
      ],
    },
    design: {
      title: "Design",
      emphasis: "an der Kante.",
      statement:
        "Design ist hier keine Showküche. Klare Kanten, passende Geräte, Materialien, die man anfasst — nicht eine Fläche, die nur fotografiert werden will.",
      statementNote:
        "Was man berührt, zählt mehr als die Ansicht. Licht von zwei Seiten, sonst wird eine dunkle Fläche schwer.",
      quote:
        "Die Kante war das ganze Gespräch. Das Gerät kam danach.",
      quoteSource: "Aus einem Haus in München",
      closeTitle: "Anfassen vor dem Bild.",
      closeText:
        "Muster unter Tageslicht. Kante, Gerät, Licht. Die Showküche bleibt im Katalog.",
      ledgerLine: "Design ist Fuge und Griff. Nicht Bühne.",
      lookTitle: "Kante, Gerät, Licht.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Kante mustern",
      film: ["Kante klar", "Gerät passend", "Material zur Hand", "Licht von zwei Seiten"],
      looks: ["Kante, Stein", "Front, still", "Gerät, eingefügt", "Griff, reduziert", "Fuge", "Licht"],
      facts: [
        { value: "Kante", label: "vor der Show" },
        { value: "Gerät", label: "zur Aufgabe" },
        { value: "Hand", label: "vor der Ansicht" },
        { value: "Licht", label: "von zwei Seiten" },
      ],
      extras: [
        ["Keine Bühne. Eine Arbeitskante, die man täglich sieht.", "Geräte, die zur Nische passen, nicht zum Logo."],
        ["Haptik vor Fotografie.", "Stein, Lack, Holz — was die Hand bestätigt."],
        ["Dunkle Flächen brauchen Gegenlicht.", "Sonst wird Design schwer, nicht klar."],
      ],
    },
    holz: {
      title: "Holz",
      emphasis: "als Material.",
      statement:
        "Eiche, Nuss, Esche. Holz bei BEER ist kein Stilname. Schliff, Öl oder Lack entscheiden den Alltag — der Stein dagegen hält die Wärme ruhig.",
      statementNote:
        "Kein zweites Holz auf der Platte, wenn die Front schon spricht. Die Maserung will Licht, kein Hochglanz.",
      quote:
        "Die Front sollte altern dürfen. Deshalb Öl, nicht eine Folie, die Holz heißt.",
      quoteSource: "Aus der Werkstatt in Wolfersdorf",
      closeTitle: "Maserung unter Tageslicht.",
      closeText:
        "Muster neben Stein und Wand. Dann entscheiden Schliff und Öl — nicht ein Holz-Look aus dem Katalog.",
      ledgerLine: "Holz ist Material. Kein Programm.",
      lookTitle: "Maserung, Schliff, Stein.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Holz mustern",
      film: ["Eiche, geölt", "Nuss, ruhig", "Schliff, ehrlich", "Stein dagegen"],
      looks: ["Maserung, echt", "Öl, nicht Folie", "Kante, Holz", "Stein, Unikat", "Griff, still", "Licht"],
      facts: [
        { value: "Eiche", label: "Nuss, Esche" },
        { value: "Schliff", label: "Öl oder Lack" },
        { value: "Stein", label: "gegen das Holz" },
        { value: "Alltag", label: "sieht man in der Maserung" },
      ],
      extras: [
        ["Kein Stilname. Eine Holzart, ein Schliff, ein Öl.", "Furnier oder massiv — ehrlich benannt."],
        ["Die Oberfläche entscheidet Finger und Licht.", "Hochglanz auf Holz ist Kostüm."],
        ["Stein oder Keramik gegen die Front.", "Zwei Hölzer im selben Blick werden unruhig."],
      ],
    },
    purist: {
      title: "Puristisch",
      emphasis: "wenn die Öffnung sitzt.",
      statement:
        "Grifflos, flächig, zurückhaltend. Purismus trägt den Tag nur, wenn schwere Auszüge eine ehrliche Öffnung haben — Mulde oder Tipp, nicht ein Versprechen.",
      statementNote:
        "Die Linie bleibt ruhig. Stauraum und Licht müssen hinter der Ruhe stehen, sonst ist Purismus Pose.",
      quote:
        "Die Fläche war schön. Der Auszug hat entschieden, dass eine Mulde ehrlicher ist als Tipp-on.",
      quoteSource: "Aus einer Planung in Wolfersdorf",
      closeTitle: "Öffnung vor der Fläche.",
      closeText:
        "Schwere Türen anfassen, bevor die Front feststeht. Puristisch nur, wenn der Alltag die Linie hält.",
      ledgerLine: "Puristisch ist die Öffnung. Nicht die Pose.",
      lookTitle: "Fläche, Mulde, Auszug.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Öffnung klären",
      film: ["Fläche ruhig", "Mulde oder Tipp", "Auszug schwer", "Licht still"],
      looks: ["Front, flächig", "Mulde, ehrlich", "Tipp, wo er trägt", "Fuge, knapp", "Licht, indirekt", "Griff, keiner"],
      facts: [
        { value: "Fläche", label: "grifflos" },
        { value: "Öffnung", label: "Mulde oder Tipp" },
        { value: "Auszug", label: "schwer, ehrlich" },
        { value: "Licht", label: "hält die Ruhe" },
      ],
      extras: [
        ["Die Linie bleibt, wenn nichts stört.", "Kein Griff als Nachtrag, der die Fläche bricht."],
        ["Schwere Auszüge mögen eine Mulde.", "Tipp-on nur, wo das Gewicht es erlaubt."],
        ["Stauraum und Licht hinter der Ruhe.", "Sonst ist Purismus nur eine Fotografie."],
      ],
    },
    luxus: {
      title: "Luxus",
      emphasis: "als Maß und Stein.",
      statement:
        "Luxus bei BEER ist Passgenauigkeit und Stein, nicht Beschlag-Theater. Was man täglich nutzt, sitzt in der Arbeitszone — weniger Flächen, die sich zeigen wollen.",
      statementNote:
        "Der Preis folgt dem Aufmaß, dem Stein, der Zeit in der Werkstatt. Erstgespräch kostenlos. Die Küche nicht.",
      quote:
        "Das Teuerste war der Stein, der saß. Nicht der Griff, den man sieht.",
      quoteSource: "Aus einem Haus westlich von München",
      closeTitle: "Maß vor Theater.",
      closeText:
        "Bilder vom Raum, vom Stein, vom Alltag. Den Rest mustern wir in Wolfersdorf — ohne Showküche.",
      ledgerLine: "Luxus ist Millimeter. Nicht Beschlag.",
      lookTitle: "Stein, Maß, Stille.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Maß besprechen",
      film: ["Stein, Unikat", "Fuge, Maß", "Arbeitszone klar", "Weniger Theater"],
      looks: ["Stein, Aderung", "Front, still", "Griff, reduziert", "Fuge, knapp", "Gerät, eingefügt", "Licht"],
      facts: [
        { value: "Maß", label: "nicht Theater" },
        { value: "Stein", label: "als Unikat" },
        { value: "Alltag", label: "in der Arbeitszone" },
        { value: "Weniger", label: "Flächen, die posieren" },
      ],
      extras: [
        ["Passgenauigkeit an der Wand, nicht ein Logo auf der Front.", "Stein, den man mustert, nicht bestellt vom Bild."],
        ["Was täglich sitzt, sitzt in Griffhöhe.", "Show-Geräte außerhalb der Zone bleiben ungezeichnet."],
        ["Ruhe statt Fläche, die gesehen werden will.", "Das Erstgespräch ist kostenlos. Die Küche nicht."],
      ],
    },
    weiss: {
      title: "Weiß",
      emphasis: "nie nur weiß.",
      statement:
        "In einer Küche dieser Klasse ist Weiß Alltag, nicht Unschuld. Der Unterton entscheidet gegen Stein, Wand und das Licht aus dem Haus.",
      statementNote:
        "Matt, seidenmatt oder Struktur. Der Tag zeigt sich dort. Am Bildschirm kauft man Weiß zweimal.",
      quote:
        "Neben dem Stein war das Weiß plötzlich warm. Deshalb mustern wir an der Wand.",
      quoteSource: "Aus dem Materialgespräch in der Ausstellung",
      closeTitle: "Unter Tageslicht.",
      closeText:
        "Muster neben Wand und Stein. Weiß, das man nicht hält, kauft man neu.",
      ledgerLine: "Weiß, das man nicht mustert, kauft man zweimal.",
      lookTitle: "Unterton gegen Stein.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Weiß mustern",
      film: ["Unterton", "Gegen Stein", "Matt, nicht Glanz", "Wand zuerst"],
      looks: ["Matt, ruhig", "Seide, Licht", "Struktur, Hand", "Stein daneben", "Fuge, hell", "Griff, still"],
      facts: [
        { value: "Unterton", label: "gegen Stein" },
        { value: "Matt", label: "nicht Hochglanz" },
        { value: "Wand", label: "zuerst" },
        { value: "Muster", label: "unter Tageslicht" },
      ],
      toneLine: "Weiß ist nie nur weiß. Der Unterton entscheidet gegen Stein.",
      extras: [
        ["Warm oder kühl — das sagt der Stein, nicht der Bildschirm.", "Neben der Wand, bevor die Front feststeht."],
        ["Matt hält den Alltag. Hochglanz will Polieren.", "Struktur, wo Finger stören würden."],
        ["Kein Weiß ohne Muster an der Wand.", "Licht ändert den Ton zwischen Morgen und Abend."],
      ],
    },
    schwarz: {
      title: "Schwarz",
      emphasis: "mit Gegengewicht.",
      statement:
        "Schwarz braucht Tageslicht oder gezieltes Licht — und Holz oder Stein, sonst wird die Fläche schwer. Finger und Staub sieht man. Die Öffnung muss dazu passen.",
      statementNote:
        "Ein Gegengewicht hält die Nacht ruhig. Reines Schwarz ohne Material daneben ist Theater.",
      quote:
        "Ohne die Eiche wäre das Schwarz ein Loch. Mit ihr ist es eine Fläche.",
      quoteSource: "Aus einem Haus in München",
      closeTitle: "Licht und Holz daneben.",
      closeText:
        "Muster unter Tageslicht, neben Holz und Stein. Schwarz ohne Gegengewicht zeichnen wir selten.",
      ledgerLine: "Schwarz ohne Gegengewicht wird schwer.",
      lookTitle: "Licht, Holz, Öffnung.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Schwarz mustern",
      film: ["Schwarz, mit Licht", "Holz daneben", "Stein, Aderung", "Öffnung klar"],
      looks: ["Front, tief", "Holz, warm", "Stein, hell", "Griff, still", "Staub, ehrlich", "Licht"],
      facts: [
        { value: "Licht", label: "oder es wird schwer" },
        { value: "Holz", label: "oder Stein daneben" },
        { value: "Finger", label: "sieht man" },
        { value: "Öffnung", label: "muss passen" },
      ],
      toneLine: "Schwarz braucht Licht — und ein Gegengewicht aus Holz oder Stein.",
      extras: [
        ["Tageslicht oder gezieltes Licht. Sonst ein Loch.", "Offene Räume tragen Schwarz besser als dunkle Nischen."],
        ["Eiche, Nuss oder ein heller Stein.", "Ohne Gegengewicht bleibt nur Theater."],
        ["Mulde oder Griff, der zum Staub passt.", "Hochglanz-Schwarz poliert man. Matt hält ruhiger."],
      ],
    },
    salbei: {
      title: "Salbei",
      emphasis: "zwischen den Welten.",
      statement:
        "Salbei liegt zwischen Landhaus und Moderne. Nicht jedes Grün ist dieser Ton. Lack, nicht Folie — und der Stein hält die Farbe ruhig.",
      statementNote:
        "Neben Wand und Boden mustern, bevor die Front feststeht. Salbei am Bildschirm ist ein anderes Grün.",
      quote:
        "An der Wand war es Landhaus. Neben dem Stein war es modern. Deshalb der Mustertermin.",
      quoteSource: "Aus der Ausstellung Wolfersdorf",
      closeTitle: "Den Ton an der Wand.",
      closeText:
        "Salbei neben Putz, Holz und Stein. Erst dann ist es eine Farbe, kein Name.",
      ledgerLine: "Salbei ist ein Unterton. Kein Modegrün.",
      lookTitle: "Lack, Stein, Wand.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Salbei mustern",
      film: ["Salbei, gemustert", "Neben der Wand", "Stein hält ruhig", "Lack, nicht Folie"],
      looks: ["Lack, seidenmatt", "Unterton, grün", "Stein, warm", "Holz daneben", "Fuge", "Licht"],
      facts: [
        { value: "Zwischen", label: "Landhaus und Moderne" },
        { value: "Lack", label: "nicht Folie" },
        { value: "Stein", label: "hält den Ton" },
        { value: "Wand", label: "zuerst" },
      ],
      toneLine: "Nicht jedes Grün ist Salbei. Den Ton mustern wir an der Wand.",
      extras: [
        ["Ein Unterton, kein Dekorgrün.", "Zu gelb, zu grau — das sieht man nur am Muster."],
        ["Lack trägt den Ton. Folie macht ihn billig.", "Der Stein daneben entscheidet, ob Salbei ruht."],
        ["Putz, Boden, Licht — alles ändert den Grün.", "Ohne Mustertermin bleibt es ein Name."],
      ],
    },
    grau: {
      title: "Grau",
      emphasis: "als Entscheidung.",
      statement:
        "Grau ist Ruhe, nicht der Kompromiss zwischen Weiß und Schwarz. Warm oder kühl — das sagt der Stein, nicht die Stimmung.",
      statementNote:
        "Gegen eine weiße Wand bleibt die Küche klar. Grau am Bildschirm ist ein anderes Grau im Haus.",
      quote:
        "Wir wollten kein Weiß. Grau war die Entscheidung, nicht die Vermeidung.",
      quoteSource: "Aus einem Neubau in Erding",
      closeTitle: "Warm oder kühl.",
      closeText:
        "Stein und Licht legen den Ton fest. Mustern Sie Grau, bevor es zur Ausrede wird.",
      ledgerLine: "Grau ist eine Entscheidung. Kein Mittelweg.",
      lookTitle: "Ton gegen Stein.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Grau mustern",
      film: ["Grau, entschieden", "Warm oder kühl", "Gegen die Wand", "Stein daneben"],
      looks: ["Matt, ruhig", "Unterton, warm", "Unterton, kühl", "Stein, Aderung", "Fuge", "Griff"],
      facts: [
        { value: "Ruhe", label: "nicht Kompromiss" },
        { value: "Warm", label: "oder kühl" },
        { value: "Stein", label: "legt den Ton fest" },
        { value: "Wand", label: "hält es klar" },
      ],
      toneLine: "Grau als Ruhe, nicht als Kompromiss zwischen Weiß und Schwarz.",
      extras: [
        ["Der Stein sagt warm oder kühl.", "Ein Modegrau ohne Unterton wird unruhig."],
        ["Keine Vermeidung von Weiß und Schwarz.", "Eine Haltung, die zum Haus gehört."],
        ["Gegen Weiß bleibt die Küche eine Fläche.", "Gegen Putz muss der Unterton stimmen."],
      ],
    },
    kochinsel: {
      title: "Kochinsel",
      emphasis: "mit Anschluss.",
      statement:
        "Herd und oft Abzug in der Mitte des Raums. Eine Kochinsel dieser Klasse ist Technik unter der Platte, Wege rundherum — und Dunst, der in der Zeichnung sitzt, nicht hinterher.",
      statementNote:
        "Arbeiten von allen Seiten. Fehlt der Anschluss oder der Weg, bleibt sie ungezeichnet.",
      quote:
        "Der Abzug in der Esse hätte den Blick genommen. Deshalb sitzt er in der Platte — und der Anschluss war der ganze Plan.",
      quoteSource: "Aus einem offenen Haus in München",
      closeTitle: "Technik zuerst.",
      closeText:
        "Strom, Luft, Wasser, Weg. Bringen Sie den Raum mit. Die Kochinsel kommt, wenn das trägt.",
      ledgerLine: "Eine Kochinsel ohne Anschluss ist ein Herd im Weg.",
      lookTitle: "Herd, Abzug, Wege.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Kochinsel klären",
      film: ["Herd in der Mitte", "Abzug in der Platte", "Wege rundherum", "Anschluss darunter"],
      looks: ["Kochfeld, frei", "Abzug, gezeichnet", "Kabel im Korpus", "Wege, offen", "Platte, hitzeehrlich", "Fuge"],
      facts: [
        { value: "Herd", label: "in der Mitte" },
        { value: "Abzug", label: "in der Zeichnung" },
        { value: "Wege", label: "von allen Seiten" },
        { value: "Anschluss", label: "unter der Platte" },
      ],
      extras: [
        ["Korpus, Kabel, Luft — bevor das Kochfeld gewählt wird.", "Eine Esse im offenen Raum ist oft der falsche Blick."],
        ["Rundherum stehen, nicht nur von einer Seite kochen.", "Der Weg darf den Koch nicht einschließen."],
        ["Dunst gehört ins Aufmaß.", "Nachträglich ist er teuer und falsch."],
      ],
    },
    arbeitsinsel: {
      title: "Arbeitsinsel",
      emphasis: "ohne Kochfeld.",
      statement:
        "Reine Fläche zum Vorbereiten. Kein Herd, dafür Auszüge unter der Platte — und eine Sitzkante nur, wenn der Weg bleibt.",
      statementNote:
        "Arbeitsfläche und Sitzfläche sind nicht dieselbe Höhe. Wer beides will, zeichnet zwei Kanten.",
      quote:
        "Wir wollten kochen in der Mitte. Der Raum wollte ablegen. Die Arbeitsinsel war ehrlicher.",
      quoteSource: "Aus einem Aufmaß in Freising",
      closeTitle: "Fläche, nicht Herd.",
      closeText:
        "Ob die Mitte Arbeit oder Feuer trägt, sagt der Grundriss. Wir zeichnen die ehrlichere.",
      ledgerLine: "Eine Arbeitsinsel ist Fläche. Kein verkleinerter Herd.",
      lookTitle: "Fläche, Auszug, Höhe.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Arbeitsinsel klären",
      film: ["Reine Fläche", "Auszüge darunter", "Sitzkante, wenn der Weg bleibt", "Höhe getrennt"],
      looks: ["Platte, frei", "Auszug, voll", "Überstand, ehrlich", "Beine, frei", "Keine Mulde für den Herd", "Fuge"],
      facts: [
        { value: "Kein Herd", label: "reine Fläche" },
        { value: "Auszüge", label: "unter der Platte" },
        { value: "Sitzkante", label: "nur mit Weg" },
        { value: "Höhe", label: "Arbeit ist nicht Sitzen" },
      ],
      extras: [
        ["Vorbereiten und ablegen. Feuer bleibt an der Zeile.", "Weniger Technik, mehr Fläche."],
        ["Stauraum, den man von zwei Seiten erreicht.", "Sitzkante nur, wenn niemand im Arbeitsweg sitzt."],
        ["Zwei Höhen, wenn gekocht und gesessen wird.", "Eine Höhe für beides ist ein Kompromiss am Rücken."],
      ],
    },
    essinsel: {
      title: "Essinsel",
      emphasis: "mit Beinen frei.",
      statement:
        "Kochen und sitzen an einer Kante. Der Überstand trägt die Knie. Steckdosen, Abstand zur Arbeitszone — wer sitzt, sitzt im Weg des Kochens. Das wird gezeichnet.",
      statementNote:
        "Beinfreiheit ist Maß, nicht ein Hocker am Block. Fehlt sie, bleibt die Essinsel ungezeichnet.",
      quote:
        "Vier sitzen an der Insel. Der Koch braucht trotzdem einen Weg. Deshalb der Überstand — und der Abstand.",
      quoteSource: "Aus einem Haus in Erding",
      closeTitle: "Knie und Weg.",
      closeText:
        "Wie viele sitzen, wer kocht, welcher Weg bleibt. Dann zeichnen wir die Kante — oder trennen Tisch und Insel.",
      ledgerLine: "Eine Essinsel ohne Knie ist eine Theke.",
      lookTitle: "Überstand, Knie, Abstand.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Sitzkante klären",
      film: ["Überstand", "Beine frei", "Abstand zur Arbeit", "Steckdosen in der Kante"],
      looks: ["Kante, dick genug", "Knie, frei", "Hocker, ehrlich", "Steckdose, unsichtbar", "Weg, offen", "Platte, durchgehend"],
      facts: [
        { value: "Überstand", label: "trägt die Knie" },
        { value: "Abstand", label: "zur Arbeitszone" },
        { value: "Steckdosen", label: "in der Kante" },
        { value: "Weg", label: "trotz der Sitzenden" },
      ],
      extras: [
        ["Eine Kante, zwei Rollen. Maß für beide.", "Zu wenig Überstand ist eine Theke, kein Sitz."],
        ["Beinfreiheit, Steckdosen, Abstand.", "Wer sitzt, darf den Koch nicht sperren."],
        ["Das wird im Grundriss entschieden, nicht am Hocker.", "Manchmal ist ein Tisch ehrlicher als die Inselkante."],
      ],
    },
    grifflos: {
      title: "Grifflos",
      emphasis: "mit ehrlicher Öffnung.",
      statement:
        "Ruhige Fronten, Öffnung über Mulde oder Tipp-on. Grifflos zeigt Finger eher — und Ordnung besser. Schwere Auszüge mögen eine Mulde mehr als einen Tipper.",
      statementNote:
        "Die Fläche bleibt, wenn die Öffnung den Alltag trägt. Ein Griff als Nachtrag bricht sie.",
      quote:
        "Tipp-on an den schweren Auszügen hat nicht gehalten. Die Mulde war die ehrlichere Ruhe.",
      quoteSource: "Aus einer Planung in Wolfersdorf",
      closeTitle: "Öffnung mustern.",
      closeText:
        "Schwere Türen in der Ausstellung anfassen. Grifflos nur, wenn die Öffnung den Tag hält.",
      ledgerLine: "Grifflos ist die Öffnung. Nicht das Fehlen eines Griffs.",
      lookTitle: "Fläche, Mulde, Finger.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Öffnung klären",
      film: ["Fläche ruhig", "Mulde", "Tipp, wo er trägt", "Finger, ehrlich"],
      looks: ["Front, flächig", "Mulde, durchgehend", "Tipp, leicht", "Fuge, knapp", "Ordnung, sichtbar", "Licht"],
      facts: [
        { value: "Fläche", label: "ohne Griff" },
        { value: "Mulde", label: "für schwere Auszüge" },
        { value: "Tipp", label: "nur wo er trägt" },
        { value: "Finger", label: "sieht man" },
      ],
      extras: [
        ["Eine ruhige Fläche, die den Blick hält.", "Kein Griff, der nachträglich die Linie bricht."],
        ["Gewicht entscheidet Mulde oder Tipp.", "Schränke, die man stündlich öffnet, lügen nicht."],
        ["Ordnung wird sichtbarer. Finger auch.", "Matt und Fenix, wo Abdrücke stören würden."],
      ],
    },
    "nach-mass": {
      title: "Nach Maß",
      emphasis: "an der Wand.",
      statement:
        "Nicht das Raster, der Raum. Nische, Schräge, alte Wand — Millimeter an der Füllung, nicht eine Blende als Ausrede. Die Zeichnung folgt dem Aufmaß, bevor die Front feststeht.",
      statementNote:
        "Wo Standardzeilen enden, beginnt die Werkstatt. Jede Füllung ist Auftrag, nicht Rest.",
      quote:
        "Die Füllung an der alten Wand war der ganze Auftrag. Die Front kam danach.",
      quoteSource: "Aus einem Bestand in Freising",
      closeTitle: "Der Raum ist die Zeichnung.",
      closeText:
        "Nische, Schräge, Höhe. Bringen Sie den Raum mit — als Bild, als Maß. Den Rest zeichnen wir.",
      ledgerLine: "Wo das Raster endet, beginnt die Werkstatt.",
      lookTitle: "Nische, Füllung, Millimeter.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Maß klären",
      film: ["Alte Wand", "Nische", "Füllung auf Millimeter", "Kein Raster"],
      looks: ["Füllung, passgenau", "Schräge, gezeichnet", "Nische, genutzt", "Blende, keine Ausrede", "Aufmaß, zuerst", "Fuge"],
      facts: [
        { value: "Raum", label: "nicht Raster" },
        { value: "Millimeter", label: "an der Wand" },
        { value: "Füllung", label: "ist der Auftrag" },
        { value: "Aufmaß", label: "vor der Front" },
      ],
      extras: [
        ["Bestand, Versatz, Schräge. Das Raster lügt dort.", "Jedes Haus bringt seine Wand mit."],
        ["Keine Blende, die den Millimeter versteckt.", "Füllung als Möbel, nicht als Reststück."],
        ["Zeichnung nach dem Maß, nicht nach dem Katalog.", "Die Front folgt, wenn die Wand sitzt."],
      ],
    },
    raumhoch: {
      title: "Raumhoch",
      emphasis: "ohne Staubkante.",
      statement:
        "Stauraum bis zur Decke, ohne ein Brett, auf dem Staub liegt. Obere Fächer bleiben nutzbar — oder sie sind seltenes Gut. Decke, Wand und Front müssen zusammenpassen.",
      statementNote:
        "Höhe ohne Erreichbarkeit ist Volumen, kein Stauraum. Tritt, Leiter, interne Aufteilung — das gehört in die Zeichnung.",
      quote:
        "Bis zur Decke, ja. Aber die oberen Fächer nur für das, was selten kommt. Der Alltag sitzt darunter.",
      quoteSource: "Aus einem Neubau mit hoher Decke",
      closeTitle: "Höhe, die man erreicht.",
      closeText:
        "Lichte Höhe, was oben lagern soll, wie Sie hinaufkommen. Dann zeichnen wir raumhoch — oder eine ehrliche Kranzkante.",
      ledgerLine: "Raumhoch ohne Erreichbarkeit ist eine Staubkante mit Tür.",
      lookTitle: "Decke, Fuge, Griffhöhe.",
      indexEyebrow: "Drei Punkte",
      ctaLabel: "Höhe klären",
      film: ["Bis zur Decke", "Keine Staubkante", "Oben erreichbar", "Fuge zur Decke"],
      looks: ["Front, hoch", "Fuge, Decke", "Obere Fächer, ehrlich", "Griffhöhe, Alltag", "Licht oben", "Auftritt, geplant"],
      facts: [
        { value: "Decke", label: "ohne Staubkante" },
        { value: "Oben", label: "muss nutzbar bleiben" },
        { value: "Fuge", label: "Decke, Wand, Front" },
        { value: "Alltag", label: "sitzt in Griffhöhe" },
      ],
      extras: [
        ["Kein Brett, auf dem Staub liegt.", "Die Fuge zur Decke ist Maß, nicht Silikon."],
        ["Seltenes Gut oben, Alltag darunter.", "Eine Leiter im Plan, oder die Fächer bleiben leer."],
        ["Decke, Wand und Front in einer Linie.", "Versatz an der Decke wird gezeichnet, nicht verkleidet."],
      ],
    },
  },
  en: {
    zeile: {
      title: "Galley",
      emphasis: "on one wall.",
      statement:
        "A galley of this class is not a fallback. It is the honest architecture when the room gives a wall and no centre.",
      statementNote:
        "Sink, hob and worktop in a line. Paths without crossing. Height where width is missing.",
      quote:
        "We struck the island out. The run with height held the room.",
      quoteSource: "From an existing house in Landshut",
      closeTitle: "One wall is enough.",
      closeText:
        "Bring the narrow room — as a picture, as a measure. Whether a galley or something else is for the survey to say.",
      ledgerLine: "A galley is a layout, not a sacrifice.",
      lookTitle: "Line, height, light.",
      indexEyebrow: "Three points",
      ctaLabel: "Talk about a galley",
      film: ["One wall", "A clear line", "Height not width", "Light from the front"],
      looks: ["Front, quiet", "Top, unbroken", "Drawer, full", "Niche, used", "Handle, quiet", "Joint"],
      facts: [
        { value: "One wall", label: "the workplace" },
        { value: "Paths", label: "without crossing" },
        { value: "Height", label: "where width is missing" },
        { value: "Survey", label: "before an island idea" },
      ],
      extras: [
        ["A narrow plan, a gallery, an apartment.", "Store goes up, not into the depth of the room."],
        ["The work triangle in a line, not a square.", "Light sits in front of the face, not only above it."],
        ["Little space beside the hob — we draw that honestly.", "A cramped U is not a gain."],
      ],
    },
    "l-form": {
      title: "L-shape",
      emphasis: "two runs.",
      statement:
        "Two runs, an open angle. The L carries a living kitchen when the corner stays work and does not become a dump.",
      statementNote:
        "More open than a U, more surface than a galley. The free run holds the view into living.",
      quote:
        "The corner was the problem. Drawn as a work zone, the L opened the room.",
      quoteSource: "From a living kitchen in Freising",
      closeTitle: "The corner has to work.",
      closeText:
        "Pictures of the living room and the angle. In conversation we settle whether two runs will carry — or a galley is honester.",
      ledgerLine: "An L is open when the corner stays work.",
      lookTitle: "Angle, paths, view.",
      indexEyebrow: "Three points",
      ctaLabel: "Settle the L",
      film: ["Two runs", "Corner as work", "View into living", "Paths clear"],
      looks: ["Run, clear", "Corner, reachable", "Top, unbroken", "Drawer in the corner", "Light from two sides", "Joint"],
      facts: [
        { value: "Two", label: "runs, one angle" },
        { value: "Corner", label: "stays a work zone" },
        { value: "View", label: "into living" },
        { value: "Paths", label: "without tightness" },
      ],
      extras: [
        ["Living kitchen, a free corner, often the first honest plan.", "The short run must not become storage."],
        ["Two work edges. A drawer in the corner, not a dead angle.", "More surface than a galley, without closing three sides."],
        ["More open than a U that cinches the room.", "The path around the angle has to remain."],
      ],
    },
    "u-form": {
      title: "U-shape",
      emphasis: "only with width.",
      statement:
        "Store on three sides is a gain if a path remains in the middle. Otherwise the U is a tight court, not a workplace.",
      statementNote:
        "Short paths between sink and hob. Width and depth first. An island in the middle only if the court will carry it.",
      quote:
        "The U was the wish. The width decided it would be an L.",
      quoteSource: "From a survey in Erding",
      closeTitle: "Width first.",
      closeText:
        "A plan helps here more than a picture. We measure whether three sides will carry — before anyone orders a U.",
      ledgerLine: "A U without a path is a court without work.",
      lookTitle: "Three sides, one path.",
      indexEyebrow: "Three points",
      ctaLabel: "Settle the U",
      film: ["Three sides", "A path in the middle", "Short routes", "Store closed round"],
      looks: ["Run, deep", "Middle, free", "Corners, reachable", "Top, around", "Light, not a cave", "Joint"],
      facts: [
        { value: "Three sides", label: "of store" },
        { value: "Middle", label: "must stay a path" },
        { value: "Width", label: "decides" },
        { value: "Paths", label: "sink to hob" },
      ],
      extras: [
        ["Needs width and depth, not only a wish for store.", "A narrow court makes the form tight."],
        ["A closed workplace, short paths.", "Drawers in the corners, or three sides are dead."],
        ["Without a path in the middle you cook in a crush.", "Sometimes the L is the honester U."],
      ],
    },
    offen: {
      title: "Open",
      emphasis: "into living.",
      statement:
        "An open kitchen of this class is furniture in the room, not an appliance wall behind a counter. View, extraction and store belong in the same drawing.",
      statementNote:
        "The hood must not spoil the view. What stands open has to bear the day — and the view from the sofa.",
      quote:
        "We would have seen the hood. That is why extraction sits in the top.",
      quoteSource: "From an open new build in Munich",
      closeTitle: "The view belongs in it.",
      closeText:
        "Pictures from living, not only from the kitchen. Then we draw what may stay open.",
      ledgerLine: "Open means the room sees everything.",
      lookTitle: "View, extraction, furniture.",
      indexEyebrow: "Three points",
      ctaLabel: "Settle an open kitchen",
      film: ["Furniture in the room", "View clear", "Extraction drawn", "Living beside it"],
      looks: ["Front to living", "Extraction, unseen", "Store, closed", "Light from the house", "Edge as furniture", "Joint"],
      facts: [
        { value: "View", label: "from living" },
        { value: "Extraction", label: "in the drawing" },
        { value: "Furniture", label: "not an appliance wall" },
        { value: "Order", label: "that you see" },
      ],
      extras: [
        ["No door to hide the day.", "What stands open belongs to the house, not to a run."],
        ["Extraction, air and store in one plan.", "Sightlines first, appliances after."],
        ["An appliance wall in living is not furniture.", "Fronts that will bear the gaze."],
      ],
    },
    insel: {
      title: "Island",
      emphasis: "only with paths.",
      statement:
        "An island in this world of layouts is not a piece of furniture in the middle. It is paths, an edge and a feed — or it stays undrawn.",
      statementNote:
        "Worktop and meeting point need an edge. Not every plan will carry it. A galley is sometimes honester.",
      quote:
        "The island came only when the paths were right. Before that it was a wish, not a room.",
      quoteSource: "From a survey in Munich",
      closeTitle: "Paths first.",
      closeText:
        "Whether the layout will carry an island is for the survey. Bring the room. We draw it — or strike it out.",
      ledgerLine: "An island without paths is a block in the room.",
      lookTitle: "Top, edge, paths.",
      indexEyebrow: "Three points",
      ctaLabel: "Settle the island",
      film: ["Centre of the room", "Paths around", "An edge to stand at", "Services under"],
      looks: ["Top, clear", "Overhang", "Knee room", "Extraction drawn", "Drawer under the top", "Joint"],
      facts: [
        { value: "Paths", label: "all around" },
        { value: "Edge", label: "to stand at" },
        { value: "Kit", label: "under the top" },
        { value: "Not every", label: "plan will carry it" },
      ],
      extras: [
        ["Walk around it, do not only stand in front.", "A block in the middle chokes the room."],
        ["Work and meeting at one edge.", "Both roles need measure, not only a picture."],
        ["A galley with height is sometimes the honester centre.", "We strike islands the room will not carry."],
      ],
    },
    klein: {
      title: "Small",
      emphasis: "to the millimetre.",
      statement:
        "Where grid sizes end, the made-to-measure run begins. Niche, apartment, leftover space — centimetres decide more than the front.",
      statementNote:
        "Interiors before the view. Every drawer must be reachable. Height catches what width will not give.",
      quote:
        "The whole kitchen was 2.40. The fill against the wall was the commission.",
      quoteSource: "From an apartment in Munich",
      closeTitle: "Centimetres first.",
      closeText:
        "A photograph of the niche is enough. We measure what the grid cannot — and draw only what stays reachable.",
      ledgerLine: "Small kitchens are made to measure, not a compromise catalogue.",
      lookTitle: "Niche, drawer, height.",
      indexEyebrow: "Three points",
      ctaLabel: "Settle a small kitchen",
      film: ["Niche", "Height used", "Drawer reachable", "No grid"],
      looks: ["Millimetre at the wall", "Interiors first", "Height not width", "Light in the niche", "Opening, honest", "Joint"],
      facts: [
        { value: "Niche", label: "not a grid" },
        { value: "Height", label: "not width" },
        { value: "Drawer", label: "must be reachable" },
        { value: "Measure", label: "at the old wall" },
      ],
      extras: [
        ["Apartment, leftover, a passage kitchen.", "The grid ends at the first jog in the wall."],
        ["Centimetres in depth before the front is fixed.", "What you cannot reach is dead store."],
        ["Every drawer a decision, not a filler.", "Upper cupboards only if they stay usable."],
      ],
    },
    modern: {
      title: "Modern",
      emphasis: "precise, not cold.",
      statement:
        "Modern at BEER is not a year's colour. Quiet faces, clear joints, little décor — and warmth from wood or stone so the precision will carry the day.",
      statementNote:
        "Handles, light and drawers decide whether the calm holds. It turns cold only when the material is missing.",
      quote:
        "The front should still feel inevitable in ten years. Not like the year it was lacquered.",
      quoteSource: "From planning in the Wolfersdorf showroom",
      closeTitle: "The house, not the year.",
      closeText:
        "Pictures from the house. Then we sample face, joint and the stone that keeps modern warm.",
      ledgerLine: "Modern means precise. Not cold.",
      lookTitle: "Face, joint, warmth.",
      indexEyebrow: "Three points",
      ctaLabel: "Sample a stance",
      film: ["Quiet front", "Clear joint", "Wood against stone", "Light from the house"],
      looks: ["Lacquer, matt", "Joint, precise", "Handle, quiet", "Stone, one-off", "Drawer, full", "Light"],
      facts: [
        { value: "Face", label: "little décor" },
        { value: "Joint", label: "holds the calm" },
        { value: "Warmth", label: "from wood or stone" },
        { value: "The day", label: "decides the stance" },
      ],
      extras: [
        ["No year's front. No costume from a lookbook.", "The line holds if handles and light are right."],
        ["Precise edges, not cold gloss.", "Stone or wood against the quiet face."],
        ["Drawers that carry the day, not only the view.", "Light from two sides, or matt grows heavy."],
      ],
    },
    landhaus: {
      title: "Country",
      emphasis: "without costume.",
      statement:
        "Country at BEER is wood and frame, not décor. The house sets the tone — the old build, the boards, the stone — not a catalogue style.",
      statementNote:
        "A quiet top holds the frames together. Costume stays in the brochure.",
      quote:
        "The frames came from the house, not from a country programme.",
      quoteSource: "From an existing house east of Freising",
      closeTitle: "The house sets the tone.",
      closeText:
        "Pictures of the existing house, the floor, the light. Then we sample wood and frame — without costume.",
      ledgerLine: "Country means material. Not costume.",
      lookTitle: "Wood, frame, stone.",
      indexEyebrow: "Three points",
      ctaLabel: "Sample the wood",
      film: ["Frame, true", "Wood, warm", "Stone against it", "Light from the house"],
      looks: ["Frame, profiled", "Grain", "Top, quiet", "Handle, fitting", "Joint at the frame", "Oil, not foil"],
      facts: [
        { value: "Wood", label: "and frame" },
        { value: "House", label: "sets the tone" },
        { value: "Stone", label: "holds the calm" },
        { value: "No", label: "catalogue country" },
      ],
      extras: [
        ["Oak, frame, warmth — without mouldings as an excuse.", "Foil is not country."],
        ["An old house, or a new one with honest wood.", "The stance follows the room, not the year."],
        ["A quiet top binds the frames.", "Too much profile becomes costume."],
      ],
    },
    design: {
      title: "Design",
      emphasis: "at the edge.",
      statement:
        "Design here is not a show kitchen. Clear edges, fitting appliances, materials you touch — not a face that only wants to be photographed.",
      statementNote:
        "What you touch counts more than the view. Light from two sides, or a dark face grows heavy.",
      quote:
        "The edge was the whole conversation. The appliance came after.",
      quoteSource: "From a house in Munich",
      closeTitle: "Touch before the picture.",
      closeText:
        "Samples in daylight. Edge, appliance, light. The show kitchen stays in the catalogue.",
      ledgerLine: "Design is joint and handle. Not a stage.",
      lookTitle: "Edge, kit, light.",
      indexEyebrow: "Three points",
      ctaLabel: "Sample an edge",
      film: ["Edge, clear", "Kit, fitting", "Material to the hand", "Light from two sides"],
      looks: ["Edge, stone", "Front, quiet", "Appliance, set in", "Handle, reduced", "Joint", "Light"],
      facts: [
        { value: "Edge", label: "before the show" },
        { value: "Kit", label: "to the task" },
        { value: "Hand", label: "before the view" },
        { value: "Light", label: "from two sides" },
      ],
      extras: [
        ["No stage. A work edge you see every day.", "Appliances that fit the niche, not the logo."],
        ["Touch before photography.", "Stone, lacquer, wood — what the hand confirms."],
        ["Dark faces need counter-light.", "Otherwise design grows heavy, not clear."],
      ],
    },
    holz: {
      title: "Wood",
      emphasis: "as material.",
      statement:
        "Oak, walnut, ash. Wood at BEER is not a style name. Cut, oil or lacquer decide the day — stone against it keeps the warmth quiet.",
      statementNote:
        "Not a second wood on the top if the front already speaks. Grain wants light, not gloss.",
      quote:
        "The front should be allowed to age. That is why oil, not a foil that calls itself wood.",
      quoteSource: "From the workshop in Wolfersdorf",
      closeTitle: "Grain in daylight.",
      closeText:
        "Samples next to stone and wall. Then cut and oil decide — not a wood look from a catalogue.",
      ledgerLine: "Wood is material. Not a programme.",
      lookTitle: "Grain, cut, stone.",
      indexEyebrow: "Three points",
      ctaLabel: "Sample the wood",
      film: ["Oak, oiled", "Walnut, quiet", "Cut, honest", "Stone against it"],
      looks: ["Grain, true", "Oil, not foil", "Edge, wood", "Stone, one-off", "Handle, quiet", "Light"],
      facts: [
        { value: "Oak", label: "walnut, ash" },
        { value: "Cut", label: "oil or lacquer" },
        { value: "Stone", label: "against the wood" },
        { value: "The day", label: "shows in the grain" },
      ],
      extras: [
        ["Not a style name. A species, a cut, an oil.", "Veneer or solid — named honestly."],
        ["The surface decides fingers and light.", "Gloss on wood is costume."],
        ["Stone or ceramic against the front.", "Two woods in the same view grow restless."],
      ],
    },
    purist: {
      title: "Purist",
      emphasis: "if the opening sits.",
      statement:
        "Handleless, flush, reserved. Purism carries the day only if heavy drawers have an honest opening — a channel or a tip, not a promise.",
      statementNote:
        "The line stays quiet. Store and light have to stand behind the calm, or purism is a pose.",
      quote:
        "The face was beautiful. The drawer decided a channel was honester than tip-on.",
      quoteSource: "From a planning in Wolfersdorf",
      closeTitle: "Opening before the face.",
      closeText:
        "Touch heavy doors before the front is fixed. Purist only if the day will hold the line.",
      ledgerLine: "Purist is the opening. Not the pose.",
      lookTitle: "Face, channel, drawer.",
      indexEyebrow: "Three points",
      ctaLabel: "Settle the opening",
      film: ["Face, quiet", "Channel or tip", "Drawer, heavy", "Light, still"],
      looks: ["Front, flush", "Channel, honest", "Tip, where it carries", "Joint, tight", "Light, indirect", "Handle, none"],
      facts: [
        { value: "Face", label: "handleless" },
        { value: "Opening", label: "channel or tip" },
        { value: "Drawer", label: "heavy, honest" },
        { value: "Light", label: "holds the calm" },
      ],
      extras: [
        ["The line remains if nothing interrupts it.", "No handle added later that breaks the face."],
        ["Heavy drawers prefer a channel.", "Tip-on only where the weight allows it."],
        ["Store and light behind the calm.", "Otherwise purism is only a photograph."],
      ],
    },
    luxus: {
      title: "Luxury",
      emphasis: "as measure and stone.",
      statement:
        "Luxury at BEER is fit and stone, not hardware theatre. What you use every day sits in the work zone — fewer faces that want to be seen.",
      statementNote:
        "The price follows the survey, the stone, the time in the workshop. The first talk is free. The kitchen is not.",
      quote:
        "The dearest thing was the stone that sat. Not the handle you see.",
      quoteSource: "From a house west of Munich",
      closeTitle: "Measure before theatre.",
      closeText:
        "Pictures of the room, the stone, the day. The rest we sample in Wolfersdorf — without a show kitchen.",
      ledgerLine: "Luxury is millimetres. Not hardware.",
      lookTitle: "Stone, measure, quiet.",
      indexEyebrow: "Three points",
      ctaLabel: "Talk about measure",
      film: ["Stone, one-off", "Joint, measure", "Work zone, clear", "Less theatre"],
      looks: ["Stone, vein", "Front, quiet", "Handle, reduced", "Joint, tight", "Appliance, set in", "Light"],
      facts: [
        { value: "Measure", label: "not theatre" },
        { value: "Stone", label: "as a one-off" },
        { value: "The day", label: "in the work zone" },
        { value: "Fewer", label: "faces that pose" },
      ],
      extras: [
        ["Fit at the wall, not a logo on the front.", "Stone you sample, not order from a picture."],
        ["What sits every day sits at hand height.", "Show appliances outside the zone stay undrawn."],
        ["Quiet instead of a face that wants to be seen.", "The first talk is free. The kitchen is not."],
      ],
    },
    weiss: {
      title: "White",
      emphasis: "never only white.",
      statement:
        "In a kitchen of this class white is everyday life, not innocence. The undertone decides against stone, wall and the light from the house.",
      statementNote:
        "Matt, silk or texture. The day shows there. On a screen you buy white twice.",
      quote:
        "Next to the stone the white was suddenly warm. That is why we sample on the wall.",
      quoteSource: "From the material talk in the showroom",
      closeTitle: "In daylight.",
      closeText:
        "Samples next to wall and stone. White you do not hold, you buy again.",
      ledgerLine: "White you do not sample, you buy twice.",
      lookTitle: "Undertone against stone.",
      indexEyebrow: "Three points",
      ctaLabel: "Sample white",
      film: ["Undertone", "Against stone", "Matt, not gloss", "The wall first"],
      looks: ["Matt, quiet", "Silk, light", "Texture, hand", "Stone beside it", "Joint, pale", "Handle, quiet"],
      facts: [
        { value: "Undertone", label: "against stone" },
        { value: "Matt", label: "not gloss" },
        { value: "Wall", label: "first" },
        { value: "Sample", label: "in daylight" },
      ],
      toneLine: "White is never only white. The undertone decides against stone.",
      extras: [
        ["Warm or cool — the stone says so, not the screen.", "Next to the wall before the front is fixed."],
        ["Matt holds the day. Gloss wants polishing.", "Texture where fingerprints would shout."],
        ["No white without a sample on the wall.", "Light changes the tone between morning and evening."],
      ],
    },
    schwarz: {
      title: "Black",
      emphasis: "with a counterweight.",
      statement:
        "Black needs daylight or aimed light — and wood or stone, or the face grows heavy. Fingers and dust show. The opening has to fit.",
      statementNote:
        "A counterweight keeps the night quiet. Pure black without material beside it is theatre.",
      quote:
        "Without the oak the black would have been a hole. With it, it is a face.",
      quoteSource: "From a house in Munich",
      closeTitle: "Light and wood beside it.",
      closeText:
        "Samples in daylight, next to wood and stone. Black without a counterweight we rarely draw.",
      ledgerLine: "Black without a counterweight grows heavy.",
      lookTitle: "Light, wood, opening.",
      indexEyebrow: "Three points",
      ctaLabel: "Sample black",
      film: ["Black, with light", "Wood beside it", "Stone, vein", "Opening, clear"],
      looks: ["Front, deep", "Wood, warm", "Stone, pale", "Handle, quiet", "Dust, honest", "Light"],
      facts: [
        { value: "Light", label: "or it grows heavy" },
        { value: "Wood", label: "or stone beside it" },
        { value: "Fingers", label: "show" },
        { value: "Opening", label: "has to fit" },
      ],
      toneLine: "Black needs light — and a counterweight of wood or stone.",
      extras: [
        ["Daylight or aimed light. Otherwise a hole.", "Open rooms carry black better than dark niches."],
        ["Oak, walnut or a pale stone.", "Without a counterweight only theatre remains."],
        ["A channel or a handle that fits the dust.", "Gloss black is something you polish. Matt holds quieter."],
      ],
    },
    salbei: {
      title: "Sage",
      emphasis: "between worlds.",
      statement:
        "Sage sits between country and modern. Not every green is this tone. Lacquer, not foil — and the stone keeps the colour quiet.",
      statementNote:
        "Sample next to wall and floor before the front is fixed. Sage on a screen is another green.",
      quote:
        "On the wall it was country. Next to the stone it was modern. That is why the sample appointment.",
      quoteSource: "From the Wolfersdorf showroom",
      closeTitle: "The tone on the wall.",
      closeText:
        "Sage next to plaster, wood and stone. Only then is it a colour, not a name.",
      ledgerLine: "Sage is an undertone. Not a fashion green.",
      lookTitle: "Lacquer, stone, wall.",
      indexEyebrow: "Three points",
      ctaLabel: "Sample sage",
      film: ["Sage, sampled", "Next to the wall", "Stone keeps it quiet", "Lacquer, not foil"],
      looks: ["Lacquer, silk", "Undertone, green", "Stone, warm", "Wood beside it", "Joint", "Light"],
      facts: [
        { value: "Between", label: "country and modern" },
        { value: "Lacquer", label: "not foil" },
        { value: "Stone", label: "holds the tone" },
        { value: "Wall", label: "first" },
      ],
      toneLine: "Not every green is sage. We sample the tone on the wall.",
      extras: [
        ["An undertone, not a décor green.", "Too yellow, too grey — you only see that on a sample."],
        ["Lacquer carries the tone. Foil makes it cheap.", "The stone beside it decides whether sage rests."],
        ["Plaster, floor, light — all change the green.", "Without a sample appointment it stays a name."],
      ],
    },
    grau: {
      title: "Grey",
      emphasis: "as a decision.",
      statement:
        "Grey is calm, not the compromise between white and black. Warm or cool — the stone says so, not the mood.",
      statementNote:
        "Against a white wall the kitchen stays clear. Grey on a screen is another grey in the house.",
      quote:
        "We did not want white. Grey was the decision, not the avoidance.",
      quoteSource: "From a new build in Erding",
      closeTitle: "Warm or cool.",
      closeText:
        "Stone and light fix the tone. Sample grey before it becomes an excuse.",
      ledgerLine: "Grey is a decision. Not a middle way.",
      lookTitle: "Tone against stone.",
      indexEyebrow: "Three points",
      ctaLabel: "Sample grey",
      film: ["Grey, decided", "Warm or cool", "Against the wall", "Stone beside it"],
      looks: ["Matt, quiet", "Undertone, warm", "Undertone, cool", "Stone, vein", "Joint", "Handle"],
      facts: [
        { value: "Calm", label: "not a compromise" },
        { value: "Warm", label: "or cool" },
        { value: "Stone", label: "fixes the tone" },
        { value: "Wall", label: "keeps it clear" },
      ],
      toneLine: "Grey as calm, not as a compromise between white and black.",
      extras: [
        ["The stone says warm or cool.", "A fashion grey without an undertone grows restless."],
        ["Not an avoidance of white and black.", "A stance that belongs to the house."],
        ["Against white the kitchen stays a face.", "Against plaster the undertone has to sit."],
      ],
    },
    kochinsel: {
      title: "Cooking island",
      emphasis: "with a feed.",
      statement:
        "Hob and often extraction in the middle of the room. A cooking island of this class is kit under the top, paths all around — and extraction that sits in the drawing, not afterwards.",
      statementNote:
        "Work from every side. If the feed or the path is missing, it stays undrawn.",
      quote:
        "A hood would have taken the view. That is why extraction sits in the top — and the feed was the whole plan.",
      quoteSource: "From an open house in Munich",
      closeTitle: "Services first.",
      closeText:
        "Power, air, water, path. Bring the room. The cooking island comes if that will carry.",
      ledgerLine: "A cooking island without a feed is a hob in the way.",
      lookTitle: "Hob, extraction, paths.",
      indexEyebrow: "Three points",
      ctaLabel: "Settle a cooking island",
      film: ["Hob in the middle", "Extraction in the top", "Paths around", "Feed underneath"],
      looks: ["Hob, free", "Extraction, drawn", "Cable in the carcass", "Paths, open", "Top, honest to heat", "Joint"],
      facts: [
        { value: "Hob", label: "in the middle" },
        { value: "Extraction", label: "in the drawing" },
        { value: "Paths", label: "from every side" },
        { value: "Feed", label: "under the top" },
      ],
      extras: [
        ["Carcass, cable, air — before the hob is chosen.", "A hood in an open room is often the wrong view."],
        ["Stand all around, do not only cook from one side.", "The path must not close the cook in."],
        ["Extraction belongs in the survey.", "Afterwards it is dear and wrong."],
      ],
    },
    arbeitsinsel: {
      title: "Work island",
      emphasis: "without a hob.",
      statement:
        "A clear top for prep. No hob, drawers under the top — and a seating edge only if the path remains.",
      statementNote:
        "Work height and seating height are not the same. Who wants both, draws two edges.",
      quote:
        "We wanted to cook in the middle. The room wanted to set down. The work island was honester.",
      quoteSource: "From a survey in Freising",
      closeTitle: "A top, not a hob.",
      closeText:
        "Whether the middle carries work or fire is for the plan to say. We draw the honester one.",
      ledgerLine: "A work island is a top. Not a smaller hob.",
      lookTitle: "Top, drawer, height.",
      indexEyebrow: "Three points",
      ctaLabel: "Settle a work island",
      film: ["Clear top", "Drawers under", "Seating if the path remains", "Heights apart"],
      looks: ["Top, free", "Drawer, full", "Overhang, honest", "Knees, free", "No hob cut-out", "Joint"],
      facts: [
        { value: "No hob", label: "a clear top" },
        { value: "Drawers", label: "under the top" },
        { value: "Seating", label: "only with a path" },
        { value: "Height", label: "work is not sitting" },
      ],
      extras: [
        ["Prep and set-down. Fire stays on the run.", "Less kit, more surface."],
        ["Store you reach from two sides.", "Seating only if no one sits in the work path."],
        ["Two heights if you cook and sit.", "One height for both is a compromise in the back."],
      ],
    },
    essinsel: {
      title: "Seating island",
      emphasis: "with knee room.",
      statement:
        "Cook and sit at one edge. The overhang carries the knees. Sockets, distance to the work zone — who sits, sits in the path of cooking. That is drawn.",
      statementNote:
        "Knee room is measure, not a stool at a block. If it is missing, the seating island stays undrawn.",
      quote:
        "Four sit at the island. The cook still needs a path. That is why the overhang — and the distance.",
      quoteSource: "From a house in Erding",
      closeTitle: "Knees and path.",
      closeText:
        "How many sit, who cooks, which path remains. Then we draw the edge — or we separate table and island.",
      ledgerLine: "A seating island without knees is a counter.",
      lookTitle: "Overhang, knees, distance.",
      indexEyebrow: "Three points",
      ctaLabel: "Settle the seating edge",
      film: ["Overhang", "Knees free", "Distance to the work", "Sockets in the edge"],
      looks: ["Edge, thick enough", "Knees, free", "Stool, honest", "Socket, unseen", "Path, open", "Top, unbroken"],
      facts: [
        { value: "Overhang", label: "carries the knees" },
        { value: "Distance", label: "to the work zone" },
        { value: "Sockets", label: "in the edge" },
        { value: "Path", label: "despite those who sit" },
      ],
      extras: [
        ["One edge, two roles. Measure for both.", "Too little overhang is a counter, not a seat."],
        ["Knee room, sockets, distance.", "Who sits must not block the cook."],
        ["That is decided in the plan, not at the stool.", "Sometimes a table is honester than the island edge."],
      ],
    },
    grifflos: {
      title: "Handleless",
      emphasis: "with an honest opening.",
      statement:
        "Quiet fronts, opening by channel or tip-on. Handleless shows fingerprints sooner — and order better. Heavy drawers prefer a channel to a tipper.",
      statementNote:
        "The face remains if the opening carries the day. A handle added later breaks it.",
      quote:
        "Tip-on on the heavy drawers did not hold. The channel was the honester quiet.",
      quoteSource: "From a planning in Wolfersdorf",
      closeTitle: "Sample the opening.",
      closeText:
        "Touch heavy doors in the showroom. Handleless only if the opening will hold the day.",
      ledgerLine: "Handleless is the opening. Not the absence of a handle.",
      lookTitle: "Face, channel, fingers.",
      indexEyebrow: "Three points",
      ctaLabel: "Settle the opening",
      film: ["Face, quiet", "Channel", "Tip where it carries", "Fingers, honest"],
      looks: ["Front, flush", "Channel, through", "Tip, light", "Joint, tight", "Order, visible", "Light"],
      facts: [
        { value: "Face", label: "without a handle" },
        { value: "Channel", label: "for heavy drawers" },
        { value: "Tip", label: "only where it carries" },
        { value: "Fingers", label: "show" },
      ],
      extras: [
        ["A quiet face that holds the gaze.", "No handle added later that breaks the line."],
        ["Weight decides channel or tip.", "Cupboards you open hourly do not lie."],
        ["Order becomes more visible. So do fingers.", "Matt and Fenix where prints would shout."],
      ],
    },
    "nach-mass": {
      title: "To measure",
      emphasis: "at the wall.",
      statement:
        "Not the grid, the room. Niche, slope, old wall — millimetres in the fill, not a panel as an excuse. The drawing follows the survey before the front is fixed.",
      statementNote:
        "Where standard runs end, the workshop begins. Every fill is a commission, not a leftover.",
      quote:
        "The fill against the old wall was the whole commission. The front came after.",
      quoteSource: "From an existing house in Freising",
      closeTitle: "The room is the drawing.",
      closeText:
        "Niche, slope, height. Bring the room — as a picture, a measure. We draw the rest.",
      ledgerLine: "Where the grid ends, the workshop begins.",
      lookTitle: "Niche, fill, millimetre.",
      indexEyebrow: "Three points",
      ctaLabel: "Settle the measure",
      film: ["Old wall", "Niche", "Fill to the millimetre", "No grid"],
      looks: ["Fill, true", "Slope, drawn", "Niche, used", "Panel, no excuse", "Survey, first", "Joint"],
      facts: [
        { value: "Room", label: "not a grid" },
        { value: "Millimetre", label: "at the wall" },
        { value: "Fill", label: "is the commission" },
        { value: "Survey", label: "before the front" },
      ],
      extras: [
        ["Existing fabric, a jog, a slope. The grid lies there.", "Every house brings its wall."],
        ["No panel that hides the millimetre.", "Fill as furniture, not as leftover."],
        ["Drawing after the measure, not after a catalogue.", "The front follows when the wall sits."],
      ],
    },
    raumhoch: {
      title: "Full height",
      emphasis: "without a dust shelf.",
      statement:
        "Store to the ceiling, without a board that collects dust. Upper cupboards stay usable — or they are rare goods. Ceiling, wall and front have to meet.",
      statementNote:
        "Height without reach is volume, not store. Step, ladder, the split inside — that belongs in the drawing.",
      quote:
        "To the ceiling, yes. But the upper cupboards only for what rarely comes. The day sits below.",
      quoteSource: "From a new build with a high ceiling",
      closeTitle: "Height you can reach.",
      closeText:
        "Clear height, what should live above, how you get there. Then we draw full height — or an honest cornice.",
      ledgerLine: "Full height without reach is a dust shelf with a door.",
      lookTitle: "Ceiling, joint, hand height.",
      indexEyebrow: "Three points",
      ctaLabel: "Settle the height",
      film: ["To the ceiling", "No dust shelf", "Reachable above", "Joint to the ceiling"],
      looks: ["Front, high", "Joint, ceiling", "Upper cupboards, honest", "Hand height, the day", "Light above", "Step, planned"],
      facts: [
        { value: "Ceiling", label: "without a dust shelf" },
        { value: "Above", label: "must stay usable" },
        { value: "Joint", label: "ceiling, wall, front" },
        { value: "The day", label: "sits at hand height" },
      ],
      extras: [
        ["No board that collects dust.", "The joint to the ceiling is measure, not silicone."],
        ["Rare goods above, the day below.", "A ladder in the plan, or the cupboards stay empty."],
        ["Ceiling, wall and front in one line.", "A jog in the ceiling is drawn, not boxed in."],
      ],
    },
  },
};

function voiceFor(slug: string, locale: Locale): TopicVoice | undefined {
  return VOICE[locale][slug];
}

export function kitchenTopicCms(slug: string) {
  const voice = voiceFor(slug, "de");
  const notes = TOPIC_NOTES[slug] ?? [];
  if (!voice) {
    return null;
  }
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
    punkte: notes
      .map((note, index) => ({
        titel: note.label,
        text: (voice.extras[index] ?? []).join("\n"),
      }))
      .filter((item) => item.titel && item.text),
  };
}

function cmsPointLines(punkt?: { titel?: string; text?: string }) {
  const lines = (punkt?.text || "")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length ? lines : null;
}

function cmsForLocale<T extends { contentLocale?: string }>(item: T | undefined, locale: Locale) {
  if (!item) {
    return undefined;
  }
  if (item.contentLocale && item.contentLocale !== locale) {
    return undefined;
  }
  return item;
}

function chapterBranches(
  topic: KitchenTopic,
  locale: Locale,
  photo: (n: number, width?: number) => string,
): PresentedBranch[] {
  const voice = voiceFor(topic.slug, locale);
  const cms = cmsForLocale(topic, locale);
  const notes = TOPIC_NOTES[topic.slug] ?? [];
  const texts = topicPoints(topic.slug, locale);
  const looks = voice?.looks ?? [];
  const photos = (index: number) => ({
    image: photo(16 + index * 3),
    imageB: photo(17 + index * 3, 1200),
    imageC: photo(18 + index * 3, 1200),
    kicker: String(index + 1).padStart(2, "0"),
  });

  // Points from the CMS stand on their own: their title and text, nothing from the code next to them.
  const cmsPoints = (cms?.punkte ?? []).filter((punkt) => punkt.titel?.trim() && punkt.text?.trim());
  if (cmsPoints.length) {
    return cmsPoints.map((punkt, index) => ({
      title: punkt.titel.trim(),
      text: punkt.text.replace(/\s*\n\s*/g, " ").trim(),
      ...photos(index),
      alt: punkt.titel.trim(),
      points: [],
      caption: looks[index % looks.length] ?? punkt.titel.trim(),
    }));
  }

  return notes.map((note, index) => {
    const punkt = cms?.punkte?.[index];
    const title =
      punkt?.titel ||
      (locale === "en" ? (LABEL_EN[note.label] ?? note.label) : note.label);
    const text = texts[index] ?? note.text;
    return {
      title,
      text,
      image: photo(16 + index * 3),
      imageB: photo(17 + index * 3, 1200),
      imageC: photo(18 + index * 3, 1200),
      alt: title,
      kicker: String(index + 1).padStart(2, "0"),
      points: cmsPointLines(punkt) ?? voice?.extras[index] ?? [],
      caption: looks[index % looks.length] ?? title,
    };
  });
}

export function presentTopic(
  cluster: KitchenClusterSlug,
  topic: KitchenTopic,
  locale: Locale,
  clusterTopics: KitchenTopic[],
  projects: Project[],
): PresentedTopic {
  const local = topicCopy(topic, locale);
  const voice = voiceFor(topic.slug, locale);
  const cms = cmsForLocale(topic, locale);
  const heading = clusterHeading(cluster, locale);
  const parent = kitchensParent(locale);
  const visit = clusterVisit(locale);
  const siblingHead = SIBLING_HEAD[locale][cluster];
  const start = clusterPhotoOffset(cluster) + 90 + Math.floor(topic.order / 10) * 9;
  // Real kitchens tagged with this topic first, then the other projects.
  const tagged = projects.filter((project) => project.topics.some((item) => item.slug === topic.slug));
  const sameCluster = projects.filter(
    (project) => !tagged.includes(project) && project.topics.some((item) => item.cluster === cluster),
  );
  const kitchens = [...tagged, ...sameCluster, ...projects.filter((project) => !tagged.includes(project) && !sameCluster.includes(project))];
  const photo = kitchenPhotos(tagged, kitchens, (n, width) => devPhoto(start + n, width));
  const hex = topic.hex || undefined;

  const branches = chapterBranches(topic, locale, photo);
  const filmCaptions = voice?.film ?? heading.eyebrow;
  const lookCaptions = voice?.looks ?? [];
  const film = Array.isArray(filmCaptions) ? filmCaptions : [heading.eyebrow];

  const siblings = clusterTopics
    .filter((item) => item.slug !== topic.slug)
    .map((item, index) => {
      const copy = topicCopy(item, locale);
      return {
        href: `/kuechen/${cluster}/${item.slug}`,
        title: copy.name,
        text: copy.intro,
        // A real kitchen tagged with that topic, else the topic's own image.
        image: resolveDevImage(
          coverOf(projects, (project) => project.topics.some((entry) => entry.slug === item.slug)) ?? item.image,
          photo(70 + index, 1100),
        ),
      };
    });

  const houses = kitchens.slice(0, 4).map((project, index) => ({
    href: `/projekte/${project.slug}`,
    title: project.title,
    meta: [project.place, project.year].filter(Boolean).join(" · "),
    image: resolveDevImage(project.image, photo(80 + index, 1200)),
  }));

  const swatches = clusterTopics
    .filter((item) => item.hex)
    .map((item) => {
      const inColour = projects.filter((project) => project.topics.some((entry) => entry.slug === item.slug));
      return {
        href: `/kuechen/${cluster}/${item.slug}`,
        title: topicCopy(item, locale).name,
        hex: item.hex,
        image: coverOf(inColour, () => true) ?? item.image ?? undefined,
        count: inColour.length,
      };
    });

  const taggedHouses = tagged.map((project, index) => ({
    href: `/projekte/${project.slug}`,
    title: project.title,
    meta: [project.place, project.year].filter(Boolean).join(" · "),
    image: resolveDevImage(project.image, photo(80 + index, 1200)),
  }));

  const page: PresentedTopic = {
    locale,
    taggedKitchens: tagged.length,
    ueberschrift: cms?.ueberschrift,
    lesetext: cms?.lesetext,
    eyebrow: locale === "en" ? "Kitchen" : "Küche",
    title: cms?.seitentitel || voice?.title || local.name,
    // With a CMS title the emphasis is the CMS one too, even when it is empty.
    emphasis: cms?.seitentitel ? cms.betonung || "" : voice?.emphasis || "",
    lede: local.intro,
    statement: cms?.aussage || voice?.statement || local.intro,
    statementNote: cms?.hinweis || voice?.statementNote || "",
    heroImage: photo.hero(topic.image, 1800),
    heroAlt: local.name,
    indexEyebrow: voice?.indexEyebrow ?? heading.eyebrow,
    // Quotes come only from the CMS, where someone enters a real one with its real source.
    quote: cms?.zitat || "",
    quoteSource: cms?.zitat ? cms.zitatQuelle || "" : "",
    // Colours are chosen at the samples in the showroom, so that is where the colour pages lead.
    ctaLabel:
      cluster === "farben"
        ? locale === "en"
          ? "See the samples in the showroom"
          : "Muster in der Ausstellung ansehen"
        : voice?.ctaLabel ?? heading.eyebrow,
    ctaHref: cluster === "farben" ? "/ausstellung" : "/beratung",
    closeTitle: cms?.schlussTitel || voice?.closeTitle || local.name,
    closeText: cms?.schlussText || voice?.closeText || local.intro,
    parentHref: `/kuechen/${cluster}`,
    parentLabel: heading.title,
    crumbs: [
      { href: parent.href, label: parent.label },
      { href: `/kuechen/${cluster}`, label: heading.title },
    ],
    hex,
    statementImage: photo(1),
    statementImageB: photo(2),
    closeImage: photo(3),
    ledgerImage: photo(4),
    visitImage: photo(5),
    filmstrip: [0, 1, 2, 3].map((slot) => ({
      src: photo(6 + slot, 1000),
      alt: film[slot] ?? local.name,
      caption: film[slot] ?? local.name,
    })),
    facts: cms?.stichworte?.length
      ? cms.stichworte.map((item) => ({ value: item.wert, label: item.zeile }))
      : voice?.facts ?? [
      { value: locale === "en" ? "Survey" : "Aufmaß", label: locale === "en" ? "first" : "zuerst" },
      { value: "Wolfersdorf", label: locale === "en" ? "workshop" : "Werkstatt" },
      { value: locale === "en" ? "To measure" : "Auf Maß", label: locale === "en" ? "no grid" : "kein Raster" },
      { value: locale === "en" ? "Stone" : "Stein", label: locale === "en" ? "not foil" : "nicht Folie" },
    ],
    ledgerLine: voice?.ledgerLine ?? local.intro,
    looks: lookCaptions.map((caption, slot) => ({
      src: photo(10 + slot, 1100),
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
    siblings,
    houses,
    taggedHouses,
    swatches,
    lookTitle: voice?.lookTitle ?? local.name,
    toneLine: voice?.toneLine,
    siblingEyebrow: siblingHead.eyebrow,
    siblingTitle: siblingHead.title,
  };
  return uniquePagePhotos(page, photo);
}

export async function topicMetadata(topic: KitchenTopic): Promise<Metadata> {
  const locale = await getRequestLocale();
  const local = topicCopy(topic, locale);
  const reading = topicReading(topic.slug, locale);
  return pageMetadata({
    title: brandedTitle(cmsValue(locale, topic, topic.seoTitle) || reading?.title || local.name),
    description: cmsValue(locale, topic, topic.seoDescription) || reading?.description || local.intro,
    path: `/kuechen/${topic.cluster}/${topic.slug}`,
    image: topic.image,
  });
}
