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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const parts = pathname.split('/').filter(Boolean)

  // Redirect /{city}/{state} → /find/{city}-{stateCode}
  if (parts.length === 2) {
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

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
