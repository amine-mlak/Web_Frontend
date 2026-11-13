export const dynamic = "force-dynamic";

import { createHash, randomUUID } from "crypto";
import { fetchBooklet } from "@/lib/booklet";
import { validateBooklet, wantsPrint, type BookletInput } from "@/lib/booklet-fields";
import { isLocale } from "@/lib/i18n";
import {
  clientIp,
  honeypotFilled,
  jsonError,
  leadLimits,
  noStoreHeaders,
  originAllowed,
  parseLeadBody,
  rateLimit,
  readChallenge,
  sanitizeClickIds,
  sanitizeUtm,
  userAgentBlocked,
  type LeadBody,
} from "@/lib/lead-guard";
import { mauticEnabled, sendBookletToMautic } from "@/lib/mautic";
import { sendNewsletterSignup } from "@/lib/newsletter";
import { inPrintRegion } from "@/lib/plz-region";
import { absoluteUrl } from "@/lib/seo";

/**
 * Booklet / catalogue requests (beer.de/7-geheimnisse and later booklets). Same protection as the
 * planner: origin, bot user agents, rate limits per IP and address, honeypot, signed challenge,
 * 12 KB body cap. The request goes to n8n like every lead (lead_source "booklet"; print orders
 * wait there for the mail-out), then to Mautic, which only sends the delivery mail.
 * Answers stay generic; the reason is in the log line, without personal data.
 */

const GENERIC_ERROR = "invalid";

type BookletBody = LeadBody & BookletInput & { booklet?: unknown; newsletter?: unknown; locale?: unknown };

function reject(status: number, reason: string, body = GENERIC_ERROR) {
  console.warn(`[booklet] refused ${status} ${reason}`);
  return jsonError(status, body);
}

function n8nConfig() {
  const url = process.env.N8N_WEBHOOK_URL?.trim();
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();
  if (!url || !secret) return null;
  try {
    return new URL(url).protocol === "https:" ? { url, secret } : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") {
    return reject(415, "content_type");
  }
  if (!originAllowed(request)) {
    return reject(403, "origin");
  }
  if (userAgentBlocked(request)) {
    return reject(403, "user_agent");
  }

  const ip = clientIp(request);
  if (!rateLimit(`booklet:${ip}`, leadLimits.LEAD_MAX_PER_IP, leadLimits.LEAD_WINDOW_MS)) {
    return reject(429, "rate_ip", "rate_limited");
  }

  const parsed = parseLeadBody(await request.text());
  if (!parsed.ok) {
    return reject(400, "body");
  }
  const body = parsed.body as BookletBody;

  if (honeypotFilled(body)) {
    console.warn("[booklet] honeypot filled, answered ok without sending");
    return Response.json({ ok: true }, { headers: noStoreHeaders() });
  }
  const challenge = readChallenge(body.challenge ?? "", ip);
  if (!challenge.ok) {
    return reject(400, challenge.reason);
  }

  const slug = typeof body.booklet === "string" ? body.booklet : "";
  const booklet = await fetchBooklet(slug);
  if (!booklet) {
    return reject(400, "unknown_booklet");
  }

  const valid = validateBooklet(body, inPrintRegion);
  if (!valid.ok) {
    // The field-level reason helps the visitor; it says nothing about stored data.
    return reject(400, valid.reason, valid.reason);
  }
  const lead = valid.request;

  const emailKey = createHash("sha256").update(lead.email).digest("hex").slice(0, 16);
  if (!rateLimit(`booklet-email:${emailKey}`, leadLimits.LEAD_MAX_PER_EMAIL, leadLimits.LEAD_WINDOW_MS)) {
    return reject(429, "rate_email", "rate_limited");
  }

  const n8n = n8nConfig();
  if (!n8n) {
    return reject(503, "n8n_not_configured", "unavailable");
  }

  const consent = {
    analytics: body.tracking_consent?.analytics === true,
    marketing: body.tracking_consent?.marketing === true,
  };
  const eventId = (typeof body.event_id === "string" && /^[\w-]{8,80}$/.test(body.event_id) ? body.event_id : "") || randomUUID();
  const print = wantsPrint(lead.delivery);
  const name = `${lead.firstName} ${lead.lastName}`;
  const deliveryText = { digital: "Digital (PDF per E-Mail)", print: "Gedruckt per Post", both: "Digital und gedruckt" }[lead.delivery];
  const message = [
    `Booklet: ${booklet.title}${booklet.titleEmphasis ? ` ${booklet.titleEmphasis}` : ""}`,
    `Versand: ${deliveryText}`,
    print ? `Adresse: ${lead.street}, ${lead.plz} ${lead.city}` : `PLZ: ${lead.plz}`,
  ].join("\n");

  const payload = {
    auth_secret: n8n.secret,
    event_name: "Lead",
    lead_source: "booklet",
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: typeof body.event_source_url === "string" ? body.event_source_url.slice(0, 500) : undefined,
    landing_url: typeof body.landing_url === "string" ? body.landing_url.slice(0, 500) : undefined,
    // Without Marketing consent the click IDs are not used, even if a client sent some.
    click_ids: consent.marketing ? sanitizeClickIds(body.click_ids) : {},
    utm: sanitizeUtm(body.utm),
    consent,
    user: {
      name,
      email: lead.email,
      phone: lead.phone,
      message,
      client_ip: ip === "unknown" ? undefined : ip,
      user_agent: request.headers.get("user-agent") ?? undefined,
    },
    details: {
      place: `${lead.plz}${lead.city ? ` ${lead.city}` : ""}`,
      booklet: booklet.slug,
      delivery: lead.delivery,
      // Filled only for print: the n8n branch "Druckversand" picks these up.
      address: print
        ? { salutation: lead.salutation, first_name: lead.firstName, last_name: lead.lastName, street: lead.street, plz: lead.plz, city: lead.city, country: "DE" }
        : null,
    },
  };

  try {
    const upstream = await fetch(n8n.url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-n8n-webhook-secret": n8n.secret },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!upstream.ok) {
      return reject(502, `n8n_status_${upstream.status}`, "unavailable");
    }
    const result: unknown = await upstream.json().catch(() => null);
    if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true) {
      return reject(502, "n8n_not_ok", "unavailable");
    }
  } catch (error) {
    return reject(502, `n8n_unreachable_${error instanceof Error ? error.name : "unknown"}`, "unavailable");
  }
  console.info(`[booklet] sent to n8n event=${eventId} delivery=${lead.delivery}`);

  // Mautic sends the delivery mail. A hiccup there must not turn the request into an error.
  if (mauticEnabled()) {
    const failed = await sendBookletToMautic({
      booklet: booklet.slug,
      pdfUrl: booklet.pdfUrl ? new URL(booklet.pdfUrl, absoluteUrl("/")).toString() : "",
      delivery: lead.delivery,
      salutation: lead.salutation,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      plz: lead.plz,
      street: lead.street,
      city: lead.city,
    });
    console.info(`[booklet] mautic ${failed ? `failed: ${failed}` : "contact sent"}`);
  }
  if (body.newsletter === true) {
    const failed = await sendNewsletterSignup({
      email: lead.email,
      vorname: lead.firstName,
      locale: typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "de",
      source: `/${booklet.slug} (Booklet)`,
    });
    console.info(`[booklet] newsletter sign-up ${failed ? `failed: ${failed}` : "sent"}`);
  }

  return Response.json({ ok: true, event_id: eventId }, { headers: noStoreHeaders() });
}

export function GET() {
  return jsonError(405, GENERIC_ERROR);
}
