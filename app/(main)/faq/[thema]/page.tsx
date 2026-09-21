import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FaqHub from "@/components/FaqHub";
import { filterFaqItems } from "@/lib/faq";
import { fetchFaqHub } from "@/lib/strapi";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { themes } = await fetchFaqHub();
  return themes.map((theme) => ({ thema: theme.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ thema: string }>;
}): Promise<Metadata> {
  const { thema } = await params;
  const { themes, items } = await fetchFaqHub();
  const theme = themes.find((entry) => entry.slug === thema);

  if (!theme) {
    return { title: "FAQ | BEER Küchenmanufaktur" };
  }

  const count = filterFaqItems(items, theme.slug).length;

  return {
    title: theme.seoTitle || `FAQ ${theme.name} | BEER Küchenmanufaktur`,
    description:
      theme.seoDescription ||
      `${count} Fragen zu ${theme.name} – Küchenmanufaktur BEER in Wolfersdorf.`,
  };
}

export default async function FaqThemePage({
  params,
}: {
  params: Promise<{ thema: string }>;
}) {
  const { thema } = await params;
  const { themes, items } = await fetchFaqHub();
  const activeTheme = themes.find((theme) => theme.slug === thema);

  if (!activeTheme) {
    notFound();
  }

  return (
    <FaqHub
      themes={themes}
      items={filterFaqItems(items, activeTheme.slug)}
      activeTheme={activeTheme}
    />
  );
}
