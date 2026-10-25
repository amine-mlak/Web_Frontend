import type { Locale } from "@/lib/i18n";
import {
  PLANNER_GROUPS,
  PLANNER_STEPS,
  type PlannerContent,
  type PlannerGroupKey,
  type PlannerImage,
  type PlannerStepKey,
} from "@/lib/kitchen-planner-model";
import {
  PLANNER_MEDIA,
  type PlannerMediaFile,
  type PlannerMediaName,
} from "@/lib/kitchen-planner-media";
import { strapiGet, strapiMediaUrl } from "@/lib/strapi";

/**
 * Server side of the online kitchen planner. The flow (seven steps, which
 * question sits in which step, single or multiple choice) is fixed in
 * lib/kitchen-planner-model.ts, because the lead mail and n8n rely on it.
 * Everything an editor reads — texts, options, subtitles, photos, icons —
 * comes from the CMS single type "Küchenplaner" (api::kitchen-planner).
 * plannerFallback() only fills in while the CMS has no entry yet.
 */

function srcSetOf(sizes: readonly { url: string; width: number }[]) {
  return sizes.length > 0
    ? sizes.map((size) => `${strapiMediaUrl(size.url)} ${size.width}w`).join(", ")
    : undefined;
}

function media(name: PlannerMediaName, alt: string): PlannerImage {
  const file: PlannerMediaFile = PLANNER_MEDIA[name];
  // Photos load a web size (500–1000 px), never the 2–16 MB original.
  const smallest = file.sizes[0]?.url ?? file.url;
  return {
    src: strapiMediaUrl(file.sizes.length ? smallest : file.url),
    srcSet: srcSetOf(file.sizes),
    width: file.width,
    height: file.height,
    alt,
  };
}

type StrapiFormats = Record<string, { url?: string; width?: number } | undefined> | null | undefined;

function cmsImage(image: NonNullable<StrapiMediaRef>, alt: string): PlannerImage {
  const sizes = ["small", "medium", "large"]
    .map((key) => image.formats?.[key])
    .filter((size): size is { url: string; width: number } => Boolean(size?.url && size.width));
  return {
    src: strapiMediaUrl(sizes[0]?.url ?? image.url),
    srcSet: srcSetOf(sizes),
    width: image.width,
    height: image.height,
    alt: image.alternativeText?.trim() || alt,
  };
}

// ---------------------------------------------------------------------------
// Fallback content: the wording of the design ("Küchenplaner Design"),
// German as written by BEER, English as a reviewed-later draft.
// ---------------------------------------------------------------------------

type Copy = { de: string; en: string };
type OptionSeed = { value: string; label: Copy; subtitle?: Copy; image?: PlannerMediaName; iconSize?: number; freeText?: boolean };

const SKETCH: PlannerMediaName = "planer-skizze-offen.jpg";

