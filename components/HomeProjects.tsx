import LocaleLink from "@/components/LocaleLink";
import ProjectReel from "@/components/ProjectReel";
import { fetchProjects } from "@/lib/catalog-api";
import { getRequestLocale } from "@/lib/locale";
import { projectFeature } from "@/lib/project-features";
import type { HomeProjectsContent } from "@/lib/strapi";

const COPY = {
  de: {
    title: "Aus unseren Projekten",
    text: "Jede Küche ist für ihr Haus geplant und in Wolfersdorf gebaut. Drei davon, ausführlicher.",
    all: "Alle Projekte ansehen",
    row: "Projekte",
    previous: "Vorheriges Projekt",
    next: "Nächstes Projekt",
  },
  en: {
    title: "From our projects",
    text: "Every kitchen is planned for its house and built in Wolfersdorf. Three of them, in more detail.",
    all: "See all projects",
    row: "Projects",
    previous: "Previous project",
    next: "Next project",
  },
} as const;

/**
 * Start page: kitchens as a row of large photos that moves sideways. The CMS picks
 * them; without picks the three newest with a text and a second photo appear.
 */
export default async function HomeProjects({ content }: { content?: HomeProjectsContent | null }) {
  const locale = await getRequestLocale();
  const copy = {
    title: content?.title || COPY[locale].title,
    text: content?.text || COPY[locale].text,
    all: content?.linkLabel || COPY[locale].all,
  };
  const all = await fetchProjects();
  // The kitchens picked in the CMS, in their order. Photos come from the kitchen itself: its
  // cover photo, and the first other photo of its gallery as the detail.
  const picked = (content?.picks ?? []).flatMap((slug) => {
    const project = all.find((item) => item.slug === slug);
    return project ? [projectFeature(project)] : [];
  });
  // Nothing picked: three of the newest that have a text and a second photo.
  const features = picked.length
    ? picked.slice(0, 3)
    : all
        .filter((project) => project.image && project.intro?.trim() && project.gallery.length > 1)
        .slice(0, 3)
        .map((project) => projectFeature(project));
  if (features.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="home-projects" className="bg-paper py-20 lg:py-28">
      <div className="grid gap-5 px-5 sm:px-8 lg:grid-cols-12 lg:items-end lg:gap-16 lg:px-gutter">
        <h2 data-rise="" id="home-projects" className="t-section text-ink lg:col-span-7">
          {copy.title}
        </h2>
        <div className="lg:col-span-5">
          <p className="max-w-md font-sans text-[16px] leading-relaxed text-muted">{copy.text}</p>
          <LocaleLink href="/projekte" className="btn-quiet mt-5">
            {copy.all}
          </LocaleLink>
        </div>
      </div>
      <div className="mt-10 lg:mt-14">
        <ProjectReel
          labels={{ row: COPY[locale].row, previous: COPY[locale].previous, next: COPY[locale].next }}
          items={features.map(({ href, title, meta, intro, image, srcSet }) => ({ href, title, meta, intro, image, srcSet }))}
        />
      </div>
    </section>
  );
}
