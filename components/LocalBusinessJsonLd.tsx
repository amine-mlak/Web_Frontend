import { fetchRegions } from "@/lib/catalog-api";
import { getSiteSettings } from "@/lib/site-settings";
import { fetchHeader } from "@/lib/strapi";

export default async function LocalBusinessJsonLd() {
  const [settings, regions, header] = await Promise.all([getSiteSettings(), fetchRegions(), fetchHeader()]);
  const url = settings.siteUrl;
  const logo = `${url}${header?.wordmark || "/logo.png"}`;
  const address = {
    "@type": "PostalAddress",
    streetAddress: settings.street,
    addressLocality: settings.city,
    postalCode: settings.postalCode,
    addressRegion: settings.region,
    addressCountry: settings.country,
  };
  const telephone = settings.phone.replace(/\s+/g, "-");

  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: settings.siteName,
        legalName: settings.legalName,
        url,
        email: settings.email,
        telephone,
        address,
        sameAs: settings.sameAs,
      },
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": `${url}/#localbusiness`,
        name: settings.siteName,
        description: settings.description,
        url,
        image: settings.shareImage ?? logo,
        logo,
        telephone,
        email: settings.email,
        address,
        ...(settings.latitude !== undefined && settings.longitude !== undefined
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: settings.latitude,
                longitude: settings.longitude,
              },
            }
          : {}),
        openingHoursSpecification: settings.openingHours.map((row) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: row.days,
          opens: row.opens,
          closes: row.closes,
        })),
        areaServed: regions.map((region) => region.name),
        parentOrganization: { "@id": `${url}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
