# Open items

Status 2026-10-28. What is still open across the website (staging.beer.de), the CMS (cms.beer.de)
and n8n (n8n.beer.de). Tick items off here when they are done.

## 1. Waiting on Amine: logins and accounts

Claude does not copy keys or passwords between systems, so these need a person.

- [ ] **n8n credential "BEER Website (Formular-Schlüssel)"**: enter the value of `N8N_WEBHOOK_SECRET`
      from the staging app in Coolify (Environment Variables). Until then n8n refuses newsletter
      sign-ups and Karriere applications from the website (403).
- [ ] **n8n credential "BEER Newsletter (SMTP)"**: login of the mailbox the newsletter is sent from,
      and confirm the sender address (set to newsletter@beer.de in `n8n/lib-newsletter.js`).
- [ ] **n8n credentials "BEER Strapi (Token)" and "Claude API (BEER)"**: the nine editorial
      workflows (SEO, Ratgeber, Projekttexte, GEO, Regionen, Meldungen, Neue Seite) stay off until
      these are filled in. The Strapi token is also needed to test the drafts-only guard.
- [ ] **Where leads and applications go**: planner leads ("Lead demo (dry-run)") and applications
      ("BEER Bewerbungen") are only kept under n8n Executions. Decide on a recipient (mail to whom,
      CRM?) and add the mail login.
- [ ] **Tracking accounts**: Christian creates GTM (web + server), Stape and the consent tool
      (Usercentrics or Cookiebot). See `docs/tracking-and-consent.md`.
- [ ] **Change the staging password**: it showed up once in a session log.

## 2. Decisions

- [ ] **Datenschutz**: add a newsletter section (double opt-in, what is stored, how to unsubscribe).
      A legal text, best checked by whoever advises BEER.
- [x] **Shop**: all 66 Shopify products, 7 collections and 43 pages redirect to the new site (2026-10-28).
      Outdoor kitchens are built as drafts (see 4.). Still missing as pages (they redirect to the closest
      topic for now): a **bathroom** page, the **referral programme**
      (Empfehlen and the 19 personal voucher pages), and four kitchens without a project:
      Schwebeblock Küche, Mediterrane Landhausküche, Skandinavische Frische, Dunkelblauer Luxus.
- [ ] **Canonical domain and contact email** (`www.beer.de`? `info@beer.de`?), so they can be set
      in the CMS site settings.

## 3. Ready for Claude, needs a yes

- [ ] **Nightly backup of the CMS database** as a Coolify scheduled task (a one-off dump exists from
      the switch on 2026-10-27).
- [ ] **Instant updates after publishing**: let `/api/revalidate` through the staging password, so
      CMS changes show at once instead of within about 2 minutes.
- [ ] **Switch on "BEER Bewerbungen"** once the website key is in n8n.
- [ ] **Fix `/documentation` on cms.beer.de** (the API description file is missing).
- [ ] **Tidy the CMS server**: remove the `LEGACY_PG_*` variables from the new CMS app; delete the
      old, stopped CMS service after 3 November.
- [ ] **Free space on C:** (about 1.6 GB left); builds and caches can fail when it fills up.

## 4. Content to check and publish (in the CMS)

- [ ] **Innenleben**: the draft with 9 photo sections. Check it with the CMS preview, then publish.
- [ ] **Küchenplaner page**: draft in German and English.
- [ ] **Outdoorküchen**: three drafts, published in this order: the kitchen topic "Outdoorküchen"
      (`/kuechen/besondere/outdoor`), then the projects "Terrassenküche mit Eiche und Edelstahl" and
      "Outdoorküche mit Naturstein". The old shop addresses (Terrassen Küche, Eventküche, Miele Dreams,
      collection Outdoor) redirect there once the site change is deployed.
- [ ] **86 blog articles** from beer.de are drafts: publish before launch, set the original dates
      (in `D:/Beer/.cache/blog/import-map.json`), review the 32 kept Shopify SEO titles.
- [ ] **Project pages as stories** (design idea): each project told like an exposé, as on the
      colour pages.

## 5. Before beer.de points at the new site

- [ ] All drafts that belong on the site are published (blog, planner page, Innenleben).
- [x] Redirects for the Shopify shop and pages (356) on top of the 222 blog redirects.
- [ ] Consent banner and tracking built (the footer link "Cookie-Einstellungen" opens it).
- [ ] Links in newsletter mails point to `www.beer.de/impressum` and `/datenschutz`: check that they
      work after the switch.
- [ ] Structured data and sitemap checked (Rich Results test, `xhtml:link` alternates).

## Done recently

- 2026-10-28 Newsletter: sign-up in the footer and the planner, double opt-in, team page to send
  (`n8n.beer.de/webhook/beer-newsletter`), workflow on, website live on staging.
- 2026-10-27 Innenleben page layout (photo sections from the CMS), CMS fields for photos and links.
- 2026-10-27 CMS moved to the git-built Strapi (schema v2); header announcement and planner managed
  in the CMS.
