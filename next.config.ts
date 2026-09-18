import type { NextConfig } from "next";

const strapiUrl =
  process.env.STRAPI_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://strapi-2p2cktq4f2aqoklpusgyfdqt.217.160.8.26.sslip.io";

const strapiHost = new URL(strapiUrl).hostname;

const allowIndexing = process.env.ALLOW_INDEXING === "true";

function frameAncestorsCsp() {
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
  if (!umamiUrl) {
    return "frame-ancestors 'self'";
  }

  try {
    return `frame-ancestors 'self' ${new URL(umamiUrl).origin}`;
  } catch {
    return "frame-ancestors 'self'";
  }
}

const robotsHeaders = allowIndexing
  ? []
  : [
      {
        key: "X-Robots-Tag",
        value: "noindex, nofollow, noarchive, nosnippet",
      },
    ];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [75, 90],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      {
        protocol: "http",
        hostname: strapiHost,
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: strapiHost,
        pathname: "/uploads/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/cms-uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          ...robotsHeaders,
        ],
      },
      {
        source: "/kitchens/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          ...robotsHeaders,
        ],
      },
      {
        source: "/cms-opt/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          ...robotsHeaders,
        ],
      },
      {
        source: "/llms.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/markdown; charset=utf-8",
          },
          ...robotsHeaders,
        ],
      },
      {
        source: "/",
        headers: [
          {
            key: "Content-Security-Policy",
            value: frameAncestorsCsp(),
          },
          ...robotsHeaders,
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: frameAncestorsCsp(),
          },
          ...robotsHeaders,
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/cms-uploads/:path*",
        destination: `${strapiUrl.replace(/\/$/, "")}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
