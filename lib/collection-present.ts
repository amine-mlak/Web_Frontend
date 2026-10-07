import {
  collectionHub,
  type CollectionBranch,
  type CollectionHubCopy,
  type CollectionHubId,
} from "@/lib/collection-hubs";
import { devPhoto, resolveDevImage } from "@/lib/dev-images";
import type { Locale } from "@/lib/i18n";

export type CollectionFact = {
  value: string;
  label: string;
};

export type CollectionLook = {
  src: string;
  alt: string;
  caption: string;
};

export type PresentedBranch = CollectionBranch & {
  kicker: string;
  points: string[];
  caption: string;
  imageB: string;
  imageC: string;
  hex?: string;
};

export type HubCrumb = {
  href: string;
  label: string;
};

export type PresentedHub = Omit<CollectionHubCopy, "branches"> & {
  id?: CollectionHubId;
  parentHref?: string;
  parentLabel?: string;
  crumbs?: HubCrumb[];
  hex?: string;
  locale: Locale;
  statementImage: string;
  statementImageB: string;
  closeImage: string;
  ledgerImage: string;
  visitImage: string;
  filmstrip: CollectionLook[];
  facts: CollectionFact[];
  ledgerLine: string;
  looks: CollectionLook[];
  branches: PresentedBranch[];
  visitPlace: string;
  visitLine: string;
  visitNote: string;
  priceLine: string;
  placeLine: string;
};

const OFFSET: Record<CollectionHubId, number> = {
  kuechen: 0,
  material: 13,
  geraete: 26,
  moebel: 39,
  projekte: 52,
  regionen: 65,
  marken: 5,
  ratgeber: 18,
  planen: 31,
  ueber: 44,
};

