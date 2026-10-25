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

function refuse(status: number, reason: string, request: Request, body: string) {
  const referer = request.headers.get("referer");
  console.warn(
    `[lead] challenge refused ${status} ${reason} origin=${request.headers.get("origin") ? "set" : "none"} referer=${referer ? "set" : "none"}`,
  );
  return jsonError(status, body);
}

export function GET(request: Request) {
  if (!originAllowed(request)) {
    return refuse(403, "origin", request, "forbidden");
  }
  if (userAgentBlocked(request)) {
    return refuse(403, "user_agent", request, "forbidden");
  }

  const ip = clientIp(request);
  if (
    !rateLimit(
      `challenge:${ip}`,
      leadLimits.CHALLENGE_MAX_PER_IP,
      leadLimits.LEAD_WINDOW_MS,
    )
  ) {
    return refuse(429, "rate_ip", request, "rate_limited");
  }

  try {
    return Response.json(
      { ok: true, challenge: issueChallenge(ip) },
      { headers: noStoreHeaders() },
    );
  } catch {
    return refuse(503, "challenge_secret_missing", request, "unavailable");
  }
}
