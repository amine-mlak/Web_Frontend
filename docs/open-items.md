# Open items

Status 2026-11-03. What is still open across the website (staging.beer.de), the CMS (cms.beer.de)
and n8n (n8n.beer.de). Tick items off here when they are done.

The new site only runs on staging; www.beer.de is still the old site. Order of work: deploy what is
ready, protect data and privacy, launch requirements, content, go live.

## 1. Waiting on Amine or Christian: logins, accounts and decisions

Claude does not copy keys or passwords between systems, so these need a person.

- [ ] **n8n credential "BEER Website (Formular-Schlüssel)"**: enter the value of `N8N_WEBHOOK_SECRET`
      from the staging app in Coolify (Environment Variables). Until then n8n refuses newsletter
      sign-ups and Karriere applications from the website (403).
- [ ] **n8n credential "BEER Newsletter (SMTP)"**: login of the mailbox the newsletter is sent from,
      and confirm the sender address (set to newsletter@beer.de in `n8n/lib-newsletter.js`).
- [ ] **n8n credential "BEER Strapi (Token)"**: it works but is read-only, so saving drafts and photo
      descriptions gets 403. Enter a token with the rights listed in `docs/automations-map.md`.
- [ ] **n8n credential "Claude API (BEER)"**: holds a personal Kimi key for testing. Replace that key,
      since it was pasted in a chat, and enter BEER's Claude key before launch.
- [ ] **Where leads and applications go**: planner leads ("Lead demo (dry-run)") and applications
      ("BEER Bewerbungen", switched off) reach nobody. Decide on a recipient (mail to whom, CRM?) and
      add the mail login.
