"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { useLocale } from "@/components/LocaleProvider";
import { gtag } from "@/lib/analytics";
import { consentTranslation } from "@/lib/consent-copy";
import { CONSENT_SETTINGS_ATTR, setConsent, type ConsentState } from "@/lib/consent-state";
import { withLocale, type Locale } from "@/lib/i18n";

/**
 * The cookie banner (vanilla-cookieconsent v3, MIT). Nothing that needs consent
 * loads before an answer; "Alle ablehnen" sits next to "Alle akzeptieren" with
 * the same weight. The answer lives only in the visitor's beer_consent cookie
 * (ID, time, categories, revision). Texts and the cookie list: lib/consent-copy.ts.
 */

/** Raise when services or cookies change: everyone is asked again. */
export const CONSENT_REVISION = 1;
export const CONSENT_COOKIE = "beer_consent";

function readState(): ConsentState {
  return {
    decided: CookieConsent.validConsent(),
    analytics: CookieConsent.acceptedCategory("analytics"),
    marketing: CookieConsent.acceptedCategory("marketing"),
  };
}

function apply() {
  const state = readState();
  const analytics = state.analytics ? "granted" : "denied";
  const ads = state.marketing ? "granted" : "denied";
  gtag("consent", "update", {
    analytics_storage: analytics,
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
  setConsent(state);
}

function translations(locale: Locale) {
  return consentTranslation(locale, {
    privacy: withLocale("/datenschutz", locale),
    imprint: withLocale("/impressum", locale),
  });
}

export default function ConsentBanner() {
  const locale = useLocale();

  useEffect(() => {
    void CookieConsent.run({
      revision: CONSENT_REVISION,
      cookie: { name: CONSENT_COOKIE, expiresAfterDays: 182, sameSite: "Lax" },
      guiOptions: {
        consentModal: { layout: "box wide", position: "bottom left", equalWeightButtons: true, flipButtons: false },
        preferencesModal: { layout: "box", equalWeightButtons: true, flipButtons: false },
      },
      categories: {
        necessary: { enabled: true, readOnly: true },
        analytics: {
          autoClear: { cookies: [{ name: /^_ga/ }], reloadPage: true },
        },
        marketing: {
          autoClear: {
            cookies: [
              { name: /^_gcl_/ },
              { name: /^_fb[pc]$/ },
              { name: /^_pin_unauth$/ },
              { name: /^_epik$/ },
              { name: /^_uet/ },
              { name: /^_ttp$/ },
              { name: /^li_/ },
            ],
            reloadPage: true,
          },
        },
      },
      language: {
        default: locale,
        translations: { de: translations("de"), en: translations("en") },
      },
      onConsent: apply,
      onChange: apply,
    });
    // run() only works once per page load; the locale effect below handles language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void CookieConsent.setLanguage(locale);
  }, [locale]);

  useEffect(() => {
    const open = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest(`[${CONSENT_SETTINGS_ATTR}]`) : null;
      if (!target) return;
      event.preventDefault();
      CookieConsent.showPreferences();
    };
    document.addEventListener("click", open);
    return () => document.removeEventListener("click", open);
  }, []);

  return null;
}
