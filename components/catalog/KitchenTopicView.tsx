import Link from "next/link";
import CmsImage from "@/components/CmsImage";
import SpecList from "@/components/catalog/SpecList";
import Pill from "@/components/Pill";
import type { KitchenCluster, KitchenTopic, Project } from "@/lib/catalog";
import { TOPIC_NOTES } from "@/lib/kitchen-details";

function uniqueBySlug<T extends { slug: string; name: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.slug)) {
      return false;
    }
    seen.add(item.slug);
    return true;
  });
}

export default function KitchenTopicView({
  cluster,
  topic,
  siblings,
  projects,
}: {
  cluster: KitchenCluster;
  topic: KitchenTopic;
  siblings: KitchenTopic[];
  projects: Project[];
}) {
  const notes = TOPIC_NOTES[topic.slug] ?? [];
  const materials = uniqueBySlug(projects.flatMap((project) => project.materials));
  const brands = uniqueBySlug(projects.flatMap((project) => project.brands));
  const appliances = uniqueBySlug(projects.flatMap((project) => project.appliances));

  return (
    <main className="bg-paper">
      <article>
        <header className="border-b border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:py-24">
            <div>
              <p className="type-eyebrow mb-3">
                <Link href={`/kuechen/${cluster.slug}`} className="hover:text-ink">
                  {cluster.name}
                </Link>
              </p>
              <h1 className="type-h1 text-ink">{topic.name}</h1>
              {topic.hex ? (
                <p className="mt-5 flex items-center gap-3">
                  <span
                    className="inline-block h-5 w-5 rounded-full border border-line"
                    style={{ backgroundColor: topic.hex }}
                    aria-hidden
                  />
                  <span className="type-eyebrow text-muted">Farbton {topic.hex}</span>
                </p>
              ) : null}
              <p className="type-intro mt-6">{topic.intro}</p>
            </div>
            <figure className="relative aspect-[4/3] overflow-hidden bg-karte">
              <CmsImage
                src={topic.image}
                alt={topic.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </figure>
          </div>
        </header>

        {notes.length > 0 ? (
          <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
            <h2 className="type-h2 text-ink">Worauf es ankommt</h2>
            <dl className="mt-10 divide-y divide-line border-y border-line">
              {notes.map((note) => (
                <div
                  key={note.label}
                  className="grid gap-2 py-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8"
                >
                  <dt className="type-eyebrow text-muted">{note.label}</dt>
                  <dd className="type-body">{note.text}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {projects.length > 0 ? (
          <section className="border-t border-line">
            <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
              <h2 className="type-h2 text-ink">So haben wir es gebaut</h2>
              <div className="mt-12 space-y-20">
                {projects.map((project) => (
                  <article
                    key={project.slug}
                    className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
                  >
                    <figure className="relative aspect-[4/3] overflow-hidden bg-karte">
                      <CmsImage
                        src={project.image}
                        srcSet={project.srcSet}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </figure>
                    <div>
                      <p className="type-eyebrow text-muted">
                        {[project.place, project.year].filter(Boolean).join(" · ")}
                      </p>
                      <h3 className="type-h3 mt-2 text-ink">
                        <Link
                          href={`/projekte/${project.slug}`}
                          className="hover:underline hover:decoration-line hover:underline-offset-4"
                        >
                          {project.title}
                        </Link>
                      </h3>
                      <p className="type-body mt-4">{project.body || project.intro}</p>
                      {project.specs.length > 0 ? (
                        <div className="mt-8">
                          <SpecList items={project.specs} />
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {materials.length + brands.length + appliances.length > 0 ? (
          <section className="border-t border-line">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3 md:py-24">
              <DetailLinks title="Material" items={materials} hrefFor={(slug) => `/material/${slug}`} />
              <DetailLinks title="Marken" items={brands} hrefFor={(slug) => `/marken/${slug}`} />
              <DetailLinks title="Geräte" items={appliances} hrefFor={(slug) => `/geraete/${slug}`} />
            </div>
          </section>
        ) : null}

        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
            <h2 className="type-h2 text-ink">Passt das zu Ihrem Raum?</h2>
            <p className="type-body mt-5">
              {topic.name} ist eine Richtung, kein Katalogblatt. Ob sie in Ihrem
              Grundriss trägt, klären wir am Aufmaß.
            </p>
            <div className="mt-8">
              <Pill href="/beratung" variant="primary">
                {topic.name} besprechen
              </Pill>
            </div>
          </div>
        </section>
      </article>

      {siblings.length > 0 ? (
        <nav aria-label={`Weitere ${cluster.name}`} className="border-t border-line">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
            <h2 className="type-h2 text-ink">Weitere {cluster.name}</h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {siblings.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/kuechen/${cluster.slug}/${item.slug}`}
                    className="grid gap-2 py-5 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8"
                  >
                    <span className="type-h3 text-ink">{item.name}</span>
                    <span className="type-body text-muted">{item.intro}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      ) : null}
    </main>
  );
}

function DetailLinks({
  title,
  items,
  hrefFor,
}: {
  title: string;
  items: { slug: string; name: string }[];
  hrefFor: (slug: string) => string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="type-eyebrow text-muted">{title}</h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={hrefFor(item.slug)}
              className="type-body text-ink underline decoration-line underline-offset-4"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
