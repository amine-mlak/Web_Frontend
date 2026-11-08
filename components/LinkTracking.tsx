"use client";

import { useEffect } from "react";
import { pushDataLayer } from "@/lib/analytics";

/**
 * Turns clicks on phone, e-mail, route and social links into dataLayer events
 * for GA4 and the ad platforms. Umami already counts the same links through
 * their data-umami-event attributes, so nothing goes to Umami from here.
 */

const MAPS = /(?:google\.[a-z.]+\/maps|maps\.google\.|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.apple\.com)/i;

function eventFor(link: Element) {
  const href = link.getAttribute("href") ?? "";
  const name = link.getAttribute("data-umami-event") ?? "";
  const placement = link.getAttribute("data-umami-event-placement") ?? link.getAttribute("data-umami-event-location") ?? undefined;

  if (href.startsWith("tel:") || name === "tel_click" || name === "cta_call") {
    return { event: "contact", method: "phone", placement };
  }
  if (href.startsWith("mailto:")) {
    return { event: "contact", method: "email", placement };
  }
  if (name === "cta_location" || MAPS.test(href)) {
    return { event: "get_directions", placement };
  }
  if (name === "social_click" || name.startsWith("instagram_")) {
    return { event: "social_click", network: link.getAttribute("data-umami-event-network") ?? "instagram" };
  }
  return null;
}

export default function LinkTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link) return;
      const entry = eventFor(link);
      if (!entry) return;
      const clean = Object.fromEntries(Object.entries(entry).filter(([, value]) => value !== undefined));
      pushDataLayer(clean);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
