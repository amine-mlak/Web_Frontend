import type { Metadata } from "next";
import { FALLBACK_PAGES, type SitePage } from "@/lib/catalog";
import { fetchSitePage } from "@/lib/catalog-api";
import type { ClusterSibling } from "@/lib/collection-clusters";
import { presentHub, type CollectionFact, type PresentedHub } from "@/lib/collection-present";
import { cmsLarge } from "@/lib/beer-photos";
import { isStockPhoto } from "@/lib/dev-images";
import {
  SIBLING_IMAGES,
  sizedMedia,
  type HouseLayout,
  type HousePerson,
  type HouseShot,
} from "@/lib/house-photos";
import type { Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/locale";
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
      bodyTitle: "Ausstellung Freising.",
      facts: [
        { value: "Wolfersdorf", label: "bei Freising" },
        { value: "Muster", label: "unter Tageslicht" },
        { value: "Termin", label: "macht Zeit" },
        { value: "Keine", label: "Filiale" },
      ],
      ledger: "Ein Studio unter Tageslicht. Keine Halle.",
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
      emphasis: "was bleibt.",
      statement:
        "Keine Kampagne. Wer wenige Küchen baut, verschwendet weniger. Stein, Holz, Verbindungen, die man löst, ohne das Haus zu zerstören — Material, das man pflegt, statt mit der Saison zu wechseln.",
      statementNote: "Maß vor Raster. Zeit vor Trend. Das ist die Haltung, nicht ein Siegel auf der Tür.",
      closeTitle: "Was bleibt, wird gebaut.",
      closeText:
        "Im Gespräch klären wir, was der Raum wirklich trägt — und was nur auf dem Bildschirm hält.",
      bodyTitle: "Weniger, dafür richtig.",
      facts: [
        { value: "Wenige", label: "Aufträge im Jahr" },
        { value: "Stein", label: "als Unikat" },
        { value: "Maß", label: "statt Raster" },
        { value: "Pflege", label: "statt Wechsel" },
      ],
      ledger: "Kein Siegel. Weniger Aufträge.",
      seed: 60,
      heroFile: "stile-design.jpg",
    },
    karriere: {
      kind: "contact",
      emphasis: "in der Manufaktur.",
      statement:
        "Selten eine Stelle. Wenn, dann Handwerk und Planung in Wolfersdorf — kein Vertriebsnetz, keine Motivationslyrik. Wir stellen ein, wenn die Werkstatt es trägt.",
      statementNote: "Schreiben Sie uns sachlich. Wir lesen in der Manufaktur, nicht in einer Personalabteilung hinter Glas.",
      closeTitle: "Eine Nachricht, kein Portal.",
      closeText: "Anfragen an die Manufaktur. Antwort, wenn eine Stelle offen ist — oder wenn sie es bald sein könnte.",
      bodyTitle: "Handwerk vor Vertrieb.",
      facts: [
        { value: "Wolfersdorf", label: "kein Netz" },
        { value: "Handwerk", label: "und Planung" },
        { value: "Selten", label: "eine Stelle" },
        { value: "Gespräch", label: "statt Portal" },
      ],
      ledger: "Eine Stelle, wenn die Werkstatt sie trägt.",
      seed: 70,
      heroFile: "stile-purist.jpg",
      showLead: true,
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
      ledger: "A studio in daylight. Not a hall.",
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
      emphasis: "what lasts.",
      statement:
        "Not a campaign. Who builds few kitchens wastes less. Stone, wood, joints you can undo without wrecking the house — material you keep, instead of changing with the season.",
      statementNote: "Measure before a grid. Time before trend. That is the stance, not a badge on the door.",
      closeTitle: "What lasts is what we build.",
      closeText:
        "In conversation we settle what the room will really carry — and what only holds on a screen.",
      bodyTitle: "Less, done properly.",
      facts: [
        { value: "Few", label: "commissions a year" },
        { value: "Stone", label: "as a one-off" },
        { value: "Measure", label: "not a grid" },
        { value: "Care", label: "not a swap" },
      ],
      ledger: "No badge. Fewer commissions.",
      seed: 60,
      heroFile: "stile-design.jpg",
    },
    karriere: {
      kind: "contact",
      emphasis: "in the workshop.",
      statement:
        "A post is rare. When there is one, it is craft and planning in Wolfersdorf — not a sales net, not motivational copy. We hire when the workshop can carry it.",
      statementNote: "Write plainly. We read in the manufactory, not in a glass HR office.",
      closeTitle: "A note, not a portal.",
      closeText:
        "Enquiries to the workshop. An answer if a post is open — or if it soon could be.",
      bodyTitle: "Craft before sales.",
      facts: [
        { value: "Wolfersdorf", label: "no net" },
        { value: "Craft", label: "and planning" },
        { value: "Rare", label: "a post" },
        { value: "Talk", label: "not a portal" },
      ],
      ledger: "A post, when the workshop can carry it.",
      seed: 70,
      heroFile: "stile-purist.jpg",
      showLead: true,
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

function asHouse(
  slug: string,
  locale: Locale,
  hub: PresentedHub,
  voice: Voice,
  page: SitePage | null,
): PresentedHouse {
  const media = sizedMedia(slug);
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
    title: page?.title?.trim() || hub.title,
    eyebrow: page?.eyebrow?.trim() || hub.eyebrow,
    lede: page?.intro?.trim() || hub.lede,
    emphasis: page && (!page.contentLocale || page.contentLocale === locale) && page.betonung
      ? page.betonung
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
    facts: voice.facts,
    ledgerLine: voice.ledger || hub.ledgerLine,
    visitNote:
      locale === "en"
        ? "Samples, edges, light. By appointment."
        : "Muster, Kanten, Licht. Mit Termin.",
    body,
    bodyTitle: voice.bodyTitle,
    showLead: Boolean(voice.showLead),
    siblings: companySiblings(locale, slug),
    faq: page?.faq ?? null,
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
    title: page?.title || slug,
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
    title: slug,
    eyebrow: "",
    intro: voice.statementNote,
    body: [voice.statement, voice.statementNote].filter(Boolean).join("\n\n"),
    ctaLabel: "Termin anfragen",
    ctaUrl: "/beratung",
    seitentitel: slug,
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
