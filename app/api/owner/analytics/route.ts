import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'

// GET /api/owner/analytics?slug=some-restaurant-slug
// Returns weekly page visit analytics for a claimed restaurant.
// Only accessible to authenticated users who have an approved claim on that slug.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const admin = createAdminClient()
  const client = admin ?? supabase

  const isAdmin = process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL

  if (!isAdmin) {
    // Verify the user has an approved claim on this restaurant
    const { data: claim } = await client
      .from('claims')
      .select('id')
      .eq('user_id', user.id)
      .eq('restaurant_slug', slug)
      .eq('status', 'approved')
      .maybeSingle()

    if (!claim) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Fetch last 30 days of visit + click events
  const since = new Date()
  since.setDate(since.getDate() - 29)
  since.setHours(0, 0, 0, 0)

  const { data: rows, error } = await client
    .from('restaurant_visits')
    .select('created_at, event_type')
    .eq('restaurant_slug', slug)
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Build per-day maps for the last 30 days — views and clicks separately.
  // Rows written before the event_type column existed default to 'view'.
  const viewsByDay: Record<string, number> = {}
  const clicksByDay: Record<string, number> = {}
  for (let i = 0; i < 30; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    viewsByDay[key] = 0
    clicksByDay[key] = 0
  }

  for (const row of rows ?? []) {
    const day = row.created_at.slice(0, 10)
    const bucket = row.event_type === 'click' ? clicksByDay : viewsByDay
    if (day in bucket) bucket[day]++
  }

  const daily = Object.keys(viewsByDay)
    .sort((a, b) => a.localeCompare(b))
    .map(date => ({ date, visits: viewsByDay[date], clicks: clicksByDay[date] }))

  const totalThisMonth = daily.reduce((s, d) => s + d.visits, 0)
  const clicksThisMonth = daily.reduce((s, d) => s + d.clicks, 0)

  const last7 = daily.slice(-7)
  const thisWeek = last7.reduce((s, d) => s + d.visits, 0)
  const prevWeek = daily.slice(-14, -7).reduce((s, d) => s + d.visits, 0)
  const clicksThisWeek = last7.reduce((s, d) => s + d.clicks, 0)

  // All-time counts (views vs clicks)
  const { count: allTimeViews } = await client
    .from('restaurant_visits')
    .select('id', { count: 'exact', head: true })
    .eq('restaurant_slug', slug)
    .neq('event_type', 'click')

  const { count: allTimeClicks } = await client
    .from('restaurant_visits')
    .select('id', { count: 'exact', head: true })
    .eq('restaurant_slug', slug)
    .eq('event_type', 'click')

  return NextResponse.json({
    daily,
    thisWeek,
    prevWeek,
    totalThisMonth,
    allTime: allTimeViews ?? 0,
    weekChange: prevWeek > 0 ? Math.round(((thisWeek - prevWeek) / prevWeek) * 100) : null,
    clicksThisWeek,
    clicksThisMonth,
    allTimeClicks: allTimeClicks ?? 0,
  })
}
