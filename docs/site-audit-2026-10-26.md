# Site audit, 26 October 2026: from the header down

Crawled the production build (125 DE pages) and compared every photo with the CMS
media library (4,058 files in folders). Nothing was changed.

## 1. Navigation: buttons that open the wrong page

Header and footer menus are CMS data (`Header` → menus, `Footer` → columns), so these
are fixed in the CMS, not in code.

| Where | Button | Goes to | Should go to |
|---|---|---|---|
| Header › Über BEER | Team | `/ueber` | `/team` |
| Header › Über BEER | Nachhaltigkeit | `/ueber` | `/nachhaltigkeit` |
| Header › Über BEER | Karriere | `/kontakt` | `/karriere` |
| Header › Über BEER | Aktuelles & Presse | `/ratgeber` (CMS) | `/presse` |
| Header › Über BEER | Empfehlungen | `/projekte` | a real reviews/references page (none exists) or remove |
| Header › Küche planen | So entsteht Ihre Küche | `/kueche-planen` (same as "Übersicht") | `/kueche-planen#ablauf` or remove the duplicate |
| Header › Küche planen | Küchenplaner – Welche Küche passt zu Ihnen? | `/beratung` | `/kueche-planen#planer` |
| Header › Küche planen | Ausstellung Freising | `/ausstellung` | label: the showroom is in **Wolfersdorf** |
| Header › Wissen | Blog / Checkliste | both `/ratgeber` | Checkliste has no page; remove or build one |
| Homepage › Küchenwelten | Arbeitsplatten / Innenleben entdecken | published: anchors on `/material` | fixed in the homepage draft (`/material/arbeitsplatten`, `/material/innenleben`), waiting to be published |
| Homepage › Küchenwelten | panel photos | steel-edge close-up, a wall socket for "Arbeitsplatten", a Blum product photo; English alt texts | draft now uses matching BEER kitchens + German alt texts |
| Footer | Team, Nachhaltigkeit | `/ueber` | `/team`, `/nachhaltigkeit` |
| Footer | Karriere | `/kontakt` | `/karriere` |
| Footer | Küchenplaner | `/beratung` | `/kueche-planen#planer` |
| Footer | Cookie-Einstellungen | `/datenschutz` | opens the consent banner (comes with the tracking work) |
| Footer | "Material & Ausstellung" | `/material` | label typo: "Material & Ausstattung" |
| Footer | YouTube, Facebook, Pinterest, Houzz | bare `youtube.com`, `facebook.com` … | youtube.com/@BEER-Kuechen, facebook.com/BeerKuechen, linkedin.com/company/beer-küchen; Pinterest/Houzz: real profile or remove |

## 2. Photos: one page, many kitchens

- **93 of 125 pages** show photos from several different customer kitchens.
- **Project pages are the worst**: each shows 12 photos from up to 11 kitchens, though a
  project is meant to be one kitchen.
- Root cause is in code: pages pick photos by number from one flat pool
  (`devPhoto` → `beerPhoto(index)` in `lib/beer-photos.ts`), project galleries are
  padded with random photos (`withFill` / `PROJECT_GALLERIES` in
  `lib/project-photos.ts`), house pages use fixed file lists (`lib/house-photos.ts`).
- The 32 files in "API Uploads" (e.g. the menu teasers `stile-*.jpg`) are real BEER
  kitchen photos uploaded by a script, not stock; they are just not linked to their
  kitchen folder. Geräte and Marken use photos served from code.

What the library already has (and the site ignores):

- **97 real customer kitchens**, one folder each (`Kundenfotos › _Kunden 20xx › …`),
  47 of them with 15+ photos, some split into Küche / Bad / Garderobe.
- 2024 kitchens are tagged with BEER style lines: SIMPLE ELEGANCE (8), VINTAGE LOVE (3),
  SMART REBELLION (3), NATURES HARMONY (3), NATURAL BEAUTY (1), PURE NATURE (1).
- `Themenfotos`: building, production, showroom, milestones (BR 2016/2019, Spatenstich
  2021), staff by person, partner photos by brand (Bora 42, Blanco 15, Berbel 10 …).
- Folder names contain customers' surnames: never publish them without consent; use
  place + style ("Simple Elegance in Freising").

## 3. Empty or thin pages (words in the main content)

| Page | Words | Note |
|---|---|---|
| `/impressum`, `/agb`, `/datenschutz` | 47–64 | full Impressum/AGB are CMS drafts waiting to be published; Datenschutz needs a new text |
| `/ausstellung` | 70 | the showroom page itself |
| `/nachhaltigkeit` | 86 | one photo |
| `/team` | 90 | 21 portraits, almost no text |
| `/beratung` | 96 | stock photos only; waits for the Bookings calendar |
| `/presse` | 106 | one news item |
| `/kuechen/stile`, `/kuechen/farben` | 134–136 | overview pages |
| `/katalog`, `/kuechen/besondere`, `/karriere`, `/kuechen/inseln` | 154–161 | |
| Ratgeber articles | ~2 sentences each | CMS stubs |

## 4. Content still kept in code

| File | Size | Holds |
|---|---|---|
| `lib/collection-topics.ts` | 83 KB | texts of 22 topic pages (≈390 sentences) |
| `lib/collection-entries.ts` | 83 KB | texts of material/appliance/region/brand pages (≈280) |
| `lib/collection-hubs.ts` | 43 KB | hub page texts (≈110) |
| `lib/collection-clusters.ts` | 33 KB | cluster page texts (≈115) |
| `lib/topic-reading.ts`, `lib/stile-reading.ts` | 44 KB | long reading texts (≈185) |
| `lib/house-pages.ts` | 29 KB | Über/Team/Kontakt/… voices (≈60) |
| `lib/catalog-data.json`, `lib/faq-data.json` | 57 KB | fallback catalogue + FAQ copies of the CMS |
| `lib/kitchen-planner.ts` | 22 KB | planner fallback (the CMS has the real one) |
| `lib/house-photos.ts`, `lib/project-photos.ts`, `lib/cms-photos.ts`, `lib/beer-photos.ts` | 28 KB | which photo goes where |

About 1,400 German sentences and every photo choice live in code; editors cannot
change them. Moving them needs new CMS fields, which needs schema v2 deployed
(the parked CMS move).

## 5. Proposed direction (SieMatic way: one kitchen, one story)

1. **Projects are the backbone.** One CMS project per real kitchen, built from its
   folder: style line, place (town, no surname), year, room (Küche/Bad/Garderobe),
   materials, appliances, brands, and only that folder's photos. Created as drafts;
   BEER publishes the ones customers agreed to.
2. **Every other page shows kitchens, not loose photos.** Styles, colours, shapes,
   materials, regions and brands pull photos through their related projects, so each
   photo belongs to a kitchen and links to it. The random pool goes.
3. **Style lines as "Küchenwelten"** (like SieMatic's style worlds): SIMPLE ELEGANCE,
   VINTAGE LOVE, NATURES HARMONY, SMART REBELLION, PURE NATURE, NATURAL BEAUTY, each a
   page with its kitchens.
4. **Navigation fixed in the CMS** (section 1): quick, no schema change.
5. **Texts out of code into CMS fields**, page type by page type, after schema v2.