const POINTS_DE: Record<string, string[]> = {
  Küchenformen: ["Zeile, wenn der Raum schmal ist", "L und U nur mit echten Laufwegen", "Insel nie um ihrer selbst willen"],
  Küchenstile: ["Haltung des Hauses, nicht des Jahres", "Modern heißt präzise, nicht kalt", "Holz als Material, nicht als Kostüm"],
  Küchenfarben: ["Farbe am Muster, unter Tageslicht", "Schwarz braucht ein Gegengewicht", "Salbei zwischen Landhaus und Moderne"],
  Kücheninseln: ["Nur mit Wegen darum herum", "Technik unter der Platte mitdenken", "Sitzkante mit Beinfreiheit"],
  "Besondere Küchen": ["Raster endet an der Nische", "Raumhoch ohne Staubkante", "Grifflos, wenn die Öffnung stimmt"],
  Fronten: ["Matt, seidenmatt, Holzsicht", "Lack, den man nicht poliert", "Fenix, wo Finger stören würden"],
  Arbeitsplatten: ["Stein als Unikat", "Keramik mit ehrlicher Kante", "Holz, das Öl will"],
  Innenleben: ["Vollauszüge vor der Front", "Ecken, die man erreicht", "Vorrat, der den Alltag trägt"],
  "Spüle & Armatur": ["Mit der Platte gezeichnet", "Quooker als Tank, nicht als Nachtrag", "Unterbau, der sitzt"],
  Kochen: ["Induktion, Gas, unsichtbar", "Abzug in der Platte, wenn die Esse stört", "Korpus und Kabel zuerst"],
  "Backen & Dämpfen": ["Ofen auf Griffhöhe", "Dampf mit Wasseranschluss", "Wärmeschublade nur wenn sie arbeitet"],
  Kälte: ["Nische und Lüftung zuerst", "Vollintegriert oder als Schrank", "Die Tür kommt zuletzt"],
  Spülen: ["Vollintegriert neben der Spüle", "Knock-to-open an griffloser Front", "Anschluss im Aufmaß"],
  Extra: ["Kaffee auf Augenhöhe", "Nur was der Alltag trägt", "Wasser und Ablauf gezeichnet"],
  Einbauschränke: ["Nischen und Schrägen", "Raumhohe Füllungen", "Dasselbe Aufmaß wie die Küche"],
  Ankleiden: ["Maß vor System", "Dieselbe Manufaktur", "Licht und Griffwege"],
  "Tische & Bänke": ["Länge nach dem Raum", "Kante in der Sprache der Küche", "Holz, das man täglich berührt"],
  Wohnmöbel: ["Nur was zum Haus gehört", "Sideboard und Einbau", "Keine Katalogwand"],
  München: ["Ausstellung in Wolfersdorf", "Aufmaß in der Stadt", "Montage durch uns"],
  Freising: ["Kurzer Weg zur Ausstellung", "Oft der erste Termin", "Manufaktur vor der Haustür"],
  Erding: ["Östlich von München", "Bestand und Neubau", "Aufmaß vor Ort"],
  Pfaffenhofen: ["Nördlich ins Landkreisgebiet", "Ohne Filiale vor Ort", "Weg, der zur Werkstatt trägt"],
  Kosten: ["Kein Prospektpreis", "Stein, Maß, Zeit", "Rahmen im Erstgespräch"],
  Planung: ["Gespräch, Aufmaß, Freigabe", "Visualisierung ist Annäherung", "Verbindlich nach dem Maß"],
  "Geräte & Technik": ["Abzug oder Esse", "Leistung ehrlich benennen", "Offene Räume brauchen Luft"],
  Fragen: ["Termin zu früh?", "Pinterest erlaubt", "Der erste Schritt kostet nichts"],
  "Ausstellung Freising": ["Muster unter Tageslicht", "Gebaute Details", "Mit Termin"],
  "Beratung & Termin": ["Bilder statt Plan", "Kurze Schritte", "Dann vor Ort"],
  Unterlagen: ["Kein dicker Katalog", "Was Sie brauchen, schicken wir", "Oder Sie holen es"],
  "Vorher klären": ["Vier, fünf Fragen", "Danach das Gespräch", "Zeichnen tun wir später"],
  Werkstatt: ["Jedes Element als Einzelstück", "Aufmaß, Fertigung, Montage", "Eine Verantwortung"],
  "Wenige Aufträge": ["Kapazität ist Qualität", "Keine Serie nebenan", "Zeit in der Manufaktur"],
  "Häuser, nicht Hallen": ["Was wir zeigen, steht", "Ort, Jahr, Stein, Gerät", "Kein Showraum aus der Halle"],
  Radius: ["Wolfersdorf als Mitte", "Umland Münchens", "Weiteres ehrlich klären"],
};

const POINTS_EN: Record<string, string[]> = {
  Layouts: ["Galley when the room is narrow", "L and U only with real paths", "Never an island for its own sake"],
  Styles: ["The house sets the tone", "Modern means precise, not cold", "Wood as material, not costume"],
  Colours: ["Colour on a sample, in daylight", "Black needs a counterweight", "Sage between country and modern"],
  Islands: ["Only with paths around it", "Kit thought through under the top", "Seating with knee room"],
  "Particular kitchens": ["The grid ends at the niche", "Full height without a dust shelf", "Handleless if the opening works"],
  Fronts: ["Matt, silk, wood face", "Lacquer you do not polish to a shine", "Fenix where fingerprints would shout"],
  Worktops: ["Stone as a one-off", "Ceramic with an honest edge", "Wood that wants oil"],
  Interiors: ["Full-extension before the front", "Corners you can reach", "Stores that carry the day"],
  "Sink & tap": ["Drawn with the top", "Quooker as a tank, not an afterthought", "Undermount that sits"],
  Cooking: ["Induction, gas, unseen", "Downdraft if a hood spoils the view", "Carcass and cable first"],
  "Baking & steam": ["Oven at hand height", "Steam with a water feed", "Warming drawer only if it works"],
  Cold: ["Niche and ventilation first", "Fully integrated or as a cabinet", "The door comes last"],
  "Washing up": ["Fully integrated by the sink", "Knock-to-open on a handleless front", "Services in the survey"],
  Extra: ["Coffee at eye height", "Only what the day will use", "Water and waste drawn in"],
  "Built-in cupboards": ["Niches and slopes", "Full-height fills", "The same survey as the kitchen"],
  "Dressing rooms": ["Measure before a system", "The same workshop", "Light and reach"],
  "Tables & benches": ["Length from the room", "An edge in the kitchen's language", "Wood you touch every day"],
  "Living furniture": ["Only what belongs to the house", "Sideboard and built-in", "No catalogue wall"],
  Munich: ["Showroom in Wolfersdorf", "Survey in the city", "Fitting by us"],
  Freising: ["Short path to the showroom", "Often the first appointment", "Workshop at the door"],
  "Freising showroom": ["Samples in daylight", "Built details", "By appointment"],
  "Advice & appointment": ["Pictures, not a plan", "Short steps", "Then on site"],
  Papers: ["No thick catalogue", "We send what you need", "Or you collect it"],
  "Clear first": ["Four or five questions", "Then the conversation", "Drawing comes later"],
  "The shop": ["Every element a one-off", "Survey, making, fitting", "One responsibility"],
  "Few commissions": ["Capacity is quality", "No series next door", "Time in the workshop"],
  "Houses, not halls": ["What we show stands", "Place, year, stone, kit", "No hall show kitchen"],
  Cost: ["No brochure figure", "Stone, measure, time", "A frame in the first talk"],
  Planning: ["Talk, survey, approval", "A visualisation is an approach", "Binding after the measure"],
  Appliances: ["Downdraft or hood", "Name the performance honestly", "Open rooms need air"],
  Questions: ["Appointment too early?", "Pinterest is allowed", "The first step costs nothing"],
};

