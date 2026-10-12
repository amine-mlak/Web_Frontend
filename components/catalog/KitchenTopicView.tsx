import MagazinePage from "@/components/catalog/hub/MagazinePage";
import type { KitchenCluster, KitchenTopic, Project } from "@/lib/catalog";
import { presentTopic } from "@/lib/collection-topics";
import type { Locale } from "@/lib/i18n";

export default function KitchenTopicView({
  cluster,
  topic,
  topics,
  projects,
  locale,
}: {
  cluster: KitchenCluster;
  topic: KitchenTopic;
  topics: KitchenTopic[];
  projects: Project[];
  locale: Locale;
}) {
  const hub = presentTopic(cluster.slug, topic, locale, topics, projects);
  return <MagazinePage hub={hub} />;
}
