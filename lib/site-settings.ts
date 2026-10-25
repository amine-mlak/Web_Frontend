import { strapiGet, strapiMediaUrl } from "@/lib/strapi";

/**
 * Company facts for JSON-LD, contact blocks and llms.txt. Source: the CMS
 * single type "Einstellungen" (api::global). The defaults below only cover
 * fields the CMS has not been filled in for yet.
 */
export type OpeningHours = {
  days: string[];
  opens: string;
  closes: string;
};

export type SiteSettings = {
  siteName: string;
  legalName: string;
  description: string;
  siteUrl: string;
  street: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  phone: string;
  email: string;
  latitude?: number;
  longitude?: number;
  openingHours: OpeningHours[];
  sameAs: string[];
  shareImage?: string;
  llmsIntro: string;
};

const DEFAULTS: SiteSettings = {
  siteName: "BEER Küchenmanufaktur",
  legalName: "BEER GmbH",
  description:
    "Individuelle Manufakturküchen aus Wolfersdorf bei Freising. Beratung, Planung, Fertigung und Montage aus einer Hand.",
  siteUrl: "https://www.beer.de",
  street: "Badendorf 6",
  postalCode: "85395",
  city: "Wolfersdorf",
  region: "Bayern",
  country: "DE",
  phone: "+49 8168 909910",
  email: "info@beer.de",
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    { days: ["Saturday"], opens: "09:00", closes: "14:00" },
  ],
  sameAs: ["https://www.instagram.com/beer.kuechen/"],
  llmsIntro: "",
};

const DAYS: Record<string, string[]> = {
  "mo-fr": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "mo-sa": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  mo: ["Monday"],
  di: ["Tuesday"],
  mi: ["Wednesday"],
  do: ["Thursday"],
  fr: ["Friday"],
  sa: ["Saturday"],
  so: ["Sunday"],
};

type StrapiGlobal = {
  siteName?: string;
  siteDescription?: string;
  legalName?: string;
  siteUrl?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  region?: string;
  country?: string;
  phone?: string;
  email?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  llmsIntro?: string;
  openingHours?: { days?: string; opens?: string; closes?: string }[];
  socialLinks?: { href?: string }[];
  defaultSeo?: { shareImage?: { url?: string } | null } | null;
};

function pick(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function coordinate(value: number | string | null | undefined) {
  const parsed = typeof value === "string" ? Number.parseFloat(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : undefined;
}

// Strapi "time" fields come back as HH:mm:ss.SSS.
function clock(value?: string) {
  return value?.slice(0, 5) || "";
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const payload = await strapiGet<{ data?: StrapiGlobal }>("/api/global", {
    "populate[openingHours]": "true",
    "populate[socialLinks]": "true",
    "populate[defaultSeo][populate]": "shareImage",
  });
  const cms = payload?.data;
  if (!cms) {
    return DEFAULTS;
  }

  const hours = (cms.openingHours ?? [])
    .map((row) => ({
      days: DAYS[row.days ?? ""] ?? [],
      opens: clock(row.opens),
      closes: clock(row.closes),
    }))
    .filter((row) => row.days.length && row.opens && row.closes);
  const sameAs = (cms.socialLinks ?? [])
    .map((link) => link.href?.trim() ?? "")
    .filter((href) => href.startsWith("https://"));

  return {
    siteName: pick(cms.siteName, DEFAULTS.siteName),
    legalName: pick(cms.legalName, DEFAULTS.legalName),
    description: pick(cms.siteDescription, DEFAULTS.description),
    siteUrl: pick(cms.siteUrl, DEFAULTS.siteUrl).replace(/\/$/, ""),
    street: pick(cms.street, DEFAULTS.street),
    postalCode: pick(cms.postalCode, DEFAULTS.postalCode),
    city: pick(cms.city, DEFAULTS.city),
    region: pick(cms.region, DEFAULTS.region),
    country: pick(cms.country, DEFAULTS.country),
    phone: pick(cms.phone, DEFAULTS.phone),
    email: pick(cms.email, DEFAULTS.email),
    latitude: coordinate(cms.latitude),
    longitude: coordinate(cms.longitude),
    openingHours: hours.length ? hours : DEFAULTS.openingHours,
    sameAs: sameAs.length ? sameAs : DEFAULTS.sameAs,
    shareImage: strapiMediaUrl(cms.defaultSeo?.shareImage?.url) || undefined,
    llmsIntro: cms.llmsIntro?.trim() || "",
  };
}
