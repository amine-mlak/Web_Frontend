/**
 * The CMS collection "Weiterleitungen": the CMS writes one automatically when a published page gets a
 * new address (old address → new address), editors can add more. proxy.ts applies them before routing.
 *
 * Kept free of other app modules because proxy.ts runs before the app.
 */

type Redirect = { to: string; permanent: boolean };

const CMS = (process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "https://cms.beer.de").replace(/\/$/, "");
/** How long the list is kept before it is asked for again. */
const TTL_MS = 5 * 60 * 1000;
/** A slow CMS must never hold a page back: then the last list (or none) is used. */
const TIMEOUT_MS = 1500;

let cache: { at: number; map: Map<string, Redirect> } | null = null;
let loading: Promise<void> | null = null;

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

async function load() {
  try {
    const response = await fetch(
      `${CMS}/api/redirects?pagination[pageSize]=1000&fields[0]=from&fields[1]=to&fields[2]=statusCode`,
      { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    const payload = (await response.json()) as {
      data?: { from?: string; to?: string; statusCode?: string }[];
    };
    const map = new Map<string, Redirect>();
    for (const row of payload.data ?? []) {
      const from = row.from?.trim();
      const to = row.to?.trim();
      if (from?.startsWith("/") && to && normalize(from) !== normalize(to)) {
        map.set(normalize(from), { to, permanent: row.statusCode !== "temporary" });
      }
    }
    cache = { at: Date.now(), map };
  } catch {
    // Keep the last list; try again after the next TTL.
    cache = { at: Date.now(), map: cache?.map ?? new Map() };
  }
}

/** The CMS redirect for a public address, if there is one. */
export async function cmsRedirect(pathname: string): Promise<Redirect | undefined> {
  if (!cache || Date.now() - cache.at > TTL_MS) {
    loading ??= load().finally(() => {
      loading = null;
    });
    // The first request waits for the list; later ones use the old list while it refreshes.
    if (!cache) {
      await loading;
    }
  }
  return cache?.map.get(normalize(pathname));
}
