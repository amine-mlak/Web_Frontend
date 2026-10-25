import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReferenzPage from "@/components/catalog/ReferenzPage";
import { findBySlug } from "@/lib/catalog";
import { fetchProjects } from "@/lib/catalog-api";
import { getRequestLocale } from "@/lib/locale";
import { brandedTitle, pageMetadata } from "@/lib/seo";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await fetchProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = findBySlug(await fetchProjects(), slug);
  if (!project) {
    return { title: "Projekt | BEER Küchenmanufaktur" };
  }
  return pageMetadata({
    title: brandedTitle(project.title),
    description: project.intro,
    path: `/projekte/${project.slug}`,
    image: project.image,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const projects = await fetchProjects();
  const project = findBySlug(projects, slug);
  if (!project) {
    notFound();
  }

  return (
    <ReferenzPage
      project={project}
      others={projects.filter((item) => item.slug !== project.slug).slice(0, 3)}
      locale={locale}
    />
  );
}
