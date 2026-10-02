import type { Metadata } from "next";
import {
  KITCHEN_CLUSTERS,
  type KitchenClusterSlug,
  type KitchenTopic,
  type Project,
} from "@/lib/catalog";
import {
  type CollectionFact,
  type PresentedBranch,
  type PresentedHub,
} from "@/lib/collection-present";
import { TOPIC_NOTES } from "@/lib/kitchen-details";
import { devPhoto, resolveDevImage } from "@/lib/dev-images";
import { getRequestLocale } from "@/lib/locale";
import type { Locale } from "@/lib/i18n";

export type ClusterHouse = {
  href: string;
  title: string;
  meta?: string;
  image: string;
};

export type ClusterSibling = {
  href: string;
  title: string;
  text: string;
  image: string;
};

export type ClusterSwatch = {
  href: string;
  title: string;
  hex: string;
};

export type PresentedCluster = PresentedHub & {
  siblings: ClusterSibling[];
  houses: ClusterHouse[];
  swatches: ClusterSwatch[];
};

type ClusterCopy = {
  eyebrow: string;
  title: string;
  emphasis: string;
  lede: string;
  statement: string;
  statementNote: string;
  indexEyebrow: string;
  quote: string;
  quoteSource: string;
  ctaLabel: string;
  closeTitle: string;
  closeText: string;
  ledgerLine: string;
  lookTitle: string;
  film: string[];
  looks: string[];
  facts: CollectionFact[];
  seoTitle: string;
  seoDescription: string;
};

const OFFSET: Record<KitchenClusterSlug, number> = {
  formen: 8,
  stile: 21,
  farben: 34,
  inseln: 47,
  besondere: 60,
};

const PARENT: Record<Locale, { href: string; label: string }> = {
  de: { href: "/kuechen", label: "Küchen" },
  en: { href: "/kuechen", label: "Kitchens" },
};

const VISIT: Record<Locale, { place: string; line: string; note: string }> = {
  de: {
    place: "Ausstellung Wolfersdorf",
    line: "Badendorf 6 · 85395 Wolfersdorf bei Freising",
    note: "Muster, Kanten, Licht. Mit Termin. Das Erstgespräch ist kostenlos — die Küche nicht.",
  },
  en: {
    place: "Wolfersdorf showroom",
    line: "Badendorf 6 · 85395 Wolfersdorf near Freising",
    note: "Samples, edges, light. By appointment. The first talk is free — the kitchen is not.",
  },
};

