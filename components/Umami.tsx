import UmamiClient from "@/components/UmamiClient";
import { umamiRecorderSrc, umamiScriptSrc } from "@/lib/umami";

export default function Umami() {
  const src = umamiScriptSrc();
  const recorderSrc = umamiRecorderSrc();
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
      <script
        defer
        src={src}
        data-website-id={websiteId}
        {...(domains ? { "data-domains": domains } : {})}
      />
      {/* The session recorder is added by UmamiClient, only after Statistik consent. */}
      <UmamiClient
        src={src}
        recorderSrc={recorderSrc ?? undefined}
        websiteId={websiteId}
        domains={domains}
      />
    </>
  );
}
