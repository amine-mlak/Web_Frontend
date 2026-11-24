import type { KitchenTopic, Project } from "@/lib/catalog";
import type { ClusterHouse, PresentedCluster } from "@/lib/collection-clusters";
import { projectHouse } from "@/lib/project-card";
import { photoKey } from "@/lib/utils";

/** One colour as the Küchenfarben overview shows it: its own texts, photo and kitchens. */
export type ColourEntry = {
  slug: string;
  href: string;
  name: string;
  hex: string;
  /** Whether text on this colour is dark. */
  light: boolean;
  intro: string;
  image: string;
  count: number;
  statement: string;
  note: string;
  /** The first paragraph of the colour's reading text. */
  reading: string;
  closeTitle: string;
  closeText: string;
  houses: ClusterHouse[];
};

/** Whether text on this colour should be dark (same rule as the colour switcher on the start page). */
export function isLightColour(hex: string) {
  const raw = hex.replace("#", "");
  const full = raw.length === 3 ? raw.replace(/./g, "$&$&") : raw;
  const [red, green, blue] = [0, 2, 4].map((at) => parseInt(full.slice(at, at + 2), 16) / 255);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55;
}

/**
 * The colours of the overview, each with the texts of its own CMS entry and three kitchens built
 * in it. A kitchen is shown under one colour only, and never the kitchen of the colour's own photo.
 */
export function colourEntries(hub: PresentedCluster, topics: KitchenTopic[], projects: Project[]): ColourEntry[] {
  const used = new Set<string>();
  return hub.branches.flatMap((branch) => {
    const slug = branch.href?.split("/").pop() ?? "";
    const topic = topics.find((item) => item.slug === slug);
    const image = branch.cover || branch.image;
    if (!topic || !branch.hex || !branch.href || !image) {
      return [];
    }
    const built = projects.filter((project) => project.image && project.topics.some((item) => item.slug === slug));
    const fresh = built.filter((project) => photoKey(project.image) !== photoKey(image) && !used.has(project.slug));
    const picked = [...fresh, ...built.filter((project) => !fresh.includes(project))].slice(0, 3);
    for (const project of picked) used.add(project.slug);
    const reading =
      (topic.lesetext ?? "")
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .find((part) => part && !part.startsWith("## ")) ?? "";
    return [
      {
        slug,
        href: branch.href,
        name: branch.title,
        hex: branch.hex,
        light: isLightColour(branch.hex),
        intro: branch.text ?? "",
        image,
        count: branch.count ?? built.length,
        statement: topic.aussage ?? "",
        note: topic.hinweis ?? "",
        reading,
        closeTitle: topic.schlussTitel || hub.closeTitle,
        closeText: topic.schlussText || hub.closeText,
        houses: picked.map((project) => projectHouse(project)),
      },
    ];
  });
}
