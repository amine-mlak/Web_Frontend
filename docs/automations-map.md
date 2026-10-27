# Automations for the BEER website (n8n + Strapi + Claude)

Status 2026-10-27. All nine workflows are built, tested against the live CMS (Claude answers
simulated) and installed in n8n, **switched off** until the logins below are filled in.
Source: `n8n/` (one file per Code node, `lib-*.js` shared, `pack-workflows.mjs` builds and
deploys; `node n8n/pack-workflows.mjs --deploy`).

Start page for the team: **https://n8n.beer.de/webhook/redaktion**

## Rules every automation follows

1. **Drafts only, a person publishes.** Every write sends `status=draft` (without it, Strapi's
   REST API publishes at once) and then checks that no published version appeared. The one
   exception is photo descriptions: media has no drafts in Strapi, so they apply on "Übernehmen".
2. **Few, good pages from BEER's own facts.** Google's spam policy on scaled content targets
   many low-value pages, whoever writes them. Drafts come from real material only: projects and
   photos, the 64 FAQ answers, events. Nothing invents prices, numbers, quotes or towns; gaps are
   marked `[prüfen: …]` for the editor.
3. **Answer-first structure (GEO).** First paragraph answers the question; one heading per
   sub-question; "Auf einen Blick" points; FAQ at the end; links only to existing BEER pages.
4. **German first.** English only once the linked topics, materials and regions exist in English
   (Strapi copies shared fields between languages). The English part of "Projekttexte" is built
   and switched off (`ENGLISH = false`).
5. **One review page per workflow**, all with the same navigation; failures of any workflow
   appear on the start page.

## The workflows

| Workflow | Address | What it does | Writes |
|---|---|---|---|
| **BEER Redaktion** | `/webhook/redaktion` | Start page; collects the errors of all others | – |
| **BEER SEO-Prüfung** | `/webhook/seo-pruefung` | Report on every German entry: titles, descriptions, duplicates, addresses, images, photo descriptions, town, year, region, topic | – |
| **BEER SEO-Vorschläge** | `/webhook/seo-vorschlaege` | New meta titles and descriptions for what the check flags, as a Google-style preview, old next to new | SEO block of the draft |
| **BEER Projekttexte** | `/webhook/beer-texte` | Photo descriptions from Claude (looks at each photo), reviewed, then applied | photo alt texts |
| **BEER Ratgeber** | `/webhook/beer-ratgeber` | Topic ideas from web research into what buyers ask; one click writes the article from the FAQ answers and matching projects | article draft |
| **BEER Meldungen** | chat (link on the start page) | A few lines about an event, award or new kitchen → article draft in "Presse" with project photos, plus Business Profile and social media texts; asks back when date, time or place is missing; warns about similar drafts | article draft |
| **BEER Neue Seite** | chat (link on the start page) | A short brief → draft of a fixed page, topic, material, appliance, brand, furniture or region page in the house style (example: "Weiße Küchen"), with overlap check | page draft |
| **BEER GEO-Monitor** | `/webhook/geo-monitor` | 12 editable buyer questions answered by Claude with web search as seen from Freising: is BEER named, who instead, which sites are cited, trend, recommendations | – |
| **BEER Regionen** | `/webhook/beer-regionen` | Town and region per project (form), region texts from the projects there, Business Profile posts for new projects | project and region drafts |
| **BEER Bewerbungen** | `/webhook/beer-bewerbung` (POST, from the website only) | Receives the Karriere application form (job, name, email, phone, start, message, up to 3 documents: PDF, Word, JPG, PNG, 5 MB each, 10 MB together) and answers the website. Where an application goes next is **not decided yet**; until then it is only under Executions | – |

Schedules (built, **off**): Projekttexte every 2 hours, SEO-Vorschläge and Ratgeber monthly,
GEO-Monitor weekly (Monday 6:00). Switch on in n8n once the first results look right.

