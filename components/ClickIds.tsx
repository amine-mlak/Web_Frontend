"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { subscribeConsent } from "@/lib/consent-state";
import { captureClickIds, dropClickIds, persistClickIds } from "@/lib/conversion";

export default function ClickIds() {
  const pathname = usePathname();

  // Every page (also client-side navigation) may arrive with ?gclid=… or UTMs.
  useEffect(() => {
    captureClickIds();
  }, [pathname]);

  useEffect(
    () =>
      subscribeConsent((consent) => {
        if (!consent.decided) return;
        if (consent.marketing) persistClickIds();
        else dropClickIds();
      }),
    [],
  );

  return null;
}
