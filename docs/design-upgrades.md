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
| T3 | Plain headlines instead of wordplay; real facts instead of one-word tiles | waiting: CMS fix for draft access (Strapi 5.61) must go live first | `lib/collection-entries.ts` (`VOICE`, `regionVoice`) | wording list below for Amine |
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
| A1 | Photo frames show the photo's own colours blurred (24 px version) and uncover the photo with an upward wipe once it is in view and loaded | on staging (9 Nov) | `Frame` in `components/catalog/collections/parts.tsx`, `lib/photo-reveal.ts`, `components/RevealObserver.tsx`, `app/globals.css`, width 24 in the `/cms-opt` route | any project or topic page |
| A2 | Project photos drift slowly inside their frames (CSS scroll timeline, no JavaScript) | on staging (9 Nov) | `ReferenzPage` story photos, `ProjectFeature` | [Projekt](https://staging.beer.de/projekte/greige-u-form-holzdecke) |
| A3 | Headings and closing text rise into place once | on staging (9 Nov) | `data-rise` on EndBand, PageEnd, TopicReading, project texts, homepage projects, Ablauf, FAQ | homepage, project pages |
| – | Homepage carousel stops with "reduce motion" | on staging (9 Nov) | `components/HeroCarousel.tsx` | |

Checked: every frame uncovers after scrolling (project 11/11, Landhaus 13/13, homepage 8/8); with
"reduce motion" no cover, no rise, no drift; without JavaScript nothing is covered (CSS `scripting: enabled`).

## Phase 3: openers and header (B1 three-panel opener, transparent header with two buttons)
planned

## Phase 4: sections from existing photos (C7, C8, C2, C4, C9, D2, D3, A5)
planned

## Phase 5: after a showroom photo day (B2, C1, C5, C6)
planned; the shot list will be added here

## Phase 6: after content from BEER (C3, C10, C11, C12, A4 video)
planned
