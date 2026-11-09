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
| T1 | First point under each numbered item repeated the line above it | in progress | `lib/collection-entries.ts` (`pointBranches`, `withPunkte`) | [Keramik](https://staging.beer.de/material/keramik), [Kochfeld](https://staging.beer.de/geraete/kochfeld) |
| T2 | Same "…, geplant in Wolfersdorf." block on 32 pages | in progress | `lib/entry-reading.ts` (`isSeededReading`), `components/catalog/clusters/TopicReading.tsx`, Spec/Sample/PlacePage | [Keramik](https://staging.beer.de/material/keramik), [Miele](https://staging.beer.de/marken/miele), [Augsburg](https://staging.beer.de/regionen/augsburg) |
| T3 | Plain headlines instead of wordplay; real facts instead of one-word tiles | planned | `lib/collection-entries.ts` (`VOICE`, `regionVoice`) | wording list below for Amine |
| T4 | Each page type gets its own section order | planned | `components/catalog/entries/*` | |
| D1 | Dark ending band with the next step and related photo tiles, per page type | planned | new `components/catalog/EndBand.tsx` | |
| – | Instagram only on the homepage and `/projekte` | planned | `app/[locale]/(main)/layout.tsx` | |

T2 note: the 32 entries' CMS reading text ("Lesetext") is the old generated template. The site now
leaves that section out while the text is still the template, so nothing is written to the CMS. Writing
real reading text for these pages is part of the content work (launch plan, phase 3); as soon as an
entry gets its own text, the section shows again by itself.

## Phase 2: movement (A1 colour cover, A2 parallax, A3 slide-in; reduced motion in the homepage carousel)
planned

## Phase 3: openers and header (B1 three-panel opener, transparent header with two buttons)
planned

## Phase 4: sections from existing photos (C7, C8, C2, C4, C9, D2, D3, A5)
planned

## Phase 5: after a showroom photo day (B2, C1, C5, C6)
planned; the shot list will be added here

## Phase 6: after content from BEER (C3, C10, C11, C12, A4 video)
planned