## Switching them on

1. **n8n → Credentials**
   - *BEER Strapi (Token)*: in Strapi, Settings → API Tokens → new **custom** token. It needs:
     find/findOne on projects, articles, categories, faq-items, kitchen-topics, regions,
     materials, appliances, brands, furniture-items, site-pages; create on articles,
     site-pages, kitchen-topics, materials, appliances, brands, furniture-items, regions; update
     on projects, regions, kitchen-topics, materials, appliances, brands, furniture-items,
     site-pages; upload (for photo descriptions). Value: `Bearer <token>`.
   - *Claude API (BEER)*: an Anthropic API key (console.anthropic.com).
   - *BEER Redaktion (Login)*: username and password for all pages and chats.
   - *BEER Website (Formular-Schlüssel)*: header `x-n8n-webhook-secret`, value = the website's
     `N8N_WEBHOOK_SECRET` (Coolify → staging app → Environment). Until it is filled in and
     "BEER Bewerbungen" is active, the Karriere form shows the email and phone instead.
2. **Activate** the ten workflows (BEER Redaktion first).
3. Switch off the old, broken **"BEER CMS news chat (draft only)"**; "BEER Meldungen" replaces it.

## Model and cost

Claude Opus 5.5 (`claude-opus-5-5`) with refusal fallback; effort low for photo descriptions,
medium for snippets and news, high for articles, topic research and recommendations. Rough
cost: all 1,353 photo descriptions about $10; one Ratgeber article well under $1; one
GEO-Monitor run (12 searches) a few dollars. Claude Haiku 5.5 (`claude-haiku-5-5`) would be far
cheaper for the photo descriptions if quality holds — one constant in `lib-claude.js`.

## Open decisions for the team

- Create the category **"Presse"** in Strapi (categories have no drafts: saving publishes it).
- Article descriptions are limited to **80 characters** in the CMS; Google shows up to about 160.
  Schema v2 gives articles a proper SEO field.
- Upgrade Strapi to 5.49+ for the built-in **MCP server**: live CMS structure for the agents and
  a token without publish rights, so Strapi itself enforces drafts-only (together with the
  parked "CMS in git" step).
- Google Business Profile: posting by API needs Google's approval; until then the Regionen
  page prepares the text and a person posts it.
- Applications (BEER Bewerbungen): where they go — a mail to Christian Beer, an HR tool, a
  list — and how long they are kept (n8n keeps executions, documents included, until they are
  pruned).
- Later (needs data or decisions): review requests after handover (customer emails), Search
  Console data for the Ratgeber topics, CMS backups on a schedule, weekly broken-link scan.

## Sources (research, 2026)

- Generative engine optimization, local businesses: [beancount.io](https://beancount.io/blog/2026/07/16/generative-engine-optimization-geo-small-business-guide), [seotuners.com](https://seotuners.com/blog/generative-engine-optimization/generative-engine-optimization-best-practices/), [stubgroup.com](https://stubgroup.com/blog/geo-in-2026-how-to-get-your-business-cited-by-ai-search-engines/) — vendor content; the consistent points are answer-first structure, verifiable facts, current listings and reviews.
- Scaled content abuse: [ppc.land](https://ppc.land/scaled-content-abuse/), [frase.io](https://www.frase.io/blog/does-google-penalize-ai-content-no-but-it-punishes-this) — the policy targets volume without value, not AI itself.
- Local ranking factors: [storerocket.io](https://storerocket.io/learn/local-seo-ranking-factors), [bkacontent.com](https://bkacontent.com/local-seo-in-2026-the-3-signals-that-actually-drive-results/) — Business Profile category and completeness, recent reviews and replies, consistent name/address/phone.
- Strapi MCP server: [docs.strapi.io](https://docs.strapi.io/cms/features/strapi-mcp-server), [strapi.io blog](https://strapi.io/blog/ai-blog-publishing-strapi-claude-desktop).