const GROUP_SEED: { group: PlannerGroupKey; label: Copy; hint?: Copy; placeholder?: Copy; options: OptionSeed[] }[] = [
  {
    group: "style",
    label: { de: "Welcher Küchenstil spricht Sie an?", en: "Which kitchen style speaks to you?" },
    hint: { de: "Mehrfachauswahl möglich", en: "Choose as many as you like" },
    placeholder: { de: "Beschreiben Sie Ihren Stil (optional)", en: "Describe your style (optional)" },
    options: [
      { value: "modern-schlicht", label: { de: "Modern & Schlicht", en: "Modern & simple" }, subtitle: { de: "Klare Flächen, reduziert auf das Wesentliche, viel Ruhe.", en: "Clean surfaces, reduced to the essentials, a lot of calm." }, image: "planer-stil-modern-schlicht.jpg" },
      { value: "skandinavisch", label: { de: "Skandinavisch", en: "Scandinavian" }, subtitle: { de: "Hell, freundlich, mit hellem Holz und weichem Licht.", en: "Light and friendly, with pale wood and soft light." }, image: "planer-stil-skandinavisch.jpg" },
      { value: "landhaus-klassisch", label: { de: "Landhaus & Klassisch", en: "Country & classic" }, subtitle: { de: "Kassettentüren, detailverliebt, zeitlose Formen mit Geschichte.", en: "Panelled doors, careful detail, timeless shapes with a history." }, image: "planer-stil-landhaus-klassisch.jpg" },
      { value: "industrial", label: { de: "Industrial", en: "Industrial" }, subtitle: { de: "Inspiriert von New Yorker Lofts mit Ecken und Kanten.", en: "Inspired by New York lofts, with rough edges." }, image: "planer-stil-industrial.jpg" },
      { value: "natuerlich", label: { de: "Natürlich", en: "Natural" }, subtitle: { de: "Echtholz und warme Naturtöne im Mittelpunkt.", en: "Real wood and warm natural tones at the centre." }, image: "planer-stil-natuerlich.jpg" },
      { value: "anders", label: { de: "Etwas anderes?", en: "Something else?" }, subtitle: { de: "Noch unentschlossen? Wir finden Ihren Stil gemeinsam.", en: "Not sure yet? We will find your style together." }, image: SKETCH, freeText: true },
    ],
  },
  {
    group: "front",
    label: { de: "Welche Fronten gefallen Ihnen?", en: "Which fronts do you like?" },
    hint: { de: "Mehrfachauswahl möglich", en: "Choose as many as you like" },
    options: [
      { value: "hell-weiss", label: { de: "Front hell & weiß", en: "Light & white fronts" }, subtitle: { de: "Von reinem Weiß bis zu sanften Creme- und Grautönen.", en: "From pure white to soft cream and grey tones." }, image: "planer-front-hell-weiss.jpg" },
      { value: "dunkel", label: { de: "Front dunkel", en: "Dark fronts" }, subtitle: { de: "Anthrazit, Schwarz und tiefe Töne mit starker Präsenz.", en: "Anthracite, black and deep tones with a strong presence." }, image: "planer-front-dunkel.jpg" },
      { value: "kassette", label: { de: "Kassette", en: "Panelled" }, subtitle: { de: "Rahmenfront mit Füllung – zeitlos, in Lack oder Holz.", en: "Framed front with an inset panel – timeless, lacquered or wood." }, image: "planer-front-kassette.jpg" },
      { value: "holz", label: { de: "Holz", en: "Wood" }, subtitle: { de: "Massiv oder furniert, mit pflegeleichten Oberflächen.", en: "Solid or veneered, with easy-care surfaces." }, image: "planer-stil-natuerlich.jpg" },
      { value: "vor-ort", label: { de: "Lieber vor Ort entscheiden?", en: "Rather decide in person?" }, subtitle: { de: "Alle Muster liegen in unserem Showroom bereit.", en: "All samples are waiting in our showroom." }, image: SKETCH },
    ],
  },
  {
    group: "top",
    label: { de: "Welche Arbeitsplatte wünschen Sie sich?", en: "Which worktop would you like?" },
    hint: { de: "Mehrfachauswahl möglich", en: "Choose as many as you like" },
    options: [
      { value: "naturstein", label: { de: "Naturstein", en: "Natural stone" }, subtitle: { de: "Jede Platte ein Unikat.", en: "Every slab is one of a kind." }, image: "planer-platte-naturstein.jpg" },
      { value: "keramik", label: { de: "Keramik", en: "Ceramic" }, subtitle: { de: "Hitzefest, kratzfest, porenfrei.", en: "Heat-proof, scratch-proof, non-porous." }, image: "planer-platte-keramik.jpg" },
      { value: "edelstahl", label: { de: "Edelstahl", en: "Stainless steel" }, subtitle: { de: "Warmgewalzt, robust und hygienisch.", en: "Hot-rolled, robust and hygienic." }, image: "planer-platte-edelstahl.jpg" },
      { value: "massivholz", label: { de: "Massivholz", en: "Solid wood" }, subtitle: { de: "Warm, lebendig, nachölbar.", en: "Warm, alive, can be re-oiled." }, image: "planer-platte-massivholz.jpg" },
      { value: "dekor", label: { de: "Dekorplatte", en: "Laminate" }, subtitle: { de: "Kompaktplatte, HPL oder Mineralwerkstoff.", en: "Compact board, HPL or solid surface." }, image: "planer-platte-dekor.jpg" },
      { value: "vor-ort", label: { de: "Lieber im Original vergleichen?", en: "Rather compare the real thing?" }, subtitle: { de: "Wir zeigen Ihnen alle Materialien persönlich.", en: "We show you every material in person." }, image: SKETCH },
    ],
  },
  {
    group: "griffe",
    label: { de: "Welche Griffe mögen Sie?", en: "Which handles do you like?" },
    hint: { de: "Mehrfachauswahl möglich", en: "Choose as many as you like" },
    options: [
      { value: "grifflos", label: { de: "Grifflos", en: "Handleless" }, subtitle: { de: "Tip-On oder Push-to-open.", en: "Tip-On or push-to-open." }, image: "planer-griff-grifflos.jpg" },
      { value: "griff", label: { de: "Griff", en: "Bar handle" }, subtitle: { de: "Schlicht und zeitlos, unendliche Möglichkeiten.", en: "Simple and timeless, endless options." }, image: "planer-griff-stange.jpg" },
      { value: "griffleiste", label: { de: "Griffleiste", en: "Handle rail" }, subtitle: { de: "Schmale Metallprofile an der Oberkante.", en: "Slim metal profiles along the top edge." }, image: "planer-griff-leiste.jpg" },
      { value: "griffmulde", label: { de: "Griffmulde", en: "Recessed grip" }, subtitle: { de: "In den Korpus oder die Front gefräst.", en: "Milled into the carcass or the front." }, image: "planer-griff-mulde.jpg" },
      { value: "knopf-muschel", label: { de: "Knopf & Muschel", en: "Knob & cup" }, subtitle: { de: "Klassisch & Vintage.", en: "Classic & vintage." }, image: "planer-griff-knopf-muschel.jpg" },
      { value: "vor-ort", label: { de: "Lieber erst anfassen?", en: "Rather touch them first?" }, subtitle: { de: "Griffe muss man spüren – alle Varianten liegen für Sie bereit.", en: "Handles have to be felt – every option is waiting for you." }, image: SKETCH },
    ],
  },
  {
    group: "appliances",
    label: { de: "Welche besonderen Geräte wünschen Sie sich?", en: "Which special appliances would you like?" },
    hint: { de: "Mehrfachauswahl möglich", en: "Choose as many as you like" },
    options: [
      { value: "kuehl-einbau", label: { de: "Kühl- & Gefrierkombination (Einbau)", en: "Built-in fridge-freezer" } },
      { value: "kuehl-frei", label: { de: "Freistehender Kühl- & Gefrierschrank", en: "Freestanding fridge-freezer" } },
      { value: "wein", label: { de: "Weinkühlschrank", en: "Wine fridge" } },
      { value: "abzug-unten", label: { de: "Dunstabzug nach unten", en: "Downdraft extractor" } },
      { value: "teppanyaki", label: { de: "Teppanyaki-Kochfeld", en: "Teppanyaki hob" } },
      { value: "dampfgarer", label: { de: "Dampfgarer (Kombigerät)", en: "Combi steam oven" } },
      { value: "waermeschublade", label: { de: "Wärmeschublade", en: "Warming drawer" } },
      { value: "vakuumierer", label: { de: "Vakuumiergerät", en: "Vacuum sealer" } },
      { value: "xxl-spueler", label: { de: "XXL-Geschirrspüler", en: "XXL dishwasher" } },
      { value: "quooker", label: { de: "Quooker / Kochendwasserhahn", en: "Quooker / boiling-water tap" } },
      { value: "kaffee", label: { de: "Kaffeevollautomat", en: "Built-in coffee machine" } },
    ],
  },
  {
    group: "wishes",
    label: { de: "Besondere Wünsche", en: "Special wishes" },
    placeholder: { de: "Ihre persönlichen Wünsche (optional)", en: "Your personal wishes (optional)" },
    options: [],
  },
  {
    group: "project",
    label: { de: "Was haben Sie vor?", en: "What are you planning?" },
    options: [
      { value: "neubau", label: { de: "Neubau", en: "New build" }, image: "planer-raum-neubau.png", iconSize: 98 },
      { value: "umbau", label: { de: "Umbau / Renovierung", en: "Conversion / renovation" }, image: "planer-raum-umbau.png", iconSize: 98 },
    ],
  },
  {
    group: "raum",
    label: { de: "Wie sieht der Raum mit der Küche aus?", en: "What is the room like?" },
    options: [
      { value: "geschlossen", label: { de: "Geschlossener Raum", en: "Closed room" }, image: "planer-raum-geschlossen.png", iconSize: 118 },
      { value: "offen", label: { de: "Offenes Raumkonzept", en: "Open-plan" }, image: "planer-raum-offen.png", iconSize: 118 },
    ],
  },
  {
    group: "size",
    label: { de: "Wie groß ist der Raum?", en: "How big is the room?" },
    options: [
      { value: "bis-10", label: { de: "bis 10 m²", en: "up to 10 m²" }, image: "planer-groesse-bis-10.png", iconSize: 124 },
      { value: "10-25", label: { de: "10–25 m²", en: "10–25 m²" }, image: "planer-groesse-10-25.png", iconSize: 124 },
      { value: "ueber-25", label: { de: "über 25 m²", en: "over 25 m²" }, image: "planer-groesse-ueber-25.png", iconSize: 144 },
    ],
  },
  {
    group: "form",
    label: { de: "Welche Küchenform passt zu Ihrem Raum?", en: "Which kitchen shape suits your room?" },
    placeholder: { de: "Beschreiben Sie Ihre Form (optional)", en: "Describe your shape (optional)" },
    options: [
      { value: "zeile", label: { de: "Küchenzeile", en: "Single wall" }, image: "planer-form-zeile.png", iconSize: 144 },
      { value: "l-form", label: { de: "L-Form", en: "L-shape" }, image: "planer-form-l-form.png", iconSize: 144 },
      { value: "u-form", label: { de: "U-Form", en: "U-shape" }, image: "planer-form-u-form.png", iconSize: 144 },
      { value: "insel", label: { de: "Mit Insel", en: "With island" }, image: "planer-form-insel.png", iconSize: 144 },
      { value: "zweizeilig", label: { de: "Zweizeilig", en: "Galley" }, image: "planer-form-zweizeilig.png", iconSize: 144 },
      { value: "anders", label: { de: "Etwas anderes", en: "Something else" }, subtitle: { de: "Eigene Form oder noch nicht festgelegt.", en: "Your own shape, or not decided yet." }, image: "planer-form-anders.svg", iconSize: 144, freeText: true },
    ],
  },
];

