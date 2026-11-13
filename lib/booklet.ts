import { strapiGet, strapiMediaUrl, strapiResponsiveImage, type StrapiMedia } from "@/lib/strapi";

/**
 * Booklet pages (catalogue / booklet requests, mostly for ad traffic), from the CMS collection
 * "Booklet" (api::booklet). The address is the entry's slug: beer.de/7-geheimnisse.
 * BOOKLET_FALLBACK keeps the first booklet working until its CMS entry is published.
 */

export type Booklet = {
  slug: string;
  title: string;
  titleEmphasis: string;
  eyebrow: string;
  intro: string;
  benefits: string[];
  hero: { src: string; srcSet?: string; alt: string } | null;
  cover: { src: string; srcSet?: string; alt: string } | null;
  pdfUrl: string;
  formTitle: string;
  printNote: string;
  thanksTitle: string;
  thanksText: string;
  seoTitle: string;
  seoDescription: string;
  noIndex: boolean;
};

type StrapiBooklet = {
  slug?: string;
  titel?: string;
  titelBetonung?: string;
  kurzzeile?: string;
  einleitung?: string;
  vorteile?: { text?: string }[];
  titelbild?: StrapiMedia | null;
  cover?: StrapiMedia | null;
  pdf?: { url?: string; mime?: string } | null;
  formTitel?: string;
  hinweisDruck?: string;
  dankeTitel?: string;
  dankeText?: string;
  seo?: { metaTitle?: string; metaDescription?: string; noindex?: boolean } | null;
};

const DEFAULTS = {
  formTitle: "Wie möchten Sie das Booklet erhalten?",
  printNote: "Gedruckt schicken wir es innerhalb von 4–5 Tagen, in Bayern und Baden-Württemberg.",
  thanksTitle: "Vielen Dank.",
  thanksText: "Ihr Booklet ist unterwegs.",
};

/** The booklet mock-up in the CMS media library (id 4261), used until the entry has its own cover. */
const COVER_7_GEHEIMNISSE: StrapiMedia = {
  url: "/uploads/booklet_7_geheimnisse_traumkueche_197f8090fa.png",
  width: 1024,
  height: 1536,
  alternativeText: "Booklet „7 Geheimnisse zum Planen Ihrer Traumküche“ der BEER Küchenmanufaktur",
  formats: {
    small: { url: "/uploads/small_booklet_7_geheimnisse_traumkueche_197f8090fa.png", width: 333 },
    medium: { url: "/uploads/medium_booklet_7_geheimnisse_traumkueche_197f8090fa.png", width: 500 },
    large: { url: "/uploads/large_booklet_7_geheimnisse_traumkueche_197f8090fa.png", width: 667 },
  },
};

const BOOKLET_FALLBACK: Record<string, Booklet> = {
  "7-geheimnisse": {
    slug: "7-geheimnisse",
    title: "7 Geheimnisse",
    titleEmphasis: "Ihrer Traumküche",
    eyebrow: "Kostenloses Booklet",
    intro:
      "Erleben Sie mit unserem kleinen Booklet, wie aus Raum, Licht und Material ein Ort entsteht, der mehr ist als eine Küche – ein Raum, der zu Ihnen passt, sich richtig anfühlt und jeden Tag Freude schenkt.",
    benefits: ["Fehler bei der Planung vermeiden", "Wissen, worauf es wirklich ankommt", "Räume erschaffen, die berühren"],
    hero: null,
    cover: image(COVER_7_GEHEIMNISSE, 750),
    pdfUrl: "",
    ...DEFAULTS,
    seoTitle: "7 Geheimnisse zum Planen Ihrer Traumküche – kostenloses Booklet",
    seoDescription:
      "Das kostenlose Booklet der BEER Küchenmanufaktur: sieben Gedanken zum Planen Ihrer Traumküche. Digital sofort, gedruckt per Post in Bayern und Baden-Württemberg.",
    noIndex: true,
  },
};

function image(media: StrapiMedia | null | undefined, width: number) {
  const mapped = strapiResponsiveImage(media, { srcWidth: width });
  return mapped.src ? { src: mapped.src, srcSet: mapped.srcSet, alt: media?.alternativeText?.trim() || "" } : null;
}

function mapBooklet(entry: StrapiBooklet): Booklet | null {
  const slug = entry.slug?.trim();
  const title = entry.titel?.trim();
  if (!slug || !title) return null;
  const pdf = entry.pdf?.url && (!entry.pdf.mime || entry.pdf.mime === "application/pdf") ? strapiMediaUrl(entry.pdf.url) : "";
  return {
    slug,
    title,
    titleEmphasis: entry.titelBetonung?.trim() ?? "",
    eyebrow: entry.kurzzeile?.trim() ?? "",
    intro: entry.einleitung?.trim() ?? "",
    benefits: (entry.vorteile ?? []).map((item) => item.text?.trim() ?? "").filter(Boolean),
    hero: image(entry.titelbild, 1600),
    cover: image(entry.cover, 900),
    pdfUrl: pdf,
    formTitle: entry.formTitel?.trim() || DEFAULTS.formTitle,
    printNote: entry.hinweisDruck?.trim() || DEFAULTS.printNote,
    thanksTitle: entry.dankeTitel?.trim() || DEFAULTS.thanksTitle,
    thanksText: entry.dankeText?.trim() || DEFAULTS.thanksText,
    seoTitle: entry.seo?.metaTitle?.trim() || title,
    seoDescription: entry.seo?.metaDescription?.trim() || "",
    // Ad landing pages stay out of Google unless the CMS says otherwise.
    noIndex: entry.seo?.noindex ?? true,
  };
}

export async function fetchBooklet(slug: string): Promise<Booklet | null> {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  const payload = await strapiGet<{ data?: StrapiBooklet[] }>("/api/booklets", {
    "filters[slug][$eq]": slug,
    "populate[vorteile]": "true",
    "populate[titelbild]": "true",
    "populate[cover]": "true",
    "populate[pdf]": "true",
    "populate[seo]": "true",
  });
  const entry = payload?.data?.[0];
  return (entry && mapBooklet(entry)) ?? BOOKLET_FALLBACK[slug] ?? null;
}
