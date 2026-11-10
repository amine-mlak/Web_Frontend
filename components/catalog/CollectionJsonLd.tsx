import { chromeCopy, type Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";

/**
 * Structured data for a page that lists other pages: the hubs (/kuechen, /material …),
 * the kitchen world overviews and the category pages. It names the page as a collection
 * and lists every entry it links to, in the order shown.
 */
export default function CollectionJsonLd({
  path,
  name,
  description,
  items,
  locale,
  withBreadcrumb = false,
}: {
  path: string;
  name: string;
  description?: string;
  items: { href?: string; title: string }[];
  locale: Locale;
  /** Hubs have no visible breadcrumb line, so the trail (Home → this page) is added here. */
  withBreadcrumb?: boolean;
}) {
  const url = absoluteUrl(path, locale);
  const entries = items.filter(
    (item): item is { href: string; title: string } => Boolean(item.title && item.href && item.href.startsWith("/")),
  );

  const collection = {
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name,
    ...(description ? { description } : {}),
    url,
    inLanguage: locale,
    ...(entries.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: entries.length,
            itemListElement: entries.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.title,
              url: absoluteUrl(item.href, locale),
            })),
          },
        }
      : {}),
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: chromeCopy[locale].home, item: absoluteUrl("/", locale) },
      { "@type": "ListItem", position: 2, name },
    ],
  };

  const json = {
    "@context": "https://schema.org",
    "@graph": withBreadcrumb ? [collection, breadcrumb] : [collection],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
