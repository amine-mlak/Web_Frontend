import type { Project, ProjectFrame } from "@/lib/catalog";
import { photoKey } from "@/lib/utils";

/**
 * A project page as the editor builds it in the CMS, block by block from the top:
 *   1 · Kopf mit Titelfoto (with two detail photos: the three-photo opener)
 *   2 · Eckdaten
 *   3 · Einleitung (text with one or two photos)
 *   4 · Abschnitte (each: heading, text, one or two photos)
 *   5 · Weitere Fotos
 *   6 · Ähnliche Häuser
 *   7 · Schluss mit Foto
 *
 * Until a project is moved into these blocks, `legacyProjectBlocks` builds them from the old fields
 * exactly as the page used to place the photos, so the page looks the same either way.
 */

export type BlockPhoto = ProjectFrame;

export type ProjectSection = {
  heading?: string;
  text: string;
  photo: BlockPhoto;
  /** "Text mit zwei Fotos": a second, smaller photo beside the text. */
  photo2?: BlockPhoto;
};

export type ProjectBlocks = {
  /** "cms" once the project's blocks are filled in the CMS; "legacy" while built from the old fields. */
  source: "cms" | "legacy";
  hero: { photo?: BlockPhoto; detailLeft?: BlockPhoto; detailRight?: BlockPhoto };
  facts: { label: string; value: string }[];
  intro?: ProjectSection;
  sections: ProjectSection[];
  /** Old fields only: texts that found no photo (shown as a text column). */
  textOnly: { lead: boolean; text: string }[];
  morePhotos: BlockPhoto[];
  /** Slugs of the "Ähnliche Häuser", in order. */
  similar: string[];
  close: { title: string; text: string; photo?: BlockPhoto; buttonText: string; buttonHref: string };
};

export const PROJECT_CLOSE = {
  de: {
    title: "Ihr Haus ist keines davon.",
    text: "Die Akte zeigt, was gebaut wurde. Was bei Ihnen entsteht, folgt dem Aufmaß.",
    buttonText: "Ähnliches planen",
    buttonHref: "/beratung",
  },
  en: {
    title: "Your house is none of these.",
    text: "The file shows what was built. What is made for you follows the survey.",
    buttonText: "Plan something similar",
    buttonHref: "/beratung",
  },
} as const;

/** Projects sharing the most themes, materials, brands and places, newest first on a tie. */
export function similarProjects(project: Project, projects: Project[]) {
  const traits = (item: Project) =>
    new Set([
      ...item.topics.map((topic) => `t:${topic.slug}`),
      ...item.materials.map((material) => `m:${material.slug}`),
      ...item.brands.map((brand) => `b:${brand.slug}`),
      ...item.regions.map((region) => `r:${region.slug}`),
    ]);
  const own = traits(project);
  return projects
    .filter((item) => item.slug !== project.slug)
    .map((item) => ({ item, score: [...traits(item)].filter((trait) => own.has(trait)).length }))
    .sort((a, b) => b.score - a.score || Number(b.item.year || 0) - Number(a.item.year || 0))
    .slice(0, 3)
    .map(({ item }) => item);
}

/** The page's blocks: from the CMS when filled there, else built from the old fields. */
export function projectBlocks(project: Project, projects: Project[], locale: "de" | "en"): ProjectBlocks {
  // Blocks written in another language (German blocks on an English page) wait for their translation.
  if (project.blocks && (project.contentLocale || "de") === locale) {
    return project.blocks;
  }
  return legacyProjectBlocks(project, similarProjects(project, projects).map((item) => item.slug), locale);
}

/** Close-ups (an edge, a corner, knobs, an open drawer), told apart by their alt texts. */
const CLOSE_UP = /^(Kante|Ecke|Bedienknebel|Geöffnete?|Eingelassene?|Griff|Griffmulde|Detail|Nahaufnahme|Messerleiste|Armatur|Blick in)/i;

function paragraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * The blocks a project had before the CMS held them: the hero is the title photo, two close-ups from
 * the gallery join it as the opener, the last gallery photo closes the page, the intro and each
 * paragraph stand beside the next gallery photo, and the rest follow below.
 */
export function legacyProjectBlocks(project: Project, similar: string[], locale: "de" | "en"): ProjectBlocks {
  const hero = project.image
    ? { src: project.image, srcSet: project.srcSet, alt: project.title }
    : undefined;
  // The hero photo is not repeated in the gallery, and no photo appears twice.
  const seen = new Set(project.image ? [photoKey(project.image)] : []);
  const gallery = project.gallery.filter((frame) => {
    const key = photoKey(frame.src);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const closeUps = gallery.filter((frame) => CLOSE_UP.test(frame.alt ?? ""));
  const opener = hero && closeUps.length >= 2 ? { left: closeUps[0], right: closeUps[1] } : null;
  if (opener) {
    for (const used of [opener.left, opener.right]) gallery.splice(gallery.indexOf(used), 1);
  }
  const closePhoto = gallery.length > 3 ? gallery.pop()! : undefined;
  const texts = [
    ...(project.intro ? [{ lead: true, text: project.intro }] : []),
    ...paragraphs(project.body).map((text) => ({ lead: false, text })),
  ];
  const story = texts.slice(0, gallery.length).map((item, index) => ({ ...item, photo: gallery[index] }));
  const intro = story[0]?.lead ? { text: story[0].text, photo: story[0].photo } : undefined;
  const sections = story.filter((item) => !item.lead).map((item) => ({ text: item.text, photo: item.photo }));
  const copy = PROJECT_CLOSE[locale];
  return {
    source: "legacy",
    hero: { photo: hero, detailLeft: opener?.left, detailRight: opener?.right },
    facts: project.specs.map((spec) => ({ label: spec.label, value: spec.value })),
    intro,
    sections,
    textOnly: texts.slice(story.length),
    morePhotos: gallery.slice(story.length),
    similar,
    close: { title: copy.title, text: copy.text, photo: closePhoto, buttonText: copy.buttonText, buttonHref: copy.buttonHref },
  };
}
