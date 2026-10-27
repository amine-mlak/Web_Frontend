import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ApplicationForm from "@/components/careers/ApplicationForm";
import LocaleLink from "@/components/LocaleLink";
import RichText from "@/components/RichText";
import { employmentType, jobKindLabel, jobsFrom, type Job } from "@/lib/careers";
import { fetchSitePage } from "@/lib/catalog-api";
import { getRequestLocale } from "@/lib/locale";
import { brandedTitle, pageMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

export const revalidate = 120;
export const dynamicParams = true;

const COPY = {
  de: { back: "Alle Stellen", eyebrow: "Karriere", apply: "Bewirb Dich", applyText: "Ein paar Angaben reichen. Deine Bewerbung geht direkt an Christian Beer." },
  en: { back: "All positions", eyebrow: "Careers", apply: "Apply", applyText: "A few details are enough. Your application goes straight to Christian Beer." },
} as const;

async function loadJobs() {
  const page = await fetchSitePage("karriere");
  return { jobs: jobsFrom(page?.punkte), updatedAt: page?.updatedAt };
}

export async function generateStaticParams() {
  return (await loadJobs()).jobs.map((job) => ({ stelle: job.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ stelle: string }> }): Promise<Metadata> {
  const { stelle } = await params;
  const job = (await loadJobs()).jobs.find((item) => item.slug === stelle);
  if (!job) {
    return { title: brandedTitle("Karriere") };
  }
  return pageMetadata({
    title: brandedTitle(`${job.title} in Wolfersdorf`),
    description: job.teaser || undefined,
    path: `/karriere/${job.slug}`,
  });
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Google wants the ad text as simple HTML; headings, lists and paragraphs are enough. */
function adHtml(job: Job) {
  const inline = (text: string) =>
    escapeHtml(text)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  const blocks = [job.teaser, job.body].join("\n\n").split(/\n\s*\n/);
  return blocks
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const heading = block.match(/^#{1,6}\s+(.*)$/);
      if (heading) return `<h3>${inline(heading[1])}</h3>`;
      const lines = block.split("\n");
      if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
        return `<ul>${lines.map((line) => `<li>${inline(line.replace(/^\s*[-*]\s+/, ""))}</li>`).join("")}</ul>`;
      }
      return `<p>${inline(lines.join(" "))}</p>`;
    })
    .join("");
}

export default async function JobPage({ params }: { params: Promise<{ stelle: string }> }) {
  const { stelle } = await params;
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  const [{ jobs, updatedAt }, settings] = await Promise.all([loadJobs(), getSiteSettings()]);
  const job = jobs.find((item) => item.slug === stelle);
  if (!job) {
    // An ad that was taken down (or renamed) leads back to the open positions.
    redirect("/karriere#stellen");
  }

  const posting = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: adHtml(job),
    datePosted: (updatedAt ?? new Date().toISOString()).slice(0, 10),
    employmentType: employmentType(job.kind),
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: settings.siteName,
      sameAs: settings.siteUrl,
      logo: `${settings.siteUrl}/beer-wordmark.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.street,
        addressLocality: settings.city,
        postalCode: settings.postalCode,
        addressRegion: settings.region,
        addressCountry: settings.country,
      },
    },
  };

  return (
    <main className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(posting).replace(/</g, "\\u003c") }}
      />
      <article className="px-5 pt-12 pb-20 sm:px-8 lg:px-14 lg:pt-16">
        <LocaleLink href="/karriere#stellen" className="btn-quiet text-ink">
          {copy.back}
        </LocaleLink>
        <p className="mt-12 type-eyebrow text-gold">
          {copy.eyebrow} · {jobKindLabel(job.kind, locale)}
        </p>
        <h1 className="mt-4 max-w-4xl font-serif text-[40px] leading-[1.05] font-medium tracking-[-0.03em] text-ink sm:text-[56px]">
          {job.title}
        </h1>
        {job.teaser ? (
          <p className="mt-6 max-w-2xl font-sans text-[19px] leading-relaxed font-light text-muted">{job.teaser}</p>
        ) : null}
        <RichText source={job.body} className="mt-14 max-w-2xl" />
      </article>
      <section id="bewerbung" className="scroll-mt-24 bg-karte px-5 py-20 sm:px-8 md:py-24 lg:px-14" aria-labelledby="bewerbung-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="bewerbung-title" className="font-serif text-[34px] leading-tight font-medium tracking-[-0.02em] text-ink md:text-[40px]">
              {copy.apply}
            </h2>
            <p className="mt-5 max-w-sm font-sans text-[16px] leading-relaxed text-muted">{copy.applyText}</p>
          </div>
          <div className="lg:col-span-8">
            <ApplicationForm jobs={jobs.map(({ slug, title }) => ({ slug, title }))} selected={job.slug} />
          </div>
        </div>
      </section>
    </main>
  );
}
