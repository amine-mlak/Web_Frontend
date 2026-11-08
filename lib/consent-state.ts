/**
 * The visitor's cookie choice, shared by everything that must wait for it
 * (GTM, the Umami recorder, click IDs). The banner (components/ConsentBanner.tsx)
 * is the only writer; nothing here imports the banner library. No "use client":
 * server components import CONSENT_SETTINGS_ATTR from here; the state itself is
 * only ever set and read in the browser.
 */

/** Put on anything that should open the cookie settings again, e.g. the footer link. */
export const CONSENT_SETTINGS_ATTR = "data-consent-settings";

export type ConsentCategory = "analytics" | "marketing";

export type ConsentState = {
  /** False until the visitor has answered the banner (or an earlier answer was read). */
  decided: boolean;
  analytics: boolean;
  marketing: boolean;
};

let state: ConsentState = { decided: false, analytics: false, marketing: false };
const listeners = new Set<(state: ConsentState) => void>();

export function getConsent(): ConsentState {
  return state;
}

export function hasConsent(category: ConsentCategory) {
  return state[category];
}

export function setConsent(next: ConsentState) {
  state = next;
  for (const listener of listeners) {
    listener(state);
  }
}

/** Calls `listener` now and on every change; returns the unsubscribe function. */
export function subscribeConsent(listener: (state: ConsentState) => void) {
  listeners.add(listener);
  listener(state);
  return () => {
    listeners.delete(listener);
  };
}
