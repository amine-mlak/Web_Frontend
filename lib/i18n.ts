export const LOCALES = ["de", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "de";
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_HEADER = "x-beer-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  de: "DE",
  en: "EN",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
};

export const chromeCopy: Record<
  Locale,
  {
    language: string;
    location: string;
    call: string;
    menuOpen: string;
    menuClose: string;
    home: string;
    overview: string;
    kitchenColours: string;
    instagramTitle: string;
    instagramFollow: string;
    instagramMore: string;
    instagramOpen: string;
    saveIdea: string;
    discover: string;
  }
> = {
  de: {
    language: "Sprache",
    location: "Standort in Wolfersdorf öffnen",
    call: "Anrufen",
    menuOpen: "Menü öffnen",
    menuClose: "Menü schließen",
    home: "Startseite",
    overview: "Übersicht",
    kitchenColours: "Küchenfarben",
    instagramTitle: "Täglich neue Ideen",
    instagramFollow: "Folgen",
    instagramMore: "Mehr auf\nInstagram",
    instagramOpen: "auf Instagram öffnen",
    saveIdea: "Diese Idee merken",
    discover: "Küchenwelten entdecken",
  },
  en: {
    language: "Language",
    location: "Open the Wolfersdorf showroom on the map",
    call: "Call",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    home: "Home",
    overview: "Overview",
    kitchenColours: "Kitchen colours",
    instagramTitle: "New ideas every day",
    instagramFollow: "Follow",
    instagramMore: "More on\nInstagram",
    instagramOpen: "Open on Instagram",
    saveIdea: "Save this idea",
    discover: "Discover kitchen worlds",
  },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "de" || value === "en";
}

export function stripLocalePrefix(pathname: string) {
  const match = pathname.match(/^\/en(?=\/|$)/);
  if (!match) {
    return pathname || "/";
  }
  const rest = pathname.slice(match[0].length);
  return rest || "/";
}

export function withLocale(href: string, locale: Locale) {
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    href.startsWith("/cms-") ||
    href.startsWith("/kitchens/") ||
    href.startsWith("/instagram/") ||
    href.startsWith("/brands/")
  ) {
    return href;
  }

  const match = href.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  const path = match?.[1] || href;
  const search = match?.[2] || "";
  const hash = match?.[3] || "";
  const unprefixed = stripLocalePrefix(path);
  const localized =
    locale === DEFAULT_LOCALE
      ? unprefixed
      : unprefixed === "/"
        ? `/${locale}`
        : `/${locale}${unprefixed}`;

  return `${localized}${search}${hash}`;
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/")
    ? "en"
    : DEFAULT_LOCALE;
}
