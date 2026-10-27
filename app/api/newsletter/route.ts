export const dynamic = "force-dynamic";

import { createHash } from "crypto";
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
  userAgentBlocked,
} from "@/lib/lead-guard";
import { newsletterEmail, sendNewsletterSignup, signupPath } from "@/lib/newsletter";

/**
 * Newsletter sign-up from the website (footer form). Same protection as the planner
 * (origin, bots, rate limits, honeypot, signed challenge); n8n then sends the
 * confirmation mail. The answer never says whether an address is already subscribed.
 */

const GENERIC_ERROR = "invalid";

function reject(status: number, reason: string, body = GENERIC_ERROR) {
  console.warn(`[newsletter] refused ${status} ${reason}`);
  return jsonError(status, body);
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
  if (!rateLimit(`newsletter:${ip}`, leadLimits.LEAD_MAX_PER_IP, leadLimits.LEAD_WINDOW_MS)) {
    return reject(429, "rate_ip", "rate_limited");
  }

  const parsed = parseLeadBody(await request.text());
  if (!parsed.ok) {
    return reject(400, "body");
  }
  const body = parsed.body as typeof parsed.body & { consent?: unknown; vorname?: unknown; locale?: unknown; page?: unknown };

  if (honeypotFilled(body)) {
    console.warn("[newsletter] honeypot filled, answered ok without sending");
    return Response.json({ ok: true }, { headers: noStoreHeaders() });
  }
  const challenge = readChallenge(body.challenge ?? "", ip);
  if (!challenge.ok) {
    return reject(400, challenge.reason);
  }

  const email = newsletterEmail(body.email);
  if (!email) {
    return reject(400, "invalid_email", "invalid_email");
  }
  if (body.consent !== true) {
    return reject(400, "no_consent", "no_consent");
  }
  const emailKey = createHash("sha256").update(email).digest("hex").slice(0, 16);
  if (!rateLimit(`newsletter-email:${emailKey}`, leadLimits.LEAD_MAX_PER_EMAIL, leadLimits.LEAD_WINDOW_MS)) {
    return reject(429, "rate_email", "rate_limited");
  }

  const failed = await sendNewsletterSignup({
    email,
    vorname: typeof body.vorname === "string" ? body.vorname : "",
    locale: typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "de",
    source: `${signupPath(body.page) || "/"} (Fußzeile)`,
  });
  if (failed) {
    return reject(502, failed, "unavailable");
  }
  console.info("[newsletter] sign-up sent to n8n");
  return Response.json({ ok: true }, { headers: noStoreHeaders() });
}

export function GET() {
  return jsonError(405, GENERIC_ERROR);
}
