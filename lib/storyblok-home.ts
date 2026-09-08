import type { SbBlokData } from "@storyblok/react/rsc";
import { storyblokAsset } from "@/lib/storyblok-asset";
import { asBloks } from "@/lib/storyblok-fields";
import type {
  BeratungContent,
  EntdeckenContent,
  FaqContent,
  HomeCms,
  KachelnContent,
  ProcessContent,
  ProcessIcon,
} from "@/lib/strapi";

const PROCESS_ICONS: ProcessIcon[] = [
  "consult",
  "plan",
  "factory",
  "handover",
];

function firstBlok(value: unknown): SbBlokData | undefined {
  return asBloks(value)[0];
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hexColor(value: unknown): string {
  const color = text(value);
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color) ? color : "";
}

function processIcon(value: unknown): ProcessIcon {
  return PROCESS_ICONS.includes(value as ProcessIcon)
    ? (value as ProcessIcon)
    : "consult";
}

function mapHeroSlides(blok?: SbBlokData) {
  return asBloks(blok?.slides)
    .map((slide) => {
      const image = storyblokAsset(slide.image, "", text(slide.alt));
      return {
        src: image.src,
        alt: image.alt || text(slide.alt),
      };
    })
    .filter((slide) => slide.src);
}

function mapKacheln(blok?: SbBlokData): KachelnContent | null {
  if (!blok) return null;

  const colors = asBloks(blok.colors)
    .map((tile) => {
      const image = storyblokAsset(tile.image, "", text(tile.alt) || text(tile.title));
      return {
        title: text(tile.title),
        href: text(tile.href) || "#kacheln",
        image: image.src,
        alt: image.alt,
        color: hexColor(tile.color),
      };
    })
    .filter((tile) => tile.title && tile.image && tile.color);

  if (colors.length === 0) return null;

  return {
    eyebrow: text(blok.eyebrow) || "Die Kacheln · Geteilte Bildtafeln",
    intro:
      text(blok.intro) ||
      "Keine Liste – Tafeln. Zur Hälfte das Projekt, zur Hälfte Material und Farbe. So wird die Wahl der Küchenfarbe zum Erlebnis.",
    colors,
  };
}

function mapAblauf(blok?: SbBlokData): ProcessContent | null {
  if (!blok) return null;

  const steps = asBloks(blok.steps)
    .map((item) => ({
      step: text(item.step),
      title: text(item.title),
      description: text(item.description),
      icon: processIcon(item.icon),
    }))
    .filter((item) => item.step && item.title && item.description);

  if (steps.length === 0) return null;

  return {
    eyebrow: text(blok.eyebrow) || "Der Weg zur Küche",
    title: text(blok.title) || "Von der ersten Idee bis zur Übergabe",
    buttonLabel: text(blok.button_label) || "Entdecken",
    buttonHref: text(blok.button_href) || "#ablauf",
    steps,
  };
}

function mapEntdecken(blok?: SbBlokData): EntdeckenContent | null {
  if (!blok) return null;

  const panels = asBloks(blok.panels)
    .map((panel) => {
      const image = storyblokAsset(
        panel.image,
        "",
        text(panel.alt) || text(panel.title),
      );
      return {
        title: text(panel.title),
        subtitle: text(panel.subtitle),
        buttonLabel: text(panel.button_label),
        href: text(panel.href) || "#kacheln",
        image: image.src,
        alt: image.alt,
      };
    })
    .filter((panel) => panel.title && panel.image);

  if (panels.length === 0) return null;

  return { panels };
}

function mapFaq(blok?: SbBlokData): FaqContent | null {
  if (!blok) return null;

  const items = asBloks(blok.items)
    .map((item) => ({
      question: text(item.question),
      answer: text(item.answer),
    }))
    .filter((item) => item.question && item.answer);

  if (items.length === 0) return null;

  return {
    eyebrow: text(blok.eyebrow) || "Fragen",
    title: text(blok.title) || "Bevor wir uns sehen",
    items,
  };
}

function mapBeratung(blok?: SbBlokData): BeratungContent | null {
  if (!blok || !text(blok.title) || !text(blok.intro)) return null;

  return {
    eyebrow: text(blok.eyebrow) || "Persönliche Beratung",
    title: text(blok.title),
    intro: text(blok.intro),
    company: text(blok.company) || "BEER GmbH",
    street: text(blok.street) || "Badendorf 6",
    city: text(blok.city) || "85395 Wolfersdorf",
    phoneLabel: text(blok.phone_label) || "T 08168 909910",
    phoneHref: text(blok.phone_href) || "tel:+498168909910",
    email: text(blok.email) || "beratung@beer-kuechenmanufaktur.de",
  };
}

export function mapStoryblokLanding(blok: SbBlokData): HomeCms {
  return {
    title: text(blok.title) || undefined,
    slug: "home",
    heroSlides: mapHeroSlides(firstBlok(blok.hero)),
    kacheln: mapKacheln(firstBlok(blok.kacheln)),
    ablauf: mapAblauf(firstBlok(blok.ablauf)),
    entdecken: mapEntdecken(firstBlok(blok.entdecken)),
    faq: mapFaq(firstBlok(blok.faq)),
    beratung: mapBeratung(firstBlok(blok.beratung)),
  };
}

export function sectionBlok(value: unknown): SbBlokData | undefined {
  return firstBlok(value);
}
