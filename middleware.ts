import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Full state slug → 2-letter code (lowercase for URL)
const STATE_SLUG_TO_CODE: Record<string, string> = {
  'alabama': 'al', 'alaska': 'ak', 'arizona': 'az', 'arkansas': 'ar',
  'california': 'ca', 'colorado': 'co', 'connecticut': 'ct', 'delaware': 'de',
  'florida': 'fl', 'georgia': 'ga', 'hawaii': 'hi', 'idaho': 'id',
  'illinois': 'il', 'indiana': 'in', 'iowa': 'ia', 'kansas': 'ks',
  'kentucky': 'ky', 'louisiana': 'la', 'maine': 'me', 'maryland': 'md',
  'massachusetts': 'ma', 'michigan': 'mi', 'minnesota': 'mn', 'mississippi': 'ms',
  'missouri': 'mo', 'montana': 'mt', 'nebraska': 'ne', 'nevada': 'nv',
  'new-hampshire': 'nh', 'new-jersey': 'nj', 'new-mexico': 'nm', 'new-york': 'ny',
  'north-carolina': 'nc', 'north-dakota': 'nd', 'ohio': 'oh', 'oklahoma': 'ok',
  'oregon': 'or', 'pennsylvania': 'pa', 'rhode-island': 'ri', 'south-carolina': 'sc',
  'south-dakota': 'sd', 'tennessee': 'tn', 'texas': 'tx', 'utah': 'ut',
  'vermont': 'vt', 'virginia': 'va', 'washington': 'wa', 'west-virginia': 'wv',
  'wisconsin': 'wi', 'wyoming': 'wy', 'district-of-columbia': 'dc',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const parts = pathname.split('/').filter(Boolean)

  // Only intercept exactly /{city}/{state} — not restaurant sub-pages
  if (parts.length !== 2) return NextResponse.next()

  const [citySlug, stateSlug] = parts
  const stateCode = STATE_SLUG_TO_CODE[stateSlug]
  if (!stateCode) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/find/${citySlug}-${stateCode}`
  return NextResponse.redirect(url, 301)
}

export const config = {
  // Run on all paths except known top-level non-city routes and Next.js internals
  matcher: [
    '/((?!find|api|_next|blog|products|reviews|auth|catering|profile|saved|terms-of-service|privacy-policy|sitemap|robots|images|favicon).*)',
  ],
}
