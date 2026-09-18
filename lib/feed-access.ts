import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { isAdminEmail } from '@/lib/is-admin'

export type FeedAccess =
  | { ok: true; userId: string }
  | { ok: false; reason: 'signin' | 'subscribe' }

// The /feed endpoints are the paid tier, so they re-check entitlement on the
// server for every request. The client's gate decides what to *render*; this
// decides what data actually leaves the building. A subscription that lapses
// mid-session stops working here even if the page is still open.
export async function requireFeedAccess(): Promise<FeedAccess> {
  const supabase = await createClient()
  if (!supabase) return { ok: false, reason: 'signin' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, reason: 'signin' }

  if (isAdminEmail(user.email)) return { ok: true, userId: user.id }

  const admin = createAdminClient()
  if (!admin) return { ok: false, reason: 'subscribe' }

  const { data: sub } = await admin
    .from('ramen_pass_subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle()

  const subscribed = sub?.status === 'active' || sub?.status === 'trialing'
  return subscribed ? { ok: true, userId: user.id } : { ok: false, reason: 'subscribe' }
}

/** 401 for signed-out, 402 for signed-in-but-unsubscribed. */
export function feedAccessStatus(reason: 'signin' | 'subscribe'): number {
  return reason === 'signin' ? 401 : 402
}
