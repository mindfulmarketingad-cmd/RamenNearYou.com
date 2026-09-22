import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

// Collector for Content-Security-Policy-Report-Only violation reports.
//
// Currently DORMANT: next.config.mjs no longer sets `report-uri`, because a
// report-only policy makes the browser POST here on every page load for every
// would-be violation, and each POST is a serverless invocation plus a log line.
// The allow-lists have been tuned from what these reports already told us.
//
// The route stays so that pages still cached in the wild with the old header
// get a cheap 204 instead of a 404. It does not log — a straggler report is
// nothing new, and logging it is exactly the cost we removed.
//
// To collect fresh reports (e.g. before switching the policy to enforcing),
// put "report-uri /api/csp-report" back in the CSP, restore the console.warn
// below, read the logs, then take both out again.
export async function POST(request: Request) {
  // Rate limited: unauthenticated and public; caps invocation flooding.
  const limited = checkRateLimit(request, 'csp-report', 30, 60000)
  if (limited) return limited

  return new NextResponse(null, { status: 204 })
}
