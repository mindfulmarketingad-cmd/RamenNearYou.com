import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRestaurantBySlug } from '@/lib/restaurants'

// Resolves the signed-in user's saved slugs to display cards server-side.
// Keeps the full restaurants dataset out of the client bundle — the
// /profile page only needs the handful of fields below per saved restaurant,
// not the whole ~8,000-row dataset that lib/restaurants.ts holds in memory.
export async function GET() {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ restaurants: [] })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ restaurants: [] })

  const { data } = await supabase
    .from('saved_restaurants')
    .select('restaurant_slug')
    .eq('user_id', user.id)

  const restaurants = (data ?? [])
    .map((row) => getRestaurantBySlug(row.restaurant_slug))
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .map((r) => ({
      slug: r.slug,
      citySlug: r.citySlug,
      stateSlug: r.stateSlug,
      name: r.name,
      city: r.city,
      stateCode: r.stateCode,
      photo: r.photo,
      rating: r.rating,
    }))

  return NextResponse.json({ restaurants })
}
