import { STRAPI_URL } from "@/lib/strapi";

export const runtime = "nodejs";

/**
 * CMS files (logos, brand SVGs, photos without a resized copy, PDFs) under the site's own
 * address. This used to be a rewrite in next.config.ts, but the CMS answers with
 * `Cache-Control: max-age=0` and a rewrite passes that on, so browsers asked again on every
 * page. Strapi gives every upload its own hashed file name, so the file behind a name does not
 * change: browsers may keep it a year, like the resized copies from /cms-opt.
 */

const SAFE_PATH = /^(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+$/;

// Request headers the CMS needs for partial and conditional requests (PDFs, re-checks).
const FORWARD_REQUEST = ["range", "if-modified-since", "if-none-match"];
// Response headers about the file itself; the site adds its own security headers.
const FORWARD_RESPONSE = [
  "content-type",
  "content-length",
  "content-range",
  "accept-ranges",
  "content-disposition",
  "last-modified",
  "etag",
];
// SVG files get their own strict security policy in next.config.ts (headers set there win).

type RouteParams = { path: string[] };

async function serve(request: Request, context: { params: Promise<RouteParams> }) {
  const { path } = await context.params;
  const filePath = path.join("/");
  if (!SAFE_PATH.test(filePath)) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  const headers = new Headers();
  for (const name of FORWARD_REQUEST) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${STRAPI_URL}/uploads/${filePath}`, {
      method: request.method,
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    return new Response("CMS not reachable", { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  const ok = upstream.status === 200 || upstream.status === 206 || upstream.status === 304;
  const out = new Headers();
  for (const name of FORWARD_RESPONSE) {
    const value = upstream.headers.get(name);
    if (value) out.set(name, value);
  }
  // Only a file that is there is kept a year; a missing one is asked for again next time.
  out.set("Cache-Control", ok ? "public, max-age=31536000, immutable" : "no-store");

  return new Response(request.method === "HEAD" || upstream.status === 304 ? null : upstream.body, {
    status: upstream.status,
    headers: out,
  });
}

export const GET = serve;
export const HEAD = serve;
