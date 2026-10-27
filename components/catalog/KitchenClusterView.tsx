import ClusterPage from "@/components/catalog/clusters/ClusterPage";
import type { KitchenCluster, KitchenTopic, Project, SitePage } from "@/lib/catalog";
import { presentCluster } from "@/lib/collection-clusters";
import type { Locale } from "@/lib/i18n";

/** Every kitchen world (Farben, Stile, Formen, Inseln, Besondere) shares one overview layout. */
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
  return <ClusterPage hub={hub} />;
}
