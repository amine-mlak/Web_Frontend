# Google Tag Manager: setup for beer.de

How to get from "no accounts" to live tracking. The site part is built
(see `docs/tracking-and-consent.md`); everything below happens in the vendors' web
interfaces, plus one env change in Coolify.

**Not tested against a real GTM account yet.** The import file was checked by its
own script (ids, triggers, variable names), not by GTM. Check the import result
in GTM's preview before publishing.

## 1. Accounts (Christian, as owner)

| Platform | Create | What we need from it |
|---|---|---|
| Google Tag Manager | tagmanager.google.com → account "BEER Küchen", container "beer.de", type **Web** | Container ID `GTM-…` |
| Google Analytics 4 | analytics.google.com → property "beer.de", web data stream `https://www.beer.de` | Measurement ID `G-…` |
| Google Ads | ads.google.com → Goals → Conversions → **3 conversion actions** (website, "set up manually with Google Tag Manager"): "Küchenplaner-Anfrage" (primary, count: one), "Anruf-Klick" (secondary), "Route geplant" (secondary). Turn on **Enhanced conversions for leads** (method: Google Tag Manager). | Conversion ID (`AW-` digits) + the 3 labels |
| Meta | business.facebook.com → Events Manager → connect a **web data source (Pixel)** for beer.de; verify the domain beer.de | Pixel ID |
| Pinterest | ads.pinterest.com → Conversions → Tag | Tag ID |
| Microsoft Advertising | ads.microsoft.com → Tools → UET tag | UET Tag ID |
| TikTok | ads.tiktok.com → Events Manager → Web → Pixel (manual setup) | Pixel ID |
| LinkedIn | Campaign Manager → Analyze → Insight tag; Conversions → "Küchenplaner-Anfrage" (method: event-specific) | Partner ID + Conversion ID |

Only create the ad platforms Christian will actually spend money on. A platform
without an ID simply stays paused.

In every tool: accept the data processing terms (Google: Data Processing Terms in
Ads and Analytics; Meta: Business Tools Terms), and set Google Analytics data
retention to 14 months. Link GA4 with Google Ads (GA4 Admin → Product links →
Google Ads) and import nothing twice: the Ads conversions come from GTM, not from GA4.

## 2. Fill and import the container

1. In `scripts/gtm/build-container.mjs`, put the IDs into `PLATFORMS` (no IDs in
   git, they are public anyway, but keep REPLACE for platforms not used).
2. `node scripts/gtm/build-container.mjs` → writes `gtm/web-container.json`. Tags of a
   platform whose ID still starts with REPLACE are paused.
3. GTM → Admin → **Import Container** → the file, workspace "Default", option
   **Overwrite** (first import) or **Merge → Rename conflicting** (later updates).
4. Alternatively import with placeholders and edit the constant variables in GTM
   (Variables → "Meta Pixel ID" …), then un-pause the platform's tags.

What is in it: Google tag (GA4) + GA4 events (lead, contact, directions, social, form
funnel); Google Ads lead conversion with enhanced conversions, phone and directions
conversions, remarketing, Conversion Linker; Meta, Pinterest, Microsoft UET, TikTok
and LinkedIn as Custom HTML tags (base + page view on navigation + lead, contact).
Every tag requires its consent type (`analytics_storage` for GA4, `ad_storage` for
the rest), on top of the site loading GTM only after a "yes".

Check after import: the variable **"User-Provided Data"** (enhanced conversions).
It should read the pre-hashed `user_data` from the dataLayer ("Code" mode). If GTM
shows it as broken, recreate it: New variable → User-Provided Data → Code →
`{{DLV - user_data}}`.

## 3. Staging first

1. GTM → Admin → **Environments** → New "Staging" → copy the snippet's `gtm_auth`
   and `gtm_preview` values.
2. Coolify, staging app, env (build time, they are `NEXT_PUBLIC_`):
   `NEXT_PUBLIC_GTM_ID=GTM-…`, `NEXT_PUBLIC_GTM_AUTH=…`, `NEXT_PUBLIC_GTM_PREVIEW=env-…`,
   optional `NEXT_PUBLIC_LEAD_VALUE=` (EUR per lead for bidding; empty = none). Redeploy.
3. GTM → Publish to the Staging environment → **Preview** (Tag Assistant) on
   staging.beer.de: accept the banner, send a planner test, check that each tag
   fires once, and that nothing fires after "Alle ablehnen".
4. Meta Events Manager → Test events; Google Ads → conversion "Recording" status
   (can take a day); Pinterest/TikTok/Microsoft helpers (browser extensions).

## 4. Live

Production app env: `NEXT_PUBLIC_GTM_ID` only (no AUTH/PREVIEW). Publish the GTM
version to "Live". Then in Google Ads, use "Küchenplaner-Anfrage" as the bidding
goal; the two secondary conversions are for reporting only.

## Phase 2 (later): server-side GTM on Coolify

Server container in GTM → run Google's image (`gcr.io/cloud-tagging-10302018/gtm-cloud-image`)
twice on Coolify (tagging server + preview server), DNS `sgtm.beer.de`, then
`NEXT_PUBLIC_GTM_SERVER_URL=https://sgtm.beer.de` and the GA4 tag's `server_container_url`.
Meta Conversions API and Google Ads go into the server container with the same
`event_id`, so nothing is counted twice. Needs health monitoring: when it is down, no
conversions arrive.