const COPY: Record<Locale, Record<KitchenClusterSlug, ClusterCopy>> = {
  de: {
    formen: {
      eyebrow: "Küchenformen",
      title: "Formen",
      emphasis: "aus dem Grundriss.",
      lede: "Zeile, L, U, Insel. Die Form folgt dem Raum, nicht dem Wunsch nach einer Insel um jeden Preis. Was trägt, entscheidet das Aufmaß.",
      statement:
        "In einer Küche dieser Klasse ist die Form Architektur, kein Katalogblatt. Wege, Licht und die Höhe der Platte stehen vor der Zeichnung der Front.",
      statementNote:
        "Manche Zeile ist ehrlicher als eine gedrängte U-Form. Manche Insel bleibt ungezeichnet, weil der Raum sie nicht trägt.",
      indexEyebrow: "Sechs Formen",
      quote:
        "Wir haben eine Insel gezeichnet und wieder gestrichen. Die Zeile mit Höhe war ehrlicher.",
      quoteSource: "Aus einem Neubau in Erding",
      ctaLabel: "Form besprechen",
      closeTitle: "Zuerst der Raum.",
      closeText:
        "Bilder helfen. Ein Plan muss nicht sein. Im Gespräch sortieren wir Zeile, L, U oder Insel — bevor gezeichnet wird.",
      ledgerLine:
        "Die Form ist keine Stimmung. Sie ist der Weg, den der Alltag nimmt.",
      lookTitle: "Wege, Kanten, Höhe.",
      film: ["Zeile, klar", "L, offen", "U, geschlossen", "Insel, mit Wegen"],
      looks: ["Eine Wand", "Zwei Schenkel", "Drei Seiten", "Mitte des Raums", "Nische", "Höhe"],
      facts: [
        { value: "Wege", label: "vor der Insel" },
        { value: "Aufmaß", label: "entscheidet die Form" },
        { value: "Zeile", label: "oft die ehrlichere" },
        { value: "Raum", label: "nicht der Wunsch" },
      ],
      seoTitle: "Küchenformen | BEER Küchenmanufaktur",
      seoDescription:
        "Küchenzeile, L-Form, U-Form, offene Küche und Insel: welche Form zu Ihrem Grundriss passt. Manufaktur in Wolfersdorf.",
    },
    stile: {
      eyebrow: "Küchenstile",
      title: "Stile",
      emphasis: "ohne Kostüm.",
      lede: "Modern, Landhaus, Design, Holz, puristisch. Haltung, die zum Haus passt — nicht zum Jahr, in dem sie bestellt wird.",
      statement:
        "Ein Stil bei BEER ist kein Programm. Das Haus gibt den Ton, das Material die Wärme, die Fuge die Ruhe. Kostüm bleibt im Katalog.",
      statementNote:
        "Modern heißt präzise, nicht kalt. Landhaus heißt Holz und Rahmen, nicht Dekor. Luxus heißt Maß und Stein.",
      indexEyebrow: "Sechs Haltungen",
      quote:
        "Eine Küche in diesem Haus muss in zehn Jahren noch selbstverständlich wirken. Nicht nach dem Jahr, in dem sie bestellt wurde.",
      quoteSource: "Aus der Planung in der Ausstellung Freising",
      ctaLabel: "Haltung mustern",
      closeTitle: "Das Haus gibt den Ton.",
      closeText:
        "Bilder aus dem Haus, nicht aus dem Lookbook. Den Rest sortieren wir unter Tageslicht in Wolfersdorf.",
      ledgerLine:
        "Stil ist, was nach zehn Jahren noch zum Haus gehört.",
      lookTitle: "Fläche, Holz, Fuge.",
      film: ["Modern, präzise", "Landhaus, Holz", "Design, Fuge", "Puristisch, still"],
      looks: ["Ruhige Front", "Rahmen, echt", "Kante, klar", "Maserung", "Griff, still", "Licht"],
      facts: [
        { value: "Haus", label: "gibt den Ton" },
        { value: "Kein", label: "Jahresstil" },
        { value: "Material", label: "nicht Kostüm" },
        { value: "Muster", label: "in Wolfersdorf" },
      ],
      seoTitle: "Küchenstile | BEER Küchenmanufaktur",
      seoDescription:
        "Moderne Küchen, Landhausküchen, Designküchen und Holzküchen aus der Manufaktur in Wolfersdorf.",
    },
    farben: {
      eyebrow: "Küchenfarben",
      title: "Farben",
      emphasis: "am Muster.",
      lede: "Weiß, Schwarz, Salbei, Grau. Farbe unter Tageslicht, neben Wand und Stein — nicht am Bildschirm.",
      statement:
        "In einer Küche dieser Klasse ist Farbe Alltag, nicht Stimmung. Der Unterton entscheidet gegen das Licht. Matt hält, Hochglanz poliert man.",
      statementNote:
        "Schwarz braucht ein Gegengewicht. Salbei liegt zwischen Landhaus und Moderne. Weiß ist nie nur weiß.",
      indexEyebrow: "Vier Töne",
      quote:
        "Die Front ist das, was Sie jeden Morgen anfassen. Deshalb mustern wir, bevor irgendetwas bestellt wird.",
      quoteSource: "Aus dem Materialgespräch in der Ausstellung",
      ctaLabel: "Farbe mustern",
      closeTitle: "Unter Tageslicht.",
      closeText:
        "Stein, Lack und Holz ändern sich mit dem Wetter. Deshalb liegen die Muster in Wolfersdorf, nicht nur auf dem Bildschirm.",
      ledgerLine:
        "Farbe, die man nicht mustert, kauft man zweimal.",
      lookTitle: "Unterton gegen Stein.",
      film: ["Weiß, ruhig", "Schwarz, mit Licht", "Salbei, gemustert", "Grau, entschieden"],
      looks: ["Matt, nicht Glanz", "Unterton", "Gegen Stein", "Gegen Wand", "Fuge", "Griff"],
      facts: [
        { value: "Muster", label: "unter Tageslicht" },
        { value: "Unterton", label: "gegen Stein" },
        { value: "Matt", label: "nicht Hochglanz" },
        { value: "Wand", label: "zuerst" },
      ],
      seoTitle: "Küchenfarben | BEER Küchenmanufaktur",
      seoDescription:
        "Weiße, schwarze, salbeigrüne und graue Küchen. Farbe als Entscheidung für den Alltag, gemustert in Wolfersdorf.",
    },
    inseln: {
      eyebrow: "Kücheninseln",
      title: "Inseln",
      emphasis: "nur mit Wegen.",
      lede: "Kochinsel, Arbeitsinsel, Sitzkante. Nur wenn der Raum Laufwege lässt — und die Technik unter der Platte mitgedacht ist.",
      statement:
        "Eine Insel in dieser Klasse ist kein Möbel in der Mitte. Sie ist Wege, Anschlüsse, Dunst und eine Kante, an der man stehen oder sitzen kann. Fehlt eines, bleibt sie ungezeichnet.",
      statementNote:
        "Nicht jeder Grundriss trägt eine Insel. Manche Zeile mit Höhe ist die ehrlichere Mitte des Hauses.",
      indexEyebrow: "Drei Rollen",
      quote:
        "Die Insel kam erst, als die Wege stimmten. Vorher war sie ein Wunsch, kein Raum.",
      quoteSource: "Aus einem Aufmaß in München",
      ctaLabel: "Insel klären",
      closeTitle: "Wege zuerst.",
      closeText:
        "Ob Kochinsel, Arbeitsinsel oder Sitzkante: wir zeichnen sie, wenn der Raum sie trägt. Sonst nicht.",
      ledgerLine:
        "Eine Insel ohne Wege ist ein Block im Raum.",
      lookTitle: "Platte, Kante, Anschluss.",
      film: ["Kochinsel", "Arbeitsinsel", "Sitzkante", "Wege darum"],
      looks: ["Herd in der Mitte", "Reine Fläche", "Überstand", "Abzug gezeichnet", "Beine frei", "Anschluss"],
      facts: [
        { value: "Wege", label: "rundherum" },
        { value: "Technik", label: "unter der Platte" },
        { value: "Sitzkante", label: "mit Beinen" },
        { value: "Nicht", label: "jeder Grundriss" },
      ],
      seoTitle: "Kücheninseln | BEER Küchenmanufaktur",
      seoDescription:
        "Kochinsel, Arbeitsinsel und Essinsel: wann eine Kücheninsel Sinn hat. Manufaktur in Wolfersdorf.",
    },
    besondere: {
      eyebrow: "Besondere Küchen",
      title: "Besondere",
      emphasis: "Küchen.",
      lede: "Klein, raumhoch, grifflos, nach Maß. Dort, wo Standardzeilen enden, beginnt die Manufaktur.",
      statement:
        "Rastermaße enden an der Nische, an der Schräge, an der Decke. Eine Küche dieser Klasse füllt den Millimeter, nicht die Blende. Die Öffnung sitzt, bevor die Fläche ruhig wird.",
      statementNote:
        "Grifflos nur, wenn schwere Auszüge eine ehrliche Lösung haben. Raumhoch nur, wenn die oberen Fächer erreichbar bleiben.",
      indexEyebrow: "Wo Raster enden",
      quote:
        "Die Füllung an der alten Wand war der ganze Auftrag. Die Front kam danach.",
      quoteSource: "Aus einem Bestand in Freising",
      ctaLabel: "Maß klären",
      closeTitle: "Der Raum ist die Zeichnung.",
      closeText:
        "Nische, Schräge, Höhe. Bringen Sie den Raum mit — als Bild, als Maß, als Gefühl. Den Rest zeichnen wir.",
      ledgerLine:
        "Wo das Raster endet, beginnt die Werkstatt.",
      lookTitle: "Nische, Fuge, Öffnung.",
      film: ["Grifflos", "Nach Maß", "Raumhoch", "Nische"],
      looks: ["Mulde oder Tipp", "Millimeter", "Bis zur Decke", "Schräge", "Füllung", "Öffnung"],
      facts: [
        { value: "Raster", label: "endet hier" },
        { value: "Millimeter", label: "an der Wand" },
        { value: "Öffnung", label: "vor der Fläche" },
        { value: "Höhe", label: "ohne Staubkante" },
      ],
      seoTitle: "Besondere Küchen | BEER Küchenmanufaktur",
      seoDescription:
        "Kleine Küchen, grifflose Küchen, raumhohe Schränke und Küchen nach Maß. Manufaktur in Wolfersdorf.",
    },
  },
  en: {
    formen: {
      eyebrow: "Kitchen layouts",
      title: "Layouts",
      emphasis: "from the plan.",
      lede: "Galley, L, U, island. The layout follows the room, not the wish for an island at any cost. What carries is settled on the survey.",
      statement:
        "In a kitchen of this class the layout is architecture, not a catalogue sheet. Paths, light and the height of the top stand before the drawing of the front.",
      statementNote:
        "A galley is often more honest than a cramped U. Some islands stay undrawn because the room will not carry them.",
      indexEyebrow: "Six layouts",
      quote:
        "We drew an island and struck it out again. The run with height was more honest.",
      quoteSource: "From a new build in Erding",
      ctaLabel: "Talk about layout",
      closeTitle: "The room first.",
      closeText:
        "Pictures help. A plan is not required. In conversation we sort galley, L, U or island — before anyone draws.",
      ledgerLine:
        "Layout is not a mood. It is the path the day will take.",
      lookTitle: "Paths, edges, height.",
      film: ["Galley, clear", "L, open", "U, closed", "Island, with paths"],
      looks: ["One wall", "Two runs", "Three sides", "Centre of the room", "Niche", "Height"],
      facts: [
        { value: "Paths", label: "before the island" },
        { value: "Survey", label: "decides the layout" },
        { value: "Galley", label: "often the honester" },
        { value: "Room", label: "not the wish" },
      ],
      seoTitle: "Kitchen layouts | BEER Küchenmanufaktur",
      seoDescription:
        "Galley, L-shape, U-shape, open kitchen and island: which layout fits the plan. Workshop in Wolfersdorf.",
    },
    stile: {
      eyebrow: "Kitchen styles",
      title: "Styles",
      emphasis: "without costume.",
      lede: "Modern, country, design, wood, purist. A stance that fits the house — not the year it is ordered.",
      statement:
        "A style at BEER is not a programme. The house sets the tone, the material the warmth, the joint the calm. Costume stays in the catalogue.",
      statementNote:
        "Modern means precise, not cold. Country means wood and frame, not décor. Luxury means measure and stone.",
      indexEyebrow: "Six stances",
      quote:
        "A kitchen in this house has to feel inevitable in ten years. Not like the year it was ordered.",
      quoteSource: "From planning in the Freising showroom",
      ctaLabel: "Sample a stance",
      closeTitle: "The house sets the tone.",
      closeText:
        "Pictures from the house, not from a lookbook. The rest we sort in daylight in Wolfersdorf.",
      ledgerLine:
        "Style is what still belongs to the house in ten years.",
      lookTitle: "Face, wood, joint.",
      film: ["Modern, precise", "Country, wood", "Design, joint", "Purist, quiet"],
      looks: ["Quiet front", "Frame, true", "Edge, clear", "Grain", "Handle, quiet", "Light"],
      facts: [
        { value: "House", label: "sets the tone" },
        { value: "No", label: "year's style" },
        { value: "Material", label: "not costume" },
        { value: "Samples", label: "in Wolfersdorf" },
      ],
      seoTitle: "Kitchen styles | BEER Küchenmanufaktur",
      seoDescription:
        "Modern, country, design and wood kitchens from the workshop in Wolfersdorf.",
    },
    farben: {
      eyebrow: "Kitchen colours",
      title: "Colours",
      emphasis: "on a sample.",
      lede: "White, black, sage, grey. Colour in daylight, next to wall and stone — not on a screen.",
      statement:
        "In a kitchen of this class colour is everyday life, not a mood. The undertone decides against the light. Matt holds; gloss is something you polish.",
      statementNote:
        "Black needs a counterweight. Sage sits between country and modern. White is never only white.",
      indexEyebrow: "Four tones",
      quote:
        "The front is what you touch every morning. That is why we sample before anything is ordered.",
      quoteSource: "From the material talk in the showroom",
      ctaLabel: "Sample a colour",
      closeTitle: "In daylight.",
      closeText:
        "Stone, lacquer and wood change with the weather. That is why the samples sit in Wolfersdorf, not only on a screen.",
      ledgerLine:
        "A colour you do not sample, you buy twice.",
      lookTitle: "Undertone against stone.",
      film: ["White, quiet", "Black, with light", "Sage, sampled", "Grey, decided"],
      looks: ["Matt, not gloss", "Undertone", "Against stone", "Against the wall", "Joint", "Handle"],
      facts: [
        { value: "Samples", label: "in daylight" },
        { value: "Undertone", label: "against stone" },
        { value: "Matt", label: "not gloss" },
        { value: "Wall", label: "first" },
      ],
      seoTitle: "Kitchen colours | BEER Küchenmanufaktur",
      seoDescription:
        "White, black, sage and grey kitchens. Colour as a decision for everyday life, sampled in Wolfersdorf.",
    },
    inseln: {
      eyebrow: "Kitchen islands",
      title: "Islands",
      emphasis: "only with paths.",
      lede: "Cooking island, work island, seating. Only if the room leaves paths — and the kit under the top is thought through.",
      statement:
        "An island of this class is not a piece of furniture in the middle. It is paths, services, extraction and an edge you can stand or sit at. If one is missing, it stays undrawn.",
      statementNote:
        "Not every plan carries an island. A galley with height is sometimes the honester centre of the house.",
      indexEyebrow: "Three roles",
      quote:
        "The island came only when the paths were right. Before that it was a wish, not a room.",
      quoteSource: "From a survey in Munich",
      ctaLabel: "Settle the island",
      closeTitle: "Paths first.",
      closeText:
        "Cooking island, work island or seating: we draw it if the room will carry it. Otherwise not.",
      ledgerLine:
        "An island without paths is a block in the room.",
      lookTitle: "Top, edge, feed.",
      film: ["Cooking island", "Work island", "Seating edge", "Paths around"],
      looks: ["Hob in the middle", "Clear top", "Overhang", "Extraction drawn", "Knee room", "Services"],
      facts: [
        { value: "Paths", label: "all around" },
        { value: "Kit", label: "under the top" },
        { value: "Seating", label: "with knees" },
        { value: "Not", label: "every plan" },
      ],
      seoTitle: "Kitchen islands | BEER Küchenmanufaktur",
      seoDescription:
        "Cooking island, work island and seating: when an island makes sense. Workshop in Wolfersdorf.",
    },
    besondere: {
      eyebrow: "Particular kitchens",
      title: "Particular",
      emphasis: "kitchens.",
      lede: "Small, full-height, handleless, to measure. Where standard runs end, the workshop begins.",
      statement:
        "Grid sizes end at the niche, the slope, the ceiling. A kitchen of this class fills the millimetre, not a filler panel. The opening sits before the face goes quiet.",
      statementNote:
        "Handleless only if heavy drawers have an honest solution. Full height only if the upper cupboards stay reachable.",
      indexEyebrow: "Where the grid ends",
      quote:
        "The fill against the old wall was the whole commission. The front came after.",
      quoteSource: "From an existing house in Freising",
      ctaLabel: "Settle the measure",
      closeTitle: "The room is the drawing.",
      closeText:
        "Niche, slope, height. Bring the room — as a picture, a measure, a feeling. We draw the rest.",
      ledgerLine:
        "Where the grid ends, the workshop begins.",
      lookTitle: "Niche, joint, opening.",
      film: ["Handleless", "To measure", "Full height", "Niche"],
      looks: ["Channel or tip", "Millimetre", "To the ceiling", "Slope", "Fill", "Opening"],
      facts: [
        { value: "Grid", label: "ends here" },
        { value: "Millimetre", label: "at the wall" },
        { value: "Opening", label: "before the face" },
        { value: "Height", label: "without a dust shelf" },
      ],
      seoTitle: "Particular kitchens | BEER Küchenmanufaktur",
      seoDescription:
        "Small kitchens, handleless kitchens, full-height cupboards and kitchens to measure. Workshop in Wolfersdorf.",
    },
  },
};