const FALLBACK_POINTS: Record<Locale, string[]> = {
  de: ["Auf Maß gezeichnet", "In Wolfersdorf gefertigt", "Vor Ort montiert"],
  en: ["Drawn to measure", "Made in Wolfersdorf", "Fitted on site"],
};

const FACTS: Record<Locale, Record<CollectionHubId | "default", CollectionFact[]>> = {
  de: {
    default: [
      { value: "Wolfersdorf", label: "Manufaktur" },
      { value: "Auf Maß", label: "Kein Raster" },
      { value: "Wenige", label: "Aufträge im Jahr" },
      { value: "~200 km", label: "um München" },
    ],
    kuechen: [
      { value: "Unikat", label: "Jedes Stück" },
      { value: "Aufmaß", label: "vor der Bestellung" },
      { value: "Werkstatt", label: "Wolfersdorf" },
      { value: "Stein", label: "nicht Folie" },
    ],
    material: [
      { value: "Muster", label: "unter Tageslicht" },
      { value: "Stein", label: "als Unikat" },
      { value: "Lack", label: "matt, nicht Hochglanz" },
      { value: "Auszug", label: "stiller als die Front" },
    ],
    geraete: [
      { value: "Frei", label: "keine Vertragsküche" },
      { value: "Nische", label: "vor dem Gerät" },
      { value: "Blick", label: "ohne erzwungene Esse" },
      { value: "Griffhöhe", label: "wo der Alltag sitzt" },
    ],
    moebel: [
      { value: "Maß", label: "vor dem System" },
      { value: "Holz", label: "derselben Werkstatt" },
      { value: "Nische", label: "Schräge, Füllung" },
      { value: "Haus", label: "nicht Katalog" },
    ],
    projekte: [
      { value: "Ort", label: "kein Hallenlook" },
      { value: "Jahr", label: "gebaut, nicht gestellt" },
      { value: "Stein", label: "und Gerät genannt" },
      { value: "Wenige", label: "vollständig gezeigt" },
    ],
    regionen: [
      { value: "Wolfersdorf", label: "Ausstellung" },
      { value: "München", label: "Aufmaß in der Stadt" },
      { value: "200 km", label: "ehrlicher Radius" },
      { value: "Wir", label: "montieren selbst" },
    ],
    marken: [
      { value: "BEER", label: "der Korpus" },
      { value: "Frei", label: "die Gerätewahl" },
      { value: "Aufgabe", label: "nicht das Logo" },
      { value: "Nische", label: "entscheidet mit" },
    ],
    ratgeber: [
      { value: "Wenig", label: "Texte, klare Fragen" },
      { value: "Kein", label: "Prospektpreis" },
      { value: "Erst", label: "lesen, dann kommen" },
      { value: "Gespräch", label: "am Haus, nicht an Basics" },
    ],
    planen: [
      { value: "Gespräch", label: "kostenlos" },
      { value: "Aufmaß", label: "macht verbindlich" },
      { value: "Freigabe", label: "vor der Fertigung" },
      { value: "Montage", label: "durch uns" },
    ],
    ueber: [
      { value: "Haltung", label: "keine Kette" },
      { value: "Eine", label: "Werkstatt" },
      { value: "Wenige", label: "Küchen im Jahr" },
      { value: "Maß", label: "Stein, Zeit" },
    ],
  },
  en: {
    default: [
      { value: "Wolfersdorf", label: "Workshop" },
      { value: "To measure", label: "No grid" },
      { value: "Few", label: "commissions a year" },
      { value: "~200 km", label: "around Munich" },
    ],
    kuechen: [
      { value: "One-off", label: "every piece" },
      { value: "Survey", label: "before the order" },
      { value: "Workshop", label: "Wolfersdorf" },
      { value: "Stone", label: "not foil" },
    ],
    material: [
      { value: "Samples", label: "in daylight" },
      { value: "Stone", label: "as a one-off" },
      { value: "Lacquer", label: "matt, not gloss" },
      { value: "Drawer", label: "quieter than the front" },
    ],
    geraete: [
      { value: "Free", label: "no tied brands" },
      { value: "Niche", label: "before the appliance" },
      { value: "View", label: "without a forced hood" },
      { value: "Hand height", label: "where the day sits" },
    ],
    moebel: [
      { value: "Measure", label: "before a system" },
      { value: "Wood", label: "from the same shop" },
      { value: "Niche", label: "slope, fill" },
      { value: "House", label: "not a catalogue" },
    ],
    projekte: [
      { value: "Place", label: "not a hall look" },
      { value: "Year", label: "built, not staged" },
      { value: "Stone", label: "and kit named" },
      { value: "Few", label: "shown in full" },
    ],
    regionen: [
      { value: "Wolfersdorf", label: "showroom" },
      { value: "Munich", label: "survey in the city" },
      { value: "200 km", label: "honest radius" },
      { value: "Us", label: "fitting ourselves" },
    ],
    marken: [
      { value: "BEER", label: "the carcass" },
      { value: "Free", label: "the choice of kit" },
      { value: "Task", label: "not the logo" },
      { value: "Niche", label: "decides with us" },
    ],
    ratgeber: [
      { value: "Few", label: "texts, clear questions" },
      { value: "No", label: "brochure price" },
      { value: "Read", label: "then come" },
      { value: "Talk", label: "about the house" },
    ],
    planen: [
      { value: "Talk", label: "is free" },
      { value: "Survey", label: "makes it binding" },
      { value: "Approval", label: "before making" },
      { value: "Fitting", label: "by us" },
    ],
    ueber: [
      { value: "Stance", label: "not a chain" },
      { value: "One", label: "workshop" },
      { value: "Few", label: "kitchens a year" },
      { value: "Measure", label: "stone, time" },
    ],
  },
};

