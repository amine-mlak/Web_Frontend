"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pushDataLayer } from "@/lib/analytics";
import { subscribeConsent } from "@/lib/consent-state";

let loaded = false;

function loadGtm(gtmId: string, base: string, auth?: string, preview?: string) {
  if (loaded) return;
  loaded = true;
  pushDataLayer({ "gtm.start": Date.now(), event: "gtm.js" });
  const env =
    auth && preview
      ? `&gtm_auth=${encodeURIComponent(auth)}&gtm_preview=${encodeURIComponent(preview)}&gtm_cookies_win=x`
      : "";
  const script = document.createElement("script");
  script.async = true;
  script.src = `${base}/gtm.js?id=${encodeURIComponent(gtmId)}${env}`;
  document.head.appendChild(script);
}

export default function TagManagerClient({
  gtmId,
  auth,
  preview,
  serverUrl,
}: {
  gtmId: string;
  auth?: string;
  preview?: string;
  serverUrl?: string;
}) {
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  useEffect(
    () =>
      subscribeConsent((consent) => {
        if (consent.analytics || consent.marketing) {
          loadGtm(gtmId, serverUrl ?? "https://www.googletagmanager.com", auth, preview);
        }
      }),
    [gtmId, serverUrl, auth, preview],
  );

  // Client-side navigation: GA4 counts it itself (history change), the other
  // pixels fire their page view on this event. The first page is "gtm.js".
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    pushDataLayer({ event: "page_view_spa", page_path: pathname, page_location: window.location.href });
  }, [pathname]);

  return null;
}
