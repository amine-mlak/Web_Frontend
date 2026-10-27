import type { MetadataRoute } from "next";
import {
  articleHref,
  KITCHEN_CLUSTERS,
} from "@/lib/catalog";
import { jobsFrom } from "@/lib/careers";
import { fetchCatalog } from "@/lib/catalog-api";
import {
  GERAETE_KIND_ROUTES,
  MATERIAL_KIND_ROUTES,
} from "@/lib/collection-entries";
import { absoluteUrl } from "@/lib/seo";
import { fetchFaqHub } from "@/lib/strapi";
import { allowSearchIndexing } from "@/lib/umami";

const HUBS = [
  "/",
  "/kuechen",
  "/material",
  "/geraete",
  "/moebel",
  "/projekte",
  "/regionen",
  "/marken",
  "/ratgeber",
  "/kueche-planen",
  "/ueber",
  "/team",
  "/nachhaltigkeit",
  "/karriere",
  "/ausstellung",
  "/katalog",
  "/kontakt",
  "/faq",
  "/beratung",
  "/presse",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!allowSearchIndexing()) {
    return [];
  }

  const paths = new Set<string>(HUBS);

  for (const cluster of KITCHEN_CLUSTERS) {
    paths.add(`/kuechen/${cluster.slug}`);
  }
  for (const route of MATERIAL_KIND_ROUTES) {
    paths.add(route.href);
  }
  for (const route of GERAETE_KIND_ROUTES) {
    paths.add(route.href);
  }

  const [catalog, faq] = await Promise.all([
    fetchCatalog(),
    fetchFaqHub(),
  ]);

  for (const topic of catalog.topics) {
    paths.add(`/kuechen/${topic.cluster}/${topic.slug}`);
  }
  for (const project of catalog.projects) {
    paths.add(`/projekte/${project.slug}`);
  }
  for (const brand of catalog.brands) {
    paths.add(`/marken/${brand.slug}`);
  }
  for (const appliance of catalog.appliances) {
    paths.add(`/geraete/${appliance.slug}`);
  }
  for (const item of catalog.furniture) {
    paths.add(`/moebel/${item.slug}`);
  }
  for (const region of catalog.regions) {
    paths.add(`/regionen/${region.slug}`);
  }
  for (const material of catalog.materials) {
    paths.add(`/material/${material.slug}`);
  }
  for (const article of catalog.articles) {
    paths.add(articleHref(article));
  }
  for (const job of jobsFrom(catalog.pages.find((page) => page.slug === "karriere")?.punkte)) {
    paths.add(`/karriere/${job.slug}`);
  }
  for (const page of catalog.pages) {
    if (page.slug && page.slug !== "home") {
      paths.add(`/${page.slug}`);
    }
  }
  for (const theme of faq.themes) {
    paths.add(`/faq/${theme.slug}`);
  }

  return [...paths].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    alternates: {
      languages: {
        de: absoluteUrl(path, "de"),
        en: absoluteUrl(path, "en"),
      },
    },
  }));
}
