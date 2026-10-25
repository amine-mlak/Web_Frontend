import { BesondereCluster } from "@/components/catalog/clusters/Besondere";
import { FarbenCluster } from "@/components/catalog/clusters/Farben";
import { FormenCluster } from "@/components/catalog/clusters/Formen";
import { InselnCluster } from "@/components/catalog/clusters/Inseln";
import { StileCluster } from "@/components/catalog/clusters/Stile";
import type { KitchenCluster, KitchenTopic, Project, SitePage } from "@/lib/catalog";
import { presentCluster } from "@/lib/collection-clusters";
import type { Locale } from "@/lib/i18n";

export default function KitchenClusterView({
  cluster,
  topics,
  projects,
  locale,
  page,
}: {
  cluster: KitchenCluster;
  topics: KitchenTopic[];
  projects: Project[];
  locale: Locale;
  page?: SitePage | null;
}) {
  const hub = presentCluster(cluster.slug, locale, topics, projects, page);

  switch (cluster.slug) {
    case "formen":
      return <FormenCluster hub={hub} />;
    case "farben":
      return <FarbenCluster hub={hub} />;
    case "inseln":
      return <InselnCluster hub={hub} />;
    case "besondere":
      return <BesondereCluster hub={hub} />;
    default:
      return <StileCluster hub={hub} />;
  }
}
