import type { Translation } from "vanilla-cookieconsent";

/**
 * Cookie banner texts (DE/EN) and the list of services and cookies per category.
 *
 * DRAFT, needs a legal check before www.beer.de goes live. When a service or
 * cookie is added or removed here, raise CONSENT_REVISION in components/ConsentBanner.tsx
 * so everybody is asked again, and update the Datenschutzerklärung.
 * Later this could move to the CMS (Global settings), which needs a schema change.
 */

type Links = { privacy: string; imprint: string };

type Row = { name: string; provider: string; purpose: string; lifetime: string };

const headers = {
  de: { name: "Name", provider: "Anbieter", purpose: "Zweck", lifetime: "Speicherdauer" },
  en: { name: "Name", provider: "Provider", purpose: "Purpose", lifetime: "Lifetime" },
};

const necessaryRows: Record<"de" | "en", Row[]> = {
  de: [
    { name: "beer_consent", provider: "BEER", purpose: "Speichert Ihre Auswahl in diesem Fenster", lifetime: "6 Monate" },
  ],
  en: [
    { name: "beer_consent", provider: "BEER", purpose: "Stores your choice in this window", lifetime: "6 months" },
  ],
};

const analyticsRows: Record<"de" | "en", Row[]> = {
  de: [
    { name: "_ga, _ga_*", provider: "Google Analytics 4 (Google Ireland)", purpose: "Unterscheidet Besuche, misst Seitenaufrufe und Anfragen", lifetime: "2 Jahre" },
    { name: "– (keine Cookies)", provider: "Umami (eigener Server, EU)", purpose: "Anonyme Aufzeichnung von Klicks und Scrollen, um Formulare zu verbessern", lifetime: "–" },
  ],
  en: [
    { name: "_ga, _ga_*", provider: "Google Analytics 4 (Google Ireland)", purpose: "Tells visits apart, measures page views and enquiries", lifetime: "2 years" },
    { name: "– (no cookies)", provider: "Umami (our own server, EU)", purpose: "Anonymous recording of clicks and scrolling, to improve our forms", lifetime: "–" },
  ],
};

const marketingRows: Record<"de" | "en", Row[]> = {
  de: [
    { name: "_gcl_au, _gcl_aw", provider: "Google Ads (Google Ireland)", purpose: "Erkennt, ob eine Anfrage über eine Anzeige kam; Remarketing", lifetime: "90 Tage" },
    { name: "_fbp, _fbc", provider: "Meta Pixel (Meta Platforms Ireland)", purpose: "Erfolgsmessung und Zielgruppen für Facebook und Instagram", lifetime: "90 Tage" },
    { name: "_pin_unauth, _epik", provider: "Pinterest Tag (Pinterest Europe)", purpose: "Erfolgsmessung und Zielgruppen für Pinterest", lifetime: "1 Jahr" },
    { name: "_uetsid, _uetvid, MUID", provider: "Microsoft Advertising (Microsoft Ireland)", purpose: "Erfolgsmessung für Anzeigen bei Bing", lifetime: "1 Tag bis 13 Monate" },
    { name: "li_fat_id, li_sugr, bcookie", provider: "LinkedIn Insight Tag (LinkedIn Ireland)", purpose: "Erfolgsmessung für Anzeigen bei LinkedIn", lifetime: "30 Tage bis 1 Jahr" },
    { name: "beer_click_ids, beer_utm", provider: "BEER (Sitzungsspeicher)", purpose: "Merkt sich, über welche Anzeige Sie kamen, und gibt es mit Ihrer Anfrage weiter", lifetime: "bis das Fenster geschlossen wird" },
  ],
  en: [
    { name: "_gcl_au, _gcl_aw", provider: "Google Ads (Google Ireland)", purpose: "Recognises whether an enquiry came from an ad; remarketing", lifetime: "90 days" },
    { name: "_fbp, _fbc", provider: "Meta Pixel (Meta Platforms Ireland)", purpose: "Measuring results and audiences for Facebook and Instagram", lifetime: "90 days" },
    { name: "_pin_unauth, _epik", provider: "Pinterest Tag (Pinterest Europe)", purpose: "Measuring results and audiences for Pinterest", lifetime: "1 year" },
    { name: "_uetsid, _uetvid, MUID", provider: "Microsoft Advertising (Microsoft Ireland)", purpose: "Measuring results of ads on Bing", lifetime: "1 day to 13 months" },
    { name: "li_fat_id, li_sugr, bcookie", provider: "LinkedIn Insight Tag (LinkedIn Ireland)", purpose: "Measuring results of ads on LinkedIn", lifetime: "30 days to 1 year" },
    { name: "beer_click_ids, beer_utm", provider: "BEER (session storage)", purpose: "Remembers which ad brought you here and passes it on with your enquiry", lifetime: "until the window is closed" },
  ],
};

function table(locale: "de" | "en", rows: Row[]) {
  return { headers: headers[locale], body: rows };
}

