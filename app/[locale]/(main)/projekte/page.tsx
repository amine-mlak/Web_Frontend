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
  // The newest house opens the page, the next four stand below it.
  const featured = projects.slice(0, 5).map((project) => ({
    href: `/projekte/${project.slug}`,
    title: project.title,
    text: project.intro,
    image: project.image,
    srcSet: project.srcSet,
    alt: project.title,
    meta: [project.place, project.year].filter(Boolean).join(" · "),
  }));
  // All other houses wait in an archive that opens on request and can be narrowed down by style, colour, layout and detail.
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
