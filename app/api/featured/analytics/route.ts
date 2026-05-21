import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// POST /api/featured/analytics  { listing_id, event_type: 'view' | 'click' }
export async function POST(request: Request) {
  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ ok: false })

  let body: { listing_id?: string; event_type?: string }
  try { body = await request.json() } catch { return NextResponse.json({ ok: false }) }

  const { listing_id, event_type } = body
  if (!listing_id || !['view', 'click'].includes(event_type ?? '')) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  await admin.from('listing_analytics').insert({ listing_id, event_type })

  return NextResponse.json({ ok: true })
}

// GET /api/featured/analytics?listing_id=xxx  — owner stats
export async function GET(request: Request) {
  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  const { searchParams } = new URL(request.url)
  const listing_id = searchParams.get('listing_id')
  if (!listing_id) return NextResponse.json({ error: 'Missing listing_id' }, { status: 400 })

  const { data, error } = await admin
    .from('listing_analytics')
    .select('event_type, created_at')
    .eq('listing_id', listing_id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = data ?? []
  const views = rows.filter(r => r.event_type === 'view')
  const clicks = rows.filter(r => r.event_type === 'click')

  // Daily views for the last 30 days
  const now = new Date()
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(now.getDate() - 29)

  const dailyMap = new Map<string, { views: number; clicks: number }>()
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo)
    d.setDate(thirtyDaysAgo.getDate() + i)
    dailyMap.set(d.toISOString().slice(0, 10), { views: 0, clicks: 0 })
  }

  for (const r of rows) {
    const day = r.created_at.slice(0, 10)
    const entry = dailyMap.get(day)
    if (!entry) continue
    if (r.event_type === 'view') entry.views++
    else entry.clicks++
  }

  const daily = Array.from(dailyMap.entries()).map(([date, v]) => ({ date, ...v }))

  // Stats
  const totalViews = views.length
  const totalClicks = clicks.length
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0'

  // Active days (days with at least one view)
  const daysWithViews = new Set(views.map(v => v.created_at.slice(0, 10))).size
  const avgDailyViews = daysWithViews > 0 ? (totalViews / daysWithViews).toFixed(1) : '0.0'

  // This week
  const weekAgo = new Date(now)
  weekAgo.setDate(now.getDate() - 6)
  const weekAgoStr = weekAgo.toISOString().slice(0, 10)
  const viewsThisWeek = views.filter(v => v.created_at.slice(0, 10) >= weekAgoStr).length
  const clicksThisWeek = clicks.filter(v => v.created_at.slice(0, 10) >= weekAgoStr).length

  return NextResponse.json({
    totalViews,
    totalClicks,
    ctr,
    avgDailyViews,
    viewsThisWeek,
    clicksThisWeek,
    daily,
  })
}
