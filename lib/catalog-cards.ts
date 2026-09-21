import type { CatalogCardItem } from "@/components/catalog/EntryCard";
import type {
  Appliance,
  Article,
  Brand,
  Furniture,
  KitchenCluster,
  KitchenTopic,
  Material,
  Project,
  Region,
} from "@/lib/catalog";

export function projectCards(projects: Project[]): CatalogCardItem[] {
  return projects.map((project) => ({
    href: `/projekte/${project.slug}`,
    title: project.title,
    image: project.image,
    srcSet: project.srcSet,
    meta: [project.place, project.year].filter(Boolean).join(" · "),
    excerpt: project.intro,
  }));
}

export function topicCards(topics: KitchenTopic[]): CatalogCardItem[] {
  return topics.map((topic) => ({
    href: `/kuechen/${topic.cluster}/${topic.slug}`,
    title: topic.name,
    image: topic.image,
    excerpt: topic.intro,
  }));
}

export function clusterCards(clusters: KitchenCluster[]): CatalogCardItem[] {
  return clusters.map((cluster) => ({
    href: `/kuechen/${cluster.slug}`,
    title: cluster.name,
    excerpt: cluster.intro,
    image: "/kitchens/stile-holz.jpg",
  }));
}

export function brandCards(brands: Brand[]): CatalogCardItem[] {
  return brands.map((brand) => ({
    href: `/marken/${brand.slug}`,
    title: brand.name,
    image: brand.image,
    srcSet: brand.srcSet,
    excerpt: brand.intro,
  }));
}

export function applianceCards(items: Appliance[]): CatalogCardItem[] {
  return items.map((item) => ({
    href: `/geraete/${item.slug}`,
    title: item.name,
    image: item.image,
    srcSet: item.srcSet,
    excerpt: item.intro,
  }));
}

export function furnitureCards(items: Furniture[]): CatalogCardItem[] {
  return items.map((item) => ({
    href: `/moebel/${item.slug}`,
    title: item.name,
    image: item.image,
    srcSet: item.srcSet,
    excerpt: item.intro,
  }));
}

export function regionCards(items: Region[]): CatalogCardItem[] {
  return items.map((item) => ({
    href: `/regionen/${item.slug}`,
    title: item.name,
    image: item.image,
    excerpt: item.intro,
  }));
}

export function materialCards(items: Material[]): CatalogCardItem[] {
  return items.map((item) => ({
    href: `/material/${item.slug}`,
    title: item.name,
    image: item.image,
    srcSet: item.srcSet,
    excerpt: item.intro,
  }));
}

export function articleCards(items: Article[]): CatalogCardItem[] {
  return items.map((item) => ({
    href: `/ratgeber/${item.slug}`,
    title: item.title,
    image: item.image,
    srcSet: item.srcSet,
    meta: item.category?.name,
    excerpt: item.description,
  }));
}
