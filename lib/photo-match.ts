import { projectHref, type Project, type ProjectFrame } from "@/lib/catalog";
import { isCodeGallery } from "@/lib/project-photos";
import { photoKey } from "@/lib/utils";

/**
 * Photos that really show the thing a page is about.
 *
 * Every gallery photo carries a description written in the media library ("Kante einer
 * Arbeitsplatte aus Naturstein …"). A page about a material, an appliance or a brand looks
 * these up and builds its photo sections from the kitchens where the thing is actually visible,
 * instead of from the next photo in line. Each photo keeps its description and its project,
 * so the caption can say where it was built.
 */

export type StoryPhoto = {
  src: string;
  srcSet?: string;
  /** The description from the media library. */
  alt: string;
  /** The project the photo belongs to. */
  href: string;
  project: string;
  place?: string;
  portrait?: boolean;
};

export type PhotoStory = {
  /** Three photos of one kitchen that open the page: a large one and two beside it. */
  opener?: { big: StoryPhoto; side: [StoryPhoto, StoryPhoto] };
  /** One close-up shown edge to edge between two texts. */
  band?: StoryPhoto;
  /** Two photos of one kitchen, set at different sizes. */
  pair?: [StoryPhoto, StoryPhoto];
  /** One photo beside the facts. */
  ledger?: StoryPhoto;
};

export type PhotoMatch = {
  story: PhotoStory;
  /** Kitchens where the thing is visible, the richest first. */
  projects: Project[];
  /** For each of those kitchens, a photo that shows it (for the project cards). */
  detailOf: Map<string, ProjectFrame>;
  /** Every photo the story uses, so the rest of the page takes others. */
  used: string[];
};

type Rule = {
  has: RegExp;
  not?: RegExp;
  /** What the page opens on: the surface itself, or the room it stands in. */
  lead: "close" | "room";
};

const RULES: Record<string, Rule> = {
  // Materials: the surface comes first.
  keramik: { has: /keramiksp[üu]l|keramikbecken|keramikarbeitsplatte|arbeitsplatte aus keramik/i, lead: "close" },
  naturstein: {
    has: /naturstein|granit|marmor(?!optik)|quarzit|steinplatte|steinarbeitsplatte/i,
    not: /marmoroptik|steinoptik|natursteinboden|natursteinwand|wand aus [a-zäöüß ]*naturstein/i,
    lead: "close",
  },
  edelstahl: {
    has: /edelstahl(arbeits)?platte|edelstahlsp[üu]le|edelstahlbecken|platte aus edelstahl|arbeitsplatte aus edelstahl/i,
    lead: "close",
  },
  "holz-massiv": {
    has: /massivholz(arbeits)?platte|holzarbeitsplatte|holzplatte|eichenplatte|eichenarbeitsplatte|nussbaumplatte|arbeitsplatte aus (eiche|holz|nussbaum)/i,
    not: /esstisch|tischplatte|sideboard|waschtisch|fernsehm[öo]bel|pflanzkasten/i,
    lead: "close",
  },
  "eiche-furnier": {
    has: /furnier|eichenfront|fronten aus (astiger )?eiche|eichenschrank|schrankwand aus (astiger )?eiche|oberschr[äa]nke aus eiche/i,
    lead: "close",
  },
  "lack-matt": { has: /matt lackiert|mattlack|lackfront|matte[nr]? front/i, lead: "close" },
  "innen-auszug": { has: /ausz[uü]g|innenausz|schublade mit|besteckeinsatz/i, lead: "close" },
  // Appliances: the room comes first, then the appliance up close.
  kochfeld: { has: /kochfeld/i, lead: "room" },
  kochfeldabzug: {
    has: /kochfeldabzug|muldenl[üu]ft|tischl[üu]ft|abzug im kochfeld|kochfeld mit (integriertem |mittigem )?abzug/i,
    lead: "close",
  },
  backofen: { has: /backofen|back[öo]fen/i, lead: "room" },
  dampfgarer: { has: /dampfgarer|dampfbackofen/i, lead: "room" },
  kuehlung: { has: /k[üu]hlschrank|weink[üu]hl|k[üu]hlger[äa]t/i, lead: "room" },
  kaffee: { has: /kaffee|siebtr[äa]ger/i, not: /kaffeem[üu]hle/i, lead: "room" },
  "quooker-armatur": { has: /armatur/i, lead: "close" },
};

