"use client";

import { useEffect } from "react";
import { subscribeConsent } from "@/lib/consent-state";

function injectScript(src: string, websiteId: string, domains?: string) {
  if (document.querySelector(`script[src="${src}"]`)) {
    return;
  }

  const el = document.createElement("script");
  el.src = src;
  el.defer = true;
  el.setAttribute("data-website-id", websiteId);
  if (domains) {
    el.setAttribute("data-domains", domains);
  }
  document.head.appendChild(el);
}

export default function UmamiClient({
  src,
  recorderSrc,
  websiteId,
  domains,
}: {
  src: string;
  recorderSrc?: string;
  websiteId: string;
  domains?: string;
}) {
  useEffect(() => {
    injectScript(src, websiteId, domains);
  }, [src, websiteId, domains]);

  // The recorder (clicks and scrolling) needs Statistik consent; a withdrawal reloads the page.
  useEffect(() => {
    if (!recorderSrc) return;
    return subscribeConsent((consent) => {
      if (consent.analytics) injectScript(recorderSrc, websiteId, domains);
    });
  }, [recorderSrc, websiteId, domains]);

  return null;
}
