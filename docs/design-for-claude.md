# Design work for Claude

29 October 2026. This is the design pass before the site goes live.
Do this. Do not invent a new visual system on top of it.

Staging (what was live this morning) is behind the repo in a few places.
`HubEnd` is already one showroom block. The concentric circles on Regionen
are already gone. Material already lists the materials inside each area.
Read the files below and finish what is still the costume. Then check the
eight URLs on https://staging.beer.de after deploy.

Out of scope: security, n8n, indexing, consent. Another note covers those.

## The standard

A BEER page is a photograph, the name of the thing, and one true sentence.
The workshop in Wolfersdorf is the luxury. The page does not perform it.

One collection layout, used everywhere:

- Title on paper, one line, no italic second line.
- H1 stays in the range of the Möbel title (`text-[48px]` / `sm:text-[68px]`).
  Nothing at 92px, 96px, 104px, 120px, or 136px.
- One sentence under the title. That sentence is the CMS intro (`hub.lede`).
- Then the real items: photo, name, one sentence, link.
- One ending: `HubEnd` → `AtelierVisit` (hours, address, phone, appointment).
  Do not add a second quote band, a brass dash, or `GutZuWissen` under a collection.

Delete these wherever they still appear on a collection, cluster, or style page:

- Gold or brass micro-labels (`type-eyebrow`, `tracking-[0.22em] uppercase`) used as section openers.
- Giant pale numbers behind a heading (`text-ink/[0.06]`, `text-ink/[0.07]`).
- Numbered rows `01` `02` `03`, Roman numerals, and `branch.kicker` when it is only that number.
- A paper card or a second photo sitting on top of a photograph, including thick white frames (`border-[10px]`, `border-[12px]`) and soft shadows (`shadow-[0_24px_60px…]`, `shadow-[0_30px_80px…]`).
- A dark gradient on a photo so a caption can be burned into it.
- Captions set in small tracked capitals on the picture. A caption sits under the photo, and only if it names the material, the house, or the place.
- Image zoom on hover (`group-hover:scale-[1.03]`, `duration-700`).
- Pill buttons on these pages. `btn-quiet` or a text link.
- Hex codes printed next to a colour dot. On Farben the colour itself is the swatch. Do not print `#c4a070`.
- Empty quotation marks. A quote renders only when the CMS has both the sentence and its source, and only once on the page.
- Hardcoded costume words: “Die Küche als Haus”, “Eintreten”, “Hausakte”, “Haus öffnen”, “Satzprobe”, “Ortsverzeichnis”, “Gazetteer”, “An die Hand”, “Oberflächen vor der Zeichnung.”, “Der Korpus bleibt BEER.” set as a tracked label.

Do not add a new layout variant to avoid repetition. Repetition of one quiet layout is the point. `ChapterSpread` rotating five layouts with `index % 5` is the thing to remove, not to refine.

## Copy that is decoration

In `lib/collection-present.ts`, stop feeding the page with:

- `LOOK_CAPTION` (“Griff, still”, “Alltag, nicht Pose”, “Haus, nicht Pose”, “Auszug, still”)
- `FILM_CAPTION`
- `LEDGER_LINE`
- `priceLine` (“Das Erstgespräch ist kostenlos. Die Küche nicht.”) used as a poster
- `FACTS` when the cells are slogans (“Stein / nicht Folie”, “Wenige / Aufträge im Jahr”). A true number (200 km, a town, a year) belongs in a sentence, once.

If a component still reads `hub.looks`, `hub.filmstrip`, `hub.ledgerLine`, or `hub.priceLine` only to decorate, delete that block. Do not restyle it.

`presentHub` sets `kicker` to `"01"`, `"02"`, … Delete the display of `kicker` on the collection pages. Leave the field if something else needs an id, but it must not be visible.

## Already done — do not put it back

- `components/catalog/collections/parts.tsx` `HubEnd` is the showroom only. No `GutZuWissen`, no `CloseAtelier`.
- `RegionenCollection` no longer draws concentric circles. Keep it that way.
- `MaterialCollection` lists each material under its area (`branch.items`). Keep the list. It is the page.
- Küchen no longer prints Roman numerals or “Eintreten”.

