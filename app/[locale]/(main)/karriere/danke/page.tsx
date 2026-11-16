import type { Metadata } from "next";
import ThankYou from "@/components/ThankYou";
import { getRequestLocale } from "@/lib/locale";
import { brandedTitle } from "@/lib/seo";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const en = (await getRequestLocale()) === "en";
  return { title: brandedTitle(en ? "Thank you" : "Danke"), robots: { index: false, follow: false } };
}

/** Thank-you page after a job application (/karriere/danke). Careers speak "Du", as the job ads do. */
export default async function ApplicationThanksPage() {
  const en = (await getRequestLocale()) === "en";
  return (
    <ThankYou
      kind="application"
      eyebrow={en ? "Application" : "Bewerbung"}
      title={en ? "Thank you, {name}." : "Danke, {name}."}
      text={en ? "Your application has reached us. We will get in touch." : "Deine Bewerbung ist bei uns. Wir melden uns bei Dir."}
      nextTitle={en ? "Get to know us" : "Lerne uns kennen"}
      next={[
        { href: "/team", label: en ? "The team" : "Das Team" },
        { href: "/ueber", label: en ? "About BEER" : "Über BEER" },
        { href: "/projekte", label: en ? "What we build" : "Was wir bauen" },
      ]}
    />
  );
}