const TOPIC_EN: Record<string, { name: string; intro: string }> = {
  zeile: {
    name: "Galley",
    intro: "One clear line. For a narrow room often the honester answer than a cramped U.",
  },
  "l-form": {
    name: "L-shape",
    intro: "Two runs, open paths. In a living kitchen often the quieter alternative to a U.",
  },
  "u-form": {
    name: "U-shape",
    intro: "More worktop and store, a closed workplace. It needs width.",
  },
  offen: {
    name: "Open kitchen",
    intro: "The kitchen as furniture in the living room: views, extraction and store belong together.",
  },
  insel: {
    name: "Kitchen with island",
    intro: "Island as worktop and meeting point — only with paths around it.",
  },
  klein: {
    name: "Small kitchens",
    intro: "Centimetres, niches, height. Made-to-measure earns its keep where grid sizes end.",
  },
  modern: {
    name: "Modern kitchens",
    intro: "Quiet faces, clear joints, little décor. Modern here means precise, not cold.",
  },
  landhaus: {
    name: "Country kitchens",
    intro: "Wood, frame, warmth — without costume. The house sets the tone.",
  },
  design: {
    name: "Design kitchens",
    intro: "Not a show kitchen. Clear joints, fitting appliances, materials you like to touch.",
  },
  holz: {
    name: "Wood kitchens",
    intro: "Oak, walnut, ash — material, not a style name. Cut and worktop decide.",
  },
  purist: {
    name: "Purist kitchens",
    intro: "Handleless, flush, reserved. Fit for the day if opening and drawers work.",
  },
  luxus: {
    name: "Luxury kitchens",
    intro: "Luxury as measure and stone, not as hardware theatre.",
  },
  weiss: {
    name: "White kitchens",
    intro: "Light and quiet. The surface decides how the day looks.",
  },
  schwarz: {
    name: "Black kitchens",
    intro: "Black needs light and a counterweight of wood or stone.",
  },
  salbei: {
    name: "Sage kitchens",
    intro: "Between country and modern. We sample the tone on the wall.",
  },
  grau: {
    name: "Grey kitchens",
    intro: "Grey as calm, not as a compromise. Warm or cool — according to the stone.",
  },
  kochinsel: {
    name: "Cooking island",
    intro: "Hob and often extraction in the middle of the room. Kit thought through under the top.",
  },
  arbeitsinsel: {
    name: "Work island",
    intro: "A clear top for prep. No hob, store and a seating edge if the path remains.",
  },
  essinsel: {
    name: "Island with seating",
    intro: "Cook and sit at one edge. Overhang, knee room, sockets.",
  },
  grifflos: {
    name: "Handleless kitchens",
    intro: "Quiet fronts, tip-on or a channel. Shows fingerprints sooner — and order better.",
  },
  "nach-mass": {
    name: "To measure",
    intro: "Not a grid, the room. Niches, slopes, fills to the millimetre.",
  },
  raumhoch: {
    name: "Full-height kitchens",
    intro: "Store to the ceiling, without a dust shelf. Upper cupboards must stay reachable.",
  },
};

