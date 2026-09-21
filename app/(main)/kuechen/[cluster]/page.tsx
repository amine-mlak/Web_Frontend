import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HubPage from "@/components/catalog/HubPage";
import {
  isKitchenCluster,
  KITCHEN_CLUSTERS,
  topicsInCluster,
} from "@/lib/catalog";
import { topicCards } from "@/lib/catalog-cards";
import { fetchKitchenTopics } from "@/lib/catalog-api";

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
  const topics = topicsInCluster(await fetchKitchenTopics(), cluster);
  return (
    <HubPage
      eyebrow="Küchen"
      title={meta.name}
      intro={meta.intro}
      image={topics[0]?.image}
      chips={[
        { href: "/kuechen", label: "Alle Themen" },
        ...KITCHEN_CLUSTERS.map((item) => ({
          href: `/kuechen/${item.slug}`,
          label: item.name,
        })),
      ]}
      activeHref={`/kuechen/${cluster}`}
      items={topicCards(topics)}
    />
  );
}
