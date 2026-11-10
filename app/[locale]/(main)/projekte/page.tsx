import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import ProjectArchive from "@/components/catalog/ProjectArchive";
import InstagramFeed from "@/components/InstagramFeed";
import { collectionHubMetadata } from "@/lib/collection-hubs";
import { fetchProjects } from "@/lib/catalog-api";
import { getRequestLocale } from "@/lib/locale";
import { projectArchive } from "@/lib/project-archive";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("projekte");
}

export default async function ProjektePage() {
  const locale = await getRequestLocale();
  const projects = await fetchProjects();
  const featured = projects.slice(0, 3).map((project) => ({
    href: `/projekte/${project.slug}`,
    title: project.title,
    text: project.intro,
    image: project.image,
    srcSet: project.srcSet,
    alt: project.title,
    meta: [project.place, project.year].filter(Boolean).join(" · "),
  }));
  // All other houses follow as an archive that can be narrowed down by style, colour, layout and detail.
  const archive = projectArchive(projects, locale, featured.length);

  // The Instagram feed belongs to the homepage and the projects, not to every page.
  return (
    <>
      <CollectionHub
        id="projekte"
        locale={locale}
        branches={featured.length > 0 ? featured : undefined}
      >
        <ProjectArchive houses={archive.houses} groups={archive.groups} locale={locale} />
      </CollectionHub>
      <InstagramFeed />
    </>
  );
}
