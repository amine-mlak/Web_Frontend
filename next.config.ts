import type { NextConfig } from "next";

const strapiUrl =
  process.env.STRAPI_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "https://cms.beer.de";

const strapiHost = new URL(strapiUrl).hostname;

const allowIndexing = process.env.ALLOW_INDEXING === "true";

function frameAncestorsCsp() {
  const origins = new Set<string>(["'self'"]);

  for (const raw of [
    process.env.NEXT_PUBLIC_UMAMI_URL,
    process.env.STRAPI_URL,
    process.env.NEXT_PUBLIC_STRAPI_URL,
  ]) {
    if (!raw) {
      continue;
    }

    try {
      const url = new URL(raw);
      origins.add(url.origin);
      const otherProtocol = url.protocol === "https:" ? "http:" : "https:";
      origins.add(`${otherProtocol}//${url.host}`);
    } catch {
      // Ignore an unusable URL and keep the remaining origins.
    }
  }

  return `frame-ancestors ${[...origins].join(" ")}`;
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
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
        pathname: "/wiki/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/**",
      },
      {
        protocol: "https",
        hostname: "thumb.wikimedia.org",
        pathname: "/wikipedia/**",
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
        source: "/instagram/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          ...robotsHeaders,
        ],
      },
      {
        source: "/brands/:path*",
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
