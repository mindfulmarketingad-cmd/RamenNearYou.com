// Browser helpers for the self-serve owner portal (/owner, /owner/admin).
// Every rule — who may claim, auto-approval, who may edit — is enforced by
// SECURITY DEFINER functions in Supabase (supabase/owner-portal.sql); this
// file only calls them and turns their error codes into plain English.
import { createClient } from '@/lib/supabase/client'

let client: ReturnType<typeof createClient> | null = null
export function supabase() {
  if (!client) client = createClient()
  return client
}

export type PortalListing = {
  slug: string; name: string; city: string | null; state_code: string | null; path: string | null; has_website: boolean
}

export type OwnerClaim = {
  id: string
  slug: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  reviewed_at: string | null
  name: string
  city: string | null
  state_code: string | null
  path: string | null
  listing: { description: string | null; phone: string | null; website: string | null; menu_link: string | null; hours: Record<string, string[]> | null }
  edited_at: string | null
}

export type ListingStats = {
  views_30d: number; calls_30d: number; directions_30d: number; reviews_30d: number; views_prev_30d: number; views_all: number
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

const MESSAGES: Record<string, string> = {
  not_signed_in: 'Please sign in first.',
  email_not_verified: 'Please confirm your email address first — use the link or code we emailed you.',
  unknown_listing: "We couldn't find that listing. Search for it on the Claim Your Listing page.",
  already_claimed: 'This listing has already been claimed by another owner. If that’s a mistake, reply to any RamenNearYou email and we’ll sort it out.',
  too_many_pending: 'You have several claims waiting for review already — we’ll get to them shortly.',
  not_owner: 'Only the verified owner can do that.',
  not_admin: 'This page is only for the RamenNearYou team.',
  bad_website: 'Website must start with http:// or https://',
  bad_menu_link: 'Menu link must start with http:// or https://',
  bad_hours: 'Hours look off — use something like “11:30 AM – 9 PM” for each day.',
  too_long: 'One of the fields is too long.',
  not_found: 'That claim no longer exists.',
}

export function portalError(e: unknown): string {
  const msg = (e as { message?: string })?.message ?? String(e)
  for (const [code, text] of Object.entries(MESSAGES)) if (msg.includes(code)) return text
  return 'Something went wrong. Please try again in a minute.'
}

export async function rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase().rpc(fn, args)
  if (error) throw error
  return data as T
}

