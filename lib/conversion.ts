"use client";

const CLICK_KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "ttclid",
  "li_fat_id",
  "msclkid",
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

export function captureClickIds() {
  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const storedClicks = readStored(STORAGE_CLICK);
  const storedUtm = readStored(STORAGE_UTM);

  for (const key of CLICK_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      storedClicks[key] = value.slice(0, 180);
    }
  }
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      storedUtm[key] = value.slice(0, 80);
    }
  }

  const fbclid = storedClicks.fbclid;
  if (fbclid && !storedClicks.fbc) {
    storedClicks.fbc = `fb.1.${Date.now()}.${fbclid}`;
  }
  const fbp = cookie("_fbp");
  const fbc = cookie("_fbc");
  if (fbp) {
    storedClicks.fbp = fbp.slice(0, 180);
  }
  if (fbc) {
    storedClicks.fbc = fbc.slice(0, 180);
  }

  writeStored(STORAGE_CLICK, storedClicks);
  writeStored(STORAGE_UTM, storedUtm);

  try {
    if (!sessionStorage.getItem(STORAGE_LANDING)) {
      sessionStorage.setItem(
        STORAGE_LANDING,
        window.location.href.split("#")[0] ?? window.location.href,
      );
    }
  } catch {
    /* ignore */
  }
}

export function conversionContext() {
  captureClickIds();
  return {
    event_id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    event_source_url:
      typeof window !== "undefined"
        ? (window.location.href.split("#")[0] ?? window.location.href)
        : "",
    landing_url:
      (typeof sessionStorage !== "undefined"
        ? sessionStorage.getItem(STORAGE_LANDING)
        : null) ?? "",
    click_ids: readStored(STORAGE_CLICK),
    utm: readStored(STORAGE_UTM),
  };
}
