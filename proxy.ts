import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/list', '/claim']

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

// Top-level app sections. The /{city}/{state} rule below matches any two-
// segment path whose second segment is a state slug, which would also swallow
// real routes like /experiences/california (it was rewriting that to
// /find/experiences-ca). Anything with its own directory under app/ and a
// state-shaped child belongs here.
const RESERVED_SECTIONS = new Set([
  'experiences', 'find', 'blog', 'reviews', 'recipes', 'partners', 'collections',
  'comparisons', 'compare', 'menu', 'claim', 'claim-your-listing', 'admin', 'api',
  'auth', 'owner', 'list', 'state', 'search', 'profile', 'dashboard', 'feed',
  'saved', 'products', 'featured', 'featured-listing', 'cities', 'broth', 'authors',
  'ambassador', 'plus', 'catering', 'faq', 'about', 'contact', 'review-cards', 'r',
])

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const parts = pathname.split('/').filter(Boolean)

  // Redirect /{city}/{state} → /find/{city}-{stateCode}
  if (parts.length === 2 && !RESERVED_SECTIONS.has(parts[0])) {
    const [citySlug, stateSlug] = parts
    const stateCode = STATE_SLUG_TO_CODE[stateSlug]
    if (stateCode) {
      const url = request.nextUrl.clone()
      url.pathname = `/find/${citySlug}-${stateCode}`
      return NextResponse.redirect(url, 301)
    }
  }

  // If Supabase env vars aren't configured yet, pass through all requests
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request })
  }

  // No auth cookie means no session, so getUser() below can only ever come
  // back null — and it costs a Supabase round trip on the critical path of
  // every request to find that out. The overwhelming majority of this site's
  // traffic is signed out, so skip straight to the answer.
  //
  // Both branches this short-circuits still behave identically: a PROTECTED
  // path gets redirected to login (no cookie ⇒ no user), and there is no
  // session for the cookie-refresh side effect to refresh.
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith('sb-') && c.name.includes('auth-token'))

  if (!hasAuthCookie) {
    const isProtected = PROTECTED.some((path) => pathname.startsWith(path))
    if (isProtected) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()
    const isProtected = PROTECTED.some(path => request.nextUrl.pathname.startsWith(path))
    if (isProtected && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  } catch {
    // Auth check failed — allow request through rather than crashing the site
  }

  return supabaseResponse
}

// Every path this matches costs a middleware invocation, which Vercel bills and
// meters as an observability event. The excluded API routes are the site's
// highest-volume endpoints by far — fire-and-forget beacons hit on page load —
// and not one of them reads an auth cookie or a state-shaped path, so the
// middleware has nothing to do for them. Everything else still runs it: other
// /api routes keep the session-refresh side effect, and page paths keep the
// /{city}/{state} redirect above.
export const config = {
  // Must stay a single string literal — Next parses this at compile time and
  // rejects a concatenated expression.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/analytics/track|api/track-view|api/track-click|api/csp-report|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json|woff|woff2|ttf|map)$).*)',
  ],
}