const POINTS_EN: Record<string, string[]> = {
  zeile: [
    "One wall, a narrow plan, a gallery.",
    "Sink, hob and worktop in a line, without crossing.",
    "Little prep space beside the hob.",
  ],
  "l-form": [
    "A free corner, often the living kitchen.",
    "Two runs. The corner stays a work zone, not a dump.",
    "More open than a U, more surface than a galley.",
  ],
  "u-form": [
    "Width and depth. Store on three sides.",
    "A closed workplace, short paths between sink and hob.",
    "A path must remain in the middle. Otherwise the form tightens.",
  ],
  offen: [
    "The kitchen stands in living, not behind a door.",
    "View, extraction and store belong in the same drawing.",
    "Furniture in the room, not an appliance wall.",
  ],
  insel: [
    "Paths around the island, not only in front of it.",
    "Worktop and meeting point. Both need an edge.",
    "Not every plan carries an island. A galley is sometimes honester.",
  ],
  klein: [
    "Niche, apartment, leftover space.",
    "Height, depth and centimetres. Grid sizes end here.",
    "Interiors before the front. Every drawer must be reachable.",
  ],
  modern: [
    "Quiet fronts, clear joints, little décor.",
    "Precise, not cold. Wood or stone gives warmth.",
    "Handles, light and drawers decide whether the calm holds.",
  ],
  landhaus: [
    "Wood and frame, without costume.",
    "The old house or the house sets the tone, not a catalogue style.",
    "Stone or a quiet top holds the frames together.",
  ],
  design: [
    "Clear edges, fitting appliances, little ornament.",
    "What you touch counts more than the view.",
    "Light from two sides, or a dark face grows heavy.",
  ],
  holz: [
    "Oak, walnut, ash. Material, not a style name.",
    "Cut, oil or lacquer decide the day.",
    "Stone or ceramic against the wood, not a second wood.",
  ],
  purist: [
    "Handleless or flush. The line stays quiet.",
    "Tip-on or a channel. Heavy drawers need an honest opening.",
    "Reserved only if store and light work.",
  ],
  luxus: [
    "Fit and stone, not hardware theatre.",
    "What you use every day sits in the work zone.",
    "Fewer faces that want to be seen.",
  ],
  weiss: [
    "Light and quiet. The undertone decides against stone and light.",
    "Matt, silk or texture. The day shows there.",
    "On the wall, not on a screen.",
  ],
  schwarz: [
    "Black needs daylight or aimed light.",
    "Wood or stone, or the face grows heavy.",
    "Fingers and dust show. The opening has to fit.",
  ],
  salbei: [
    "Between country and modern. Not every green is sage.",
    "Lacquer, not foil. The stone holds the colour quiet.",
    "Next to wall and floor, before the front is fixed.",
  ],
  grau: [
    "Warm or cool, according to stone and light.",
    "Grey as a decision, not a compromise between white and black.",
    "Against a white wall the kitchen stays clear.",
  ],
  kochinsel: [
    "Hob and often extraction in the middle. Services under the top.",
    "Work all around, not from one side only.",
    "Extraction belongs in the drawing, not afterwards.",
  ],
  arbeitsinsel: [
    "Prep and set-down. No hob.",
    "Drawers under the top, seating only if the path remains.",
    "Work height and seating height are not the same.",
  ],
  essinsel: [
    "Cook and sit at one piece. The overhang carries the knees.",
    "Knee room, sockets, distance to the work zone.",
    "Who sits, sits in the path of cooking. That is drawn.",
  ],
  grifflos: [
    "Quiet face. Opening by channel or tip-on.",
    "Heavy drawers prefer a channel to a tipper.",
    "Fingers show. Order too.",
  ],
  "nach-mass": [
    "Niche, slope, old wall. Not the grid size.",
    "Millimetres at the wall, not a panel as an excuse.",
    "The drawing follows the room before the front is fixed.",
  ],
  raumhoch: [
    "To the ceiling, without a dust shelf.",
    "Upper cupboards stay usable, or they are rare goods.",
    "Ceiling, wall and front have to meet.",
  ],
};

