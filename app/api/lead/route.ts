export const dynamic = "force-dynamic";

import { createHash, randomUUID } from "crypto";
import { getKitchenPlanner } from "@/lib/kitchen-planner";
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
  validateLead,
} from "@/lib/lead-guard";

const GENERIC_ERROR = "invalid";

function emailKey(email: string) {
  return createHash("sha256").update(email).digest("hex").slice(0, 16);
}

function hostOf(value: string | null) {
  if (!value) return "none";
  try {
    return new URL(value).host;
  } catch {
    return "invalid";
  }
}

/**
 * Every refused lead leaves one log line with the reason (no names, mails
 * or phone numbers), so a failed submit can be traced in the Coolify logs.
 */
function reject(request: Request, status: number, reason: string, body = GENERIC_ERROR) {
  console.warn(
    `[lead] refused ${status} ${reason} origin=${hostOf(request.headers.get("origin"))} referer=${hostOf(request.headers.get("referer"))}`,
  );
  return jsonError(status, body);
}

function n8nConfig() {
  const url = process.env.N8N_WEBHOOK_URL?.trim();
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();
  if (!url || !secret) {
    return null;
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      return null;
    }
    return { url, secret };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") {
    return reject(request, 415, "content_type");
  }
  if (!originAllowed(request)) {
    return reject(request, 403, "origin");
  }
  if (userAgentBlocked(request)) {
    return reject(request, 403, "user_agent");
  }

  const ip = clientIp(request);
  if (!rateLimit(`lead:${ip}`, leadLimits.LEAD_MAX_PER_IP, leadLimits.LEAD_WINDOW_MS)) {
    return reject(request, 429, "rate_ip", "rate_limited");
  }

  const raw = await request.text();
  const parsed = parseLeadBody(raw);
  if (!parsed.ok) {
    return reject(request, 400, `body (${raw.length} bytes)`);
  }

  if (honeypotFilled(parsed.body)) {
    console.warn("[lead] honeypot filled, answered ok without sending");
    return Response.json({ ok: true }, { headers: noStoreHeaders() });
  }

  const challenge = readChallenge(parsed.body.challenge ?? "", ip);
  if (!challenge.ok) {
    return reject(request, 400, `${challenge.reason} ip=${ip === "unknown" ? "unknown" : "known"}`);
  }

  const valid = validateLead(parsed.body, await getKitchenPlanner("de"));
  if (!valid.ok) {
    return reject(request, 400, valid.reason);
  }

  if (
    !rateLimit(
      `lead-email:${emailKey(valid.lead.email)}`,
      leadLimits.LEAD_MAX_PER_EMAIL,
      leadLimits.LEAD_WINDOW_MS,
    )
  ) {
    return reject(request, 429, "rate_email", "rate_limited");
  }

  const n8n = n8nConfig();
  if (!n8n) {
    return reject(request, 503, "n8n_not_configured", "unavailable");
  }

  const eventId = valid.lead.eventId || randomUUID();
  const payload = {
    auth_secret: n8n.secret,
    event_name: "Lead",
    // Which form sent it; the n8n workflow reads `details` by this.
    lead_source: "kuechenplaner",
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: valid.lead.eventSourceUrl,
    landing_url: valid.lead.landingUrl,
    click_ids: valid.lead.clickIds,
    utm: valid.lead.utm,
    user: {
      name: valid.lead.name,
      email: valid.lead.email,
      phone: valid.lead.phone,
      message: valid.lead.message,
      client_ip: ip === "unknown" ? undefined : ip,
      user_agent: request.headers.get("user-agent") ?? undefined,
    },
    details: valid.lead.details,
  };

  try {
    const upstream = await fetch(n8n.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-n8n-webhook-secret": n8n.secret,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!upstream.ok) {
      return reject(request, 502, `n8n_status_${upstream.status}`, "unavailable");
    }
    const result: unknown = await upstream.json().catch(() => null);
    if (
      !result ||
      typeof result !== "object" ||
      !("ok" in result) ||
      result.ok !== true
    ) {
      return reject(request, 502, "n8n_not_ok", "unavailable");
    }
  } catch (error) {
    const code = error instanceof Error ? error.name : "unknown";
    return reject(request, 502, `n8n_unreachable_${code}`, "unavailable");
  }

  console.info(`[lead] sent to n8n event=${eventId}`);
  return Response.json({ ok: true, event_id: eventId }, { headers: noStoreHeaders() });
}

export function GET() {
  return jsonError(405, GENERIC_ERROR);
}
