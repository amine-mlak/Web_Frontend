import type { Project } from "@/lib/catalog";
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

/** `avoid`: photos already on the page (for example the page's hero), never used as the detail. */
export function projectFeature(project: Project, avoid: string[] = []): ProjectFeatureData {
  const skip = new Set([project.image, ...avoid].filter(Boolean).map((src) => photoKey(src)));
  const detail = project.gallery.find((item) => item.src && !skip.has(photoKey(item.src)));
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
    image: project.image,
    srcSet: project.srcSet,
    detail: detail ? { src: detail.src, srcSet: detail.srcSet, alt: detail.alt || project.title } : undefined,
    links,
  };
}
