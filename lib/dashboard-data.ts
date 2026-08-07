// SERVER-ONLY. Aggregates the analytics table for /dashboard.
//
// Rows are pulled once per range and reduced in JS rather than issuing a
// query per stat — one round trip keeps the page fast, and the volumes here
// (a directory site's event stream over 90 days) stay well inside a single
// paged read.
import { createAdminClient } from './supabase-admin'
import { createLeadsClient } from './leads-supabase'
import { ANALYTICS_TABLE, LEAD_ACTION_EVENTS, type AnalyticsEvent } from './analytics'

export type RangeDays = 7 | 30 | 90

export type EventRow = {
  created_at: string
  event_type: AnalyticsEvent
  path: string | null
  session_id: string | null
  visitor_id: string | null
  listing_slug: string | null
  listing_name: string | null
  city: string | null
  query: string | null
}

export type BusinessRow = {
  slug: string
  name: string
  city: string
  directions: number
  calls: number
  reviews: number
  leadActions: number
  views: number
  total: number
}

export type DashboardData = {
  ok: boolean
  sessions: number
  visitors: number
  leadActions: number
  searches: number
  impressions: number
  /** Real inbound leads from the shared CRM, null when unavailable. Kept
   *  distinct from click-based leadActions — one is a submitted form, the
   *  other is someone tapping "call". */
  leadsReceived: number | null
  actionBreakdown: { label: string; value: number }[]
  daily: { date: string; pageviews: number; leadActions: number }[]
  businesses: BusinessRow[]
  topSearches: { query: string; count: number }[]
}

const EMPTY: DashboardData = {
  ok: false,
  sessions: 0, visitors: 0, leadActions: 0, searches: 0, impressions: 0,
  leadsReceived: null, actionBreakdown: [], daily: [], businesses: [], topSearches: [],
}

const ACTION_LABELS: Record<string, string> = {
  directions_click: 'Directions',
  call_click: 'Phone Calls',
  review_click: 'Review Clicks',
  search: 'Searches',
  listing_view: 'Listing Views',
  pageview: 'Pageviews',
}

export async function getDashboardData(days: RangeDays): Promise<DashboardData> {
  const admin = createAdminClient()
  if (!admin) return EMPTY

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const sinceIso = since.toISOString()

  const { data, error } = await admin
    .from(ANALYTICS_TABLE)
    .select('created_at,event_type,path,session_id,visitor_id,listing_slug,listing_name,city,query')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false })
    .limit(50000)

  if (error) {
    console.error('Dashboard query error:', error.message)
    return EMPTY
  }

  const rows = (data ?? []) as EventRow[]

  const sessions = new Set<string>()
  const visitors = new Set<string>()
  const byAction = new Map<string, number>()
  const byDay = new Map<string, { pageviews: number; leadActions: number }>()
  const byBusiness = new Map<string, BusinessRow>()
  const byQuery = new Map<string, number>()

  let leadActions = 0
  let searches = 0
  let impressions = 0

  // Seed every day in range so the trend line has no gaps on quiet days.
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    byDay.set(d.toISOString().slice(0, 10), { pageviews: 0, leadActions: 0 })
  }

  for (const r of rows) {
    if (r.session_id) sessions.add(r.session_id)
    if (r.visitor_id) visitors.add(r.visitor_id)

    byAction.set(r.event_type, (byAction.get(r.event_type) ?? 0) + 1)

    const isLead = (LEAD_ACTION_EVENTS as string[]).includes(r.event_type)
    if (isLead) leadActions++
    if (r.event_type === 'search') searches++
    if (r.event_type === 'listing_view' || r.event_type === 'pageview') impressions++

    const day = r.created_at.slice(0, 10)
    const bucket = byDay.get(day)
    if (bucket) {
      if (r.event_type === 'listing_view' || r.event_type === 'pageview') bucket.pageviews++
      if (isLead) bucket.leadActions++
    }

    if (r.event_type === 'search' && r.query) {
      const q = r.query.toLowerCase()
      byQuery.set(q, (byQuery.get(q) ?? 0) + 1)
    }

    if (r.listing_slug) {
      let b = byBusiness.get(r.listing_slug)
      if (!b) {
        b = {
          slug: r.listing_slug,
          name: r.listing_name ?? r.listing_slug,
          city: r.city ?? '—',
          directions: 0, calls: 0, reviews: 0, leadActions: 0, views: 0, total: 0,
        }
        byBusiness.set(r.listing_slug, b)
      }
      if (r.listing_name && b.name === b.slug) b.name = r.listing_name
      if (r.city && b.city === '—') b.city = r.city

      if (r.event_type === 'directions_click') { b.directions++; b.leadActions++ }
      else if (r.event_type === 'call_click') { b.calls++; b.leadActions++ }
      else if (r.event_type === 'review_click') { b.reviews++; b.leadActions++ }
      else if (r.event_type === 'listing_view' || r.event_type === 'pageview') b.views++
      b.total++
    }
  }

  return {
    ok: true,
    sessions: sessions.size,
    visitors: visitors.size,
    leadActions,
    searches,
    impressions,
    leadsReceived: await getLeadsReceived(sinceIso),
    actionBreakdown: Array.from(byAction.entries())
      .map(([k, value]) => ({ label: ACTION_LABELS[k] ?? k, value }))
      .sort((a, b) => b.value - a.value),
    daily: Array.from(byDay.entries()).map(([date, v]) => ({ date, ...v })),
    businesses: Array.from(byBusiness.values()).sort((a, b) => b.total - a.total),
    topSearches: Array.from(byQuery.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  }
}

/**
 * Real inbound leads from the shared cross-site CRM (see lib/leads-supabase.ts),
 * filtered to this directory. Returns null rather than 0 when the table can't
 * be reached, so the dashboard can hide the card instead of implying no leads.
 */
async function getLeadsReceived(sinceIso: string): Promise<number | null> {
  try {
    const leads = createLeadsClient()
    const { count, error } = await leads
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('source', 'ramennearyou.com')
      .gte('created_at', sinceIso)
    if (error) return null
    return count ?? 0
  } catch {
    return null
  }
}
