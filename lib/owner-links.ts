// Kept apart from lib/owner-portal.ts so listing pages don't pull in the Supabase client.
/** Link to the self-serve claim flow; name/city/state let /owner fall back to the email claim. */
export function ownerClaimHref(slug: string, name: string, city?: string | null, stateCode?: string | null): string {
  const q = new URLSearchParams({ claim: slug, name })
  if (city) q.set('city', city)
  if (stateCode) q.set('st', stateCode)
  return `/owner?${q.toString()}`
}
