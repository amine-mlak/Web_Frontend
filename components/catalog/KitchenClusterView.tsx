import Link from "next/link";
import CmsImage from "@/components/CmsImage";
import Pill from "@/components/Pill";
import type { KitchenCluster, KitchenTopic, Project } from "@/lib/catalog";
import { TOPIC_NOTES } from "@/lib/kitchen-details";

export default function KitchenClusterView({
  cluster,
  topics,
  projects,
}: {
  cluster: KitchenCluster;
  topics: KitchenTopic[];
  projects: Project[];
}) {
  return (
    <main className="bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <p className="type-eyebrow mb-3">Küchen</p>
          <h1 className="type-h1 text-ink">{cluster.name}</h1>
          <p className="type-intro mt-6">{cluster.intro}</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6">
        {topics.map((topic, index) => {
          const notes = TOPIC_NOTES[topic.slug] ?? [];
          const imageFirst = index % 2 === 1;
          return (
            <article
              key={topic.slug}
              className="grid items-center gap-10 border-b border-line py-16 md:grid-cols-2 md:gap-16 md:py-24"
            >
              <figure className={imageFirst ? "md:order-2" : undefined}>
                <div className="relative aspect-[4/3] overflow-hidden bg-karte">
                  <CmsImage
                    src={topic.image}
                    alt={topic.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </figure>
              <div>
                <p className="type-eyebrow text-muted">{cluster.name}</p>
                <h2 className="type-h2 mt-3 text-ink">
                  <Link
                    href={`/kuechen/${cluster.slug}/${topic.slug}`}
                    className="hover:underline hover:decoration-line hover:underline-offset-4"
                  >
                    {topic.name}
                  </Link>
                </h2>
                {topic.hex ? (
                  <p className="mt-4 flex items-center gap-3">
                    <span
                      className="inline-block h-4 w-4 rounded-full border border-line"
                      style={{ backgroundColor: topic.hex }}
                      aria-hidden
                    />
                    <span className="type-eyebrow text-muted">{topic.hex}</span>
                  </p>
                ) : null}
                <p className="type-body mt-5">{topic.intro}</p>
                {notes.length > 0 ? (
                  <dl className="mt-8 space-y-4">
                    {notes.map((note) => (
                      <div key={note.label}>
                        <dt className="type-eyebrow text-muted">{note.label}</dt>
                        <dd className="type-body mt-1">{note.text}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <p className="mt-8">
                  <Link
                    href={`/kuechen/${cluster.slug}/${topic.slug}`}
                    className="type-nav text-ink underline decoration-line underline-offset-4"
                  >
                    {topic.name} im Detail
                  </Link>
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {projects.length > 0 ? (
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <h2 className="type-h2 text-ink">Gebaute Küchen</h2>
            <ul className="mt-12 space-y-16">
              {projects.map((project) => (
                <li key={project.slug}>
                  <article className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
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
                      <p className="type-body mt-4">{project.intro}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h2 className="type-h2 text-ink">Im Raum entscheiden</h2>
        <p className="type-body mt-5">
          Welche dieser Seiten zu Ihrem Grundriss passt, sehen wir am Aufmaß.
          Bringen Sie Bilder mit, einen Plan brauchen Sie dafür nicht.
        </p>
        <div className="mt-8">
          <Pill href="/beratung" variant="primary">
            {cluster.name} besprechen
          </Pill>
        </div>
      </section>
    </main>
  );
}
