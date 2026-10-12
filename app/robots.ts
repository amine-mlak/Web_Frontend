import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { allowSearchIndexing } from "@/lib/umami";

export default function robots(): MetadataRoute.Robots {
  if (allowSearchIndexing()) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      sitemap: `${siteUrl()}/sitemap.xml`,
    };
  }

  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
