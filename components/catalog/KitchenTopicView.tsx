import { BesondereTopic } from "@/components/catalog/clusters/Besondere";
import { FarbenTopic } from "@/components/catalog/clusters/Farben";
import { FormenTopic } from "@/components/catalog/clusters/Formen";
import { InselnTopic } from "@/components/catalog/clusters/Inseln";
import { StileTopic } from "@/components/catalog/clusters/StileTopics";
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

  switch (cluster.slug) {
    case "formen":
      return <FormenTopic hub={hub} slug={topic.slug} />;
    case "farben":
      return <FarbenTopic hub={hub} slug={topic.slug} />;
    case "inseln":
      return <InselnTopic hub={hub} slug={topic.slug} />;
    case "besondere":
      return <BesondereTopic hub={hub} slug={topic.slug} />;
    default:
      return <StileTopic hub={hub} slug={topic.slug} />;
  }
}
