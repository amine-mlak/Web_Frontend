export const dynamic = "force-dynamic";

import { trimLead } from "@/lib/lead-fields";
import { createHash, randomUUID } from "crypto";
import { contentMatches, FILE_TYPES, safeFileName } from "@/lib/application-files";
import { isLocale } from "@/lib/i18n";
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
import { mauticEnabled, sendPlannerToMautic } from "@/lib/mautic";
import { sendNewsletterSignup } from "@/lib/newsletter";
import { PLAN_MAX_BYTES, planExtension } from "@/lib/plan-file";

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
  // Plain JSON, or multipart when the visitor added a floor plan: the lead as JSON in
  // "payload", the file as "grundriss".
  const contentType = request.headers.get("content-type")?.split(";")[0]?.trim();
  const multipart = contentType === "multipart/form-data";
  if (contentType !== "application/json" && !multipart) {
    return reject(request, 415, "content_type");
  }
  if (multipart) {
    // Refuse an oversized upload before reading it (room for the text fields on top).
    const length = Number(request.headers.get("content-length") ?? 0);
    if (!length) {
      return reject(request, 411, "length_required");
    }
    if (length > PLAN_MAX_BYTES + 64 * 1024) {
      return reject(request, 413, "too_large", "too_large");
    }
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

  let raw = "";
  let planFile: File | null = null;
  if (multipart) {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return reject(request, 400, "form_data");
    }
    const payload = form.get("payload");
    raw = typeof payload === "string" ? payload : "";
    const file = form.get("grundriss");
    planFile = file instanceof File && file.size > 0 ? file : null;
  } else {
    raw = await request.text();
  }
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

  const germanPlanner = await getKitchenPlanner("de");
  const valid = validateLead(parsed.body, germanPlanner);
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

  // The floor plan is checked by size and by its first bytes, not just its name.
  let plan: { name: string; type: string; size: number; data_base64: string } | undefined;
  if (planFile) {
    const ext = planExtension(planFile.name);
    if (!ext) {
      return reject(request, 400, "file_type");
    }
    if (planFile.size > PLAN_MAX_BYTES) {
      return reject(request, 413, "file_size", "too_large");
    }
    const bytes = Buffer.from(await planFile.arrayBuffer());
    if (!contentMatches(ext, bytes.subarray(0, 8))) {
      return reject(request, 400, "file_content");
    }
    plan = { name: safeFileName(planFile.name, 0), type: FILE_TYPES[ext], size: planFile.size, data_base64: bytes.toString("base64") };
  }

  const n8n = n8nConfig();
  if (!n8n) {
    return reject(request, 503, "n8n_not_configured", "unavailable");
  }

  // The appointment form on /kontakt: the same lead, but its text is the wish and the note, and
  // it carries no planner answers.
  const termin = parsed.body.form === "termin";
  const wish = termin ? trimLead(parsed.body.wish, 160) : "";
  const terminMessage = [wish ? `Wunschtermin: ${wish}` : "", trimLead(parsed.body.message, 2000)].filter(Boolean).join("\n\n");

  const eventId = valid.lead.eventId || randomUUID();
  const payload = {
    auth_secret: n8n.secret,
    event_name: "Lead",
    // Which form sent it; the n8n workflow reads `details` by this.
    lead_source: termin ? "termin" : "kuechenplaner",
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: valid.lead.eventSourceUrl,
    landing_url: valid.lead.landingUrl,
    click_ids: valid.lead.clickIds,
    utm: valid.lead.utm,
    // The visitor's banner choice; any later server-side send to an ad platform must respect it.
    consent: valid.lead.consent,
    user: {
      name: valid.lead.name,
      email: valid.lead.email,
      phone: valid.lead.phone,
      message: termin ? terminMessage : plan ? `${valid.lead.message}\n\nGrundriss hochgeladen: ${plan.name}` : valid.lead.message,
      client_ip: ip === "unknown" ? undefined : ip,
      user_agent: request.headers.get("user-agent") ?? undefined,
    },
    details: termin ? { form: "termin", wish } : valid.lead.details,
    // The visitor's floor plan, when they added one: file name, type, size and the file as base64.
    plan,
  };

  try {
    const upstream = await fetch(n8n.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-n8n-webhook-secret": n8n.secret,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(plan ? 20000 : 8000),
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

  console.info(`[lead] sent to n8n event=${eventId}${plan ? ` plan=${plan.size}b` : ""}`);
  // Mautic sends the planner follow-up mail, so only planner leads go there.
  if (mauticEnabled() && !termin) {
    // The contact and its planner answers also go to Mautic, which sends the follow-up mails.
    // A hiccup there must not turn the lead into an error for the visitor.
    const failed = await sendPlannerToMautic(
      { name: valid.lead.name, email: valid.lead.email, phone: valid.lead.phone, details: valid.lead.details, hasPlan: Boolean(plan) },
      germanPlanner,
    );
    console.info(`[lead] mautic ${failed ? `failed: ${failed}` : "contact sent"}`);
  }
  if (parsed.body.newsletter === true && !termin) {
    // The lead is in; a newsletter hiccup must not turn it into an error for the visitor.
    const failed = await sendNewsletterSignup({
      email: valid.lead.email,
      vorname: valid.lead.name.split(/\s+/)[0],
      locale: typeof parsed.body.locale === "string" && isLocale(parsed.body.locale) ? parsed.body.locale : "de",
      source: "/beratung (Küchenplaner)",
    });
    console.info(`[lead] newsletter sign-up ${failed ? `failed: ${failed}` : "sent to n8n"}`);
  }
  return Response.json({ ok: true, event_id: eventId }, { headers: noStoreHeaders() });
}

export function GET() {
  return jsonError(405, GENERIC_ERROR);
}
