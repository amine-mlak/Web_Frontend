import { siteUrl } from "@/lib/seo";

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Badendorf 6",
  addressLocality: "Wolfersdorf",
  postalCode: "85395",
  addressRegion: "Bayern",
  addressCountry: "DE",
} as const;

export default function LocalBusinessJsonLd() {
  const url = siteUrl();
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: "BEER Küchenmanufaktur",
        legalName: "BEER GmbH",
        url,
        email: "info@beer.de",
        telephone: "+49-8168-909910",
        address: ADDRESS,
        sameAs: ["https://www.instagram.com/beer.kuechen/"],
      },
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": `${url}/#localbusiness`,
        name: "BEER Küchenmanufaktur",
        url,
        image: `${url}/beer-wordmark.png`,
        logo: `${url}/beer-wordmark.png`,
        telephone: "+49-8168-909910",
        email: "info@beer.de",
        address: ADDRESS,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "09:00",
            closes: "14:00",
          },
        ],
        areaServed: [
          "Freising",
          "München",
          "Erding",
          "Pfaffenhofen",
          "Landshut",
          "Dachau",
        ],
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
