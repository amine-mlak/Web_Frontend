export const dynamic = "force-dynamic";

/** Lightweight liveness probe — no CMS, no HTML. Coolify can hit this later. */
export function GET() {
  return new Response("ok", {
    status: 200,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
