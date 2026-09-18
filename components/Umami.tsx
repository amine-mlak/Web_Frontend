import Script from "next/script";
import { Suspense } from "react";
import UmamiPageviews from "@/components/UmamiPageviews";
import { umamiScriptSrc } from "@/lib/umami";

export default function Umami() {
  const src = umamiScriptSrc();
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const domains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;

  if (!src || !websiteId) {
    return null;
  }

  if (
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_UMAMI_DEV !== "true"
  ) {
    return null;
  }

  return (
    <>
      <Script
        id="umami"
        src={src}
        data-website-id={websiteId}
        data-auto-track="false"
        data-do-not-track="true"
        {...(domains ? { "data-domains": domains } : {})}
        strategy="afterInteractive"
      />
      <Suspense fallback={null}>
        <UmamiPageviews />
      </Suspense>
    </>
  );
}