const STEP_SEED: Record<PlannerStepKey, { title: Copy; subtitle: Copy; overview: Copy }> = {
  stil: {
    title: { de: "Stil", en: "Style" },
    subtitle: { de: "Welcher Stil spricht Sie an? Mehrfachauswahl ist ausdrücklich erlaubt.", en: "Which style speaks to you? Choosing several is very welcome." },
    overview: { de: "Sie wählen die Küchenwelten, die Sie ansprechen – gern auch mehrere.", en: "You pick the kitchen worlds that appeal to you – several if you like." },
  },
  material: {
    title: { de: "Farbe & Material", en: "Colour & material" },
    subtitle: { de: "Welche Farben & Materialien sprechen Sie an? Alle Muster liegen in unserem Showroom für Sie bereit.", en: "Which colours and materials appeal to you? Every sample is waiting in our showroom." },
    overview: { de: "Fronten, Arbeitsplatten und Griffe: Ihre Favoriten legen wir für Sie zum Anfassen bereit.", en: "Fronts, worktops and handles: we lay out your favourites for you to touch." },
  },
  ausstattung: {
    title: { de: "Ausstattung", en: "Appliances" },
    subtitle: { de: "Neben den Standard-E-Geräten: Welche besonderen E-Geräte wünschen Sie sich?", en: "Beyond the standard appliances: which special ones would you like?" },
    overview: { de: "Ihre gewünschten Geräte und besondere Wünsche, die wir von Anfang an berücksichtigen.", en: "The appliances you want and special wishes we plan in from the start." },
  },
  raum: {
    title: { de: "Raum", en: "Room" },
    subtitle: { de: "Eine grobe Einschätzung genügt – die Details klären wir im persönlichen Gespräch.", en: "A rough idea is enough – we sort out the details in person." },
    overview: { de: "Ihr Vorhaben, die Raumsituation und eine grobe Einschätzung der Größe.", en: "Your project, the room and a rough idea of its size." },
  },
  form: {
    title: { de: "Küchenform", en: "Kitchen shape" },
    subtitle: { de: "Wie ist Ihr Raum geschnitten? Wählen Sie die Form, die am ehesten passt.", en: "How is your room laid out? Choose the shape that fits best." },
    overview: { de: "Die Grundform, die am besten zu Ihrem Raum und Ihrem Alltag passt.", en: "The basic shape that suits your room and your everyday life." },
  },
  budget: {
    title: { de: "Budget", en: "Budget" },
    subtitle: { de: "Ehrliche Zahlen helfen uns, realistisch zu planen. Alles bleibt unverbindlich.", en: "Honest numbers help us plan realistically. Nothing is binding." },
    overview: { de: "Ein grober Rahmen hilft uns, realistisch zu planen – Ihre Angabe ist freiwillig.", en: "A rough range helps us plan realistically – sharing it is optional." },
  },
  kontakt: {
    title: { de: "Kontakt", en: "Contact" },
    subtitle: { de: "Wie dürfen wir Sie beraten? Ihre Angaben bereiten das Gespräch vor – den Termin vereinbaren wir danach direkt mit Ihnen.", en: "How may we advise you? Your answers prepare the conversation – we then arrange the appointment with you directly." },
    overview: { de: "Ihre bevorzugte Form der Beratung – den Termin vereinbaren wir danach direkt mit Ihnen.", en: "How you would like to be advised – we then arrange the appointment with you directly." },
  },
};

