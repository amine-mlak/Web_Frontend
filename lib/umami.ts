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
