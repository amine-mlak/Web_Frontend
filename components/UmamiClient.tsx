"use client";

import { useEffect } from "react";

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
    if (recorderSrc) {
      injectScript(recorderSrc, websiteId, domains);
    }
  }, [src, recorderSrc, websiteId, domains]);

  return null;
}