export function plannerFallback(locale: Locale): PlannerContent {
  const t = (copy?: Copy) => (copy ? copy[locale] : undefined);
  return {
    locale,
    eyebrow: locale === "en" ? "Online kitchen planner" : "Online-Küchenplaner",
    title: locale === "en" ? "Plan" : "Planen Sie",
    titleEmphasis: locale === "en" ? "your dream kitchen." : "Ihre Traumküche.",
    intro:
      locale === "en"
        ? "Answer a few questions – none of it is binding. Your answers give us a first idea for your consultation."
        : "Beantworten Sie ein paar Fragen – nichts davon ist verbindlich. Ihre Antworten geben uns eine erste Orientierung für Ihr Beratungsgespräch.",
    steps: PLANNER_STEPS.map((step) => ({
      step,
      title: STEP_SEED[step].title[locale],
      subtitle: STEP_SEED[step].subtitle[locale],
      overview: STEP_SEED[step].overview[locale],
    })),
    groups: GROUP_SEED.map((group) => ({
      group: group.group,
      label: group.label[locale],
      hint: t(group.hint),
      placeholder: t(group.placeholder),
      options: group.options.map((option) => ({
        value: option.value,
        label: option.label[locale],
        subtitle: t(option.subtitle),
        image: option.image ? media(option.image, option.label[locale]) : undefined,
        iconSize: option.iconSize,
        freeText: option.freeText,
      })),
    })),
    budget: { min: 15000, mid: 35000, max: 100000 },
    done: {
      title: locale === "en" ? "Thank you, {name}. Your kitchen is taking shape." : "Danke, {name}. Ihre Küche nimmt Gestalt an.",
      text:
        locale === "en"
          ? "With your answers you are one step closer to your dream kitchen – a kitchen that in the end fits only you."
          : "Mit Ihren Angaben sind Sie Ihrer Traumküche einen Schritt näher – einer Küche, die am Ende nur zu Ihnen passt.",
      linkLabel: locale === "en" ? "Discover our showroom" : "Entdecken Sie unsere Ausstellung",
      linkHref: "/ausstellung",
    },
  };
}

