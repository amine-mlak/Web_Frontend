"use strict";

/**
 * Community Strapi only. Copy into the CMS app (Coolify) or run
 * scripts/strapi-enable-documentation.js inside the container.
 *
 * After restart: OpenAPI is public at /documentation (no login).
 */
module.exports = ({ env }) => ({
  documentation: {
    enabled: true,
    config: {
      restrictedAccess: false,
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "BEER CMS API",
        description:
          "OpenAPI for the self-hosted Community Strapi of BEER Küchenmanufaktur.",
        contact: {
          name: "BEER Küchenmanufaktur",
          url: env("PUBLIC_URL", "https://www.beer.de"),
        },
      },
      "x-strapi-config": {
        plugins: [],
        path: "/documentation",
      },
    },
  },
});