/** A brand page matches photos that name the brand. */
export function brandRule(name: string): Rule {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return { has: new RegExp(`(^|[^a-zäöüß])${escaped}([^a-zäöüß]|$)`, "i"), lead: "room" };
}

const CLOSE =
  /^(kante|ecke|bedienknebel|b[üu]gelgriff|stangengriff|muschelgriff|griff|knopf|kn[öo]pfe|fugen?|spiegelung|gefr[äa]ste|armatur|baumkante|ge[öo]ffnete|stirnseite|detail|nahaufnahme)|(kante|ecke|detail) (einer|eines|der|des)/i;
const ROOM =
  /k[üu]che([^a-zäöüß]|$)|k[üu]chenzeile|k[üu]cheninsel|kochinsel|(^|[^a-zäöüß])zeile|schrankwand|halbinsel|wohnk[üu]che|(^|[^a-zäöüß])insel/i;

/** What a photo shows, read from its description: a corner or handle, the room, or something between. */
export function kindOf(alt: string): "close" | "room" | "other" {
  if (CLOSE.test(alt)) return "close";
  if (ROOM.test(alt)) return "room";
  return "other";
}

type Found = {
  frame: ProjectFrame;
  project: Project;
  kind: "close" | "room" | "other";
  matched: boolean;
  /** Where the description names the thing: the earlier, the more the photo is about it. */
  at: number;
};

function toStory(found: Found): StoryPhoto {
  return {
    src: found.frame.src,
    srcSet: found.frame.srcSet,
    alt: found.frame.alt,
    href: projectHref(found.project.slug),
    project: found.project.title,
    place: found.project.place || undefined,
    portrait: found.frame.portrait,
  };
}

/**
 * The photo story of one page. `slug` is the page's slug; a brand passes its own rule.
 * Returns an empty story when no photo shows the thing: the page then keeps its plain layout.
 */