// ---------------------------------------------------------------------------
// CMS
// ---------------------------------------------------------------------------

type StrapiMediaRef = {
  url?: string;
  width?: number;
  height?: number;
  alternativeText?: string | null;
  formats?: StrapiFormats;
} | null;
type StrapiPlanner = {
  locale?: string;
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  intro?: string;
  budgetMin?: number;
  budgetMid?: number;
  budgetMax?: number;
  doneTitle?: string;
  doneText?: string;
  doneLinkLabel?: string;
  doneLinkHref?: string;
  steps?: { step?: string; title?: string; subtitle?: string; overview?: string }[];
  groups?: {
    group?: string;
    label?: string;
    hint?: string;
    placeholder?: string;
    options?: { value?: string; label?: string; subtitle?: string; image?: StrapiMediaRef; iconSize?: number; freeText?: boolean }[];
  }[];
};

function isGroupKey(value: string | undefined): value is PlannerGroupKey {
  return Boolean(value && value in PLANNER_GROUPS);
}

function mapPlanner(cms: StrapiPlanner, locale: Locale): PlannerContent | null {
  const fallback = plannerFallback(locale);
  const groups = (cms.groups ?? [])
    .filter((group): group is NonNullable<StrapiPlanner["groups"]>[number] & { group: PlannerGroupKey } => isGroupKey(group.group))
    .map((group) => ({
      group: group.group,
      label: group.label?.trim() || "",
      hint: group.hint?.trim() || undefined,
      placeholder: group.placeholder?.trim() || undefined,
      options: (group.options ?? [])
        .filter((option) => option.value && option.label)
        .map((option) => ({
          value: option.value!.trim(),
          label: option.label!.trim(),
          subtitle: option.subtitle?.trim() || undefined,
          image: option.image?.url ? cmsImage(option.image, option.label!.trim()) : undefined,
          iconSize: option.iconSize || undefined,
          freeText: Boolean(option.freeText),
        })),
    }));
  if (groups.length === 0) {
    return null;
  }
  // Questions the editors have not set up yet keep the built-in wording.
  const missing = fallback.groups.filter((group) => !groups.some((item) => item.group === group.group));
  const steps = PLANNER_STEPS.map((key) => {
    const row = cms.steps?.find((item) => item.step === key);
    const base = fallback.steps.find((item) => item.step === key)!;
    return {
      step: key,
      title: row?.title?.trim() || base.title,
      subtitle: row?.subtitle?.trim() || base.subtitle,
      overview: row?.overview?.trim() || base.overview,
    };
  });

  return {
    locale,
    eyebrow: cms.eyebrow?.trim() || fallback.eyebrow,
    title: cms.title?.trim() || fallback.title,
    titleEmphasis: cms.titleEmphasis?.trim() ?? fallback.titleEmphasis,
    intro: cms.intro?.trim() || fallback.intro,
    steps,
    groups: [...groups, ...missing],
    budget: {
      min: cms.budgetMin || fallback.budget.min,
      mid: cms.budgetMid || fallback.budget.mid,
      max: cms.budgetMax || fallback.budget.max,
    },
    done: {
      title: cms.doneTitle?.trim() || fallback.done.title,
      text: cms.doneText?.trim() || fallback.done.text,
      linkLabel: cms.doneLinkLabel?.trim() || fallback.done.linkLabel,
      linkHref: cms.doneLinkHref?.trim() || fallback.done.linkHref,
    },
  };
}

export async function getKitchenPlanner(locale: Locale): Promise<PlannerContent> {
  const payload = await strapiGet<{ data?: StrapiPlanner }>("/api/kitchen-planner", {
    locale,
    "populate[steps]": "true",
    "populate[groups][populate][options][populate]": "image",
  });
  const cms = payload?.data;
  // strapiGet falls back to German when English is empty; keep the English
  // built-in copy then instead of showing German text on English pages.
  if (!cms || (cms.locale && cms.locale !== locale)) {
    return plannerFallback(locale);
  }
  return mapPlanner(cms, locale) ?? plannerFallback(locale);
}