const LOOK_CAPTION: Record<Locale, Partial<Record<CollectionHubId, string[]>> & { default: string[] }> = {
  de: {
    default: ["Eiche, geölt", "Stein, Unikat", "Front, matt", "Kante, Maß", "Griff, still", "Licht aus dem Haus"],
    material: ["Lack, seidenmatt", "Maserung, echt", "Kante, Stein", "Auszug, still", "Fuge, präzise", "Muster, Tageslicht"],
    geraete: ["Platte, Abzug", "Ofen, Griffhöhe", "Nische zuerst", "Vollintegriert", "Kabel im Aufmaß", "Blick ohne Esse"],
    moebel: ["Holz derselben Werkstatt", "Nische, Füllung", "Kante der Küche", "Länge nach dem Raum", "Kein Katalog", "Einbau, nicht Wand"],
    projekte: ["Ort, genannt", "Jahr, gebaut", "Stein und Gerät", "Kein Hallenlook", "Wege gezeichnet", "Haus, nicht Pose"],
    regionen: ["Wolfersdorf", "München, Aufmaß", "Freising, nah", "Erding, Bestand", "Landkreis, Weg", "Radius, ehrlich"],
  },
  en: {
    default: ["Oak, oiled", "Stone, one-off", "Front, matt", "Edge, measure", "Handle, quiet", "Light from the house"],
    material: ["Lacquer, silk", "Grain, true", "Stone edge", "Drawer, quiet", "Joint, precise", "Sample, daylight"],
    geraete: ["Top, downdraft", "Oven, hand height", "Niche first", "Fully integrated", "Cable in the survey", "View without a hood"],
    moebel: ["Wood from the same shop", "Niche, fill", "Kitchen edge", "Length from the room", "No catalogue", "Built-in, not a wall"],
    projekte: ["Place, named", "Year, built", "Stone and kit", "No hall look", "Paths drawn", "House, not a pose"],
    regionen: ["Wolfersdorf", "Munich, survey", "Freising, near", "Erding, existing", "The district", "Radius, honest"],
  },
};

