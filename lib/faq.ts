import catalog from "@/lib/faq-data.json";

export type FaqTheme = {
  name: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  order: number;
};

export type FaqEntry = {
  slug: string;
  question: string;
  answer: string;
  showOnHome: boolean;
  order: number;
  themes: FaqTheme[];
};

export const FALLBACK_FAQ_THEMES: FaqTheme[] = catalog.themes.map((theme) => ({
  name: theme.name,
  slug: theme.slug,
  description: theme.description,
  seoTitle: theme.seoTitle,
  seoDescription: theme.seoDescription,
  order: theme.order,
}));

const themeBySlug = new Map(
  FALLBACK_FAQ_THEMES.map((theme) => [theme.slug, theme]),
);

export const FALLBACK_FAQ_ITEMS: FaqEntry[] = catalog.items.map((item) => ({
  slug: item.slug,
  question: item.question,
  answer: item.answer,
  showOnHome: Boolean(item.showOnHome),
  order: item.order,
  themes: item.themes
    .map((slug) => themeBySlug.get(slug))
    .filter((theme): theme is FaqTheme => Boolean(theme)),
}));

export function filterFaqItems(items: FaqEntry[], themeSlug?: string) {
  const sorted = [...items].sort((left, right) => left.order - right.order);
  if (!themeSlug) {
    return sorted;
  }
  return sorted.filter((item) =>
    item.themes.some((theme) => theme.slug === themeSlug),
  );
}

export function homeFaqItems(items: FaqEntry[]) {
  const featured = items.filter((item) => item.showOnHome);
  return filterFaqItems(featured.length > 0 ? featured : items.slice(0, 4));
}
