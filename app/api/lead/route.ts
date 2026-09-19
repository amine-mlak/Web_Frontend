export const dynamic = "force-dynamic";

import { createHash, randomUUID } from "crypto";
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
    return jsonError(415, GENERIC_ERROR);
  }
  if (!originAllowed(request) || userAgentBlocked(request)) {
    return jsonError(403, GENERIC_ERROR);
  }

  const ip = clientIp(request);
  if (!rateLimit(`lead:${ip}`, leadLimits.LEAD_MAX_PER_IP, leadLimits.LEAD_WINDOW_MS)) {
    return jsonError(429, "rate_limited");
  }

  const raw = await request.text();
  const parsed = parseLeadBody(raw);
  if (!parsed.ok) {
    return jsonError(400, GENERIC_ERROR);
  }

  if (honeypotFilled(parsed.body)) {
    return Response.json({ ok: true }, { headers: noStoreHeaders() });
  }

  const challenge = readChallenge(parsed.body.challenge ?? "", ip);
  if (!challenge.ok) {
    return jsonError(400, GENERIC_ERROR);
  }

  const valid = validateLead(parsed.body);
  if (!valid.ok) {
    return jsonError(400, GENERIC_ERROR);
  }

  if (
    !rateLimit(
      `lead-email:${emailKey(valid.lead.email)}`,
      leadLimits.LEAD_MAX_PER_EMAIL,
      leadLimits.LEAD_WINDOW_MS,
    )
  ) {
    return jsonError(429, "rate_limited");
  }

  const n8n = n8nConfig();
  if (!n8n) {
    return jsonError(503, "unavailable");
  }

  const eventId = valid.lead.eventId || randomUUID();
  const payload = {
    auth_secret: n8n.secret,
    event_name: "Lead",
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
      return jsonError(502, "unavailable");
    }
    const result: unknown = await upstream.json().catch(() => null);
    if (
      !result ||
      typeof result !== "object" ||
      !("ok" in result) ||
      result.ok !== true
    ) {
      return jsonError(502, "unavailable");
    }
  } catch {
    return jsonError(502, "unavailable");
  }

  return Response.json({ ok: true, event_id: eventId }, { headers: noStoreHeaders() });
}

export function GET() {
  return jsonError(405, GENERIC_ERROR);
}
