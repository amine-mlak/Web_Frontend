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
import { topicMetadata } from "@/lib/collection-topics";
import { getRequestLocale } from "@/lib/locale";

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
  return topicMetadata(topic);
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
  const [locale, topics, projects] = await Promise.all([
    getRequestLocale(),
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

  const inCluster = topicsInCluster(topics, topic.cluster);
  const related = projectsForTopic(projects, topic.slug);
  const houses =
    related.length > 0
      ? related
      : projects
          .filter((project) =>
            project.topics.some((item) => item.cluster === cluster),
          )
          .slice(0, 4);

  return (
    <KitchenTopicView
      cluster={clusterMeta}
      topic={topic}
      topics={inCluster}
      projects={houses}
      locale={locale}
    />
  );
}
