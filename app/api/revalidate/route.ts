import { revalidateTag } from "next/cache";
import { safeEqual } from "@/lib/lead-guard";

export const dynamic = "force-dynamic";

/**
 * Strapi webhook target. In Strapi: Settings → Webhooks, URL
 * https://<site>/api/revalidate, header `Authorization: Bearer <REVALIDATE_SECRET>`,
 * events entry.publish / entry.unpublish / entry.update / entry.delete.
 *
 * Every CMS fetch in lib/strapi.ts carries the `strapi` tag, so one call
 * refreshes all pages that read CMS data on their next visit.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  const header = request.headers.get("authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!secret || !given || !safeEqual(given, secret)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    event?: string;
    model?: string;
    entry?: { locale?: string };
  } | null;

  // Webhooks need the data gone now, not stale-while-revalidate.
  revalidateTag("strapi", { expire: 0 });

  return Response.json(
    {
      ok: true,
      event: payload?.event ?? null,
      model: payload?.model ?? null,
      locale: payload?.entry?.locale ?? null,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
