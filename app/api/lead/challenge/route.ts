export const dynamic = "force-dynamic";

import {
  clientIp,
  issueChallenge,
  jsonError,
  leadLimits,
  noStoreHeaders,
  originAllowed,
  rateLimit,
  userAgentBlocked,
} from "@/lib/lead-guard";

export function GET(request: Request) {
  if (!originAllowed(request) || userAgentBlocked(request)) {
    return jsonError(403, "forbidden");
  }

  const ip = clientIp(request);
  if (
    !rateLimit(
      `challenge:${ip}`,
      leadLimits.CHALLENGE_MAX_PER_IP,
      leadLimits.LEAD_WINDOW_MS,
    )
  ) {
    return jsonError(429, "rate_limited");
  }

  return Response.json(
    { ok: true, challenge: issueChallenge(ip) },
    { headers: noStoreHeaders() },
  );
}
