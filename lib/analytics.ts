"use client";

import { trackEvent } from "@/lib/umami";

/**
 * One way to record an event: Umami (our cookieless dashboard) and the GTM
 * dataLayer (GA4 and the ad platforms). The dataLayer is only read once GTM
 * loads, and GTM only loads after a "yes" in the banner (components/TagManager.tsx).
 * Event names and fields: docs/tracking-and-consent.md.
 */

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function pushDataLayer(entry: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(entry);
}

/** Google's gtag(): the dataLayer needs the `arguments` object itself, not an array. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function gtag(..._args: unknown[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.dataLayer = window.dataLayer ?? [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

export function track(event: string, params?: Params) {
  trackEvent(event, params);
  pushDataLayer({ event, ...params });
}
