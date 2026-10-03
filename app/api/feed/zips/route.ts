import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'
import { requireFeedAccess, feedAccessStatus } from '@/lib/feed-access'
import { zipLabel, zipExists } from '@/lib/feed-zips'

export const dynamic = 'force-dynamic'

const MAX_ZIPS = 25

async function client() {
  return createAdminClient() ?? (await createClient())
}

export async function GET() {
  const access = await requireFeedAccess()
  if (!access.ok) {
    return NextResponse.json({ error: access.reason }, { status: feedAccessStatus(access.reason) })
  }

  const db = await client()
  const { data } = await db
    .from('feed_zips')
    .select('zip, label, created_at')
    .eq('user_id', access.userId)
    .order('created_at', { ascending: false })

  return NextResponse.json({ zips: data ?? [] })
}

export async function POST(request: Request) {
  // Rate limited: per-account writes.
  const limited = checkRateLimit(request, 'feed-zips', 20, 600000)
  if (limited) return limited

  const access = await requireFeedAccess()
  if (!access.ok) {
    return NextResponse.json({ error: access.reason }, { status: feedAccessStatus(access.reason) })
  }

  const body = await request.json().catch(() => ({}))
  const zip = String(body.zip ?? '').trim()

  if (!/^[0-9]{5}$/.test(zip)) {
    return NextResponse.json({ error: 'Enter a 5-digit ZIP code' }, { status: 400 })
  }
  // Rejecting an empty ZIP up front beats silently adding one that will only
  // ever render an empty feed.
  if (!zipExists(zip)) {
    return NextResponse.json({ error: 'No ramen listed in that ZIP yet' }, { status: 404 })
  }

  const db = await client()

  const { count } = await db
    .from('feed_zips')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', access.userId)
  if ((count ?? 0) >= MAX_ZIPS) {
    return NextResponse.json({ error: `You can follow up to ${MAX_ZIPS} ZIP codes` }, { status: 400 })
  }

  const label = zipLabel(zip)
  const { error } = await db
    .from('feed_zips')
    .upsert({ user_id: access.userId, zip, label }, { onConflict: 'user_id,zip' })

  if (error) return NextResponse.json({ error: 'Could not save that ZIP' }, { status: 500 })
  return NextResponse.json({ ok: true, zip, label })
}

export async function DELETE(request: Request) {
  const access = await requireFeedAccess()
  if (!access.ok) {
    return NextResponse.json({ error: access.reason }, { status: feedAccessStatus(access.reason) })
  }

  const body = await request.json().catch(() => ({}))
  const zip = String(body.zip ?? '').trim()
  if (!zip) return NextResponse.json({ error: 'Missing zip' }, { status: 400 })

  const db = await client()
  await db.from('feed_zips').delete().eq('user_id', access.userId).eq('zip', zip)

  return NextResponse.json({ ok: true })
}
