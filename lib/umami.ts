export const UMAMI_TRACKED_PATHS = ["/", "/beratung"] as const;

export function isUmamiTrackedPath(pathname: string) {
  return pathname === "/" || pathname === "/beratung";
}

export function allowSearchIndexing() {
  return process.env.ALLOW_INDEXING === "true";
}

export function umamiScriptSrc() {
  const base = process.env.NEXT_PUBLIC_UMAMI_URL?.replace(/\/$/, "");
  return base ? `${base}/script.js` : null;
}

export function trackEvent(
  name: string,
  data?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") {
    return;
  }

  const send = () => {
    const track = window.umami?.track;
    if (typeof track !== "function") {
      return false;
    }
    track(name, data);
    return true;
  };

  if (send()) {
    return;
  }

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (send() || attempts >= 40) {
      window.clearInterval(timer);
    }
  }, 50);
}
