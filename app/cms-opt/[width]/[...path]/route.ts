import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { STRAPI_URL } from "@/lib/strapi";

export const runtime = "nodejs";

const ALLOWED_WIDTHS = new Set([1280, 1600, 1920, 2560, 3840]);
const SAFE_PATH = /^(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+$/;
const CACHE_DIR = path.join(process.cwd(), ".next", "cache", "cms-opt");

type RouteParams = { width: string; path: string[] };

export async function GET(
  _request: Request,
  context: { params: Promise<RouteParams> },
) {
  const params = await context.params;
  const width = Number(params.width);
  const filePath = params.path.join("/");

  if (!ALLOWED_WIDTHS.has(width) || !SAFE_PATH.test(filePath)) {
    return new Response("Not found", { status: 404 });
  }

  const cacheFile = path.join(
    CACHE_DIR,
    `${width}-${filePath.replace(/\//g, "_")}.webp`,
  );

  try {
    return imageResponse(await readFile(cacheFile));
  } catch {
    // generate below
  }

  try {
    const source = await fetch(`${STRAPI_URL}/uploads/${filePath}`, {
      signal: AbortSignal.timeout(20_000),
    });

    if (!source.ok) {
      return new Response("Not found", { status: 404 });
    }

    const input = Buffer.from(await source.arrayBuffer());
    // Some CMS originals are huge (e.g. a 14,000 px worktop scan). sharp shrinks
    // JPEGs while decoding, so a high pixel limit stays affordable; a low one
    // sent visitors the full 10 MB original instead.
    const output = await sharp(input, {
      failOn: "none",
      limitInputPixels: 400_000_000,
      sequentialRead: true,
    })
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 90, effort: 4 })
      .toBuffer();

    try {
      await mkdir(path.dirname(cacheFile), { recursive: true });
      await writeFile(cacheFile, output);
    } catch {
      // cache is optional
    }

    return imageResponse(output);
  } catch (error) {
    console.warn(`[cms-opt] serving original for ${filePath}: ${error instanceof Error ? error.message : "unknown"}`);
    return Response.redirect(new URL(`/cms-uploads/${filePath}`, _request.url));
  }
}

function imageResponse(body: Buffer) {
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
