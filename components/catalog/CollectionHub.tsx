import type { ReactNode } from "react";
import CollectionJsonLd from "@/components/catalog/CollectionJsonLd";
import Questions from "@/components/catalog/Questions";
import { HouseLine } from "@/components/catalog/clusters/parts";
import EditorialCollection from "@/components/catalog/collections/EditorialCollection";
import GeraeteCollection from "@/components/catalog/collections/GeraeteCollection";
import KuechenCollection from "@/components/catalog/collections/KuechenCollection";
import MarkenCollection from "@/components/catalog/collections/MarkenCollection";
import MaterialCollection from "@/components/catalog/collections/MaterialCollection";
import MoebelCollection from "@/components/catalog/collections/MoebelCollection";
import ProjekteCollection from "@/components/catalog/collections/ProjekteCollection";
import RegionenCollection from "@/components/catalog/collections/RegionenCollection";
import type { CollectionExtra } from "@/components/catalog/collections/parts";
import type { CollectionBranch, CollectionHubId } from "@/lib/collection-hubs";
import { presentHub } from "@/lib/collection-present";
import { fetchProjects, fetchSitePage } from "@/lib/catalog-api";
import type { Project } from "@/lib/catalog";
import type { ClusterHouse } from "@/lib/collection-clusters";
import { hubPageSlug } from "@/lib/collection-hubs";
import { devPhoto, resolveDevImage } from "@/lib/dev-images";
import type { PresentedHub } from "@/lib/collection-present";
import type { Locale } from "@/lib/i18n";
import { photoKey } from "@/lib/utils";

export type { CollectionExtra };

/** Hubs about kitchens show photos of real projects; Möbel and Ratgeber keep their own. */
const KITCHEN_HUBS = new Set<CollectionHubId>(["kuechen", "material", "geraete", "marken", "projekte", "regionen"]);

/**
 * A branch card never shows the hero photo again: it takes one of its own
 * spare photos (imageB, imageC) that no other card shows.
 */
function withDistinctHero(hub: PresentedHub): PresentedHub {
  const hero = photoKey(hub.heroImage);
  const shown = new Set([hero, ...hub.branches.map((branch) => photoKey(branch.image))]);
  return {
    ...hub,
    branches: hub.branches.map((branch) => {
      if (photoKey(branch.image) !== hero) return branch;
      const spare = [branch.imageB, branch.imageC].find((src) => src && !shown.has(photoKey(src)));
      if (!spare) return branch;
      shown.add(photoKey(spare));
      return { ...branch, image: spare, srcSet: undefined };
    }),
  };
}

/** FAQ theme in the CMS whose questions close each hub. Projekte and Ratgeber have none. */
const HUB_QUESTIONS: Partial<Record<CollectionHubId, string>> = {
  kuechen: "planung",
  material: "material",
  geraete: "geraete",
  marken: "marken",
  moebel: "moebel",
  regionen: "regionen",
};

/** Heading over the row of built kitchens on a hub. Hubs not listed show no row. */
const HUB_HOUSES: Partial<Record<CollectionHubId, { de: string; en: string }>> = {
  kuechen: { de: "Küchen, die wir gebaut haben", en: "Kitchens we have built" },
  material: { de: "Diese Materialien in gebauten Küchen", en: "These materials in finished kitchens" },
  geraete: { de: "Geräte in gebauten Küchen", en: "Appliances in finished kitchens" },
  marken: { de: "Diese Marken in gebauten Küchen", en: "These brands in finished kitchens" },
};

/**
 * Four built kitchens that belong to the hub: Material shows projects with a material on record
 * and names it, Marken and Geräte show projects with a brand on record (two different sets),
 * Küchen shows the newest. A photo the hub already shows is never used again.
 */
function hubHouses(id: CollectionHubId, projects: Project[], hub: PresentedHub): ClusterHouse[] {
  const shown = new Set(
    [hub.heroImage, hub.visitImage, hub.closeImage, hub.statementImage, ...hub.branches.map((branch) => branch.image)]
      .filter(Boolean)
      .map((src) => photoKey(src)),
  );
  const tags = (project: Project) =>
    id === "material"
      ? project.materials.map((item) => item.name)
      : id === "marken" || id === "geraete"
        ? project.brands.map((item) => item.name)
        : [];
  const free = projects.filter((project) => project.image && !shown.has(photoKey(project.image)));
  const tagged = free.filter((project) => tags(project).length > 0);
  // The Küchen hub shows kitchens the brand and material hubs don't, so the three rows never repeat.
  const untagged = free.filter(
    (project) => project.place && project.brands.length === 0 && project.materials.length === 0,
  );
  const pool =
    id === "kuechen"
      ? untagged.length >= 4
        ? untagged
        : free
      : id === "geraete" && tagged.length >= 8
        ? tagged.slice(4)
        : tagged;

  return pool.slice(0, 4).map((project, index) => ({
    href: `/projekte/${project.slug}`,
    title: project.title,
    meta: (id === "kuechen" ? [project.place, project.year].filter(Boolean) : tags(project).slice(0, 3)).join(" · "),
    image: resolveDevImage(project.image, devPhoto(80 + index, 1200)),
  }));
}

export default async function CollectionHub({
  id,
  locale,
  branches,
  extras,
  extrasTitle,
  children,
}: {
  id: CollectionHubId;
  locale: Locale;
  branches?: CollectionBranch[];
  extras?: CollectionExtra[];
  extrasTitle?: string;
  children?: ReactNode;
}) {
  const [page, projects] = await Promise.all([
    fetchSitePage(hubPageSlug(id)),
    KITCHEN_HUBS.has(id) ? fetchProjects() : Promise.resolve([]),
  ]);
  const hub = withDistinctHero(presentHub(id, locale, branches, page, projects));
  const resolvedExtras = extras?.map((item, index) => ({
    ...item,
    image: resolveDevImage(item.image, devPhoto(40 + index, 1920)),
  }));

  const housesTitle = HUB_HOUSES[id];
  const houses = housesTitle ? hubHouses(id, projects, hub) : [];

  // Every hub closes the same way: what the route adds, built kitchens, the questions, the showroom.
  const depth = (
    <>
      {children}
      {housesTitle && houses.length > 0 ? (
        <div className="bg-paper">
          <HouseLine
            houses={houses}
            title={housesTitle[locale === "en" ? "en" : "de"]}
            more={{ href: "/projekte", label: locale === "en" ? "All projects" : "Alle Projekte" }}
          />
        </div>
      ) : null}
      <Questions theme={HUB_QUESTIONS[id]} title={hub.title} locale={locale} />
    </>
  );

  const layout = { hub, extras: resolvedExtras, extrasTitle, children: depth };

  const render = () => {
    switch (id) {
      case "kuechen":
        return <KuechenCollection hub={hub}>{depth}</KuechenCollection>;
      case "material":
        return <MaterialCollection hub={hub}>{depth}</MaterialCollection>;
      case "geraete":
        return <GeraeteCollection hub={hub}>{depth}</GeraeteCollection>;
      case "moebel":
        return <MoebelCollection hub={hub}>{depth}</MoebelCollection>;
      case "projekte":
        return <ProjekteCollection {...layout} />;
      case "regionen":
        return <RegionenCollection {...layout} />;
      case "marken":
        return <MarkenCollection {...layout} />;
      default:
        return <EditorialCollection {...layout} />;
    }
  };

  return (
    <>
      <CollectionJsonLd
        path={`/${id}`}
        name={hub.title}
        description={hub.lede}
        items={hub.branches}
        locale={locale}
        withBreadcrumb
      />
      {render()}
    </>
  );
}
