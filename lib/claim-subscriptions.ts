import { createAdminClient } from './supabase-admin'

// Claims used to be free; they're now a $19.99/mo Stripe subscription (see
// app/api/webhooks/stripe/route.ts, which upserts claim_subscriptions on
// checkout.session.completed keyed by restaurant_slug + customer_email).
// This is the read-side of that entitlement — queried per-request on the
// claim page itself, so no cache is needed the way lib/featured-city.ts
// needs one for hot, repeatedly-hit routes.
export async function hasActiveClaimSubscription(restaurantSlug: string, email: string): Promise<boolean> {
  if (!email) return false
  const admin = createAdminClient()
  if (!admin) return false

  const { data } = await admin
    .from('claim_subscriptions')
    .select('id')
    .eq('restaurant_slug', restaurantSlug)
    .eq('customer_email', email)
    .eq('status', 'active')
    .maybeSingle()

  return !!data
}
