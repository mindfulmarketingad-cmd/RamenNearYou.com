import { NextResponse } from 'next/server'
import { getRestaurantBySlug } from '@/lib/restaurants'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'

// QR-code redirect for Google Review Cards: /r/{slug} → the restaurant's
// Google review popup. Routing scans through our domain (instead of encoding
// the Google URL directly in the QR) gives us scan analytics, lets us fix a
// destination without the customer reprinting cards, and leaves the door open
// to a subscription/enforcement model later.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const r = getRestaurantBySlug(slug)
  if (!r) return NextResponse.redirect('https://www.ramennearyou.com', 302)

  // Best-effort scan logging — never block or fail the redirect over it.
  try {
    const db = createAdminClient() ?? await createClient()
    if (db) await db.from('review_card_scans').insert({ restaurant_slug: slug })
  } catch { /* analytics only */ }

  const dest = r.placeId
    ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(r.placeId)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.city} ${r.stateCode}`)}`

  return NextResponse.redirect(dest, 302)
}
