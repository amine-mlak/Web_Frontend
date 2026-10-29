import type { Metadata } from "next";
import FaqHub, { faqHubText } from "@/components/FaqHub";
import { getRequestLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";
import { fetchFaqHub } from "@/lib/strapi";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  // The heading and intro on the page, so the search result says what the page says.
  const text = faqHubText(await getRequestLocale());
  return pageMetadata({
    title: `FAQ: ${text.title} | BEER Küchenmanufaktur`,
    description: text.intro,
    path: "/faq",
  });
}

export default async function FaqPage() {
  const locale = await getRequestLocale();
  const { themes, items } = await fetchFaqHub();
  return <FaqHub themes={themes} items={items} locale={locale} />;
}
