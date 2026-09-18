import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const CHALLENGE_TTL_MS = 20 * 60 * 1000;
const MIN_SOLVE_MS = 1500;
const LEAD_WINDOW_MS = 10 * 60 * 1000;
const LEAD_MAX_PER_IP = 5;
const LEAD_MAX_PER_EMAIL = 2;
const CHALLENGE_MAX_PER_IP = 30;
const MAX_JSON_BYTES = 8 * 1024;

const BOT_UA =
  /(?:curl|wget|python-requests|python-httpx|scrapy|httpie|go-http-client|java\/|libwww-perl|aiohttp|fasthttp|okhttp|powershell|postmanruntime|nmap|masscan|sqlmap)/i;

const attempts = new Map<string, number[]>();

export type ClickIds = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
  ttclid?: string;
  li_fat_id?: string;
  msclkid?: string;
  twclid?: string;
  rdt_cid?: string;
};

export type LeadBody = {
  challenge?: string;
  company_website?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  event_id?: string;
  event_source_url?: string;
  landing_url?: string;
  click_ids?: ClickIds;
  utm?: Record<string, string>;
};

const runtimeChallengeSecret =
  process.env.LEAD_CHALLENGE_SECRET || randomBytes(32).toString("hex");

function challengeSecret() {
  return runtimeChallengeSecret;
}

function trim(value: unknown, max: number) {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function hmac(value: string) {
  return createHmac("sha256", challengeSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

function prune(key: string, windowMs: number) {
  const now = Date.now();
  const next = (attempts.get(key) ?? []).filter((ts) => now - ts < windowMs);
  if (next.length === 0) {
    attempts.delete(key);
  } else {
    attempts.set(key, next);
  }
  return next;
}

export function rateLimit(key: string, max: number, windowMs: number) {
  const next = prune(key, windowMs);
  if (next.length >= max) {
    return false;
  }
  next.push(Date.now());
  attempts.set(key, next);
  return true;
}

export function clientIp(request: Request) {
  const real = request.headers.get("x-real-ip");
  if (real) {
    return real.split(",")[0]!.trim();
  }
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]!.trim();
  }
  return "unknown";
}

export function noStoreHeaders() {
  return {
    "cache-control": "no-store, no-cache, max-age=0",
    pragma: "no-cache",
    "x-robots-tag": "noindex, nofollow, noarchive, nosnippet",
  };
}

export function jsonError(status: number, error: string) {
  return Response.json(
    { ok: false, error },
    { status, headers: noStoreHeaders() },
  );
}

export function extraAllowedOrigins() {
  const extras = new Set<string>();
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) {
    try {
      extras.add(new URL(site).origin);
    } catch {
      /* ignore invalid */
    }
  }
  for (const raw of (process.env.ALLOWED_LEAD_ORIGINS ?? "").split(",")) {
    const value = raw.trim();
    if (!value) {
      continue;
    }
    try {
      extras.add(new URL(value).origin);
    } catch {
      extras.add(value);
    }
  }
  extras.add("https://mwnw2vfalrhrso250cxmnje9.89.58.45.227.sslip.io");
  extras.add("http://localhost:3000");
  extras.add("https://localhost:3000");
  extras.add("http://127.0.0.1:3000");
  return extras;
}

export function originAllowed(request: Request) {
  const allowed = extraAllowedOrigins();
  try {
    allowed.add(new URL(request.url).origin);
  } catch {
    /* ignore */
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origin) {
    return allowed.has(origin);
  }
  if (referer) {
    try {
      return allowed.has(new URL(referer).origin);
    } catch {
      return false;
    }
  }
  return false;
}

export function userAgentBlocked(request: Request) {
  const ua = request.headers.get("user-agent")?.trim() ?? "";
  if (ua.length < 12) {
    return true;
  }
  return BOT_UA.test(ua);
}

export function issueChallenge(ip: string) {
  if (!challengeSecret()) {
    throw new Error("missing_challenge_secret");
  }
  const ts = Date.now().toString();
  const nonce = randomBytes(16).toString("hex");
  const mac = hmac(`${ts}.${nonce}.${ip}`);
  return `${ts}.${nonce}.${mac}`;
}

export function readChallenge(token: string, ip: string) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return { ok: false as const };
  }
  const [ts, nonce, mac] = parts;
  if (!ts || !nonce || !mac || nonce.length < 16) {
    return { ok: false as const };
  }
  if (!safeEqual(mac, hmac(`${ts}.${nonce}.${ip}`))) {
    return { ok: false as const };
  }
  const issuedAt = Number(ts);
  if (!Number.isFinite(issuedAt)) {
    return { ok: false as const };
  }
  const age = Date.now() - issuedAt;
  if (age < MIN_SOLVE_MS || age > CHALLENGE_TTL_MS) {
    return { ok: false as const };
  }
  return { ok: true as const, issuedAt };
}

export function parseLeadBody(raw: string): { ok: true; body: LeadBody } | { ok: false } {
  if (raw.length > MAX_JSON_BYTES) {
    return { ok: false };
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false };
    }
    return { ok: true, body: parsed as LeadBody };
  } catch {
    return { ok: false };
  }
}

export function honeypotFilled(body: LeadBody) {
  return trim(body.company_website, 200).length > 0;
}

export function validateLead(body: LeadBody) {
  const name = trim(body.name, 80);
  const email = trim(body.email, 120).toLowerCase();
  const phone = trim(body.phone, 40);
  const message = trim(body.message, 2000);
  const eventId = trim(body.event_id, 80);
  const eventSourceUrl = trim(body.event_source_url, 500);
  const landingUrl = trim(body.landing_url, 500);

  if (name.length < 2 || !/^[^\r\n]{2,80}$/.test(name)) {
    return { ok: false as const };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const };
  }
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 6 || phoneDigits.length > 16) {
    return { ok: false as const };
  }
  if ((message.match(/https?:\/\//gi) ?? []).length > 2) {
    return { ok: false as const };
  }

  const clickIds = sanitizeClickIds(body.click_ids);
  const utm = sanitizeUtm(body.utm);

  return {
    ok: true as const,
    lead: {
      name,
      email,
      phone,
      message,
      eventId: eventId || undefined,
      eventSourceUrl: eventSourceUrl || undefined,
      landingUrl: landingUrl || undefined,
      clickIds,
      utm,
    },
  };
}

function sanitizeClickIds(value: LeadBody["click_ids"]) {
  if (!value || typeof value !== "object") {
    return {};
  }
  const keys: (keyof ClickIds)[] = [
    "gclid",
    "gbraid",
    "wbraid",
    "fbclid",
    "fbc",
    "fbp",
    "ttclid",
    "li_fat_id",
    "msclkid",
    "twclid",
    "rdt_cid",
  ];
  const out: ClickIds = {};
  for (const key of keys) {
    const item = trim(value[key], 180);
    if (item && /^[\w.:=+/-]+$/.test(item)) {
      out[key] = item;
    }
  }
  return out;
}

function sanitizeUtm(value: LeadBody["utm"]) {
  if (!value || typeof value !== "object") {
    return {};
  }
  const out: Record<string, string> = {};
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ]) {
    const item = trim(value[key], 80);
    if (item) {
      out[key] = item;
    }
  }
  return out;
}

export const leadLimits = {
  LEAD_WINDOW_MS,
  LEAD_MAX_PER_IP,
  LEAD_MAX_PER_EMAIL,
  CHALLENGE_MAX_PER_IP,
};
