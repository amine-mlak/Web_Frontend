import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPage from "@/components/catalog/DetailPage";
import { findBySlug } from "@/lib/catalog";
import { topicCards } from "@/lib/catalog-cards";
import { fetchProjects } from "@/lib/catalog-api";

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
  return {
    title: `${project.title} | BEER Küchenmanufaktur`,
    description: project.intro,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findBySlug(await fetchProjects(), slug);
  if (!project) {
    notFound();
  }

  return (
    <DetailPage
      eyebrow="Referenz"
      title={project.title}
      meta={[project.place, project.year].filter(Boolean).join(" · ")}
      intro={project.intro}
      body={project.body}
      image={project.image}
      srcSet={project.srcSet}
      specs={project.specs}
      links={[
        ...project.brands.map((item) => ({
          href: `/marken/${item.slug}`,
          label: item.name,
        })),
        ...project.materials.map((item) => ({
          href: `/material/${item.slug}`,
          label: item.name,
        })),
        ...project.appliances.map((item) => ({
          href: `/geraete/${item.slug}`,
          label: item.name,
        })),
        ...project.regions.map((item) => ({
          href: `/regionen/${item.slug}`,
          label: item.name,
        })),
      ]}
      relatedTitle="Themen dieser Küche"
      related={topicCards(project.topics)}
    />
  );
}
