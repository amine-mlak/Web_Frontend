# Online-Küchenplaner

Design source: `D:\downloads\OneDrive_2026-10-23\Küche planen` (readme, `Küchenplaner Design.pdf`, `BEER Küche planen.html`).

## Where things live

| What | Where |
| --- | --- |
| Flow: 7 steps, which question is in which step, single or multiple choice | `lib/kitchen-planner-model.ts` (code, because the lead mail and n8n rely on it) |
| Texts, options, subtitles, photos, icons (DE + EN) | CMS single type **Küchenplaner** (`api::kitchen-planner`, beer-cms `schema-v2`) |
| Built-in copy while the CMS has no entry | `lib/kitchen-planner.ts` → `plannerFallback()` |
| Image files | CMS media library, files named `planer-*` (uploaded 2026-10-25, with German alt text) |
| URLs of those files for the fallback | `lib/kitchen-planner-media.ts` (generated) |
| UI | `components/planner/KitchenPlanner.tsx`, loaded by `PlannerSection` |
| Lead check and lead mail text | `lib/planner-lead.ts`, used by `app/api/lead/route.ts` |

The planner appears on `/kueche-planen` (`#planer`), `/beratung`, the homepage and the house pages with a form.

## Rules from the design readme

- Photos are 4:3 with `object-fit: cover`. The site loads Strapi's 500–1000 px versions, never the original.
- Icons are 2× PNGs with deliberate whitespace. Show them whole at the size in their name (98, 118, 124, 144 px; "über 25 m²" is bigger on purpose). Never crop.
- A selected tile gets a black border. The icon itself stays unchanged.

## Editing in the CMS

- Each option's **value** (for example `l-form`) is its fixed id in leads and analytics. Don't translate it, and don't change it after launch.
- The server only accepts answers whose value exists in the Küchenplaner entry, so a new option works as soon as it's published.
- Lead mails always use the German labels.

## Moving the content into the CMS (after schema v2 is live)

In beer-cms, with the CMS stopped:

```bash
node scripts/import-kitchen-planner.js
```

This creates the Küchenplaner entry as a **draft** in DE and EN, with the images linked by their media library URL. It does nothing if an entry already exists. A person then checks the English draft and publishes both languages. The data comes from `scripts/data/kitchen-planner.json`, which is exported from `plannerFallback()`.

## Regenerating the media map

If the `planer-*` files are re-uploaded, rebuild `lib/kitchen-planner-media.ts` from `GET /api/upload/files?filters[name][$startsWith]=planer-` (with an API token). The file header explains the shape.
