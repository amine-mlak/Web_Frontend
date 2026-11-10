# Design upgrades

Started 2026-11-09 from the SieMatic study (`docs/design-reference/siematic-sections.html`, local only
and kept out of git because it holds SieMatic's photos). The goal is a site that stops looking
generated and repetitive. The full plan is in six phases; each phase is shipped and checked on staging
before the next starts.

Rules: no AI photos on pages that show BEER's work, no people photos, quotes only from real customers,
all motion off under "reduce motion", no animation or slider libraries.

Status: planned · in progress · on staging · done

## Phase 1: break the template (no new photos)

| ID | What | Status | Files | Check on |
|---|---|---|---|---|
| T1 | First point under each numbered item repeated the line above it | on staging (9 Nov) | `lib/collection-entries.ts` (`pointBranches`, `withPunkte`) | [Keramik](https://staging.beer.de/material/keramik), [Kochfeld](https://staging.beer.de/geraete/kochfeld) |
| T2 | Same "…, geplant in Wolfersdorf." block on 32 pages | on staging (9 Nov) | `lib/entry-reading.ts` (`isSeededReading`), `components/catalog/clusters/TopicReading.tsx`, Spec/Sample/PlacePage | [Keramik](https://staging.beer.de/material/keramik), [Miele](https://staging.beer.de/marken/miele), [Augsburg](https://staging.beer.de/regionen/augsburg) |
| T3 | Plain headlines instead of wordplay; real facts instead of one-word tiles | drafts saved 9 Nov for 32 entries (8 materials, 8 appliances, 5 brands, 11 regions); waiting for a person to publish; backup of the old values in `D:\Beer\backups\t3-headlines-before-20261109`; once the drafts are published, empty tiles in the CMS mean no tiles (`withCms`) | `lib/collection-entries.ts` (`VOICE`, `regionVoice`) | wording list below for Amine |
| T4 | Each page type gets its own section order: materials show their kitchens right after the photo, appliances and brands before the reading text; "Unter Tageslicht" caption gone | on staging (9 Nov) | `components/catalog/entries/*` | Keramik, Kochfeld, Augsburg |
| D1 | Dark ending band with photo, next step and tiles to neighbouring pages (materials, appliances, brands, regions); topic pages get the band without tiles | on staging (9 Nov) | `components/catalog/EndBand.tsx`, `SoftClose` in `clusters/parts.tsx` | Keramik, Kochfeld, Augsburg, Weiße Küchen |
| – | Instagram only on the homepage and `/projekte` | on staging (9 Nov) | `app/[locale]/(main)/layout.tsx` | |

Photos: pages without tagged kitchens all drew the same fallback photos; the list of other projects now starts at a different point per page (`lib/kitchen-photos.ts`, `seed`).

T2 note: the 32 entries' CMS reading text ("Lesetext") is the old generated template. The site now
leaves that section out while the text is still the template, so nothing is written to the CMS. Writing
real reading text for these pages is part of the content work (launch plan, phase 3); as soon as an
entry gets its own text, the section shows again by itself.

### T3 wording proposal (for Amine's yes)

Today's headlines, four tiles and closing titles were copied into the CMS for all 37 entries
(fields "Seitentitel", "Betonung", "Stichworte", "Schluss-Titel"), so the change is made there:
saved as **drafts** after a yes, then published. The furniture pages were already rewritten in this
plain style ("Badmöbel nach Maß", tiles that name real features, "Ihr Bad planen") and stay as they are.

Style: the headline says what the page is about, the italic part says what for, no full stop.
Tiles name real properties or options instead of two-word riddles. Points marked *(prüfen)* are claims
BEER must confirm before publishing.

**Materials**

| Page | Today | New headline | New tiles | Closing |
|---|---|---|---|---|
| Keramik | Keramik *mit Kante.* | Keramik *für Arbeitsplatte und Spüle* | Hitzebeständig · Kratzfest im Alltag · Durchgefärbt oder mit Dekor · Becken unter- oder flächenbündig | Keramik in der Ausstellung ansehen |
| Naturstein | Naturstein *als Unikat.* | Naturstein *als Arbeitsplatte* | Jede Platte ein Unikat · Granit, Quarzit oder Marmor *(prüfen)* · Regelmäßig imprägnieren · Platte vor dem Zuschnitt aussuchen *(prüfen)* | Ihre Steinplatte aussuchen |
| Edelstahl | Edelstahl *mit Arbeitsspuren.* | Edelstahl *für Arbeitsplatte und Spüle* | Becken nahtlos eingeschweißt *(prüfen)* · Hitzebeständig und hygienisch · Kratzer werden zur Patina · Wie in der Profiküche | Edelstahl planen |
| Holz massiv | Holz *will Öl.* | Massivholz *als Arbeitsplatte* | Geölt statt lackiert · Kratzer lassen sich abschleifen · Regelmäßig nachölen · Warm neben Stein und Lack | Ihre Holzplatte planen |
| Lack matt | Lack matt *ohne Polieren.* | Matter Lack *für Fronten* | In jedem Farbton *(prüfen)* · Weniger Spiegelungen als Hochglanz · Farbton am Muster bei Tageslicht wählen · Pflege mit feuchtem Tuch | Ihren Farbton aussuchen |
| Eiche furniert | Eiche *als Fläche.* | Eiche furniert *für Fronten* | Echtholz auf stabiler Trägerplatte · Maserung läuft über mehrere Fronten *(prüfen)* · Geölt oder lackiert · Passt zu Stein und Lack | Furniere ansehen |
| Fenix | Fenix *wo Finger stören.* | Fenix *für Fronten und Platten* | Tiefmatte Oberfläche · Kaum Fingerabdrücke · Feine Kratzer mit Wärme ausbessern · Warm und weich im Griff | Fenix anfassen |
| Vollauszüge | Vollauszüge *bis hinten.* | Vollauszüge *für Unterschränke* | Auszug bis zur Rückwand · Gedämpft schließend · Innen nach Bedarf eingeteilt · Eckschränke ohne toten Winkel | Innenleben planen |

**Appliances**

| Page | Today | New headline | New tiles | Closing |
|---|---|---|---|---|
| Kochfeld | Kochfeld *mit der Platte.* | Kochfelder *flächenbündig geplant* | Induktion, Gas oder kombiniert · Flächenbündig oder aufgesetzt · Anschluss im Aufmaß · Marke frei wählbar | Ihr Kochfeld planen |
| Kochfeldabzug | Abzug *in der Platte.* | Kochfeldabzug *statt Dunstabzugshaube* | Abluft oder Umluft · Kanal im Unterschrank geplant · Freier Blick über die Insel · Bora und andere Hersteller | Ihren Abzug planen |
| Backofen | Backofen *wo die Hand ist.* | Backofen *auf Griffhöhe* | Im Hochschrank auf Arbeitshöhe · Mit Dampf- oder Mikrowellenfunktion · Nische nach Gerätemaß · Marke frei wählbar | Ihren Backofen planen |
| Dampfgarer | Dampf *mit Wasser.* | Dampfgarer *neben dem Backofen* | Wassertank oder Festwasser *(prüfen)* · Auf Augenhöhe im Hochschrank · Gemüse, Fisch, Aufwärmen · Wasseranschluss im Aufmaß | Ihren Dampfgarer planen |
| Kühlung | Kühlung *mit Nische.* | Kühlschränke *hinter der Front* | Vollintegriert · Lüftung im Schrank geplant · Kühl-Gefrier-Kombination oder getrennt · Weinkühlschrank möglich | Ihre Kühlung planen |
| Geschirrspüler | Spüler *in der Zeile.* | Geschirrspüler *vollintegriert* | Front bündig mit der Küche · Neben der Spüle · Auf Wunsch erhöht eingebaut · Anschluss im Aufmaß | Ihren Spüler planen |
| Kaffeevollautomat | Kaffee *auf Augenhöhe.* | Kaffeevollautomat *eingebaut* | Im Hochschrank auf Augenhöhe · Festwasseranschluss möglich *(prüfen)* · Nische nach Gerätemaß · Tassenfach daneben | Ihre Kaffeeecke planen |
| Quooker-Armatur | Quooker *als Tank.* | Quooker *kochendes Wasser aus dem Hahn* | Tank im Unterschrank · Kochend, gekühlt, mit Kohlensäure *(prüfen: Cube)* · Strom im Unterschrank nötig · Mit der Spüle geplant | Ihren Quooker planen |

**Brands** (headline "Marke *in BEER-Küchen*" or "Marke *bei BEER*")

| Page | Today | New headline | New tiles | Closing |
|---|---|---|---|---|
| Miele | Miele *für den Tag.* | Miele *in BEER-Küchen* | Backöfen, Dampfgarer, Kochfelder, Spüler · Freie Markenwahl · Kundendienst durch Miele · In die Planung eingebaut | Miele in der Ausstellung |
| Gaggenau | Gaggenau *als Architektur.* | Gaggenau *in BEER-Küchen* | Geräte sichtbar oder verborgen · Backöfen und Kochfelder *(prüfen)* · Freie Markenwahl · In die Planung eingebaut | Gaggenau planen |
| Bora | Bora *für den Blick.* | Bora-Kochfeldabzug *in BEER-Küchen* | Abzug im Kochfeld · Freier Blick ohne Haube · Unterschrank neu aufgeteilt · Abluft oder Umluft | Bora planen |
| Siemens | Siemens *wo es passt.* | Siemens *in BEER-Küchen* | Breites Gerätesortiment · Freie Markenwahl · Neben anderen Marken möglich · In die Planung eingebaut | Siemens planen |
| Quooker | Quooker *mit dem Becken.* | Quooker *in BEER-Küchen* | Armatur mit Tank im Unterschrank · Mit der Spüle geplant · Freie Markenwahl · Einbau durch uns *(prüfen)* | Quooker planen |

**Regions** (11 pages, today all "{Ort} *im Radius.*" with the same four tiles):
headline "Küchen in {Ort}" without italics, no tiles, and the projects from that area first. The CMS
has no distance or drive time (fields empty), and none is invented. Which regions stay at all is the
open content decision from the audit (keep areas with real projects, redirect the rest).

## Phase 2: movement

| ID | What | Status | Files | Check on |
|---|---|---|---|---|
| A1 | Photo frames show the photo's own colours blurred (24 px version) under the photo while it loads. The upward wipe and zoom were removed on 9 Nov (Amine: repetitive and cheap) | on staging (9 Nov) | `Frame` in `components/catalog/collections/parts.tsx`, `lib/photo-reveal.ts`, `components/RevealObserver.tsx`, `app/globals.css`, width 24 in the `/cms-opt` route | any project or topic page |
| A2 | Project photos drift slowly inside their frames (CSS scroll timeline, no JavaScript) | on staging (9 Nov) | `ReferenzPage` story photos, `ProjectFeature` | [Projekt](https://staging.beer.de/projekte/greige-u-form-holzdecke) |
| A3 | Headings and closing text rise into place once | on staging (9 Nov) | `data-rise` on EndBand, PageEnd, TopicReading, project texts, homepage projects, Ablauf, FAQ | homepage, project pages |
| – | Homepage carousel stops with "reduce motion" | on staging (9 Nov) | `components/HeroCarousel.tsx` | |

Checked: every frame uncovers after scrolling (project 11/11, Landhaus 13/13, homepage 8/8); with
"reduce motion" no cover, no rise, no drift; without JavaScript nothing is covered (CSS `scripting: enabled`).

## Phase 3: openers

| ID | What | Status | Files | Check on |
|---|---|---|---|---|
| B1 | Project pages open in three panels: the room, the title on a close-up, a detail. Close-ups are picked by their alt text (Kante, Ecke, Bedienknebel, geöffnete Schublade …) and leave the photo pairs below, so nothing repeats; projects with fewer than two close-ups keep the single photo | on staging (9 Nov) | `components/catalog/TriptychHero.tsx`, `components/catalog/ReferenzPage.tsx` | [Anthrazit unter dem Dach](https://staging.beer.de/projekte/dachgeschoss-anthrazit), [Greige U-Form](https://staging.beer.de/projekte/greige-u-form-holzdecke) |
| B1b | The same opener on topic pages (L-Form, Kochinsel …), with close-ups taken from the tagged projects' galleries that the page doesn't show yet | planned | `lib/collection-topics.ts`, topic views | |
| – | Hub pages (Küchenformen, Stile …) keep their full-screen photo opener | decided | | |
| – | Transparent header: not done. Amine kept the white bar on purpose (commit f3396c4, 23 Sep). Header buttons: the menu already has "Küche planen"; a "Termin" button comes with booking in phase 4 | decided | | |

## Collections: one grammar, real kitchens (on staging since 10 Nov, merge `e4b3091`)

Hub pages, category pages and single pages now follow one order and one type scale, and their photos
come from kitchens BEER built.

| ID | What | Status | Files | Check on |
|---|---|---|---|---|
| G1 | One type scale (`.t-display` … `.type-eyebrow`) and one page order for hubs, category and single pages: header, statement, options, quote, FAQ, ending. The parent page is a visible link above the title; one h1 per page; JSON-LD on all | on staging | `app/globals.css`, `components/catalog/collections/*`, `components/catalog/entries/*` | /material, /material/arbeitsplatten, /material/keramik |
| G2 | Photo matcher: finds the gallery photos that show a material or appliance by their alt text, and sorts them into room, close-up and other | on staging | `lib/photo-match.ts` | |
| C1 | Single pages (material, appliance, brand) open on three photos of one kitchen, then a close-up from edge to edge between two texts, with a caption that links to the project | on staging | `components/catalog/PhotoStory.tsx`, `SamplePage`, `SpecPage` | /material/naturstein, /geraete/kochfeld, /marken/miele |
| C2 | Staggered pair on single pages: two photos of one kitchen at different sizes, the second set lower | on staging | `PhotoStory.tsx` | /material/edelstahl, /geraete/backofen |
| C8 | Pair tiles on category pages: the room and a close-up of the same kitchen in one card | on staging | `CategoryPage`, `lib/collection-entries.ts` | /material/arbeitsplatten, /geraete/kochen |
| – | Category pages open on a room with one of their options, with caption and "Zur Küche" | on staging | `CategoryPage`, `matchHero` | /material/fronten, /geraete/backen |
| – | Material hub: each area shows a built kitchen with a close-up set into its corner and names the kitchen. Drawers and the sink lead with the close-up. Geräte hub rows use built kitchens too | on staging | `MaterialCollection`, `GeraeteCollection`, `matchArea`, `withAreaPhotos` | /material, /geraete |
| – | "In diesen Küchen" cards lead with the photo that shows the thing; the end tiles show built kitchens | on staging | `lib/collection-entries.ts`, `lib/project-features.ts` | /material/holz-massiv |
| – | No photo appears twice on a page (checked on 24 hub, category and single pages) | on staging | `CategoryPage`, `photoMatch().used` | |

Pages without matching gallery photos keep the old layout: Fenix, Geschirrspüler, Lack matt.

**CMS content that holds these pages back** (photos and tags, not code):
- No gallery photo shows a ceramic worktop, Fenix or a dishwasher; Lack matt has almost none.
- CMS photos of Keramik (a flat colour), Edelstahl, Holz massiv, Naturstein, Kochfeldabzug, Kühlung and Geschirrspüler show something else. The pages now use gallery photos where they exist.
- Geräte hub "Spülen" photo is a sink, its alt text says dishwasher.
- One photo file sits in two project galleries with two different alt texts.
- Only 6 of 95 projects are tagged to a region; no project is tagged Keramik.
- Keramik and Miele pages still have aphoristic CMS copy ("Die Platte ist Arbeit. Kein Bild.").

## Reading text and places (on staging since 10 Nov, merge `06b6c5d`)

Amine: the "Im Radius" block repeats, some pages look empty, and photo pages have no room for text
or for text that names places.

| ID | What | Status | Files | Check on |
|---|---|---|---|---|
| R1 | The "Im Radius" column is gone from all topic pages (was on 19). The word "Radius" is out of the page copy; the 200 km fact stays in plain words | on staging | `lib/topic-reading.ts`, `lib/stile-reading.ts`, `lib/collection-hubs.ts`, `lib/collection-present.ts`, `lib/entry-reading.ts` | /kuechen/formen/kuechenzeile |
| R2 | One reading block on every material, appliance, brand and region page and on the Regionen overview: heading on the left, text with sub-headings on the right. Text is in code (DE and EN); a text written in the CMS replaces it | on staging | `components/catalog/clusters/TopicReading.tsx`, `lib/page-reading/*`, `SamplePage`, `SpecPage`, `PlacePage`, `RegionenCollection` | /material/fenix, /marken/gaggenau, /regionen |
| R3 | Place names in the text link to their region pages, once per page. Topic pages that name no place get one paragraph on where BEER builds | on staging | `components/catalog/PlaceText.tsx`, `lib/topic-places.ts` | /regionen/augsburg |
| R4 | Region pages: each has its own text in place of the one 101-word paragraph all eleven shared, plain titles ("Küchen in Augsburg"), no points block | on staging | `lib/page-reading/regions.ts`, `lib/collection-entries.ts`, `PlacePage` | /regionen/erding |
| R5 | Search titles and descriptions: the seeded "Name · Wolfersdorf" title and the seeded description give way to the page text ("Küchen nach Maß in Erding", "Fenix als Küchenfront"). A title or description written in the CMS still wins | on staging | `app/[locale]/(main)/{material,geraete,marken,regionen}/[slug]/page.tsx`, `lib/page-reading/index.ts` | page source |

Words per page, before and after: Fenix 161 to 270, Lack matt 167 to 286, Geschirrspüler 164 to 280,
Gaggenau 185 to 296, Quooker 163 to 267, Regionen overview 337 to 456. All 80 collection pages answer 200.

**Sentences BEER must confirm** (written from what the site already says, but not checked with BEER):
- Gaggenau: "groß, schwer und klar gestaltet".
- Miele: "auf eine lange Nutzung ausgelegt".
- Siemens: "Die Geräte kommen mit der Küche und werden von unseren Monteuren eingebaut".
- Fenix: the cleaning sentence, and "gute Wahl für grifflose Küchen und dunkle Farben".
- Lack matt: the cleaning sentence.
- Holz: "Rund um die Spüle lässt sich Holz … kombinieren".
- Ingolstadt: "Arbeitsplatten aus Stein, Glas oder Metall kommen von Handwerksbetrieben, mit denen wir zusammenarbeiten".
- Mainburg: "Sondermaße gehören dazu, und die Farbauswahl ist sehr groß".
- Nürnberg: "liegt am Rand dieses Gebiets".

**Still from the CMS, not changed here:** the wordplay headlines ("Fenix wo Finger stören."), the
one-word tiles and lines like "Fenix ist Haptik. Kein Label." They go when the 32 T3 headline drafts
are published.

## Phase 4: sections from existing photos (C7, C8, C2, C4, C9, D2, D3, A5)

C2 and C8 for the collection pages went out with the collections grammar (table above). The project
pages follow here. Built 10 Nov on branch `design/phase-4-projects`, merged into `main` (`4a8636a`).
On staging since 10 Nov (deploy of `014a9a7`).
Before and after: `docs/design-reference/projects-before-after.html`.

| ID | What | Status | Files | Check on |
|---|---|---|---|---|
| D3 | Project list as an archive: a wide photo beside a tall one, then three in a row, ten houses per turn. Four filter rows (style, colour, layout, detail) with the number of houses behind each; one filter at a time. 20 houses at first, a button adds 20. The filter and the place in the list are kept for the tab, so coming back from a house lands where the visitor left. All houses stay in the page as links. Under each house: the place when it is a real one, then two or three words on what the kitchen is ("Raum München" is left out) | on staging | `lib/project-archive.ts`, `components/catalog/ProjectArchive.tsx`, `app/[locale]/(main)/projekte/page.tsx` | /projekte |
| C2 | Project pages: photo and text pairs change their split (7/5, 8/4), upright photos stand upright with air around them. The rest of the gallery is laid out from the photos' own shapes | on staging | `components/catalog/ReferenzPage.tsx` | /projekte/greige-u-form-holzdecke, /projekte/kobaltblau-eichennische |
| – | Photo viewer (not in the SieMatic list): a click on any photo of a house opens it on a dark full screen with caption, counter and arrows. Arrow keys, swipe, Escape. Browser dialog, no library; the two neighbours load ahead | on staging | `components/catalog/PhotoViewer.tsx`, `components/catalog/Frame.tsx` (moved out of `collections/parts.tsx`), `TriptychHero.tsx` | any project page |
| A5 | Pinned wipe on project pages | dropped: Amine found the photo wipe cheap; motion stays rare | | |
| D2 | Slider for "Ähnliche Häuser", HomeProjects, Presse | not built: three cards fit side by side; a slider adds nothing there | | |
| C7 | Floor-plan line drawings for the six kitchen forms: on the chapters of /kuechen/formen, in the header of each form page, and as the "Weitere Küchenformen" cards | on staging (collections polish, below) | `components/catalog/shapes/PlanDrawing.tsx`, `clusters/ClusterPage.tsx`, `clusters/Formen.tsx` | /kuechen/formen, /kuechen/formen/u-form |
| C4 | "Das Material in dieser Küche" card on project pages | planned; needs projects tagged with materials in the CMS | | |
| C9 | Calm photo between grid and text on topic pages | planned | | |

**CMS content that holds the project list back:** `year` is empty on all 95 projects; `place` is
"Raum München" on 70 and empty on 16, so only 9 houses can show a place. With real places the archive
could get a filter row by region.

## Collections polish: hubs and their sub-pages (on staging since 10 Nov, merge `014a9a7`)

A pass over every collection hub (Küchen with its five groups, Material, Geräte, Marken, Regionen, Möbel)
and the pages under them. Before and after: `docs/design-reference/collections-polish-before-after.html`.

| What | Files | Check on |
|---|---|---|
| Each kitchen topic page opens and closes on its own room photo; the "weitere" cards show photos the page has not used; no photo twice on a hub | `lib/kitchen-photos.ts`, `lib/collection-topics.ts`, `lib/collection-clusters.ts` | /kuechen/stile/landhaus, /kuechen/formen/offen |
| Hub chapters in a rhythm: one full-width chapter, then a pair, and again. Darker shade under the chapter text | `clusters/ClusterPage.tsx`, `FullChapter.tsx`, `app/globals.css` | /kuechen/stile, /kuechen/farben, /kuechen/inseln |
| Floor-plan drawings (C7) | see Phase 4 | /kuechen/formen |
| Every collection ends on its own view of the showroom or the building beside the visit facts. Before, Geräte, Marken and Regionen ended on the same customer kitchen | `lib/house-photos.ts` (`HUB_VISIT`), `lib/collection-present.ts` | the end of /geraete, /marken, /regionen, /moebel |
| Cards fill the row when there are one, two or four of them (end tiles, "Was zur Wahl steht", the kitchen row) instead of leaving a hole | `EndBand.tsx`, `PageEnd.tsx`, `entries/CategoryPage.tsx`, `clusters/parts.tsx` | /geraete/kochen, /regionen/muenchen |
| Slogans out of the code: the line under the fact tiles, the price punchline, the lines under the five group tiles, the section headings ("Projekte mit diesem Grundriss", "In diesen Küchen verbaut", "Weitere Materialien"). "In Zahlen" over word tiles is now "Auf einen Blick" | `lib/collection-*.ts`, `lib/house-pages.ts`, `lib/stile-reading.ts`, `entries/*.tsx`, `clusters/*.tsx` | /material/naturstein, /marken/bora |
| The Wohnmöbel photo showed a person. The site now shows a BEER project photo (shelf and display cabinet under a staircase) in its place, on the hub, the page and the end tiles | `lib/catalog-api.ts` (`WITHOUT_PEOPLE`) | /moebel, /moebel/wohnmoebel |
| The "Arbeitsplatz" block on the Wohnmöbel page showed a person. Its second photo (the shelves) now takes that place | `lib/catalog-api.ts` (`POINT_PHOTOS_WITH_PEOPLE`) | /moebel/wohnmoebel |
| The furniture pages showed their header photo a second time in the first block. That block now opens on its second photo | `entries/InteriorPage.tsx` | /moebel/ankleide, /moebel/einbauschraenke, /moebel/tische-baenke |
| Brand list: the rows for Bora, Miele and Siemens show a kitchen BEER built with that brand (a project photo whose description names the brand) instead of a product snapshot. Gaggenau and Quooker keep the CMS photo, because no project photo names them yet | `lib/photo-match.ts` (`brandCover`), `app/[locale]/(main)/marken/page.tsx` | /marken |

**CMS content that still reads as generated on these pages** (text in the CMS, not code; a human replaces it):
- Material, appliance and brand pages: the closing titles ("Maserung unter Licht.", "Öl und Schnitt.", "Kante und Becken.",
  "Den Ton mustern.", "Hinten erreichen.", "Spuren erlaubt.", "Diese Platte.", "Dort, wo die Hand liegt.", "Wasser zuerst.",
  "Nische und Rücken.", "Neben der Spüle.", "Ablauf oder nicht.", "Korpus zuerst.", "Luft ehrlich.", "Tank mitzeichnen.",
  "Luft messen.", "Korpus mit Bora.", "Zeigen oder ruhen.", "Mit der Spüle.", "Aufgabe, nicht Paket.", "Nische, dann Miele.").
- The same entries hold slogan points and word tiles, for example Eiche furniert: "Öl, ehrlich", "Folie bleibt Kostüm.",
  tiles "Furnier / oder ehrlich massiv", "Alter / ist erlaubt". These need plain text and real facts (thickness, care, where it is used).
- Page titles with a full stop ("Eiche als Fläche.", "Naturstein als Unikat.") go with the T3 headline drafts.

**CMS photos to replace:**
- Möbel → Wohnmöbel: the photo shows a person (swapped in code until then; remove the line in `WITHOUT_PEOPLE` afterwards).
- Möbel → Wohnmöbel → "Arbeitsplatz": the main photo shows a person (swapped in code until then; remove the line in `POINT_PHOTOS_WITH_PEOPLE` afterwards).
- Marken: the Miele and Siemens photos are small product snapshots (the brand list now shows project photos in their place; the brand pages still open on them).
- Marken: Gaggenau and Quooker have no project photo whose description names them. Once a gallery photo does, the brand list picks it up by itself.

## Phase 5: after a showroom photo day (B2, C1, C5, C6)
planned; the shot list will be added here

## Phase 6: after content from BEER (C3, C10, C11, C12, A4 video)
planned