- [ ] **Tracking accounts** (decided 2026-11-08: own banner + GTM, browser first): GA4, Google Ads,
      Meta and the other platforms already run on today's beer.de; connect them here about a month
      before launch (reuse, don't recreate). New: a GTM web container. Steps: `docs/gtm-setup.md`.
- [ ] **Consent log token**: after the CMS deploy, create the API token "Website: Einwilligungen" in the
      CMS admin (custom, only Consent-log → create) and put it in Coolify as `STRAPI_CONSENT_TOKEN`.
- [ ] **Canonical domain and contact email** (`www.beer.de`? `info@beer.de`?), so they can be set
      in the CMS site settings.
- [ ] **Datenschutz**: add a newsletter section (double opt-in, what is stored, how to unsubscribe).
      A legal text, best checked by whoever advises BEER.
- [ ] **English**: launch in German only and translate afterwards? (Recommended.) Almost nothing is
      published in English, and each content type has to go live all at once.
- [ ] **Change the staging password**: it showed up once in a session log.
- [ ] **Real photos** for the Regensburg and Neue Azubis articles, which still show stand-ins.
- [ ] **Missing pages**: a bathroom page, the referral programme (Empfehlen and the 19 personal
      voucher pages), and four kitchens without a project: Schwebeblock Küche, Mediterrane
      Landhausküche, Skandinavische Frische, Dunkelblauer Luxus. They redirect to the closest topic
      for now.

## Security (first)

- [ ] **Strapi 5.33.4 is out of date**: `npm audit` reports 12 critical and 36 high issues; 5.60.0 is
      current. Test the update on a restored copy, then deploy.
- [x] **Public drafts and open CORS on the CMS**: closed on 2026-11-03. Drafts need an API token, and
      only BEER's own sites may read the API from a browser.
- [x] **Next.js 16.4.4, security headers, tighter form checks**: on staging since 2026-11-03.
- [ ] **Content Security Policy**: runs in report-only mode. Check it on staging, then enforce it.
- [ ] **Personal data in n8n**: delete leads and applications after delivery, and stop storing
      successful runs for those workflows.
- [ ] **Logins**: least-rights tokens, new keys, and limit access to the CMS, n8n and Coolify admin areas.

## 2. Ready for Claude, needs a yes

- [ ] **Publish the two jobs in the CMS ("Stellen")**: both are drafts, for Amine to publish. Then remove
      the fallback in `fetchOpenJobs` and empty the old list on the Karriere page.
- [ ] **Delete the 4 leftover open-day article drafts**; one published article covers it.
- [ ] **Nightly backup of the CMS database** as a Coolify scheduled task, with one tested restore. No
      backup task is active. The last dump is from 2026-11-03, on the server and in
      `D:\Beer\backups\cms-20261103`, without media files.
- [ ] **Delete the old, stopped CMS service** only after that restore works. Remove the `LEGACY_PG_*`
      variables from the new CMS app then too.
- [ ] **Customer names in image addresses**: about 92 images on 6 project pages. Show the list of old
      and new addresses first.
- [ ] **Instant updates after publishing**: let `/api/revalidate` through the staging password, so
      CMS changes show at once instead of within about 2 minutes.
- [ ] **Switch on "BEER Bewerbungen"** once the website key is in n8n.
- [ ] **Fix `/documentation` on cms.beer.de** (404: the API description file is missing).
- [ ] **Free space on C:** (about 2 GB left); builds and caches can fail when it fills up.
- [ ] **Phones at 320 px**: the header pushes the menu button off screen.

## 3. Content

Everything goes in as drafts, and a person publishes.

- [ ] **Three nearly empty guides** (about 27 words each): Was kostet eine Küche?, So entsteht Ihre
      Küche, Kochfeldabzug oder Esse?
- [ ] **Appliance and category pages**: real text, and remove the template sentence about daylight and
      samples, which doesn't fit them.
- [ ] **11 region pages** are near-duplicates: keep areas with real projects and local details BEER
      confirms, redirect the rest.
- [ ] **Über BEER**: expand with Christian's story. Check "den kostspieligsten im Land" and "Badendorf"
      on the contact page against Wolfersdorf elsewhere.
- [ ] **Project pages as stories**: about 190 words on average today. Each project told like an exposé,
      as on the colour pages.
- [ ] **Photo descriptions**: nearly all 1,462 project photos have poor alt text, some with customer
      names. "BEER Projekttexte" proposes new ones and a person reviews them. Needs the Strapi token.
- [ ] **Duplicate short addresses**: `/formen`, `/stile`, `/farben`, `/inseln` and `/innenleben` share
      text with their twins. Nine more still need checking.
- [ ] **Outdoor projects**: "Terrassenküche mit Eiche und Edelstahl" and "Outdoorküche mit Naturstein"
      are not in the CMS under those names or under matching addresses. Check whether they still exist.
- [ ] **32 kept Shopify SEO titles** on the imported articles: review them.
- [x] Innenleben, the Küchenplaner page and the 86 blog articles: published, with original dates.

Never publish the 6 sample project drafts (invented places and years).

## 4. Before beer.de points at the new site

- [ ] Production app in Coolify from `main`, tested on a temporary address. Today only staging exists.
- [x] Consent banner and tracking built on `cms-central` (2026-11-08): own banner, GTM only after a yes,
      click IDs and the Umami recorder only with consent, footer link opens the settings. See
      `docs/tracking-and-consent.md`.
- [ ] Tracking still open: consent log live (CMS deploy + token), the Datenschutz text for all tracking services
      (legal check, then CMS), GTM IDs in Coolify, GTM container imported and tested in Tag Assistant.
- [ ] Spam protection on the forms, and keys rotated.
- [ ] Links in newsletter mails point to `www.beer.de/impressum` and `/datenschutz`: check that they
      work after the switch.
- [ ] Structured data and sitemap checked (Rich Results test, `xhtml:link` alternates).
- [x] Redirects for the Shopify shop and pages (356) on top of the 222 blog redirects.

## Done recently

- 2026-11-03 Project pages tell the story beside the photos, with picture cards for each theme, brand and
  material. The CMS project form explains Titelbild and Galerie. 20 kitchen topics got photos that show the
  topic (old photos listed in `D:\Beer\backups\topic-photos-before-20261103`).

- 2026-11-03 Security deploys on staging and the CMS, jobs collection live with two drafts, breadcrumbs
  hidden, German open-day announcement ends by itself at midnight after 8 November.
- 2026-11-02 Header menu images from the CMS, wider homepage hero, planner speed fixes (on staging).
- 2026-10-30 All 86 published articles have their own cover.
- 2026-10-28 All 66 Shopify products, 7 collections and 43 pages redirect to the new site.
- 2026-10-28 Newsletter: sign-up in the footer and the planner, double opt-in, team page to send
  (`n8n.beer.de/webhook/beer-newsletter`), workflow on, website live on staging.
- 2026-10-27 Innenleben page layout (photo sections from the CMS), CMS fields for photos and links.
- 2026-10-27 CMS moved to the git-built Strapi (schema v2); header announcement and planner managed
  in the CMS.
