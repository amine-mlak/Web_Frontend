import LocaleLink from "@/components/LocaleLink";
import ProjectFeature from "@/components/catalog/ProjectFeature";
import { fetchProjects } from "@/lib/catalog-api";
import { getRequestLocale } from "@/lib/locale";
import { projectFeature } from "@/lib/project-features";
import type { HomeProjectsContent } from "@/lib/strapi";

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
 * Start page: three kitchens, each shown like an exposé in its own arrangement. The CMS picks
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
    <section aria-labelledby="home-projects" className="bg-paper">
      <div className="px-5 pt-20 sm:px-8 lg:px-gutter lg:pt-28">
        <h2 data-rise="" id="home-projects" className="font-serif text-[32px] md:text-[42px] xl:text-[60px] leading-[1.02] font-medium tracking-[-0.035em] text-ink">
          {copy.title}
        </h2>
        <p className="mt-5 max-w-xl font-sans text-[16px] leading-relaxed text-muted">{copy.text}</p>
      </div>
      {features.map((feature, index) => (
        <ProjectFeature key={feature.href} feature={feature} variant={index % 4} locale={locale} />
      ))}
      <div className="px-5 pb-20 sm:px-8 lg:px-gutter">
        <LocaleLink href="/projekte" className="btn-quiet">
          {copy.all}
        </LocaleLink>
      </div>
    </section>
  );
}
