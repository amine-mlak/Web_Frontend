import { cmsLarge } from "@/lib/beer-photos";
import type { Project } from "@/lib/catalog";
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
 * fills in.
 */
export function kitchenPhotos(related: Project[], all: Project[], fallback: Photo): KitchenPhotos {
  const real = (project: Project) => !isCodeGallery(project.slug);
  const relatedSlugs = new Set(related.map((project) => project.slug));
  const order = [...related, ...all.filter((project) => !relatedSlugs.has(project.slug))].filter(real);
  const queue: string[] = [];
  const queued = new Set<string>();
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
