import { restaurants } from '@/lib/restaurants'

// Destinations for printed Google Review Card QR codes (/r/{slug}). That path
// used to be a server route; the 404 page now resolves it from this file
// (components/retired-page-redirect.tsx) so cards already on tables keep
// working.
export const dynamic = 'force-static'

export function GET() {
  return Response.json(Object.fromEntries(restaurants.map((r) => [
    r.slug,
    r.placeId
      ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(r.placeId)}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.city} ${r.stateCode}`)}`,
  ])))
}
