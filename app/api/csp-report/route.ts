import { NextResponse } from 'next/server'

// Collector for Content-Security-Policy-Report-Only violation reports (set via
// the `report-uri` directive in next.config.mjs). While the CSP is in
// report-only mode nothing is blocked — browsers just POST a JSON report here
// for each thing the target policy *would* have blocked, so we can see what a
// real enforced policy needs to allow before switching it on.
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const report = body?.['csp-report'] ?? body
    // Log the blocked URI + violated directive; kept terse so real violations
    // are easy to spot in the function logs while tuning the policy.
    console.warn(
      '[csp-report]',
      report?.['violated-directive'] ?? report?.effectiveDirective ?? 'unknown',
      '→',
      report?.['blocked-uri'] ?? report?.blockedURL ?? 'unknown',
    )
  } catch {
    // Ignore malformed reports — this endpoint is diagnostic only.
  }
  return new NextResponse(null, { status: 204 })
}
