import type { Project, ProjectFrame } from "@/lib/catalog";
import { kindOf } from "@/lib/photo-match";
import { photoKey } from "@/lib/utils";

/** One kitchen shown like an exposé: photo, a detail photo, its text and the pages it connects to. */
export type ProjectFeatureData = {
  href: string;
  title: string;
  meta: string;
  intro: string;
  image: string;
  srcSet?: string;
  detail?: { src: string; srcSet?: string; alt: string };
  /** The pages this kitchen connects to: its region, materials, brands, appliances. */
  links: { href: string; label: string }[];
};

/** The project text up to about 320 characters, ending at a sentence. */
function shortIntro(text: string) {
  const plain = text.replace(/[#*_>`]/g, "").replace(/\s+/g, " ").trim();
  if (plain.length <= 320) return plain;
  const cut = plain.slice(0, 320);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  return end > 120 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(" "))} …`;
}

/**
 * `avoid`: photos already on the page (for example the page's hero), never shown again.
 * `prefer`: a photo of this kitchen that shows what the page is about. A wide photo of the room
 * leads the card and the project's cover moves to the detail; any other one becomes the detail.
 */
export function projectFeature(project: Project, avoid: string[] = [], prefer?: ProjectFrame): ProjectFeatureData {
  const onPage = new Set(avoid.filter(Boolean).map((src) => photoKey(src)));
  const cover = photoKey(project.image);
  const fits = prefer?.src && !onPage.has(photoKey(prefer.src)) && photoKey(prefer.src) !== cover ? prefer : undefined;
  const lead = fits && !fits.portrait && kindOf(fits.alt) === "room" ? fits : undefined;
  const skip = new Set([...onPage, cover, ...(lead ? [photoKey(lead.src)] : [])]);
  const detail =
    (lead && !onPage.has(cover) ? { src: project.image, srcSet: project.srcSet, alt: project.title } : undefined) ??
    (fits && !lead ? fits : undefined) ??
    project.gallery.find((item) => item.src && !skip.has(photoKey(item.src)));
  const links = [
    ...project.regions.slice(0, 1).map((item) => ({ href: `/regionen/${item.slug}`, label: item.name })),
    ...project.materials.slice(0, 2).map((item) => ({ href: `/material/${item.slug}`, label: item.name })),
    ...project.brands.slice(0, 2).map((item) => ({ href: `/marken/${item.slug}`, label: item.name })),
    ...project.appliances.slice(0, 1).map((item) => ({ href: `/geraete/${item.slug}`, label: item.name })),
  ].slice(0, 5);
  return {
    href: `/projekte/${project.slug}`,
    title: project.title,
    meta: [project.place, project.year].filter(Boolean).join(" · "),
    intro: shortIntro(project.intro),
    image: lead?.src ?? project.image,
    srcSet: lead ? lead.srcSet : project.srcSet,
    detail: detail ? { src: detail.src, srcSet: detail.srcSet, alt: detail.alt || project.title } : undefined,
    links,
  };
}
