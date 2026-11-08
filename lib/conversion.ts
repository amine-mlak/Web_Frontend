"use client";

import { getConsent, hasConsent } from "@/lib/consent-state";

/**
 * Ad click IDs (gclid, fbclid, …) and UTMs for the lead record, so the CRM
 * knows which ad brought a kitchen order.
 *
 * § 25 TDDDG: nothing is written to the browser without Marketing consent.
 * Until then everything is held in memory only (it survives client-side
 * navigation, not a reload). Click IDs are personal data and only leave with
 * the lead after a "yes"; UTMs (campaign names) and the landing page always do.
 */

const CLICK_KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "ttclid",
  "li_fat_id",
  "msclkid",
  "epik",
  "twclid",
  "rdt_cid",
] as const;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const STORAGE_CLICK = "beer_click_ids";
const STORAGE_UTM = "beer_utm";
const STORAGE_LANDING = "beer_landing_url";

const memory: {
  clicks: Record<string, string>;
  utm: Record<string, string>;
  landing: string;
} = { clicks: {}, utm: {}, landing: "" };

function cookie(name: string) {
  if (typeof document === "undefined") {
    return "";
  }
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function readStored(key: string) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

function writeStored(key: string, value: Record<string, string>) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / private mode */
  }
}

function pageUrl() {
  return window.location.href.split("#")[0] ?? window.location.href;
}

/** Reads click IDs and UTMs from the current URL into memory (no storage); saves them with consent. */
export function captureClickIds() {
  if (typeof window === "undefined") {
    return;
  }
  readUrl();
  if (hasConsent("marketing")) {
    persistClickIds();
  }
}

function readUrl() {
  const params = new URLSearchParams(window.location.search);
  for (const key of CLICK_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      memory.clicks[key] = value.slice(0, 180);
    }
  }
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      memory.utm[key] = value.slice(0, 80);
    }
  }
  if (!memory.landing) {
    memory.landing = pageUrl();
  }
}

/** After Marketing consent: merge memory (and the current URL) with this tab's earlier values and save. */
export function persistClickIds() {
  if (typeof window === "undefined") {
    return;
  }
  // A "yes" given later on the ad's landing page (also after an earlier "no") still counts the click.
  readUrl();
  const clicks = { ...readStored(STORAGE_CLICK), ...memory.clicks };
  const utm = { ...readStored(STORAGE_UTM), ...memory.utm };

  if (clicks.fbclid && !clicks.fbc) {
    clicks.fbc = `fb.1.${Date.now()}.${clicks.fbclid}`;
  }
  // Meta's own cookies exist only after a "yes" anyway (the Pixel sets them).
  const fbp = cookie("_fbp");
  const fbc = cookie("_fbc");
  if (fbp) clicks.fbp = fbp.slice(0, 180);
  if (fbc) clicks.fbc = fbc.slice(0, 180);

  writeStored(STORAGE_CLICK, clicks);
  writeStored(STORAGE_UTM, utm);
  try {
    const landing = sessionStorage.getItem(STORAGE_LANDING);
    if (landing) {
      memory.landing = landing;
    } else if (memory.landing) {
      sessionStorage.setItem(STORAGE_LANDING, memory.landing);
    }
  } catch {
    /* ignore */
  }
  memory.clicks = clicks;
  memory.utm = utm;
}

/** Marketing refused or withdrawn: forget the click IDs and clear what was saved. */
export function dropClickIds() {
  memory.clicks = {};
  try {
    sessionStorage.removeItem(STORAGE_CLICK);
    sessionStorage.removeItem(STORAGE_UTM);
    sessionStorage.removeItem(STORAGE_LANDING);
  } catch {
    /* ignore */
  }
}

export function conversionContext() {
  captureClickIds();
  const consent = getConsent();
  return {
    event_id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    event_source_url: typeof window !== "undefined" ? pageUrl() : "",
    landing_url: memory.landing,
    click_ids: consent.marketing ? { ...memory.clicks } : {},
    utm: { ...memory.utm },
    tracking_consent: { analytics: consent.analytics, marketing: consent.marketing },
  };
}
