import type { Metadata } from "next";
import { jobsFrom, type Job } from "@/lib/careers";
import { FALLBACK_PAGES, type PagePoint, type SitePage } from "@/lib/catalog";
import { fetchSitePage } from "@/lib/catalog-api";
import type { ClusterSibling } from "@/lib/collection-clusters";
import { presentHub, type CollectionFact, type PresentedHub } from "@/lib/collection-present";
import { cmsLarge } from "@/lib/beer-photos";
import { isStockPhoto } from "@/lib/dev-images";
import {
  SIBLING_IMAGES,
  reserveShots,
  sizedMedia,
  type HouseLayout,
  type HousePerson,
  type HouseShot,
} from "@/lib/house-photos";
import type { Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/locale";
import { photoKey } from "@/lib/utils";
import { brandedTitle, pageMetadata } from "@/lib/seo";
import type { FaqContent } from "@/lib/strapi";

export type HouseKind = "house" | "guide" | "contact" | "legal";

export type PresentedHouse = PresentedHub & {
  slug: string;
  kind: HouseKind;
  layout: HouseLayout;
  body: string;
  bodyTitle: string;
  showLead: boolean;
  siblings: ClusterSibling[];
  faq: FaqContent | null;
  gallery: HouseShot[];
  people: HousePerson[];
  /** Last change in the CMS ("Stand" on legal pages). */
  updatedAt?: string;
  /** Job ads (Karriere only), from the page's "punkte" list in the CMS. */
  jobs: Job[];
  /** CMS points with a photo: on the showroom, each one is an area with its photos. */
  rooms: PagePoint[];
};

type Voice = {
  kind: HouseKind;
  emphasis: string;
  statement: string;
  statementNote: string;
  closeTitle: string;
  closeText: string;
  bodyTitle: string;
  facts: CollectionFact[];
  ledger: string;
  seed: number;
  heroFile: string;
  showLead?: boolean;
};

const LEGAL = new Set(["impressum", "datenschutz", "agb", "cookies"]);

// Headings while the CMS "Seitentitel" is empty (the emphasis comes after it).
const HOUSE_TITLE: Record<Locale, Record<string, string>> = {
  de: {
    ueber: "Über BEER",
    "kueche-planen": "Küche planen",
    ausstellung: "Ausstellung",
    kontakt: "Kontakt",
    katalog: "Katalog",
    team: "Team",
    nachhaltigkeit: "Nachhaltigkeit",
    karriere: "Karriere",
    impressum: "Impressum",
    datenschutz: "Datenschutz",
    agb: "AGB",
  },
  en: {
    ueber: "About BEER",
    "kueche-planen": "Plan your kitchen",
    ausstellung: "Showroom",
    kontakt: "Contact",
    katalog: "Catalogue",
    team: "Team",
    nachhaltigkeit: "Sustainability",
    karriere: "Careers",
    impressum: "Legal notice",
    datenschutz: "Privacy",
    agb: "Terms",
  },
};

function builtInTitle(slug: string, locale: Locale) {
  return HOUSE_TITLE[locale][slug] ?? HOUSE_TITLE.de[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

const VOICE: Record<Locale, Record<string, Voice>> = {
  de: {
    ueber: {
      kind: "house",
      emphasis: "eine Haltung.",
      statement:
        "BEER baut keine Filialkette und keinen Markenzwang. Wir bauen Küchen, die zu den kostspieligsten im Land zählen — weil Maß, Stein und Zeit in der Manufaktur nicht verhandelbar sind.",
      statementNote: "Einzugsgebiet um München. Fertigung in einer Hand. Montage durch uns.",
      closeTitle: "Kommen Sie vorbei.",
      closeText:
        "Die Ausstellung ist der Ort, an dem Haltung anfassbar wird. Ein Termin macht daraus ein Gespräch.",
      bodyTitle: "In einer Hand.",
      facts: [
        { value: "Haltung", label: "keine Kette" },
        { value: "Eine", label: "Werkstatt" },
        { value: "Wenige", label: "Küchen im Jahr" },
        { value: "Maß", label: "Stein, Zeit" },
      ],
      ledger: "Wenige Küchen im Jahr. Jede in einer Hand.",
      seed: 44,
      heroFile: "stile-purist.jpg",
    },
    "kueche-planen": {
      kind: "guide",
      emphasis: "ohne Raster.",
      statement:
        "Gezeichnet wird, was der Raum trägt. Visualisierung ist Annäherung. Verbindlich wird die Planung nach Aufmaß — und nach einem Preis, der zur Manufaktur passt, nicht zum Programm.",
      statementNote:
        "Der Preis folgt dem Aufmaß, dem Stein, den Stunden in der Werkstatt.",
      closeTitle: "Ein Termin reicht zum Anfang.",
      closeText:
        "Ausstellung oder bei Ihnen. Bilder mitbringen, Pinterest erlaubt. Zeichnen tun wir später.",
      bodyTitle: "Vier Schritte, keine Choreografie.",
      facts: [
        { value: "Gespräch", label: "kostenlos" },
        { value: "Aufmaß", label: "macht verbindlich" },
        { value: "Freigabe", label: "vor der Fertigung" },
        { value: "Montage", label: "durch uns" },
      ],
      ledger: "Verbindlich nach dem Aufmaß, nicht nach dem Bild.",
      seed: 31,
      heroFile: "stile-insel.jpg",
    },
    ausstellung: {
      kind: "house",
      emphasis: "kein Möbelhaus.",
      statement:
        "In Wolfersdorf stehen Materialien, Kanten und gebaute Details unter Tageslicht. Keine Halle voller Zeilen. Ein Studio, in dem das Gespräch beim Haus beginnt.",
      statementNote: "Spontane Besuche möglich. Ein ruhiges Gespräch ohne Termin nicht immer.",
      closeTitle: "Mit Termin wird es ein Gespräch.",
      closeText:
        "Wir öffnen Muster und Querschnitte, wenn Zeit da ist.",
      bodyTitle: "Ausstellung Wolfersdorf.",
      facts: [
        { value: "Wolfersdorf", label: "bei Freising" },
        { value: "Muster", label: "unter Tageslicht" },
        { value: "Termin", label: "macht Zeit" },
        { value: "Keine", label: "Filiale" },
      ],
      ledger: "Ganze Küchen, Muster und Geräte zum Anfassen.",
      seed: 8,
      heroFile: "stile-landhaus.jpg",
    },
    kontakt: {
      kind: "contact",
      emphasis: "ein Ort.",
      statement:
        "Ausstellung und Manufaktur sitzen in Badendorf. Schreiben Sie uns, oder kommen Sie vorbei — für ein geplantes Gespräch empfehlen wir einen Termin.",
      statementNote: "Mo–Fr 9–18 Uhr · Sa 9–14 Uhr. T 08168 909910.",
      closeTitle: "Eine Nachricht genügt.",
      closeText:
        "Kein Callcenter. Die Anfrage landet bei uns in Wolfersdorf.",
      bodyTitle: "BEER GmbH.",
      facts: [
        { value: "Badendorf 6", label: "85395 Wolfersdorf" },
        { value: "Mo–Fr", label: "9–18 Uhr" },
        { value: "Sa", label: "9–14 Uhr" },
        { value: "Termin", label: "vor dem Gespräch" },
      ],
      ledger: "Ein Hof. Ausstellung und Werkstatt.",
      seed: 20,
      heroFile: "stile-modern.jpg",
      showLead: true,
    },
    katalog: {
      kind: "guide",
      emphasis: "kein Ordner.",
      statement:
        "Wir schicken, was zur Frage passt — nicht alles, was gedruckt ist. Ein dicker Katalog wäre ein Versprechen, das die Manufaktur nicht gibt.",
      statementNote: "Sagen Sie uns, wonach Sie suchen. Oder holen Sie die Unterlagen in der Ausstellung.",
      closeTitle: "Was hilft, nicht was wirft.",
      closeText: "Eine kurze Nachricht reicht. Wir antworten aus Wolfersdorf.",
      bodyTitle: "Unterlagen auf Anfrage.",
      facts: [
        { value: "Kein", label: "Werbeordner" },
        { value: "Anfrage", label: "statt Abo" },
        { value: "Ausstellung", label: "zum Anfassen" },
        { value: "Was", label: "zur Frage passt" },
      ],
      ledger: "Was zur Frage passt — nicht ein Ordner.",
      seed: 30,
      heroFile: "stile-holz.jpg",
      showLead: true,
    },
    team: {
      kind: "house",
      emphasis: "eine Werkstatt.",
      statement:
        "Keine Filialmannschaft. Die Menschen, die aufmessen, zeichnen, fertigen und montieren, sitzen in Wolfersdorf — und stehen im Gespräch, nicht hinter einem Netz aus Gewerken.",
      statementNote: "Planung, Fertigung, Montage in einer Verantwortung.",
      closeTitle: "Lernen Sie uns kennen.",
      closeText:
        "Die Ausstellung ist der ehrlichste Ort dafür. Ein Termin, Muster, ein Gespräch ohne Folie.",
      bodyTitle: "Wer baut, spricht.",
      facts: [
        { value: "Aufmaß", label: "durch uns" },
        { value: "Zeichnung", label: "in der Manufaktur" },
        { value: "Fertigung", label: "Wolfersdorf" },
        { value: "Montage", label: "dieselbe Hand" },
      ],
      ledger: "Vom Aufmaß bis zur Montage, dieselbe Hand.",
      seed: 50,
      heroFile: "stile-holz.jpg",
    },
    nachhaltigkeit: {
      kind: "house",
      // Only used when the CMS page has no text of its own; the CMS fills all of these.
      emphasis: "in der Manufaktur",
      statement:
        "Wir heizen unsere Werke mit eigenen Holzresten, erzeugen einen großen Teil unseres Stroms mit Solaranlagen und transportieren Möbel in wiederverwendbaren Decken.",
      statementNote: "Unsere Kunden wohnen im Umkreis von etwa 200 Kilometern. Das hält die Wege kurz.",
      closeTitle: "Eine Küche, die lange bleibt",
      closeText: "Im Gespräch zeigen wir Ihnen Materialien, die sich pflegen und nacharbeiten lassen.",
      bodyTitle: "",
      facts: [
        { value: "Holzreste", label: "heizen die Werke" },
        { value: "Solarstrom", label: "vom eigenen Dach" },
        { value: "Packdecken", label: "statt Folie" },
        { value: "200 km", label: "kurze Wege" },
      ],
      ledger: "Holzreste heizen die Werke, Solarstrom kommt vom eigenen Dach.",
      seed: 60,
      heroFile: "stile-design.jpg",
    },
    karriere: {
      kind: "contact",
      // Only used when the CMS page has no text of its own; the CMS fills all of these.
      emphasis: "bei BEER",
      statement:
        "Wir sind ein Familienbetrieb mit kurzen Wegen und flachen Hierarchien. Wir bilden Schreiner aus und suchen Verstärkung in Fertigung, Montage und Planung.",
      statementNote: "Bei Fragen ist Christian Beer persönlich unter +49 8168 99 69 61 erreichbar.",
      closeTitle: "Bewirb Dich.",
      closeText: "Über das Formular auf dieser Seite oder per E-Mail an bewerbung@beer.de.",
      // The CMS text starts with its own heading.
      bodyTitle: "",
      facts: [
        { value: "Ausbildung", label: "zum Schreiner" },
        { value: "Praktikum", label: "ein bis vier Wochen" },
        { value: "Wolfersdorf", label: "bei Freising" },
        { value: "Familienbetrieb", label: "seit 1981" },
      ],
      ledger: "Ausbildung und Arbeit in Wolfersdorf.",
      seed: 70,
      heroFile: "stile-purist.jpg",
    },
  },
  en: {
    ueber: {
      kind: "house",
      emphasis: "a stance.",
      statement:
        "BEER is not a chain and not a tied brand. We build kitchens among the most expensive in the country — because measure, stone and time in the workshop are not negotiable.",
      statementNote: "Catchment around Munich. Made in one hand. Fitted by us.",
      closeTitle: "Come and see.",
      closeText:
        "The showroom is where stance becomes tangible. An appointment turns that into a conversation.",
      bodyTitle: "In one hand.",
      facts: [
        { value: "Stance", label: "not a chain" },
        { value: "One", label: "workshop" },
        { value: "Few", label: "kitchens a year" },
        { value: "Measure", label: "stone, time" },
      ],
      ledger: "Few kitchens a year. Each in one hand.",
      seed: 44,
      heroFile: "stile-purist.jpg",
    },
    "kueche-planen": {
      kind: "guide",
      emphasis: "without a grid.",
      statement:
        "We draw what the room will carry. Visualisation is an approximation. Planning becomes binding after the survey — and after a price that fits the manufactory, not a programme.",
      statementNote:
        "The price follows the survey, the stone, the hours in the workshop.",
      closeTitle: "One appointment is enough to start.",
      closeText:
        "Showroom or at your house. Bring pictures, Pinterest allowed. Drawing comes later.",
      bodyTitle: "Four steps, no choreography.",
      facts: [
        { value: "Talk", label: "free" },
        { value: "Survey", label: "makes it binding" },
        { value: "Sign-off", label: "before making" },
        { value: "Fitting", label: "by us" },
      ],
      ledger: "Binding after the survey, not after the picture.",
      seed: 31,
      heroFile: "stile-insel.jpg",
    },
    ausstellung: {
      kind: "house",
      emphasis: "not a furniture hall.",
      statement:
        "In Wolfersdorf, materials, edges and built details stand in daylight. Not a hall of runs. A studio where the conversation starts with the house.",
      statementNote: "Drop-ins are possible. A quiet conversation without an appointment is not always.",
      closeTitle: "With an appointment it becomes a talk.",
      closeText:
        "We open samples and sections when there is time.",
      bodyTitle: "Showroom near Freising.",
      facts: [
        { value: "Wolfersdorf", label: "near Freising" },
        { value: "Samples", label: "in daylight" },
        { value: "Appointment", label: "makes time" },
        { value: "Not", label: "a branch" },
      ],
      ledger: "Whole kitchens, samples and appliances to try.",
      seed: 8,
      heroFile: "stile-landhaus.jpg",
    },
    kontakt: {
      kind: "contact",
      emphasis: "one place.",
      statement:
        "Showroom and workshop sit in Badendorf. Write to us, or come by — for a planned conversation we recommend an appointment.",
      statementNote: "Mon–Fri 9am–6pm · Sat 9am–2pm. T 08168 909910.",
      closeTitle: "A note is enough.",
      closeText: "No call centre. The enquiry lands with us in Wolfersdorf.",
      bodyTitle: "BEER GmbH.",
      facts: [
        { value: "Badendorf 6", label: "85395 Wolfersdorf" },
        { value: "Mon–Fri", label: "9am–6pm" },
        { value: "Sat", label: "9am–2pm" },
        { value: "Appointment", label: "before the talk" },
      ],
      ledger: "One yard. Showroom and workshop.",
      seed: 20,
      heroFile: "stile-modern.jpg",
      showLead: true,
    },
    katalog: {
      kind: "guide",
      emphasis: "not a binder.",
      statement:
        "We send what fits the question — not everything in print. A thick catalogue would be a promise the manufactory does not make.",
      statementNote: "Tell us what you are looking for. Or collect the papers in the showroom.",
      closeTitle: "What helps, not what lands on the mat.",
      closeText: "A short note is enough. We answer from Wolfersdorf.",
      bodyTitle: "Papers on request.",
      facts: [
        { value: "No", label: "sales binder" },
        { value: "Request", label: "not a subscription" },
        { value: "Showroom", label: "to the hand" },
        { value: "What", label: "fits the question" },
      ],
      ledger: "What fits the question — not a binder.",
      seed: 30,
      heroFile: "stile-holz.jpg",
      showLead: true,
    },
    team: {
      kind: "house",
      emphasis: "one workshop.",
      statement:
        "Not a branch staff. The people who survey, draw, make and fit sit in Wolfersdorf — and stand in the conversation, not behind a net of trades.",
      statementNote: "Planning, making, fitting in one responsibility.",
      closeTitle: "Meet us.",
      closeText:
        "The showroom is the honest place for that. An appointment, samples, a conversation without foil.",
      bodyTitle: "Who builds, speaks.",
      facts: [
        { value: "Survey", label: "by us" },
        { value: "Drawing", label: "in the shop" },
        { value: "Making", label: "Wolfersdorf" },
        { value: "Fitting", label: "the same hand" },
      ],
      ledger: "From survey to fitting, the same hand.",
      seed: 50,
      heroFile: "stile-holz.jpg",
    },
    nachhaltigkeit: {
      kind: "house",
      // Only used when the CMS page has no text of its own; the CMS fills all of these.
      emphasis: "in the workshop",
      statement:
        "We heat our workshops with our own wood offcuts, generate a large part of our power with solar panels and move furniture in reusable blankets.",
      statementNote: "Our clients live within about 200 kilometres. That keeps the journeys short.",
      closeTitle: "A kitchen that lasts",
      closeText: "In the consultation we show you materials that can be cared for and refinished.",
      bodyTitle: "",
      facts: [
        { value: "Offcuts", label: "heat the workshops" },
        { value: "Solar power", label: "from our own roof" },
        { value: "Blankets", label: "instead of foil" },
        { value: "200 km", label: "short journeys" },
      ],
      ledger: "Wood offcuts heat the workshops, solar power comes from our own roof.",
      seed: 60,
      heroFile: "stile-design.jpg",
    },
    karriere: {
      kind: "contact",
      // Only used when the CMS page has no text of its own; the CMS fills all of these.
      emphasis: "at BEER",
      statement:
        "We are a family business with short paths and flat hierarchies. We train joiners and are looking for people in production, fitting and planning.",
      statementNote: "Questions? Christian Beer is personally available on +49 8168 99 69 61.",
      closeTitle: "Apply.",
      closeText: "Use the form on this page or write to bewerbung@beer.de.",
      // The CMS text starts with its own heading.
      bodyTitle: "",
      facts: [
        { value: "Apprenticeship", label: "as a joiner" },
        { value: "Internship", label: "one to four weeks" },
        { value: "Wolfersdorf", label: "near Freising" },
        { value: "Family business", label: "since 1981" },
      ],
      ledger: "Training and work in Wolfersdorf.",
      seed: 70,
      heroFile: "stile-purist.jpg",
    },
  },
};

function companySiblings(locale: Locale, slug: string): ClusterSibling[] {
  const de = locale !== "en";
  const all: ClusterSibling[] = [
    {
      href: "/ueber",
      title: de ? "Über BEER" : "About BEER",
      text: de ? "Haltung und Werkstatt." : "Stance and workshop.",
      image: SIBLING_IMAGES.ueber,
    },
    {
      href: "/team",
      title: "Team",
      text: de ? "Wer aufmisst, fertigt, montiert." : "Who surveys, makes, fits.",
      image: SIBLING_IMAGES.team,
    },
    {
      href: "/ausstellung",
      title: de ? "Ausstellung" : "Showroom",
      text: de ? "Wolfersdorf bei Freising." : "Wolfersdorf near Freising.",
      image: SIBLING_IMAGES.ausstellung,
    },
    {
      href: "/nachhaltigkeit",
      title: de ? "Nachhaltigkeit" : "Sustainability",
      text: de ? "Was bleibt, nicht was wechselt." : "What lasts, not what swaps.",
      image: SIBLING_IMAGES.nachhaltigkeit,
    },
    {
      href: "/karriere",
      title: de ? "Karriere" : "Careers",
      text: de ? "Selten. Dann Handwerk." : "Rare. Then craft.",
      image: SIBLING_IMAGES.karriere,
    },
  ];
  return all.filter((item) => item.href !== `/${slug}`).slice(0, 4);
}

function remapBranches(hub: PresentedHub, shots: HouseShot[]) {
  if (shots.length === 0 || hub.branches.length === 0) {
    return hub.branches;
  }
  return hub.branches.map((branch, index) => {
    const shot = shots[index % shots.length];
    return {
      ...branch,
      image: shot.src,
      imageB: shots[(index + 1) % shots.length].src,
      imageC: shots[(index + 2) % shots.length].src,
      alt: shot.alt || branch.alt,
    };
  });
}

export type HouseBlock =
  | "night"
  | "title"
  | "film"
  | "plate"
  | "ledger"
  | "price"
  | "body"
  | "gallery"
  | "rooms"
  | "people"
  | "chapters"
  | "visit"
  | "siblings"
  | "form"
  | "close";

/** The blocks of each house layout, top to bottom (rendered by HousePage). */
export const HOUSE_COMPOSITION: Record<HouseLayout, HouseBlock[]> = {
  legal: [],
  manufactory: ["night", "body", "chapters", "siblings", "close"],
  // Ausstellung: what is there (text, then each area with its photos), facts, how to visit, questions.
  showroom: ["plate", "body", "rooms", "ledger", "visit", "form"],
  people: ["film", "people", "body", "close"],
  lasting: ["title", "ledger", "body"],
  place: ["night", "ledger", "body", "visit", "form"],
  papers: ["film", "body", "form"],
  // Küche planen: the online planner follows the explanation (design "Küchenplaner").
  path: ["title", "price", "chapters", "form", "visit"],
  letter: ["title", "body", "form"],
};

/** Photos each chapter spread shows, by its variant (see ChapterSpread: variant 2 has three, variant 4 two). */
function spreadPhotoCount(index: number) {
  const variant = index % 5;
  return variant === 2 ? 3 : variant === 4 ? 2 : 1;
}

/**
 * No photo twice on one page. The photos of the blocks this layout shows are
 * taken first (hero, ledger, gallery, visit, close, chapter index); a sibling
 * card or chapter that would repeat one gets the next unused photo from the
 * page's chapter shots, its gallery, then the house reserve.
 */
export function withUniquePhotos(house: PresentedHouse): PresentedHouse {
  const blocks = new Set(HOUSE_COMPOSITION[house.layout]);
  const used = new Set<string>();
  const claim = (src?: string) => {
    if (src) used.add(photoKey(src));
  };
  const pool: HouseShot[] = [
    ...house.branches.flatMap((branch) => (branch.image ? [{ src: branch.image, alt: branch.alt ?? "" }] : [])),
    ...house.gallery,
    ...reserveShots(),
  ];
  const next = () => {
    const found = pool.find((item) => !used.has(photoKey(item.src)));
    claim(found?.src);
    return found ?? null;
  };

  if (blocks.has("night") || blocks.has("film") || blocks.has("plate")) claim(house.heroImage);
  if (blocks.has("ledger")) claim(house.ledgerImage);
  if (blocks.has("gallery")) house.gallery.forEach((item) => claim(item.src));
  if (blocks.has("visit")) claim(house.visitImage);
  if (blocks.has("close")) claim(house.closeImage);
  if (blocks.has("chapters")) claim(house.filmstrip[0]?.src ?? house.heroImage);

  const siblings = blocks.has("siblings")
    ? house.siblings.map((sibling) => {
        if (!sibling.image || !used.has(photoKey(sibling.image))) {
          claim(sibling.image);
          return sibling;
        }
        return { ...sibling, image: next()?.src ?? sibling.image };
      })
    : house.siblings;

  const branches = blocks.has("chapters")
    ? house.branches.map((branch, index) => {
        const count = spreadPhotoCount(index);
        const main = next();
        const b = count > 1 ? next() : null;
        const c = count > 2 ? next() : null;
        return {
          ...branch,
          image: main?.src ?? branch.image,
          srcSet: main ? undefined : branch.srcSet,
          alt: main?.alt || branch.alt,
          imageB: b?.src ?? branch.imageB,
          imageC: c?.src ?? branch.imageC,
        };
      })
    : house.branches;

  return { ...house, siblings, branches };
}

/** "Seitentitel" from the CMS, unless it is empty, just the slug, or in another language. */
function houseTitle(page: SitePage | null, slug: string, locale: Locale) {
  if (page?.contentLocale && page.contentLocale !== locale) {
    return "";
  }
  const title = page?.seitentitel?.trim();
  // The old seed stored the bare slug in lower case ("kontakt"); "Karriere" is a real title.
  if (!title || title === slug) {
    return "";
  }
  return title;
}

function asHouse(
  slug: string,
  locale: Locale,
  hub: PresentedHub,
  voice: Voice,
  page: SitePage | null,
): PresentedHouse {
  const media = sizedMedia(slug);
  const cmsHere = Boolean(page && (!page.contentLocale || page.contentLocale === locale));
  const cmsHero =
    page?.image && !isStockPhoto(page.image) ? page.image : undefined;
  const body = page?.body?.trim() || "";
  const gallery = media?.gallery ?? [];
  const chapters = media?.chapters?.length ? media.chapters : gallery;
  return {
    ...hub,
    slug,
    kind: LEGAL.has(slug) ? "legal" : voice.kind,
    layout: media?.layout ?? (LEGAL.has(slug) ? "legal" : "manufactory"),
    locale,
    // The heading is "Seitentitel" + "Betonung". The CMS "title" already holds
    // both, and an old seed stored the bare slug ("kontakt") as the title.
    title: houseTitle(page, slug, locale) || hub.title,
    eyebrow: page?.eyebrow?.trim() || hub.eyebrow,
    lede: page?.intro?.trim() || hub.lede,
    // With a CMS title the emphasis is the CMS one too, even when it is empty.
    emphasis: houseTitle(page, slug, locale)
      ? page?.betonung?.trim() || ""
      : voice.emphasis,
    statement: page && (!page.contentLocale || page.contentLocale === locale) && page.aussage
      ? page.aussage
      : voice.statement,
    statementNote: page && (!page.contentLocale || page.contentLocale === locale) && page.hinweis
      ? page.hinweis
      : voice.statementNote,
    closeTitle: page && (!page.contentLocale || page.contentLocale === locale) && page.schlussTitel
      ? page.schlussTitel
      : voice.closeTitle,
    closeText: page && (!page.contentLocale || page.contentLocale === locale) && page.schlussText
      ? page.schlussText
      : voice.closeText,
    ctaLabel: page?.ctaLabel?.trim() || hub.ctaLabel,
    ctaHref: page?.ctaUrl?.trim() || hub.ctaHref,
    heroImage: cmsLarge(cmsHero || media?.hero || hub.heroImage, 3840),
    heroAlt: page?.title?.trim() || hub.heroAlt,
    statementImage: media?.statement || hub.statementImage,
    statementImageB: media?.statementB || hub.statementImageB,
    closeImage: media?.close || hub.closeImage,
    ledgerImage: media?.ledger || hub.ledgerImage,
    visitImage: media?.visit || hub.visitImage,
    // Keywords from the CMS when the page has them in this language.
    facts: cmsHere && page?.stichworte?.length
      ? page.stichworte.map((item) => ({ value: item.wert, label: item.zeile }))
      : voice.facts,
    ledgerLine: voice.ledger || hub.ledgerLine,
    visitNote:
      locale === "en"
        ? "Samples, edges, light. By appointment."
        : "Muster, Kanten, Licht. Mit Termin.",
    body,
    bodyTitle: voice.bodyTitle,
    showLead: Boolean(voice.showLead),
    siblings: companySiblings(locale, slug),
    jobs: slug === "karriere" ? jobsFrom(page?.punkte) : [],
    rooms: slug === "karriere" || !cmsHere ? [] : (page?.punkte ?? []).filter((point) => Boolean(point.bild?.src)),
    faq: page?.faq ?? null,
    updatedAt: page?.updatedAt,
    gallery,
    people: media?.people ?? [],
    branches: remapBranches(hub, chapters),
    filmstrip: gallery.slice(0, 4).map((item) => ({
      src: item.src,
      alt: item.alt,
      caption: item.alt,
    })),
    looks: gallery.slice(0, 6).map((item) => ({
      src: item.src,
      alt: item.alt,
      caption: item.alt,
    })),
  };
}

function emptyHub(locale: Locale, slug: string, voice: Voice, page: SitePage | null): PresentedHub {
  const media = sizedMedia(slug);
  const shot = {
    hero: media?.hero || "",
    statementImage: media?.statement || "",
    statementImageB: media?.statementB || "",
    closeImage: media?.close || "",
    ledgerImage: media?.ledger || "",
    visitImage: media?.visit || "",
  };
  const visit =
    locale === "en"
      ? {
          visitPlace: "Wolfersdorf showroom",
          visitLine: "Badendorf 6 · 85395 Wolfersdorf near Freising",
          visitNote: "Samples, edges, light. By appointment.",
        }
      : {
          visitPlace: "Ausstellung Wolfersdorf",
          visitLine: "Badendorf 6 · 85395 Wolfersdorf bei Freising",
          visitNote: "Muster, Kanten, Licht. Mit Termin.",
        };

  return {
    locale,
    eyebrow: page?.eyebrow || "",
    title: houseTitle(page, slug, locale) || builtInTitle(slug, locale),
    emphasis: voice.emphasis,
    lede: page?.intro || "",
    statement: voice.statement,
    statementNote: voice.statementNote,
    heroImage: shot.hero,
    heroAlt: page?.title || slug,
    indexEyebrow: locale === "en" ? "Alongside" : "Daneben",
    quote: voice.statement,
    quoteSource: "BEER Küchenmanufaktur, Wolfersdorf",
    ctaLabel: page?.ctaLabel || (locale === "en" ? "Book a visit" : "Termin anfragen"),
    ctaHref: page?.ctaUrl || "/beratung",
    closeTitle: voice.closeTitle,
    closeText: voice.closeText,
    branches: [],
    statementImage: shot.statementImage,
    statementImageB: shot.statementImageB,
    closeImage: shot.closeImage,
    ledgerImage: shot.ledgerImage,
    visitImage: shot.visitImage,
    filmstrip: [],
    facts: voice.facts,
    ledgerLine: voice.ledger,
    looks: [],
    ...visit,
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

export function houseCms(slug: string) {
  const voice = VOICE.de[slug];
  if (!voice) {
    return null;
  }
  return {
    slug,
    title: builtInTitle(slug, "de"),
    eyebrow: "",
    intro: voice.statementNote,
    body: [voice.statement, voice.statementNote].filter(Boolean).join("\n\n"),
    ctaLabel: "Termin anfragen",
    ctaUrl: "/beratung",
    seitentitel: builtInTitle(slug, "de"),
    betonung: voice.emphasis,
    aussage: voice.statement,
    hinweis: voice.statementNote,
    zitat: voice.statement,
    zitatQuelle: "BEER Küchenmanufaktur, Wolfersdorf",
    schlussTitel: voice.closeTitle,
    schlussText: voice.closeText,
    stichworte: voice.facts.map((fact) => ({ wert: fact.value, zeile: fact.label })),
  };
}

const HUB_SLUG: Record<string, "ueber" | "planen"> = {
  ueber: "ueber",
  "kueche-planen": "planen",
};

export async function presentHouse(
  slug: string,
  locale: Locale,
): Promise<PresentedHouse | null> {
  const page =
    (await fetchSitePage(slug)) ??
    FALLBACK_PAGES.find((item) => item.slug === slug) ??
    null;
  const voice = VOICE[locale][slug] ?? VOICE.de[slug];

  if (LEGAL.has(slug)) {
    if (!page && !voice) {
      return null;
    }
    const legalVoice: Voice =
      voice ??
      ({
        kind: "legal",
        emphasis: "",
        statement: page?.intro || "",
        statementNote: "",
        closeTitle: "",
        closeText: "",
        bodyTitle: "",
        facts: [],
        ledger: "",
        seed: 0,
        heroFile: "stile-purist.jpg",
      } satisfies Voice);
    const hub = emptyHub(locale, slug, legalVoice, page);
    return asHouse(slug, locale, hub, legalVoice, page);
  }

  if (!voice && !page) {
    return null;
  }

  const resolved =
    voice ??
    ({
      kind: "house" as const,
      emphasis: "",
      statement: page?.intro || "",
      statementNote: "",
      closeTitle: locale === "en" ? "A conversation." : "Ein Gespräch.",
      closeText:
        locale === "en"
          ? "Write to us in Wolfersdorf."
          : "Schreiben Sie uns nach Wolfersdorf.",
      bodyTitle: page?.title || slug,
      facts: [],
      ledger: "",
      seed: Math.abs(slug.split("").reduce((n, c) => n + c.charCodeAt(0), 0)) % 80,
      heroFile: "stile-modern.jpg",
    } satisfies Voice);

  const hubId = HUB_SLUG[slug];
  const hub = hubId
    ? presentHub(hubId, locale)
    : emptyHub(locale, slug, resolved, page);

  return asHouse(slug, locale, hub, resolved, page);
}

export async function houseMetadata(slug: string): Promise<Metadata> {
  const locale = await getRequestLocale();
  const house = await presentHouse(slug, locale);
  if (!house) {
    return { title: "BEER Küchenmanufaktur" };
  }
  return pageMetadata({
    title: brandedTitle(house.title),
    description: house.lede,
    path: `/${slug}`,
    image: house.heroImage,
  });
}

export function houseParagraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}