export function photoMatch(slug: string, projects: Project[], rule: Rule | undefined = RULES[slug]): PhotoMatch {
  const empty: PhotoMatch = { story: {}, projects: [], detailOf: new Map(), used: [] };
  if (!rule) return empty;

  const perProject = projects
    .filter((project) => project.image && !isCodeGallery(project.slug))
    .map((project) => {
      const cover = photoKey(project.image);
      const seen = new Set<string>([cover]);
      const frames: Found[] = [];
      for (const frame of project.gallery) {
        if (!frame.src || !frame.alt || seen.has(photoKey(frame.src))) continue;
        seen.add(photoKey(frame.src));
        const at = frame.alt.search(rule.has);
        const matched = at >= 0 && !(rule.not?.test(frame.alt) ?? false);
        frames.push({ frame, project, kind: kindOf(frame.alt), matched, at });
      }
      const matched = frames.filter((found) => found.matched);
      // Many photos of the thing count, but only up to a point: a kitchen with one good close-up
      // and the room beats a kitchen where it is mentioned in passing a dozen times.
      const score =
        Math.min(matched.length, 5) +
        (matched.some((found) => found.kind === "close") ? 3 : 0) +
        (matched.some((found) => found.kind === "room") ? 2 : 0) +
        (frames.length >= 6 ? 1 : 0);
      return { project, frames, matched, score };
    })
    .filter((entry) => entry.matched.length > 0)
    .sort((left, right) => right.score - left.score);

  if (perProject.length === 0) return empty;

  const used = new Set<string>();
  const free = (found: Found) => !used.has(photoKey(found.frame.src));
  const take = (found: Found | undefined) => {
    if (found) used.add(photoKey(found.frame.src));
    return found;
  };
  const landscape = (found: Found) => !found.frame.portrait;
  const first = (list: Found[], ...tests: ((found: Found) => boolean)[]) => {
    for (const test of tests) {
      const hit = list.find((found) => free(found) && test(found));
      if (hit) return hit;
    }
    return undefined;
  };

  // Two shots of the same corner say nearly the same thing: side by side they read as a repeat.
  const words = (found: Found) => new Set(found.frame.alt.toLowerCase().split(/[^a-zäöüß]+/).filter((word) => word.length > 3));
  const unlike = (other: Found | undefined) => (found: Found) => {
    if (!other) return true;
    const a = words(found);
    const b = words(other);
    let shared = 0;
    for (const word of a) if (b.has(word)) shared += 1;
    return shared / Math.max(1, Math.min(a.size, b.size)) < 0.5;
  };

  const story: PhotoStory = {};

  // The opener: three photos of the richest kitchen.
  const lead = perProject[0];
  // For the large photo, the ones whose description starts with the thing come first.
  const bySubject = [...lead.matched].sort((left, right) => left.at - right.at);
  const big = take(
    rule.lead === "close"
      ? first(
          bySubject,
          (found) => found.kind === "close" && landscape(found),
          (found) => found.kind !== "room" && landscape(found),
          landscape,
        )
      : first(lead.matched, (found) => found.kind === "room" && landscape(found), landscape),
  );
  if (big) {
    // Beside a surface: the room it lies in and one more detail. Beside a room: two details.
    const wantRoom = rule.lead === "close";
    const sideA = take(
      wantRoom
        ? first(lead.frames, (found) => found.kind === "room" && found.matched, (found) => found.kind === "room")
        : first(lead.matched, (found) => found.kind !== "room", () => true),
    );
    const differs = unlike(sideA);
    const sideB = take(
      first(lead.matched, (found) => found.kind !== "room" && differs(found), differs) ??
        first(
          lead.frames,
          (found) => found.kind === "close" && differs(found),
          (found) => found.kind === "other" && differs(found),
          differs,
          () => true,
        ),
    );
    const sideFill = sideA ?? take(first(lead.frames, (found) => found.kind !== "room", () => true));
    if (sideFill && sideB) {
      story.opener = { big: toStory(big), side: [toStory(sideFill), toStory(sideB)] };
    } else {
      // Not enough photos of this kitchen: give them back.
      for (const found of [big, sideFill, sideB]) if (found) used.delete(photoKey(found.frame.src));
    }
  }

  // The other parts come from other kitchens where possible, so the page shows more than one.
  const rest = story.opener ? [...perProject.slice(1), lead] : perProject;
  const fromRest = (...tests: ((found: Found) => boolean)[]) => {
    for (const test of tests) {
      for (const entry of rest) {
        const hit = entry.matched.find((found) => free(found) && test(found));
        if (hit) return { hit, entry };
      }
    }
    return undefined;
  };

  // A description that starts with the thing is a photo of it; one that names it at the end is not.
  const early = (found: Found) => found.at < 30;
  const band = fromRest(
    (found) => found.kind === "close" && landscape(found) && early(found),
    (found) => found.kind === "other" && landscape(found) && early(found),
    (found) => found.kind === "close" && landscape(found),
    (found) => found.kind === "other" && landscape(found),
  );
  if (band) story.band = toStory(take(band.hit)!);

  // The pair: two photos of one kitchen, ideally not the one of the band.
  const pairEntry =
    rest.find((entry) => entry !== band?.entry && entry.matched.filter(free).length >= 2) ??
    rest.find((entry) => entry.matched.filter(free).length >= 2) ??
    rest.find((entry) => entry !== band?.entry && entry.matched.some(free) && entry.frames.filter(free).length >= 2);
  if (pairEntry) {
    const a = take(first(pairEntry.matched, (found) => found.kind === "room" && landscape(found), landscape, () => true));
    const b = a
      ? take(
          first(pairEntry.matched, (found) => found.kind !== "room", () => true) ??
            first(pairEntry.frames, (found) => found.kind === "close", () => true),
        )
      : undefined;
    if (a && b) story.pair = [toStory(a), toStory(b)];
    else if (a) used.delete(photoKey(a.frame.src));
  }

  const ledger = fromRest((found) => found.kind !== "room", () => true);
  if (ledger) story.ledger = toStory(take(ledger.hit)!);

  // For the project cards: a photo of each kitchen that shows the thing and is not used above.
  const detailOf = new Map<string, ProjectFrame>();
  for (const entry of perProject) {
    // The card stands for the kitchen: the room with the thing in it comes before a corner of it.
    const hit =
      first(
        entry.matched,
        (found) => found.kind === "room" && landscape(found),
        (found) => found.kind === "other" && landscape(found),
        landscape,
        () => true,
      ) ?? entry.matched[0];
    if (hit) detailOf.set(entry.project.slug, hit.frame);
  }

  return { story, projects: perProject.map((entry) => entry.project), detailOf, used: [...used] };
}

/**
 * Opens a category page (worktops, cooking): a room where one of the category's things stands,
 * from a kitchen that none of the cards below shows.
 */
export function matchHero(slugs: string[], projects: Project[]): StoryPhoto | undefined {
  return heroPick(slugs, projects)?.room;
}

