# Cookies, consent and tracking (GA4, Google Ads, Meta)

Plan for staging.beer.de → beer.de, for about €3,000/month of ads (€36k/year).
Goal: the most measurable conversions for Google and Meta to optimise on, with the
least custom code to maintain. Nothing here is live yet. Not legal advice: banner
texts and the Datenschutzerklärung need a legal check.

## Decision

**Consent tool (CMP) + Google Tag Manager in the browser + server-side GTM on Stape
(EU) at our own subdomain. The site only pushes clean events to the `dataLayer`.**

| Layer | What | Who maintains it |
|---|---|---|
| Consent | Usercentrics or Cookiebot (Google-certified, Consent Mode v2 built in, cookie scanner, consent log, texts kept legally current) | The vendor; we only style it |
| Browser | Web GTM container: GA4 tag, Meta Pixel, Conversion Linker, all behind consent | Marketing / agency in the GTM web UI |
| Server | Server GTM container on Stape, at `sgtm.beer.de`: GA4, Google Ads conversions + enhanced conversions, Meta Conversions API | Stape hosts and updates; tag templates maintained by Google/Stape |
| Site code | `dataLayer.push()` for each event (with `event_id`), consent defaults, CMP + GTM snippet | Us; changes only when a new kind of event is needed |
| n8n | Lead to e-mail/CRM; later the signed order → sGTM webhook (offline conversion) | Us; one HTTP call, no ad-platform APIs |
| Umami | Cookieless internal stats, stays as is (session recorder only with consent, or off) | Us |

### Why this is the best fit for €3k/month with low maintenance

- **Server-side events recover what the browser loses.** Safari limits cookies to 7
  days or less, and ad blockers stop the Pixel and gtag. The server container sends
  conversions to Google and Meta from `sgtm.beer.de` (first-party), so more of the
  leads Christian pays for get credited, and the bidding learns from them. How much
  more varies by audience; it is mostly the Safari/iPhone share.
- **No custom ad-platform code.** Google Ads and Meta change their APIs regularly
  (Google Ads API versions are retired about yearly). With sGTM those integrations
  are vendor templates, not our code in n8n. That is why the n8n Meta CAPI node
  (dry-run) is replaced, not finished.
- **The agency (or whoever runs the ads) works in GTM**, without a developer and
  without a deploy. The site only changes when a new event is needed.
- **A paid CMP is worth it at this spend.** It costs a small monthly fee (check
  current plans; a site this size is on a lower tier) and removes the risk that a
  tag added in GTM is not covered by the banner: the scanner finds it. Its Consent
  Mode v2 integration is what Google Ads needs in the EEA. Rejecting must be as easy
  as accepting ("Alle ablehnen" on the first layer).
- **Costs stay small against the ad budget:** Stape (a paid plan, about the price of
  a few clicks) + CMP fee, together a small single-digit share of €3,000/month.

### What it does not change

Consent still decides. Without "Marketing" consent nothing goes to Google Ads or
Meta, server-side included. Consent Mode **basic** (nothing loads before consent) is
the safe start in Germany; **advanced** (cookieless pings, Google models the gaps)
gives Google better bidding data but needs the lawyer's yes.

## Events (site → dataLayer)

Every event carries `event_id`; the same id goes to the Pixel and to the server so
Meta and Google count it once.

| Moment | dataLayer event | GA4 | Google Ads | Meta |
|---|---|---|---|---|
| Planner opened / step / error | `form_start`, `form_step`, `form_error` | funnel | – | – |
| Planner sent (the lead) | `generate_lead` + `user_data` (e-mail, phone; hashed in sGTM) | `generate_lead` | primary conversion + enhanced conversions | `Lead` (Pixel + CAPI) |
| Phone / e-mail click | `contact` (`method`) | `contact` | secondary conversion | `Contact` |
| "Route planen" | `get_directions` | `get_directions` | secondary | `FindLocation` |
| Appointment booked (Bookings via n8n, later) | n8n → sGTM webhook `book_appointment` | via sGTM | conversion | `Schedule` |
| Signed order (later, from CRM/n8n) | n8n → sGTM webhook `purchase` (value) | – | offline conversion "Auftrag" | `Purchase` |

The last row is the biggest lever for the budget: the platforms then optimise for
people who buy a kitchen, not for whoever fills in a form.

Umami keeps its own events (`form_*`, `tel_click`, `cta_*`) for the internal
dashboard; `lib/analytics.ts` sends each event to both.

## To build

Site (us):
1. `lib/analytics.ts`: `track(event, params)` → Umami + `dataLayer`; replace the
   direct Umami calls. Lead submit pushes `generate_lead` with `event_id` and
   `user_data` only after marketing consent.
2. Consent defaults (all denied) + CMP script + GTM snippet in the root layout,
   loaded from `sgtm.beer.de` (first-party loader). IDs from env.
3. `captureClickIds()` only after marketing consent (§ 25 TDDDG); the lead record
   keeps click IDs/UTMs for attribution in the CRM.
4. `/api/lead` passes the consent state to n8n; footer link "Cookie-Einstellungen".
5. Umami recorder only with statistics consent, or off.

GTM (us, once; then marketing): web and server containers as importable JSON
(GA4, Google Ads conversion + enhanced conversions + remarketing, Meta Pixel + CAPI
with dedup, Conversion Linker, consent checks).

n8n (later): signed order / booked appointment → sGTM webhook.

Datenschutz: list CMP, GTM, Stape (processor, EU), GA4, Google Ads, Meta, Umami;
purposes, legal basis, storage times, US transfer basis (EU-US Data Privacy
Framework).

## Needed from BEER (accounts only the owner can create)

- Google Tag Manager account with a web and a server container.
- Stape account (EU region), DNS record `sgtm.beer.de` → Stape.
- CMP account (Usercentrics or Cookiebot) for beer.de + staging.
- GA4 property, Google Ads conversion actions, Meta Pixel/dataset + CAPI token
  (the token goes into the server container, never into git).
- Data processing terms accepted in Google, Meta, Stape and the CMP.
- Access for whoever manages the ads (agency or in-house).
