import type { Project } from "@/lib/catalog";
import type { ClusterHouse } from "@/lib/collection-clusters";
import { resolveDevImage } from "@/lib/dev-images";

/** Place and year of a kitchen, as the cards show them under its name. */
export function projectMeta(project: Pick<Project, "place" | "year">) {
  return [project.place, project.year].filter(Boolean).join(" · ");
}

/**
 * One kitchen as a card: link, name, cover photo with its sizes, and the line under the name.
 * `fallback` stands in for a missing or stock cover; `meta` replaces place and year.
 */
export function projectHouse(project: Project, options: { fallback?: string; meta?: string } = {}): ClusterHouse {
  const image = options.fallback ? resolveDevImage(project.image, options.fallback) : project.image;
  return {
    href: `/projekte/${project.slug}`,
    title: project.title,
    meta: options.meta ?? projectMeta(project),
    image,
    // The sizes belong to the cover only; a stand-in photo brings none.
    srcSet: image === project.image ? project.srcSet : undefined,
  };
}
