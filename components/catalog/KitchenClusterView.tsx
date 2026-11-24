import ClusterPage from "@/components/catalog/clusters/ClusterPage";
import { FarbenOverview } from "@/components/catalog/clusters/Farben";
import FormenHub from "@/components/catalog/clusters/FormenHub";
import InselnHub from "@/components/catalog/clusters/InselnHub";
import type { KitchenCluster, KitchenTopic, Project, SitePage } from "@/lib/catalog";
import { presentCluster } from "@/lib/collection-clusters";
import { colourEntries } from "@/lib/colour-page";
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
  const path = `/kuechen/${cluster.slug}`;
  // The colours have their own overview: one page that takes the chosen colour.
  const colours = cluster.slug === "farben" ? colourEntries(hub, topics, projects) : [];
  if (colours.length > 1) {
    return <FarbenOverview hub={hub} colours={colours} path={path} />;
  }
  // The islands have an overview of their own: three chapters instead of three photo tiles.
  if (cluster.slug === "inseln") {
    return <InselnHub hub={hub} topics={topics} path={path} />;
  }
  // The shapes too: a chapter per shape with BEER's hand sketch beside a built kitchen.
  if (cluster.slug === "formen") {
    return <FormenHub hub={hub} topics={topics} path={path} />;
  }
  return <ClusterPage hub={hub} path={path} />;
}