function topicCopy(topic: KitchenTopic, locale: Locale) {
  if (locale === "en") {
    const pack = TOPIC_EN[topic.slug];
    if (pack) {
      return pack;
    }
  }
  return { name: topic.name, intro: topic.intro };
}

function topicPoints(slug: string, locale: Locale) {
  if (locale === "en") {
    return POINTS_EN[slug] ?? ["Drawn to measure", "Made in Wolfersdorf", "Fitted on site"];
  }
  const notes = TOPIC_NOTES[slug];
  if (notes?.length) {
    return notes.map((note) => note.text);
  }
  return ["Auf Maß gezeichnet", "In Wolfersdorf gefertigt", "Vor Ort montiert"];
}

const SIBLING_TEXT: Record<Locale, Record<KitchenClusterSlug, string>> = {
  de: {
    formen: "Die Form folgt dem Grundriss.",
    stile: "Haltung, die zum Haus passt.",
    farben: "Farbe am Muster, unter Tageslicht.",
    inseln: "Nur wenn der Raum Wege lässt.",
    besondere: "Dort, wo das Raster endet.",
  },
  en: {
    formen: "The layout follows the plan.",
    stile: "A stance that fits the house.",
    farben: "Colour on a sample, in daylight.",
    inseln: "Only if the room leaves paths.",
    besondere: "Where the grid ends.",
  },
};