const FILM_CAPTION: Record<Locale, string[]> = {
  de: ["Insel, nur mit Wegen", "Holz gegen Stein", "Licht aus dem Haus", "Alltag, nicht Pose"],
  en: ["Island, only with paths", "Wood against stone", "Light from the house", "Everyday, not a pose"],
};

const LEDGER_LINE: Record<Locale, string> = {
  de: "Wenige Küchen im Jahr — jede als Unikat, in einer Werkstatt, für Häuser die das tragen.",
  en: "Few kitchens a year — each a one-off, in one workshop, for houses that can carry it.",
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

function pointsFor(title: string, locale: Locale) {
  const pack = locale === "en" ? POINTS_EN : POINTS_DE;
  return pack[title] ?? FALLBACK_POINTS[locale];
}

function lookCaptions(id: CollectionHubId, locale: Locale) {
  const pack = LOOK_CAPTION[locale];
  return pack[id] ?? pack.default;
}

export function presentHub(
  id: CollectionHubId,
  locale: Locale,
  branches?: CollectionBranch[],
): PresentedHub {
  const copy = collectionHub(id, locale);
  const source = branches && branches.length > 0 ? branches : copy.branches;
  const start = OFFSET[id];
  const photo = (n: number, width?: number) => devPhoto(start + n, width);
  const captions = lookCaptions(id, locale);
  const visit = VISIT[locale];

  const presented: PresentedBranch[] = source.map((branch, index) => ({
    ...branch,
    image: resolveDevImage(branch.image, photo(16 + index * 3)),
    imageB: photo(17 + index * 3, 1200),
    imageC: photo(18 + index * 3, 1200),
    kicker: String(index + 1).padStart(2, "0"),
    points: pointsFor(branch.title, locale),
    caption: captions[index % captions.length] ?? branch.title,
    alt: branch.alt || branch.title,
  }));

  return {
    ...copy,
    id,
    locale,
    heroImage: resolveDevImage(copy.heroImage, photo(0)),
    statementImage: photo(1),
    statementImageB: photo(2),
    closeImage: photo(3),
    ledgerImage: photo(4),
    visitImage: photo(5),
    filmstrip: [0, 1, 2, 3].map((slot) => ({
      src: photo(6 + slot, 1000),
      alt: copy.title,
      caption: FILM_CAPTION[locale][slot] ?? copy.title,
    })),
    facts: FACTS[locale][id] ?? FACTS[locale].default,
    ledgerLine: LEDGER_LINE[locale],
    looks: captions.map((caption, slot) => ({
      src: photo(10 + slot, 1100),
      alt: caption,
      caption,
    })),
    branches: presented,
    heroAlt: copy.heroAlt,
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
  };
}
