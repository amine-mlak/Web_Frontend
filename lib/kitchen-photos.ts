import { cmsLarge } from "@/lib/beer-photos";
import type { Project, Region } from "@/lib/catalog";
import type { PresentedCluster } from "@/lib/collection-clusters";
import { resolveDevImage } from "@/lib/dev-images";
import { isCodeGallery } from "@/lib/project-photos";
import { photoKey } from "@/lib/utils";

type Photo = (n: number, width?: number) => string;

export type KitchenPhotos = Photo & {
  /** The page hero: the first related kitchen's photo, or the CMS image when no kitchen is tagged. */
  hero: (cmsImage: string | undefined, width?: number) => string;
  /** A photo not yet used on this page (for replacing a repeat). */
  spare: (width?: number) => string | undefined;
};

/** Slots from here up are sibling cards and house cards, which keep their own photos. */
const OWN_SLOTS_FROM = 60;

/**
 * Photos of real kitchens for one page, in place of the flat photo pool.
 * The projects tagged to the page come first, then the other projects; each
 * photo slot gets the next unused gallery photo, so the photos of one section
 * belong to one kitchen and no photo repeats on the page. Covers are left to
 * the project cards. Old example projects (gallery assembled in code, mixed
 * kitchens) are left out. When the projects run out, `fallback` (the old pool)
 * fills in. `seed` (the page slug) turns the list of other projects to a different starting point
 * for each page, so pages without tagged kitchens do not all show the same photos.
 */
export function kitchenPhotos(
  related: Project[],
  all: Project[],
  fallback: Photo,
  seed?: string,
  /** Photos the page already shows elsewhere (its photo story): never handed out again. */
  skip: string[] = [],
): KitchenPhotos {
  const real = (project: Project) => !isCodeGallery(project.slug);
  const relatedSlugs = new Set(related.map((project) => project.slug));
  const others = all.filter((project) => !relatedSlugs.has(project.slug));
  const order = [...related, ...rotate(others, seed)].filter(real);
  const queue: string[] = [];
  const queued = new Set<string>(skip.map((src) => photoKey(src)));
  for (const project of order) {
    for (const frame of project.gallery) {
      if (!frame.src || queued.has(photoKey(frame.src))) continue;
      queued.add(photoKey(frame.src));
      queue.push(frame.src);
    }
  }

  let next = 0;
  const given = new Map<number, string>();
  const take = () => {
    while (next < queue.length) {
      const src = queue[next++];
      if (src) return src;
    }
    return undefined;
  };

  const photo = ((n: number, width = 1800) => {
    if (n >= OWN_SLOTS_FROM) return fallback(n, width);
    let src = given.get(n);
    if (!src) {
      src = take();
      if (!src) return fallback(n, width);
      given.set(n, src);
    }
    return cmsLarge(src, width);
  }) as KitchenPhotos;
  const hasKitchens = related.some(real);
  photo.hero = (cmsImage, width = 3840) =>
    hasKitchens ? photo(0, width) : resolveDevImage(cmsImage, photo(0, width));
  photo.spare = (width = 1800) => {
    const src = take();
    return src ? cmsLarge(src, width) : undefined;
  };
  return photo;
}

function rotate<T>(items: T[], seed?: string) {
  if (!seed || items.length < 2) return items;
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const start = hash % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

/**
 * Finished kitchens with a cover photo, starting at a different one for each page (`seed`).
 * For pages that have no kitchens of their own to show.
 */
export function kitchenPool(all: Project[], seed?: string) {
  return rotate(
    all.filter((project) => project.image && !isCodeGallery(project.slug)),
    seed,
  );
}

/**
 * The image of a place, but only when it shows a kitchen. Several places carry a wardrobe, a
 * bathroom or an open drawer; a page named "Küchen in …" does not open on those. The media
 * library description decides; an image without one is trusted.
 */
export function kitchenImageOf(region: Region) {
  const alt = region.imageAlt ?? "";
  if (!region.image) return undefined;
  if (!alt) return region.image;
  const kitchen = /küche|kitchen|zeile|insel|schrankwand/i.test(alt);
  const other = /ankleide|schubkasten|schublade|essplatz|\bbad\b/i.test(alt);
  return kitchen && !other ? region.image : undefined;
}

/** The photo that stands for a place: a kitchen built there, else its own kitchen image, else a kitchen from the workshop. */
export function placeCover(region: Region, all: Project[]) {
  const pool = kitchenPool(all, region.slug);
  return (
    coverOf(all, (project) => project.regions.some((entry) => entry.slug === region.slug)) ??
    kitchenImageOf(region) ??
    (pool[4] ?? pool[0])?.image
  );
}

/** The cover of the first project that matches, for a card that links to another topic or place. */
export function coverOf(projects: Project[], matches: (project: Project) => boolean) {
  return projects.find((project) => project.image && matches(project))?.image;
}

/**
 * Last pass over a page: no photo twice. Project cards keep theirs; a later
 * repeat (hero, sections, sibling cards) gets an unused kitchen photo.
 */
export function uniquePagePhotos<T extends PresentedCluster>(page: T, photo: Photo): T {
  const spare = (photo as Partial<KitchenPhotos>).spare;
  if (!spare) return page;
  const used = new Set<string>(page.houses.map((house) => photoKey(house.image)));
  const keep = (src: string, width?: number) => {
    if (!src || !used.has(photoKey(src))) {
      if (src) used.add(photoKey(src));
      return src;
    }
    for (let tries = 0; tries < 20; tries += 1) {
      const other = spare(width);
      if (!other) break;
      if (!used.has(photoKey(other))) {
        used.add(photoKey(other));
        return other;
      }
    }
    return src;
  };
  return {
    ...page,
    heroImage: keep(page.heroImage, 3840),
    statementImage: keep(page.statementImage, 2560),
    statementImageB: keep(page.statementImageB, 1920),
    branches: page.branches.map((branch) => ({
      ...branch,
      image: keep(branch.image, 1920),
      imageB: keep(branch.imageB, 1200),
      imageC: keep(branch.imageC, 1200),
    })),
    filmstrip: page.filmstrip.map((item) => ({ ...item, src: keep(item.src, 1920) })),
    looks: page.looks.map((item) => ({ ...item, src: keep(item.src, 1600) })),
    closeImage: keep(page.closeImage, 2560),
    ledgerImage: keep(page.ledgerImage, 1920),
    visitImage: keep(page.visitImage, 1920),
    siblings: page.siblings.map((sibling) => ({ ...sibling, image: keep(sibling.image, 1100) })),
  };
}
