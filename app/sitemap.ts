import type { MetadataRoute } from "next";
import {
  articleHref,
  KITCHEN_CLUSTERS,
} from "@/lib/catalog";
import { fetchCatalog, fetchOpenJobs } from "@/lib/catalog-api";
import type { CmsSeo } from "@/lib/cms-seo";
import {
  GERAETE_KIND_ROUTES,
  MATERIAL_KIND_ROUTES,
} from "@/lib/collection-entries";
import { HELPER_PAGES } from "@/lib/helper-pages";
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

/** CMS pages that only forward elsewhere (next.config.ts) and so never belong in the sitemap. */
const FORWARDED = new Set(["kueche-planen"]);

type Entry = { lastModified?: string; seo?: CmsSeo };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!allowSearchIndexing()) {
    return [];
  }

  const pages = new Map<string, Entry>(HUBS.map((path) => [path, {}]));
  const add = (path: string, entry: Entry = {}) => pages.set(path, { ...pages.get(path), ...entry });

  for (const cluster of KITCHEN_CLUSTERS) {
    add(`/kuechen/${cluster.slug}`);
  }
  for (const route of MATERIAL_KIND_ROUTES) {
    add(route.href);
  }
  for (const route of GERAETE_KIND_ROUTES) {
    add(route.href);
  }

  const [catalog, faq] = await Promise.all([
    fetchCatalog(),
    fetchFaqHub(),
  ]);

  const entry = (item: { updatedAt?: string; seo?: CmsSeo }): Entry => ({
    lastModified: item.updatedAt,
    seo: item.seo,
  });

  for (const topic of catalog.topics) {
    add(`/kuechen/${topic.cluster}/${topic.slug}`, entry(topic));
  }
  for (const project of catalog.projects) {
    add(`/projekte/${project.slug}`, entry(project));
  }
  for (const brand of catalog.brands) {
    add(`/marken/${brand.slug}`, entry(brand));
  }
  for (const appliance of catalog.appliances) {
    add(`/geraete/${appliance.slug}`, entry(appliance));
  }
  for (const item of catalog.furniture) {
    add(`/moebel/${item.slug}`, entry(item));
  }
  for (const region of catalog.regions) {
    add(`/regionen/${region.slug}`, entry(region));
  }
  for (const material of catalog.materials) {
    add(`/material/${material.slug}`, entry(material));
  }
  for (const article of catalog.articles) {
    add(articleHref(article), entry(article));
  }
  for (const job of await fetchOpenJobs(catalog.pages.find((page) => page.slug === "karriere"))) {
    add(`/karriere/${job.slug}`);
  }
  for (const page of catalog.pages) {
    if (!page.slug || page.slug === "home" || FORWARDED.has(page.slug)) {
      continue;
    }
    // A helper page (stile, fronten …) feeds another address; that address is listed instead.
    const helper = HELPER_PAGES[page.slug];
    add(helper ?? `/${page.slug}`, entry(page));
  }
  for (const theme of faq.themes) {
    add(`/faq/${theme.slug}`, { seo: theme.seo });
  }

  return [...pages]
    // A page marked "noindex", or one that names another address as the original, stays out.
    .filter(([path, item]) => !item.seo?.noindex && (!item.seo?.canonicalPath || item.seo.canonicalPath === path))
    .map(([path, item]) => ({
      url: absoluteUrl(path),
      ...(item.lastModified ? { lastModified: item.lastModified } : {}),
      changeFrequency: path === "/" ? "weekly" : "monthly",
      alternates: {
        languages: {
          de: absoluteUrl(path, "de"),
          en: absoluteUrl(path, "en"),
        },
      },
    }));
}
