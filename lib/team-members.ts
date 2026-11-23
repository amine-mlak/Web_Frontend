import type { Locale } from "@/lib/i18n";
import { strapiGet, strapiResponsiveImage, type StrapiMedia } from "@/lib/strapi";
import type { TeamVoice } from "@/lib/team-voices";

/**
 * The people on /team, from the CMS collection "Team" (api::team-member): one entry per person
 * with name, role, quote, portrait and order. Editors add someone by creating and publishing an
 * entry, and take someone off by unpublishing it. English entries are optional: without them the
 * German ones show (strapiGet's language fallback).
 */

type StrapiTeamMember = {
  name?: string;
  rolle?: string | null;
  zitat?: string | null;
  foto?: StrapiMedia | null;
};

export async function fetchTeamMembers(locale: Locale): Promise<TeamVoice[]> {
  const payload = await strapiGet<{ data?: StrapiTeamMember[] }>("/api/team-members", {
    locale,
    "sort[0]": "reihenfolge:asc",
    "sort[1]": "name:asc",
    "pagination[pageSize]": "100",
    "populate[foto]": "true",
  });
  return (payload?.data ?? [])
    .map((entry) => {
      const name = entry.name?.trim() ?? "";
      const portrait = entry.foto ? strapiResponsiveImage(entry.foto, { srcWidth: 640 }) : null;
      const photo = portrait?.src ?? "";
      return {
        name,
        role: entry.rolle?.trim() ?? "",
        // Quotes are stored without quotation marks; the page sets them.
        quote: (entry.zitat ?? "").trim().replace(/^["„“”‚']+|["„“”‚']+$/g, ""),
        photo: photo || undefined,
        photoSrcSet: photo ? portrait?.srcSet : undefined,
        locale,
      };
    })
    .filter((voice) => voice.name);
}
