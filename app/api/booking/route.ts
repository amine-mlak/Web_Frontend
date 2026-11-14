export const dynamic = "force-dynamic";

import { createHash, randomUUID } from "crypto";
import { createBooking, getBookingMonth, getBookingSetup } from "@/lib/bookings";
import { trimLead, validateLeadFields } from "@/lib/lead-fields";
import {
  clientIp,
  honeypotFilled,
  jsonError,
  leadLimits,
  n8nConfig,
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

/**
 * The appointment calendar on /kontakt. GET without parameters gives the services and people,
 * GET with `service` and `month` the free times of that month, POST books a time. Everything
 * comes from and goes to the team's Microsoft Bookings calendar (lib/bookings.ts).
 */

const READS_PER_IP = 90;

type BookingBody = LeadBody & { service?: unknown; date?: unknown; time?: unknown; staff?: unknown; answers?: unknown };

function refuse(status: number, reason: string, body = "invalid") {
  console.warn(`[booking] refused ${status} ${reason}`);
  return jsonError(status, body);
}

function guard(request: Request) {
  if (!originAllowed(request)) return refuse(403, "origin", "forbidden");
  if (userAgentBlocked(request)) return refuse(403, "user_agent", "forbidden");
  return null;
}

export async function GET(request: Request) {
  const blocked = guard(request);
  if (blocked) return blocked;
  if (!rateLimit(`booking-read:${clientIp(request)}`, READS_PER_IP, leadLimits.LEAD_WINDOW_MS)) return refuse(429, "rate_ip", "rate_limited");

  const params = new URL(request.url).searchParams;
  const service = params.get("service") ?? "";
  const month = params.get("month") ?? "";
  try {
    if (!service && !month) {
      return Response.json({ ok: true, ...(await getBookingSetup()) }, { headers: noStoreHeaders() });
    }
    if (!/^[\w-]{8,64}$/.test(service) || !/^20\d\d-(0[1-9]|1[0-2])$/.test(month)) return refuse(400, "params");
    return Response.json({ ok: true, days: await getBookingMonth(service, month) }, { headers: noStoreHeaders() });
  } catch (error) {
    return refuse(502, error instanceof Error ? error.message : "unknown", "unavailable");
  }
}

export async function POST(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") return refuse(415, "content_type");
  const blocked = guard(request);
  if (blocked) return blocked;

  const ip = clientIp(request);
  if (!rateLimit(`booking:${ip}`, leadLimits.LEAD_MAX_PER_IP, leadLimits.LEAD_WINDOW_MS)) return refuse(429, "rate_ip", "rate_limited");

  const parsed = parseLeadBody(await request.text());
  if (!parsed.ok) return refuse(400, "body");
  const body: BookingBody = parsed.body;

  if (honeypotFilled(body)) {
    console.warn("[booking] honeypot filled, answered ok without booking");
    return Response.json({ ok: true }, { headers: noStoreHeaders() });
  }
  const challenge = readChallenge(body.challenge ?? "", ip);
  if (!challenge.ok) return refuse(400, challenge.reason);

  const fields = validateLeadFields(body);
  if (!fields.ok) return refuse(400, fields.reason);

  const serviceId = trimLead(body.service, 64);
  const date = trimLead(body.date, 10);
  const time = trimLead(body.time, 5);
  const staffId = trimLead(body.staff, 64);
  if (!/^[\w-]{8,64}$/.test(serviceId) || !/^20\d\d-\d\d-\d\d$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) || (staffId && !/^[\w-]{8,64}$/.test(staffId))) {
    return refuse(400, "slot");
  }
  const answers: Record<string, string> = {};
  if (body.answers && typeof body.answers === "object" && !Array.isArray(body.answers)) {
    for (const [key, value] of Object.entries(body.answers).slice(0, 10)) {
      const answer = trimLead(value, 1000);
      if (/^[\w-]{8,64}$/.test(key) && answer) answers[key] = answer;
    }
  }

  const emailKey = createHash("sha256").update(fields.email).digest("hex").slice(0, 16);
  if (!rateLimit(`booking-email:${emailKey}`, leadLimits.LEAD_MAX_PER_EMAIL, leadLimits.LEAD_WINDOW_MS)) return refuse(429, "rate_email", "rate_limited");

  const booked = await createBooking({ serviceId, date, time, staffId, name: fields.name, email: fields.email, phone: fields.phone, answers });
  if (!booked.ok) {
    if (booked.reason === "slot_taken") return refuse(409, "slot_taken", "slot_taken");
    return refuse(booked.reason === "unreachable" || booked.reason === "refused" ? 502 : 400, booked.reason, booked.reason === "unreachable" || booked.reason === "refused" ? "unavailable" : "invalid");
  }

  const eventId = trimLead(body.event_id, 80) || randomUUID();
  console.info(`[booking] booked event=${eventId} service=${serviceId} ${date} ${time}`);

  // The appointment is in the calendar. The lead log in n8n gets a copy with where the visitor
  // came from; a hiccup there must not turn the booking into an error.
  const n8n = n8nConfig();
  if (n8n) {
    const marketing = body.tracking_consent?.marketing === true;
    const notes = booked.service.questions.filter((question) => answers[question.id]).map((question) => `${question.text}: ${answers[question.id]}`);
    const when = `${date} ${time}`;
    const message = [`Termin gebucht: ${booked.service.title}`, `Zeit: ${when}${booked.staffName ? `, bei ${booked.staffName}` : ""}`, ...notes].join("\n");
    try {
      await fetch(n8n.url, {
        method: "POST",
        headers: { "content-type": "application/json", "x-n8n-webhook-secret": n8n.secret },
        body: JSON.stringify({
          auth_secret: n8n.secret,
          event_name: "Lead",
          lead_source: "termin",
          event_id: eventId,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: trimLead(body.event_source_url, 500) || undefined,
          landing_url: trimLead(body.landing_url, 500) || undefined,
          click_ids: marketing ? sanitizeClickIds(body.click_ids) : {},
          utm: sanitizeUtm(body.utm),
          consent: { analytics: body.tracking_consent?.analytics === true, marketing },
          user: {
            name: fields.name,
            email: fields.email,
            phone: fields.phone,
            message,
            client_ip: ip === "unknown" ? undefined : ip,
            user_agent: request.headers.get("user-agent") ?? undefined,
          },
          details: { form: "termin", wish: when, service: booked.service.title, staff: booked.staffName },
        }),
        signal: AbortSignal.timeout(6000),
        cache: "no-store",
      });
    } catch {
      console.warn(`[booking] lead copy not sent event=${eventId}`);
    }
  }

  return Response.json({ ok: true, event_id: eventId, staff: booked.staffName }, { headers: noStoreHeaders() });
}
