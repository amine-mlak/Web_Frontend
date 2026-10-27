export const dynamic = "force-dynamic";

import { createHash, randomUUID } from "crypto";
import { trimLead, validateLeadFields } from "@/lib/lead-fields";
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
  userAgentBlocked,
} from "@/lib/lead-guard";

const GENERIC_ERROR = "invalid";

/**
 * Application form (Karriere) → n8n workflow "BEER Bewerbungen". Same guards as the lead
 * form (origin, user agent, rate limits, honeypot, signed challenge). Only what the applicant
 * typed is passed on: no IP, browser or click data, and nothing goes to ad platforms.
 */
function reject(status: number, reason: string, body = GENERIC_ERROR) {
  console.warn(`[bewerbung] refused ${status} ${reason}`);
  return jsonError(status, body);
}

/** N8N_BEWERBUNG_WEBHOOK_URL, or /webhook/beer-bewerbung on the n8n host of the lead webhook. */
function n8nConfig() {
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();
  const own = process.env.N8N_BEWERBUNG_WEBHOOK_URL?.trim();
  const lead = process.env.N8N_WEBHOOK_URL?.trim();
  if (!secret || (!own && !lead)) {
    return null;
  }
  try {
    const url = own ? new URL(own) : new URL("/webhook/beer-bewerbung", lead);
    return url.protocol === "https:" ? { url: url.toString(), secret } : null;
  } catch {
    return null;
  }
}

function emailKey(email: string) {
  return createHash("sha256").update(email).digest("hex").slice(0, 16);
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
  if (!rateLimit(`bewerbung:${ip}`, leadLimits.LEAD_MAX_PER_IP, leadLimits.LEAD_WINDOW_MS)) {
    return reject(429, "rate_ip", "rate_limited");
  }

  const raw = await request.text();
  const parsed = parseLeadBody(raw);
  if (!parsed.ok) {
    return reject(400, `body (${raw.length} bytes)`);
  }
  const body = parsed.body as typeof parsed.body & Record<string, unknown>;

  if (honeypotFilled(body)) {
    console.warn("[bewerbung] honeypot filled, answered ok without sending");
    return Response.json({ ok: true }, { headers: noStoreHeaders() });
  }

  const challenge = readChallenge(body.challenge ?? "", ip);
  if (!challenge.ok) {
    return reject(400, challenge.reason);
  }

  const fields = validateLeadFields(body);
  if (!fields.ok) {
    return reject(400, fields.reason);
  }
  const jobTitle = trimLead(body.job_title, 120);
  if (!jobTitle) {
    return reject(400, "job_missing");
  }

  if (!rateLimit(`bewerbung-email:${emailKey(fields.email)}`, leadLimits.LEAD_MAX_PER_EMAIL, leadLimits.LEAD_WINDOW_MS)) {
    return reject(429, "rate_email", "rate_limited");
  }

  const n8n = n8nConfig();
  if (!n8n) {
    return reject(503, "n8n_not_configured", "unavailable");
  }

  const id = randomUUID();
  const payload = {
    form: "bewerbung",
    id,
    received_at: new Date().toISOString(),
    job: { slug: trimLead(body.job_slug, 80), title: jobTitle },
    applicant: {
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      start: trimLead(body.start, 60),
      message: fields.message,
    },
    page: trimLead(body.page, 200),
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

  console.info(`[bewerbung] sent to n8n id=${id}`);
  return Response.json({ ok: true, id }, { headers: noStoreHeaders() });
}

export function GET() {
  return jsonError(405, GENERIC_ERROR);
}