## Pages

### `/kuechen` — `components/catalog/collections/KuechenCollection.tsx`

Still wrong: a full-viewport photo, a gradient, and a paper card (`max-w-xl bg-paper`) holding the title.

Make it: title and the CMS sentence on the paper background, then one full-width photograph with nothing on it, then the five doors.

The five doors stay: Formen, Stile, Farben, Inseln, Besondere. Each is photo, name, one sentence. No section title “Fünf Zugänge”. The grid does not need a heading; if a heading stays, it is not a label.

Delete the black centred quote section. A CMS quote does not get its own black band on this page.

Do not add a sixth layout for one of the doors.

### `/material` — `components/catalog/collections/MaterialCollection.tsx`

The area list and the material rows are right. Keep them.

Still wrong: the title is `lg:text-[136px]`. Bring it down to the Möbel size. The statement under the sample photo is a centred 40px line. Make it a normal sentence, left aligned, under the title or beside the sample photo. Not a poster in the middle of the page.

The sample wall (`SHOWROOM_SAMPLES.wall`) can stay. It is a real wall in Wolfersdorf. No poem captions on it (“Lack, seidenmatt”, “Maserung, echt”). If a caption is needed, it is “Ausstellung Wolfersdorf”.

`Area` may alternate the photo left and right. That is enough variation. Do not add frames, numbers, or a gold “Muster” stamp.

### `/geraete` — `components/catalog/collections/GeraeteCollection.tsx`

Keep the dark page, the partner logos, and the five rows (Kochen, Backen, Kälte, Spülen, Extra): name, one sentence, one wide photo.

Still wrong: the title is `lg:text-[92px]`. Bring it down. `{branch.kicker}` is the visible `01`–`05`. Remove it.

Delete the centred quote section at the bottom (`hub.quote` on `bg` of the page). The close is `HubEnd` only.

### `/moebel` — `components/catalog/collections/MoebelCollection.tsx`

This is the reference. Leave the structure: split hero, then each line as photo, name, the point list, and a link, then the houses passed in as children.

Do not add an eyebrow above the statement (“Dieselbe Werkstatt” or any tracked label). The statement sentence can stay at a normal size (`text-[26px]` / `md:text-[34px]` is already calmer than the other hubs). Do not enlarge it.

No gold chapter marks. No zigzag added for its own sake beyond the current left/right alternation.

### `/projekte` — `components/catalog/collections/ProjekteCollection.tsx`

Keep one lead house, full width, then the file of the other houses.

Still wrong: the title is `lg:text-[88px]`. Bring it down. The lead is whichever project the API returns first. That is a data choice, not a design. Do not dress the first card to look more important than a chosen house. When a lead is chosen later, it uses the same type size as the others, only larger in the photograph.

Every card shows place and year in normal type (`text-[14px] text-muted` is already there when `meta` exists). Do not put place and year back into tracked small caps.

Delete the second quote block (`blockquote` on `bg-nacht`) next to the statement. One statement sentence is enough. `HubEnd` closes the page.

No label “Gebaut”, “Hausakte”, or “Haus öffnen”.

### `/regionen` — `components/catalog/collections/RegionenCollection.tsx`

The circle is gone. Do not bring it back.

Still wrong: the hero is centred and the title is `lg:text-[96px]`. Left-align it and use the Möbel title size. The radius sentence (“etwa 200 Kilometern um München”) stays, once, as a sentence. Not inside a diagram.

Four towns keep a sentence and a photo. Further towns are a name list. Give each a sentence from the CMS, or leave the name. Do not invent a gazetteer label, and do not print “Ortsverzeichnis” twice.

No gold arrows as decoration. A link does not need a `→` to be a link.

### `/marken` — `components/catalog/collections/MarkenCollection.tsx`

Keep the five names, one sentence each, and the photo beside the name.

Still wrong: the title is `lg:text-[120px]`. That is a type specimen. Use the Möbel title size. “Satzprobe” must not come back. “Der Korpus bleibt BEER.” must not come back as a tracked gold line. If that idea stays, it is the normal statement sentence already next to the intro.

Delete any black quote band. Further brands, when they exist, are the same list continued, not a second poster. The plain name index (`extras`) can stay as names only.

