import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { computeMapData } from '@/lib/ramen-discovery'
import { isOpenNow } from '@/lib/hours'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const client = new Anthropic()

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// POST /api/ai-ramen-search
// Body: { query: string; userLat?: number; userLng?: number }
// Auth: must be signed in AND have active ramen_pass_subscriptions row
export async function POST(req: NextRequest) {
  // 1. Auth
  const supabase = await createClient()
  const { data: { user } } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } }

  if (!user) {
    return NextResponse.json({ error: 'signin_required' }, { status: 401 })
  }

  // 2. Subscription check
  const admin = createAdminClient()
  if (admin) {
    const { data: sub } = await admin
      .from('ramen_pass_subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle()

    const isActive = sub?.status === 'active' || sub?.status === 'trialing'
    if (!isActive) {
      return NextResponse.json({ error: 'subscription_required' }, { status: 403 })
    }
  }

  // 3. Parse body
  const { query, userLat, userLng } = await req.json() as {
    query: string
    userLat?: number
    userLng?: number
  }

  if (!query?.trim()) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 })
  }

  // 4. Build restaurant context (top 200 by review count to keep prompt tight)
  const allData = computeMapData()
  const hasLocation = typeof userLat === 'number' && typeof userLng === 'number'

  const restaurants = allData
    .filter(r => r.latitude && r.longitude)
    .map(r => ({
      ...r,
      distKm: hasLocation
        ? haversineKm(userLat!, userLng!, r.latitude!, r.longitude!)
        : null,
      openNow: isOpenNow(r.hours),
    }))
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, 300)

  const contextLines = restaurants.map(r => {
    const parts: string[] = [
      `slug:${r.slug}`,
      `name:"${r.name}"`,
      `city:${r.city},${r.stateCode}`,
      `rating:${r.rating ?? 'N/A'}`,
      `reviews:${r.reviewCount}`,
      `price:${r.priceRange || 'N/A'}`,
      `bowls:${(r.bowls ?? []).join('|') || 'N/A'}`,
      `moods:${(r.moods ?? []).join('|') || 'N/A'}`,
      `open:${r.openNow ? 'yes' : 'no'}`,
    ]
    if (r.distKm !== null) parts.push(`dist:${(r.distKm * 0.621371).toFixed(1)}mi`)
    return parts.join(' ')
  }).join('\n')

  const systemPrompt = `You are a ramen expert assistant for RamenNearYou.com. Your job is to help users find the perfect ramen restaurant based on their natural language request.

You have access to a directory of ramen restaurants. Each line represents one restaurant with these fields:
slug, name, city/state, rating (1–5), review count, price range ($/$$/$$$/$$$$), bowls (types offered: tonkotsu|spicy-miso|miso|shoyu|shio|tsukemen|mazemen|chicken-paitan|black-garlic|tantanmen|vegan), moods (rich-creamy|light-clean|extra-spicy|late-night|hangover|quick-lunch|date-night), open (yes/no right now), and optionally dist (miles from user).

RESTAURANT DIRECTORY:
${contextLines}

Your response MUST follow this exact format — no other prose before or after:

REASONING: [1–2 sentences explaining your selection criteria based on the user's request]

RESULTS:
1. [slug] — [Why this one matches, 1 sentence]
2. [slug] — [Why this one matches, 1 sentence]
3. [slug] — [Why this one matches, 1 sentence]
4. [slug] — [Why this one matches, 1 sentence]
5. [slug] — [Why this one matches, 1 sentence]

TIP: [One short, personalized tip related to their request — e.g. ordering advice, best time to visit, what to pair]

Rules:
- Return exactly 5 results (or fewer only if fewer match the criteria)
- Rank by best match to the user's request, then by rating/reviews
- If the user mentions distance/miles and you have dist data, respect that constraint strictly
- If user says "open now", only include restaurants where open:yes
- Use slug exactly as shown — this is used to link to the restaurant page
- Be warm, helpful, and ramen-enthusiast in tone`

  // 5. Stream Claude response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const msgStream = client.messages.stream({
          model: 'claude-opus-4-8',
          max_tokens: 1024,
          thinking: { type: 'adaptive' },
          system: systemPrompt,
          messages: [{ role: 'user', content: query.trim() }],
        })

        for await (const event of msgStream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }

        controller.close()
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'AI error'
        controller.enqueue(encoder.encode(`\n\nERROR: ${msg}`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-store',
    },
  })
}
