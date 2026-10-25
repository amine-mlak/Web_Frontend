import type { Locale } from "@/lib/i18n";
import { strapiGet } from "@/lib/strapi";

/**
 * The announcement bar above the navigation ("Tag der offenen Tür …").
 * Managed in the CMS: Header → Ankündigungsleiste (enabled, messages with
 * optional links, rolling or still, optional start and end, tone).
 */
export type AnnouncementTone = "dunkel" | "hell" | "bronze";

export type Announcement = {
  items: { text: string; href?: string }[];
  scrolling: boolean;
  tone: AnnouncementTone;
};

type StrapiAnnouncement = {
  enabled?: boolean;
  scrolling?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  tone?: string | null;
  items?: { text?: string; href?: string | null }[];
};

/**
 * Used only while the CMS has no "Ankündigungsleiste" field yet (before
 * beer-cms schema v2 is live), so the bar can be seen on staging. Once the
 * CMS has the field, only the CMS decides whether and when it shows.
 */
const BUILT_IN: Record<Locale, StrapiAnnouncement> = {
  de: {
    enabled: true,
    scrolling: true,
    tone: "dunkel",
    items: [{ text: "Tag der offenen Tür: 7.–8. November, 13–18 Uhr", href: "/ausstellung" }],
  },
  en: {
    enabled: true,
    scrolling: true,
    tone: "dunkel",
    items: [{ text: "Open house: 7–8 November, 1–6 pm", href: "/ausstellung" }],
  },
};

function isTone(value: string | null | undefined): value is AnnouncementTone {
  return value === "dunkel" || value === "hell" || value === "bronze";
}

/** The CMS block, if it is switched on and inside its time window. */
export function activeAnnouncement(cms: StrapiAnnouncement | null | undefined, now = Date.now()): Announcement | null {
  if (!cms?.enabled) return null;
  const starts = cms.startsAt ? Date.parse(cms.startsAt) : NaN;
  const ends = cms.endsAt ? Date.parse(cms.endsAt) : NaN;
  if (Number.isFinite(starts) && now < starts) return null;
  if (Number.isFinite(ends) && now >= ends) return null;
  const items = (cms.items ?? [])
    .map((item) => ({ text: item.text?.trim() ?? "", href: item.href?.trim() || undefined }))
    .filter((item) => item.text);
  if (items.length === 0) return null;
  return { items, scrolling: cms.scrolling !== false, tone: isTone(cms.tone) ? cms.tone : "dunkel" };
}

export async function getAnnouncement(locale: Locale): Promise<Announcement | null> {
  // Asked separately from the header: on a CMS without the field Strapi
  // answers 400, and that must not take the menu down with it.
  const payload = await strapiGet<{ data?: { locale?: string; announcement?: StrapiAnnouncement | null } }>("/api/header", {
    locale,
    "fields[0]": "locale",
    "populate[announcement][populate]": "items",
  });
  if (!payload?.data) {
    return activeAnnouncement(BUILT_IN[locale]);
  }
  // No bar in English when only the German header has one.
  if (payload.data.locale && payload.data.locale !== locale) {
    return null;
  }
  return activeAnnouncement(payload.data.announcement);
}
