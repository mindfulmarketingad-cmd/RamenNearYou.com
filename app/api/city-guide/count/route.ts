import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// Real purchase count for the city-guide social proof line, last 30 days.
// Counts buyers only (paid/fulfilled), not captured-but-abandoned emails, so
// the number on the page means what it says.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const citySlug = searchParams.get('citySlug')?.trim()

  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ count: 0 })

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  let query = admin
    .from('city_guide_orders')
    .select('id', { count: 'exact', head: true })
    .in('status', ['paid', 'fulfilled'])
    .gte('created_at', since)

  // Per-city on city pages; site-wide everywhere else.
  if (citySlug) query = query.eq('city_slug', citySlug)

  const { count, error } = await query
  if (error) {
    console.error('City guide count error:', error.message)
    return NextResponse.json({ count: 0 })
  }

  return NextResponse.json({ count: count ?? 0 })
}
