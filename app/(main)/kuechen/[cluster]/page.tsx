import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KitchenClusterView from "@/components/catalog/KitchenClusterView";
import {
  isKitchenCluster,
  KITCHEN_CLUSTERS,
  topicsInCluster,
} from "@/lib/catalog";
import { fetchKitchenTopics, fetchProjects } from "@/lib/catalog-api";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  return KITCHEN_CLUSTERS.map((cluster) => ({ cluster: cluster.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cluster: string }>;
}): Promise<Metadata> {
  const { cluster } = await params;
  const entry = KITCHEN_CLUSTERS.find((item) => item.slug === cluster);
  if (!entry) {
    return { title: "Küchen | BEER Küchenmanufaktur" };
  }
  return { title: entry.seoTitle, description: entry.seoDescription };
}

export default async function KitchenClusterPage({
  params,
}: {
  params: Promise<{ cluster: string }>;
}) {
  const { cluster } = await params;
  if (!isKitchenCluster(cluster)) {
    notFound();
  }
  const meta = KITCHEN_CLUSTERS.find((item) => item.slug === cluster);
  if (!meta) {
    notFound();
  }
  const [topics, projects] = await Promise.all([
    fetchKitchenTopics(),
    fetchProjects(),
  ]);
  const inCluster = topicsInCluster(topics, cluster);
  const slugs = new Set(inCluster.map((topic) => topic.slug));
  const related = projects.filter((project) =>
    project.topics.some((topic) => slugs.has(topic.slug)),
  );

  return (
    <KitchenClusterView
      cluster={meta}
      topics={inCluster}
      projects={related}
    />
  );
}
