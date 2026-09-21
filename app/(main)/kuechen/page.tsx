import type { Metadata } from "next";
import Link from "next/link";
import CmsImage from "@/components/CmsImage";
import { KITCHEN_CLUSTERS, topicsInCluster } from "@/lib/catalog";
import { fetchKitchenTopics } from "@/lib/catalog-api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Küchen | BEER Küchenmanufaktur",
  description:
    "Küchenformen, Küchenstile, Küchenfarben, Kücheninseln und besondere Küchen – jeweils eine eigene Seite.",
};

export default async function KuechenPage() {
  const topics = await fetchKitchenTopics();

  return (
    <main className="bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <p className="type-eyebrow mb-3">Küchen</p>
          <h1 className="type-h1 text-ink">Fünf Themen, fünf Seiten</h1>
          <p className="type-intro mt-6">
            Formen, Stile, Farben, Inseln und besondere Küchen. Jedes Thema ist
            eine eigene Seite, mit den einzelnen Entscheidungen darunter.
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6">
        {KITCHEN_CLUSTERS.map((cluster) => {
          const first = topicsInCluster(topics, cluster.slug)[0];
          return (
            <article
              key={cluster.slug}
              className="grid items-center gap-8 border-b border-line py-14 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16 md:py-20"
            >
              <figure className="relative aspect-[4/3] overflow-hidden bg-karte">
                <CmsImage
                  src={first?.image || "/kitchens/stile-holz.jpg"}
                  alt={cluster.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </figure>
              <div>
                <h2 className="type-h2 text-ink">
                  <Link
                    href={`/kuechen/${cluster.slug}`}
                    className="hover:underline hover:decoration-line hover:underline-offset-4"
                  >
                    {cluster.name}
                  </Link>
                </h2>
                <p className="type-body mt-4">{cluster.intro}</p>
                <p className="mt-6">
                  <Link
                    href={`/kuechen/${cluster.slug}`}
                    className="type-nav text-ink underline decoration-line underline-offset-4"
                  >
                    {cluster.name} ansehen
                  </Link>
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
