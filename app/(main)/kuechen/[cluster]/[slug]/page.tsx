import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPage from "@/components/catalog/DetailPage";
import {
  findBySlug,
  isKitchenCluster,
  KITCHEN_CLUSTERS,
  projectsForTopic,
} from "@/lib/catalog";
import { projectCards } from "@/lib/catalog-cards";
import { fetchKitchenTopics, fetchProjects } from "@/lib/catalog-api";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  const topics = await fetchKitchenTopics();
  return topics.map((topic) => ({
    cluster: topic.cluster,
    slug: topic.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cluster: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, cluster } = await params;
  const topic = findBySlug(await fetchKitchenTopics(), slug);
  if (!topic || topic.cluster !== cluster) {
    return { title: "Küchen | BEER Küchenmanufaktur" };
  }
  return {
    title: `${topic.name} | BEER Küchenmanufaktur`,
    description: topic.intro,
  };
}

export default async function KitchenTopicPage({
  params,
}: {
  params: Promise<{ cluster: string; slug: string }>;
}) {
  const { cluster, slug } = await params;
  if (!isKitchenCluster(cluster)) {
    notFound();
  }
  const [topics, projects] = await Promise.all([
    fetchKitchenTopics(),
    fetchProjects(),
  ]);
  const topic = findBySlug(topics, slug);
  if (!topic || topic.cluster !== cluster) {
    notFound();
  }
  const related = projectsForTopic(projects, topic.slug);

  const clusterName =
    KITCHEN_CLUSTERS.find((item) => item.slug === topic.cluster)?.name ||
    topic.cluster;

  return (
    <DetailPage
      eyebrow={clusterName}
      title={topic.name}
      intro={topic.intro}
      image={topic.image}
      relatedTitle="Referenzen zu diesem Thema"
      related={projectCards(related)}
      ctaLabel="Küche in diesem Thema planen"
    />
  );
}
