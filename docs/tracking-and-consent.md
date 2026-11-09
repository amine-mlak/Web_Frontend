# Cookies, consent and tracking

For staging.beer.de → beer.de, about €3,000/month of ads. Not legal advice: the
banner texts (`lib/consent-copy.ts`) and the Datenschutzerklärung need a legal check.
Account setup and the GTM container: `docs/gtm-setup.md`.

## Decision (2026-11-08, replaces the 26 Oct choice of a paid consent tool + Stape)

Package C from `docs/tracking-options.html`, browser first:

| Layer | What | Status |
|---|---|---|
| Banner | Open source, in our code: vanilla-cookieconsent 3.1.0 (MIT). Categories Notwendig / Statistik / Marketing, "Alle ablehnen" next to "Alle akzeptieren" with the same weight, DE/EN | built |
| Proof of consent | No server log. The choice stays in the visitor's `beer_consent` cookie (random ID, time, categories, banner revision); the banner set-up is versioned in git (`CONSENT_REVISION`, `lib/consent-copy.ts`). If the legal check asks for a per-visitor log, self-host a consent tool on Coolify instead of building one | decided 2026-11-09 |
| Consent Mode v2 | **basic**: defaults all denied; GTM itself loads only after a "yes" to Statistik or Marketing (VG Hannover 2025: GTM needs consent under § 25 TDDDG) | built |
| Tag manager | Google Tag Manager, web container as import file (`gtm/web-container.json`) | built; accounts exist on today's beer.de, connected ~1 month before launch |
| Platforms | GA4, Google Ads (+ enhanced conversions), Meta, Pinterest, Microsoft Ads, TikTok, LinkedIn. A platform stays paused until its ID is set | prepared |
| Umami | Cookieless counting stays without consent; the session recorder only with Statistik | built |
| Server-side | Phase 2: own server GTM on Coolify at `sgtm.beer.de`; no site change needed (`event_id` is already on every lead) | later |

Why browser first: server tracking recovers roughly 10–30% of conversions lost to
Safari and ad blockers, but it does not help with people who say no, and a
self-hosted server that goes down silently drops conversions. The banner, clean
events and enhanced conversions come first; later, signed orders from the CRM as
offline conversions have the biggest effect on bidding.

Why basic, not advanced: Google's conversion modelling for rejected visitors needs
about 700 ad clicks a week; €3,000/month is well below that. Switching later is a
GTM setting, no code change.

## How it works on the site

- `components/TagManager.tsx`: consent defaults (inline, first in `<body>`); loads
  `gtm.js` via `components/TagManagerClient.tsx` after a "yes". Nothing renders
  without `NEXT_PUBLIC_GTM_ID`. Client-side navigation pushes `page_view_spa`.
- `components/ConsentBanner.tsx`: the banner; `gtag('consent','update', …)` on every
  answer; withdrawing a category deletes its cookies and reloads the page. Raise
  `CONSENT_REVISION` when services change, so everyone is asked again.
- `lib/consent-state.ts`: the current answer for the rest of the code
  (`hasConsent`, `subscribeConsent`).
- `lib/analytics.ts`: `track(event, params)` → Umami + dataLayer.
- `components/LinkTracking.tsx`: phone/e-mail/route/social link clicks → dataLayer.
- `lib/conversion.ts`: click IDs and UTMs stay in memory; saved to sessionStorage and
  sent with a lead only with Marketing consent. UTMs (not personal) always go with
  the lead. `/api/lead` passes `consent: {analytics, marketing}` on to n8n.
- Footer "Cookie-Einstellungen" (from the CMS or the fallback, matched by the word
  "cookie") is a button that opens the settings.

## Events (site → dataLayer)

| Moment | Event | GA4 | Google Ads | Meta | Pinterest | Microsoft | TikTok | LinkedIn |
|---|---|---|---|---|---|---|---|---|
| Planner funnel | `form_view/start/step/attempt/error/submit` | funnel | – | – | – | – | – | – |
| Planner sent (the lead) | `generate_lead` + `event_id`, `value`, `user_data` (hashes only, Marketing only) | `generate_lead` | primary conversion + enhanced conversions | `Lead` | `lead` | `submit_lead_form` | `SubmitForm` | conversion |
| Phone / e-mail click | `contact` (`method`, `placement`) | `contact` | secondary (phone) | `Contact` | – | `contact` | `Contact` | – |
| Route | `get_directions` | `get_directions` | secondary | `FindLocation` | – | – | – | – |
| Social link | `social_click` (`network`) | `social_click` | – | – | – | – | – | – |
| Navigation | `page_view_spa` | (enhanced measurement) | remarketing | `PageView` | `page` | (auto) | `page` | (auto) |
| Later: appointment, signed order | n8n → sGTM webhook (phase 2) | | offline conversion | `Schedule` / `Purchase` | | | | |

`user_data` = `sha256_email_address`, `sha256_phone_number` (E.164, +49 default),
`address.postal_code`, `address.country` (`lib/hash.ts`). The raw e-mail and phone
never enter the dataLayer.

## Env

| Variable | Where | Example |
|---|---|---|
| `NEXT_PUBLIC_GTM_ID` | staging + production | `GTM-ABC1234` |
| `NEXT_PUBLIC_GTM_AUTH`, `NEXT_PUBLIC_GTM_PREVIEW` | staging only (GTM environment) | from GTM → Environments |
| `NEXT_PUBLIC_GTM_SERVER_URL` | phase 2 | `https://sgtm.beer.de` |
| `NEXT_PUBLIC_LEAD_VALUE` | optional | `150` (EUR per lead, for value bidding) |

`NEXT_PUBLIC_` values are read at build time: change them, then redeploy.

## Still open

- Datenschutzerklärung text for all services, legal check, then into the CMS.
- Connect the existing accounts of today's beer.de about a month before launch (see `docs/gtm-setup.md`), GTM import tested in Tag Assistant.
- Phase 2: server GTM on Coolify; n8n Meta CAPI dry-run node removed; offline
  conversions from signed orders.