export function consentTranslation(locale: "de" | "en", links: Links): Translation {
  const legal = (privacy: string, imprint: string) =>
    `<a href="${links.privacy}">${privacy}</a> · <a href="${links.imprint}">${imprint}</a>`;

  if (locale === "en") {
    return {
      consentModal: {
        label: "Cookie consent",
        title: "Cookies on beer.de",
        description:
          "We would like to measure how our website is used and which ads bring enquiries. For this we and our partners (Google, Meta, Pinterest, Microsoft, LinkedIn) use cookies and similar technology, but only if you agree. Some partners process data in the USA. You can change your choice at any time under “Cookie settings” at the bottom of every page.",
        acceptAllBtn: "Accept all",
        acceptNecessaryBtn: "Reject all",
        showPreferencesBtn: "Settings",
        revisionMessage: "<br><br>Our list of services has changed since your last visit, so we are asking again.",
        footer: legal("Privacy policy", "Imprint"),
      },
      preferencesModal: {
        title: "Cookie settings",
        acceptAllBtn: "Accept all",
        acceptNecessaryBtn: "Reject all",
        savePreferencesBtn: "Save selection",
        closeIconLabel: "Close",
        serviceCounterLabel: "Service|Services",
        sections: [
          {
            title: "Your choice",
            description: `Choose what we may use. You can withdraw your consent at any time with effect for the future. Details are in our <a href="${links.privacy}">privacy policy</a>.`,
          },
          {
            title: "Necessary",
            description: "Needed for the website to work and to remember your choice. Always on.",
            linkedCategory: "necessary",
            cookieTable: table("en", necessaryRows.en),
          },
          {
            title: "Statistics",
            description: "Helps us understand which pages and kitchens interest visitors, so we can improve the website.",
            linkedCategory: "analytics",
            cookieTable: table("en", analyticsRows.en),
          },
          {
            title: "Marketing",
            description:
              "Lets ad platforms see whether an ad led to an enquiry and show our ads to people who already know us. Your e-mail address and phone number are only passed on scrambled (hashed) after you send an enquiry.",
            linkedCategory: "marketing",
            cookieTable: table("en", marketingRows.en),
          },
          {
            title: "Questions?",
            description: `Write to <a href="mailto:info@beer.de">info@beer.de</a>.`,
          },
        ],
      },
    };
  }

  return {
    consentModal: {
      label: "Cookie-Einwilligung",
      title: "Cookies auf beer.de",
      description:
        "Wir möchten messen, wie unsere Website genutzt wird und welche Anzeigen zu Anfragen führen. Dafür setzen wir und unsere Partner (Google, Meta, Pinterest, Microsoft, LinkedIn) Cookies und ähnliche Techniken ein, aber nur, wenn Sie zustimmen. Einige Partner verarbeiten Daten auch in den USA. Sie können Ihre Auswahl jederzeit unter „Cookie-Einstellungen“ unten auf jeder Seite ändern.",
      acceptAllBtn: "Alle akzeptieren",
      acceptNecessaryBtn: "Alle ablehnen",
      showPreferencesBtn: "Einstellungen",
      revisionMessage: "<br><br>Seit Ihrem letzten Besuch hat sich unsere Liste der Dienste geändert, deshalb fragen wir erneut.",
      footer: legal("Datenschutz", "Impressum"),
    },
    preferencesModal: {
      title: "Cookie-Einstellungen",
      acceptAllBtn: "Alle akzeptieren",
      acceptNecessaryBtn: "Alle ablehnen",
      savePreferencesBtn: "Auswahl speichern",
      closeIconLabel: "Schließen",
      serviceCounterLabel: "Dienst|Dienste",
      sections: [
        {
          title: "Ihre Auswahl",
          description: `Wählen Sie, was wir verwenden dürfen. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen. Einzelheiten finden Sie in der <a href="${links.privacy}">Datenschutzerklärung</a>.`,
        },
        {
          title: "Notwendig",
          description: "Für den Betrieb der Website und um Ihre Auswahl zu speichern. Immer aktiv.",
          linkedCategory: "necessary",
          cookieTable: table("de", necessaryRows.de),
        },
        {
          title: "Statistik",
          description: "Hilft uns zu verstehen, welche Seiten und Küchen interessieren, damit wir die Website verbessern können.",
          linkedCategory: "analytics",
          cookieTable: table("de", analyticsRows.de),
        },
        {
          title: "Marketing",
          description:
            "Damit Werbeplattformen sehen, ob eine Anzeige zu einer Anfrage geführt hat, und unsere Anzeigen Menschen zeigen, die uns schon kennen. Ihre E-Mail-Adresse und Telefonnummer werden erst nach dem Absenden einer Anfrage und nur verschlüsselt (gehasht) weitergegeben.",
          linkedCategory: "marketing",
          cookieTable: table("de", marketingRows.de),
        },
        {
          title: "Fragen?",
          description: `Schreiben Sie an <a href="mailto:info@beer.de">info@beer.de</a>.`,
        },
      ],
    },
  };
}
