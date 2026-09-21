import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'

// Thumbs up / down on a restaurant listing.
//
// Tallies are public, but casting a vote needs an account: the table's unique
// (user_id, restaurant_slug) constraint is what stops one person from running
// a listing's score up or down by clicking repeatedly.

export const dynamic = 'force-dynamic'

interface Tally {
  up: number
  down: number
}

async function tallyFor(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  slugs: string[]
): Promise<Record<string, Tally>> {
  const out: Record<string, Tally> = {}
  for (const s of slugs) out[s] = { up: 0, down: 0 }

  const { data, error } = await supabase.rpc('restaurant_vote_tallies', { slugs })
  if (error || !Array.isArray(data)) return out

  for (const row of data as { restaurant_slug: string; up: number; down: number }[]) {
    out[row.restaurant_slug] = { up: Number(row.up) || 0, down: Number(row.down) || 0 }
  }
  return out
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slugs = (searchParams.get('slugs') ?? searchParams.get('slug') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50)

  if (slugs.length === 0) {
    return NextResponse.json({ error: 'slug(s) required' }, { status: 400 })
  }

  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ tallies: {}, myVotes: {} })

  const tallies = await tallyFor(supabase, slugs)

  // Logged-out visitors still see the counts, just with no vote of their own.
  let myVotes: Record<string, number> = {}
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data } = await supabase
      .from('restaurant_votes')
      .select('restaurant_slug, vote')
      .eq('user_id', user.id)
      .in('restaurant_slug', slugs)
    myVotes = Object.fromEntries((data ?? []).map((r) => [r.restaurant_slug, r.vote]))
  }

  return NextResponse.json({ tallies, myVotes })
}

export async function POST(request: Request) {
  // Rate limited: public counters; generous because changing your mind is normal.
  const limited = checkRateLimit(request, 'votes', 60, 60000)
  if (limited) return limited

  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
  const vote = body.vote

  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  if (vote !== 1 && vote !== -1 && vote !== 0) {
    return NextResponse.json({ error: 'vote must be 1, -1, or 0' }, { status: 400 })
  }

  if (vote === 0) {
    // Clicking your own vote again clears it.
    await supabase
      .from('restaurant_votes')
      .delete()
      .eq('user_id', user.id)
      .eq('restaurant_slug', slug)
  } else {
    await supabase
      .from('restaurant_votes')
      .upsert(
        { user_id: user.id, restaurant_slug: slug, vote, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,restaurant_slug' }
      )
  }

  const tallies = await tallyFor(supabase, [slug])
  return NextResponse.json({ ok: true, tally: tallies[slug], myVote: vote })
}
