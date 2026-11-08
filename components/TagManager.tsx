import TagManagerClient from "@/components/TagManagerClient";

/**
 * Google Tag Manager with Consent Mode v2 "basic": the defaults below (all
 * denied) are set on every page, and GTM itself is only loaded after a "yes"
 * to Statistik or Marketing (TagManagerClient). With "Alle ablehnen" no request
 * goes to Google at all. Without NEXT_PUBLIC_GTM_ID nothing here renders.
 *
 * Env:
 * - NEXT_PUBLIC_GTM_ID          GTM-XXXXXXX (web container)
 * - NEXT_PUBLIC_GTM_AUTH,
 *   NEXT_PUBLIC_GTM_PREVIEW     optional GTM environment (staging), from GTM → Admin → Environments
 * - NEXT_PUBLIC_GTM_SERVER_URL  optional, phase 2: https://sgtm.beer.de (first-party loader)
 */

const CONSENT_DEFAULTS = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'denied',personalization_storage:'denied',security_storage:'granted',wait_for_update:500});gtag('set','ads_data_redaction',true);`;

function serverUrl() {
  const raw = process.env.NEXT_PUBLIC_GTM_SERVER_URL?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.origin : undefined;
  } catch {
    return undefined;
  }
}

export default function TagManager() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  if (!gtmId || !/^GTM-[A-Z0-9]+$/.test(gtmId)) {
    return null;
  }

  return (
    <>
      <script id="consent-defaults" dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS }} />
      <TagManagerClient
        gtmId={gtmId}
        auth={process.env.NEXT_PUBLIC_GTM_AUTH?.trim() || undefined}
        preview={process.env.NEXT_PUBLIC_GTM_PREVIEW?.trim() || undefined}
        serverUrl={serverUrl()}
      />
    </>
  );
}
