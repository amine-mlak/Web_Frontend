import LocaleLink from "@/components/LocaleLink";
import ProjectFeature from "@/components/catalog/ProjectFeature";
import { fetchProjects } from "@/lib/catalog-api";
import { getRequestLocale } from "@/lib/locale";
import { projectFeature } from "@/lib/project-features";

const COPY = {
  de: {
    title: "Aus unseren Projekten",
    text: "Jede Küche ist für ihr Haus geplant und in Wolfersdorf gebaut. Drei davon, ausführlicher.",
    all: "Alle Projekte ansehen",
  },
  en: {
    title: "From our projects",
    text: "Every kitchen is planned for its house and built in Wolfersdorf. Three of them, in more detail.",
    all: "See all projects",
  },
} as const;

/**
 * Start page: three of the newest kitchens, each shown like an exposé in its own arrangement.
 * Only kitchens with a text and a second photo, so each one can be shown properly.
 */
export default async function HomeProjects() {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  const projects = (await fetchProjects())
    .filter((project) => project.image && project.intro?.trim() && project.gallery.length > 1)
    .slice(0, 3);
  if (projects.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="home-projects" className="bg-paper">
      <div className="px-5 pt-20 sm:px-8 lg:px-14 lg:pt-28">
        <h2 id="home-projects" className="font-serif text-[40px] leading-[1.02] font-medium tracking-[-0.035em] text-ink md:text-[56px]">
          {copy.title}
        </h2>
        <p className="mt-5 max-w-xl font-sans text-[17px] leading-relaxed text-muted">{copy.text}</p>
      </div>
      {projects.map((project, index) => (
        <ProjectFeature key={project.slug} feature={projectFeature(project)} variant={index % 4} locale={locale} />
      ))}
      <div className="px-5 pb-20 sm:px-8 lg:px-14">
        <LocaleLink href="/projekte" className="btn-quiet text-ink">
          {copy.all}
        </LocaleLink>
      </div>
    </section>
  );
}