/**
 * A hub's area (worktops, cooking) shows what its category page opens on: the same room, and a
 * close-up of the thing from the same kitchen. Without such a room, the first card's photos.
 */
export function matchArea(
  slugs: string[],
  projects: Project[],
  closeUp = false,
): { room: StoryPhoto; close?: StoryPhoto } | undefined {
  // What is only seen from close up (an open drawer, a sink) leads with the photo its own page opens on.
  if (closeUp) {
    for (const slug of slugs) {
      const opener = photoMatch(slug, projects).story.opener;
      if (opener && !opener.big.portrait) return { room: opener.big };
    }
  }
  const pick = heroPick(slugs, projects);
  if (pick) return pick;
  for (const slug of slugs) {
    const tile = matchTile(slug, projects);
    if (tile) return tile;
  }
  return undefined;
}

function photoOf(frame: ProjectFrame, project: Project): StoryPhoto {
  return {
    src: frame.src,
    srcSet: frame.srcSet,
    alt: frame.alt,
    href: projectHref(project.slug),
    project: project.title,
    place: project.place || undefined,
    portrait: Boolean(frame.portrait),
  };
}

function heroPick(slugs: string[], projects: Project[]): { room: StoryPhoto; close?: StoryPhoto } | undefined {
  const matches = slugs.flatMap((slug) => {
    const rule = RULES[slug];
    return rule ? [{ rule, match: photoMatch(slug, projects) }] : [];
  });
  // The kitchens that open the cards' pages are on the cards already.
  const leads = new Set(matches.map((entry) => entry.match.projects[0]?.slug));
  const depth = Math.max(0, ...matches.map((entry) => entry.match.projects.length));
  for (let rank = 1; rank < depth; rank += 1) {
    for (const { rule, match } of matches) {
      const project = match.projects[rank];
      if (!project || leads.has(project.slug)) continue;
      const cover = photoKey(project.image);
      const shows = (candidate: ProjectFrame) =>
        Boolean(candidate.src && candidate.alt) &&
        photoKey(candidate.src) !== cover &&
        rule.has.test(candidate.alt) &&
        !(rule.not?.test(candidate.alt) ?? false);
      const frame = project.gallery.find(
        (candidate) => shows(candidate) && !candidate.portrait && kindOf(candidate.alt) === "room",
      );
      if (frame) {
        // The close-up may show any of the category's things, as long as it is the same kitchen.
        const close =
          project.gallery.find((candidate) => shows(candidate) && kindOf(candidate.alt) === "close") ??
          project.gallery.find(
            (candidate) =>
              Boolean(candidate.src && candidate.alt) &&
              photoKey(candidate.src) !== cover &&
              kindOf(candidate.alt) === "close" &&
              matches.some((entry) => entry.rule.has.test(candidate.alt) && !(entry.rule.not?.test(candidate.alt) ?? false)),
          );
        return { room: photoOf(frame, project), close: close ? photoOf(close, project) : undefined };
      }
    }
  }
  return undefined;
}

/**
 * The card that links to a page shows what the page opens on: the room, and a close-up of the
 * same kitchen set into its corner. Without matching photos the card keeps its CMS image.
 */
/**
 * The photo for a tile at the end of another page: a kitchen where the thing is built in.
 * `taken` holds the photos that page shows already; the photo chosen here joins them.
 */
export function matchTilePhoto(slug: string, projects: Project[], taken: Set<string>): string | undefined {
  const opener = photoMatch(slug, projects).story.opener;
  if (!opener) return undefined;
  const free = [opener.big, ...opener.side].filter((photo) => !photo.portrait && !taken.has(photoKey(photo.src)));
  const photo = free.find((entry) => kindOf(entry.alt) === "room") ?? free[0];
  if (!photo) return undefined;
  taken.add(photoKey(photo.src));
  return photo.src;
}

export function matchTile(slug: string, projects: Project[]): { room: StoryPhoto; close?: StoryPhoto } | undefined {
  const opener = photoMatch(slug, projects).story.opener;
  if (!opener) return undefined;
  const photos = [opener.big, ...opener.side];
  const room =
    photos.find((photo) => !photo.portrait && kindOf(photo.alt) === "room") ??
    photos.find((photo) => !photo.portrait) ??
    opener.big;
  const others = photos.filter((photo) => photo !== room);
  const close = others.find((photo) => kindOf(photo.alt) === "close") ?? others.find((photo) => kindOf(photo.alt) !== "room");
  return { room, close };
}