### `/ratgeber` — `components/catalog/collections/EditorialCollection.tsx`

This page is still the magazine. Replace it.

`EditorialCollection` currently stacks `MagazineOpen`, `ChapterRun`, `LookRail`, and `HousesSpread`. For Ratgeber that becomes:

- Title and the CMS sentence on paper.
- A list of published articles: title, one line, link. No numbered overview, no repeated chapter, no `01` `02` `03` points, no arrow column.
- `/faq` may sit under the list as “Fragen”, once. It is not a fake chapter with three slogans.
- No `LookRail`. Delete “Oberflächen vor der Zeichnung.” and the captions from `LOOK_CAPTION`.
- No empty `Interlude` (`„ “` with nothing inside).
- `HubEnd` at the bottom.

`MagazineOpen` (`CollectionHero` + `StatementSpread` + anything still beside them), `ChapterRun`, `ChapterIndex`, `ChapterSpread`, `Interlude`, and `LookRail` should have no remaining use after this. Delete them if nothing else imports them. Do not restyle the five `ChapterSpread` variants.

`HousesSpread` is a normal card grid. It may stay on a page that really has houses. It does not belong on Ratgeber unless those cards are real articles with their own photos.

## Style and cluster pages

Same costume, second pass. One quiet page each. Do not keep six different “personalities”.

`components/catalog/clusters/StileTopics.tsx`

- Landhaus: delete the paper card and its shadow on the photograph (`shadow-[0_24px_60px…]`). Title on paper, photo alone.
- Design, Holz, Luxus: delete the `01` `02` `03` column (`padStart(2, "0")` and `type-eyebrow text-gold`).
- Purist: delete the centred poster, the centred italic line, and the centred numbered list. Left-align like Möbel.
- Luxus: delete the quote centred on black with a tracked brass source.
- Titles at `sm:text-[92px]` through `sm:text-[104px]` come down to the same H1 size as the collections.

`components/catalog/clusters/Inseln.tsx`

- Delete the brass kicker on `Pedestal` (`tracking-[0.22em] text-messing`).
- Delete the centred italic line under the photo (`hub.ledgerLine`).
- The heading “Inseln, die stehen” is a slogan. Use the CMS title.

`components/catalog/clusters/Farben.tsx`

- Keep `SwatchField`: the photograph, then the real colour, then the name and the project count.
- Do not print the hex.
- Remove hover zoom.

`components/catalog/hub/CollectionSiblings.tsx`

- Delete the gradient and the `01` in brass on the picture.
- Name under the photo.

## House pages, only if you touch them

`components/catalog/house/HousePage.tsx` still mounts `AtelierFacts`, `PriceStance`, and `CloseAtelier`. Do not spread that pattern. If you are already in a house page: remove the price sentence on a black band and the second closing block. The showroom ending is enough. Do not start a new house-page redesign in this pass.

`components/GutZuWissen.tsx` is now the FAQ quote, not a collection ending. Keep Christian Beer’s sentence if it is the real one. Delete the four colour dots, the gold dash, and the caramel panel. One quote, on paper, with the name under it.

## Footer

In `components/Footer.tsx` the column labels (KÜCHEN, MÖBEL, …) and the Instagram line are `h2`. They are not headings of the page. Make them paragraphs. Leave the link lists as they are.

## Check when you are done

On each of these, after deploy:

- https://staging.beer.de/kuechen
- https://staging.beer.de/material
- https://staging.beer.de/geraete
- https://staging.beer.de/moebel
- https://staging.beer.de/projekte
- https://staging.beer.de/regionen
- https://staging.beer.de/marken
- https://staging.beer.de/ratgeber

The page passes when:

- The H1 is one line, at the Möbel size, on paper. No card on the photo. No word at 96px or above.
- You cannot find `01`, a gold micro-label, a gradient caption, a pale giant number, or a second photo overlapping the first.
- Ratgeber is a list of articles, not a magazine, and it does not print an empty quotation mark.
- The only closing block is the showroom: hours, Badendorf 6, phone, appointment.
- A new material, brand, or article shows up because it is published, not because a new layout was drawn for it.
