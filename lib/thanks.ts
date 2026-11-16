/**
 * What a thank-you page shows about the form just sent (first name, the booked time). It is
 * handed over in this tab's sessionStorage, never in the address, so no personal data ends up
 * in the URL, the browser history or an analytics hit. A page opened without it still works.
 */

export type ThanksKind = "planner" | "booking" | "application";
export type ThanksData = { name?: string; lines?: string[] };

const key = (kind: ThanksKind) => `beer_thanks_${kind}`;

export function saveThanks(kind: ThanksKind, data: ThanksData) {
  try {
    sessionStorage.setItem(key(kind), JSON.stringify(data));
  } catch {
    /* private mode or full storage: the page shows its general text */
  }
}

export function readThanks(kind: ThanksKind): ThanksData {
  try {
    const raw = sessionStorage.getItem(key(kind));
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object") return {};
    const data = parsed as Record<string, unknown>;
    return {
      name: typeof data.name === "string" ? data.name.slice(0, 60) : undefined,
      lines: Array.isArray(data.lines) ? data.lines.filter((line): line is string => typeof line === "string").slice(0, 4) : undefined,
    };
  } catch {
    return {};
  }
}
