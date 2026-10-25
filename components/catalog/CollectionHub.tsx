import type { ReactNode } from "react";
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
import { fetchSitePage } from "@/lib/catalog-api";
import { hubPageSlug } from "@/lib/collection-hubs";
import { devPhoto, resolveDevImage } from "@/lib/dev-images";
import type { Locale } from "@/lib/i18n";

export type { CollectionExtra };

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
  const page = await fetchSitePage(hubPageSlug(id));
  const hub = presentHub(id, locale, branches, page);
  const resolvedExtras = extras?.map((item, index) => ({
    ...item,
    image: resolveDevImage(item.image, devPhoto(40 + index, 1920)),
  }));

  const layout = { hub, extras: resolvedExtras, extrasTitle, children };

  switch (id) {
    case "kuechen":
      return <KuechenCollection hub={hub}>{children}</KuechenCollection>;
    case "material":
      return <MaterialCollection hub={hub}>{children}</MaterialCollection>;
    case "geraete":
      return <GeraeteCollection hub={hub}>{children}</GeraeteCollection>;
    case "moebel":
      return <MoebelCollection hub={hub}>{children}</MoebelCollection>;
    case "projekte":
      return <ProjekteCollection {...layout} />;
    case "regionen":
      return <RegionenCollection {...layout} />;
    case "marken":
      return <MarkenCollection {...layout} />;
    default:
      return <EditorialCollection {...layout} />;
  }
}
