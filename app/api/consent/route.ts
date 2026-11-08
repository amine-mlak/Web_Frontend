export const dynamic = "force-dynamic";

import { clientIp, noStoreHeaders, originAllowed, rateLimit } from "@/lib/lead-guard";
import { STRAPI_URL } from "@/lib/strapi";

/**
 * Consent log: proof of each banner answer (Art. 7(1) GDPR), since no consent
 * vendor keeps it for us. One entry per answer goes to the CMS collection
 * "Einwilligungen (Cookie-Banner)" (beer-cms, api::consent-log): the random
 * consent ID from the visitor's `beer_consent` cookie (to find an entry on
 * request), the categories, the banner revision, the language, the first consent
 * time and the page. No IP, no user agent. The CMS keeps entries 3 years and
 * refuses changes to them.
 *
 * Env: STRAPI_CONSENT_TOKEN, a CMS API token that may only create consent-log
 * entries. Without it, or if the CMS fails, the entry goes to the server log.
 */

const CATEGORIES = new Set(["necessary", "analytics", "marketing"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function siteOf(request: Request) {
  try {
    return new URL(request.headers.get("origin") ?? "").host;
  } catch {
    return "";
  }
}

function readEntry(raw: string) {
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const categories = Array.isArray(b.categories) ? b.categories.filter((c): c is string => typeof c === "string" && CATEGORIES.has(c)) : null;
  const firstConsent = typeof b.first_consent === "string" && !Number.isNaN(Date.parse(b.first_consent)) ? new Date(b.first_consent).toISOString() : null;
  if (typeof b.consent_id !== "string" || !UUID.test(b.consent_id) || !categories || !firstConsent) return null;
  return {
    consentId: b.consent_id.toLowerCase(),
    categories: [...new Set(categories)],
    analytics: categories.includes("analytics"),
    marketing: categories.includes("marketing"),
    revision: typeof b.revision === "number" && Number.isInteger(b.revision) ? b.revision : 0,
    language: b.language === "en" ? "en" : "de",
    firstConsent,
    path: typeof b.path === "string" ? b.path.slice(0, 200) : "",
  };
}

export async function POST(request: Request) {
  if (!originAllowed(request)) {
    return new Response(null, { status: 403, headers: noStoreHeaders() });
  }
  if (!rateLimit(`consent:${clientIp(request)}`, 30, 10 * 60 * 1000)) {
    return new Response(null, { status: 429, headers: noStoreHeaders() });
  }
  const raw = await request.text();
  const entry = raw.length <= 2000 ? readEntry(raw) : null;
  if (!entry) {
    return new Response(null, { status: 400, headers: noStoreHeaders() });
  }

  const data = { ...entry, site: siteOf(request) };
  const token = process.env.STRAPI_CONSENT_TOKEN?.trim();
  if (!token) {
    console.info(`[consent] ${JSON.stringify(data)} (STRAPI_CONSENT_TOKEN not set)`);
    return new Response(null, { status: 204, headers: noStoreHeaders() });
  }
  try {
    const upstream = await fetch(`${STRAPI_URL}/api/consent-logs`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ data }),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!upstream.ok) {
      // Keep the entry in the server log so it is not lost.
      console.warn(`[consent] CMS status ${upstream.status}: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.warn(`[consent] CMS unreachable (${error instanceof Error ? error.name : "unknown"}): ${JSON.stringify(data)}`);
  }
  return new Response(null, { status: 204, headers: noStoreHeaders() });
}