export function presentCluster(
  slug: KitchenClusterSlug,
  locale: Locale,
  topics: KitchenTopic[],
  projects: Project[],
): PresentedCluster {
  const copy = COPY[locale][slug];
  const parent = PARENT[locale];
  const visit = VISIT[locale];
  const start = OFFSET[slug];
  const photo = (n: number, width?: number) => devPhoto(start + n, width);

  const branches: PresentedBranch[] = topics.map((topic, index) => {
    const local = topicCopy(topic, locale);
    return {
      href: `/kuechen/${slug}/${topic.slug}`,
      title: local.name,
      text: local.intro,
      image: resolveDevImage(topic.image, photo(16 + index * 3)),
      imageB: photo(17 + index * 3, 1200),
      imageC: photo(18 + index * 3, 1200),
      alt: local.name,
      kicker: String(index + 1).padStart(2, "0"),
      points: topicPoints(topic.slug, locale),
      caption: copy.looks[index % copy.looks.length] ?? local.name,
      hex: topic.hex || undefined,
    };
  });

  const filmCaptions = copy.film;
  const lookCaptions = copy.looks;

  return {
    locale,
    eyebrow: copy.eyebrow,
    title: copy.title,
    emphasis: copy.emphasis,
    lede: copy.lede,
    statement: copy.statement,
    statementNote: copy.statementNote,
    heroImage: resolveDevImage(topics[0]?.image, photo(0)),
    heroAlt: topics[0] ? topicCopy(topics[0], locale).name : copy.title,
    indexEyebrow: copy.indexEyebrow,
    quote: copy.quote,
    quoteSource: copy.quoteSource,
    ctaLabel: copy.ctaLabel,
    ctaHref: "/beratung",
    closeTitle: copy.closeTitle,
    closeText: copy.closeText,
    parentHref: parent.href,
    parentLabel: parent.label,
    statementImage: photo(1),
    statementImageB: photo(2),
    closeImage: photo(3),
    ledgerImage: photo(4),
    visitImage: photo(5),
    filmstrip: [0, 1, 2, 3].map((slot) => ({
      src: photo(6 + slot, 1000),
      alt: filmCaptions[slot] ?? copy.title,
      caption: filmCaptions[slot] ?? copy.title,
    })),
    facts: copy.facts,
    ledgerLine: copy.ledgerLine,
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
    siblings: KITCHEN_CLUSTERS.filter((item) => item.slug !== slug).map(
      (item, index) => ({
        href: `/kuechen/${item.slug}`,
        title: COPY[locale][item.slug].title,
        text: SIBLING_TEXT[locale][item.slug],
        image: photo(70 + index, 1100),
      }),
    ),
    houses: projects.slice(0, 4).map((project, index) => ({
      href: `/projekte/${project.slug}`,
      title: project.title,
      meta: [project.place, project.year].filter(Boolean).join(" · "),
      image: resolveDevImage(project.image, photo(80 + index, 1200)),
    })),
    swatches: topics
      .filter((topic) => topic.hex)
      .map((topic) => ({
        href: `/kuechen/${slug}/${topic.slug}`,
        title: topicCopy(topic, locale).name,
        hex: topic.hex,
      })),
  };
}

export function clusterLookTitle(slug: KitchenClusterSlug, locale: Locale) {
  return COPY[locale][slug].lookTitle;
}

export async function clusterMetadata(
  slug: KitchenClusterSlug,
): Promise<Metadata> {
  const copy = COPY[await getRequestLocale()][slug];
  return {
    title: copy.seoTitle,
    description: copy.seoDescription,
  };
}
