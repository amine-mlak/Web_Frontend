"use client";

import { useEffect } from "react";

export default function UmamiClient({
  src,
  websiteId,
  domains,
}: {
  src: string;
  websiteId: string;
  domains?: string;
}) {
  useEffect(() => {
    if (document.querySelector(`script[data-website-id="${websiteId}"]`)) {
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
  }, [src, websiteId, domains]);

  return null;
}
