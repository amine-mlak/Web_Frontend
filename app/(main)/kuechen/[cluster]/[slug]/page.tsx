import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KitchenTopicView from "@/components/catalog/KitchenTopicView";
import {
  findBySlug,
  isKitchenCluster,
  KITCHEN_CLUSTERS,
  projectsForTopic,
  topicsInCluster,
} from "@/lib/catalog";
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
  const clusterMeta = KITCHEN_CLUSTERS.find((item) => item.slug === topic.cluster);
  if (!clusterMeta) {
    notFound();
  }

  return (
    <KitchenTopicView
      cluster={clusterMeta}
      topic={topic}
      siblings={topicsInCluster(topics, topic.cluster).filter(
        (item) => item.slug !== topic.slug,
      )}
      projects={projectsForTopic(projects, topic.slug)}
    />
  );
}
