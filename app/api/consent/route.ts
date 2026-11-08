export const dynamic = "force-dynamic";

import { clientIp, noStoreHeaders, originAllowed, rateLimit } from "@/lib/lead-guard";

/**
 * Consent log: proof of each banner answer (Art. 7(1) GDPR), since no consent
 * vendor keeps it for us. One row per answer goes to the n8n workflow
 * "Consent log". It holds the random consent ID from the visitor's
 * `beer_consent` cookie (to find an entry on request), the categories, the banner
 * revision, the language, the times and the page, but no IP and no user agent.
 *
 * Env: N8N_CONSENT_WEBHOOK_URL, or derived from N8N_WEBHOOK_URL as
 * /webhook/beer-consent/log; N8N_WEBHOOK_SECRET. Without them the answer is
 * only written to the server log.
 */

const CATEGORIES = new Set(["necessary", "analytics", "marketing"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function n8nConfig() {
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();
  const own = process.env.N8N_CONSENT_WEBHOOK_URL?.trim();
  const lead = process.env.N8N_WEBHOOK_URL?.trim();
  if (!secret || (!own && !lead)) return null;
  try {
    const url = own ? new URL(own) : new URL("/webhook/beer-consent/log", lead);
    return url.protocol === "https:" ? { url: url.toString(), secret } : null;
  } catch {
    return null;
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
    consent_id: b.consent_id.toLowerCase(),
    categories: [...new Set(categories)],
    analytics: categories.includes("analytics"),
    marketing: categories.includes("marketing"),
    revision: typeof b.revision === "number" && Number.isInteger(b.revision) ? b.revision : 0,
    language: b.language === "en" ? "en" : "de",
    first_consent: firstConsent,
    recorded_at: new Date().toISOString(),
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

  const n8n = n8nConfig();
  if (!n8n) {
    console.info(`[consent] ${JSON.stringify(entry)} (n8n not configured)`);
    return new Response(null, { status: 204, headers: noStoreHeaders() });
  }
  try {
    const upstream = await fetch(n8n.url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-n8n-webhook-secret": n8n.secret },
      body: JSON.stringify({ auth_secret: n8n.secret, ...entry }),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!upstream.ok) {
      // Keep the entry in the server log so it is not lost.
      console.warn(`[consent] n8n status ${upstream.status}: ${JSON.stringify(entry)}`);
    }
  } catch (error) {
    console.warn(`[consent] n8n unreachable (${error instanceof Error ? error.name : "unknown"}): ${JSON.stringify(entry)}`);
  }
  return new Response(null, { status: 204, headers: noStoreHeaders() });
}
